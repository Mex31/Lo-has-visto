import React, { useState, useEffect, useRef } from 'react';
import { GameState, ChatMessage, Riddle } from './types';
import { GAME_VERSIONS, OPENING_PHRASE, ENTITY_THINKING_TEXT, CORRECT_PHRASES, INCORRECT_PHRASES, HORROR_AUDIO_URL } from './constants';
import GlitchText from './components/GlitchText';

const App: React.FC = () => {
  // Select a random version on initial load
  const [activeRiddles] = useState<Riddle[]>(() => {
    const randomIndex = Math.floor(Math.random() * GAME_VERSIONS.length);
    console.log(`Loaded Version: ${randomIndex + 1}`);
    return GAME_VERSIONS[randomIndex];
  });

  const [state, setState] = useState<GameState>({
    phase: 'intro',
    player: { name: '', group: '', listNumber: '' },
    currentRiddleIndex: 0,
    errors: 0,
    startTime: null,
    endTime: null,
    messages: [],
    isProcessing: false,
  });

  const [inputValue, setInputValue] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(HORROR_AUDIO_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle Mute Toggle
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);

  // Focus input automatically on phase change or when processing ends
  useEffect(() => {
    if (state.phase === 'register' || (state.phase === 'playing' && !state.isProcessing)) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.isProcessing]);

  const addMessage = (
    text: string | React.ReactNode, 
    sender: 'entity' | 'user', 
    variant: ChatMessage['variant'] = 'default',
    isRiddle: boolean = false
  ) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, {
        id: Date.now().toString() + Math.random().toString(),
        sender,
        text,
        variant,
        isRiddle
      }]
    }));
  };

  const handleStart = () => {
    // Attempt to play audio on first user interaction
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(e => {
        console.warn("Autoplay prevented by browser", e);
        setIsMuted(true); // Default to muted if autoplay fails
      });
    }
    setState(prev => ({ ...prev, phase: 'register' }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.player.name || !state.player.group || !state.player.listNumber) return;
    
    // Initialize game
    setState(prev => ({
      ...prev,
      phase: 'playing',
      startTime: Date.now(),
      messages: [{
        id: 'init-1',
        sender: 'entity',
        text: `Bienvenida/o al vacío, ${prev.player.name}. Comenzamos.`,
        variant: 'default'
      }, {
        id: 'init-2',
        sender: 'entity',
        text: activeRiddles[0].question,
        variant: 'default',
        isRiddle: true // Mark as disappearable
      }]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (state.phase === 'register') {
      setState(prev => ({
        ...prev,
        player: { ...prev.player, [name]: value }
      }));
    } else {
      setInputValue(value);
    }
  };

  const normalizeString = (str: string) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  };

  const handleRequestHint = async () => {
    if (state.isProcessing) return;
    const currentRiddle = activeRiddles[state.currentRiddleIndex];
    if (!currentRiddle.hint) return;

    setState(prev => ({ ...prev, isProcessing: true }));

    // User asks for help (system message style for cleaner UI)
    addMessage("Necesito una señal...", 'user');

    await new Promise(r => setTimeout(r, 800));

    // Entity responds with hint
    addMessage(currentRiddle.hint, 'entity', 'system', true);

    setState(prev => ({ ...prev, isProcessing: false }));
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || state.isProcessing) return;

    // 1. Add User Message
    addMessage(inputValue, 'user');
    const currentUserInput = inputValue;
    setInputValue('');
    
    setState(prev => ({ ...prev, isProcessing: true }));

    // Delay for realism
    await new Promise(r => setTimeout(r, 800));

    const currentRiddle = activeRiddles[state.currentRiddleIndex];
    const normalizedInput = normalizeString(currentUserInput);
    
    const isCorrect = currentRiddle.answerKeywords.some(keyword => 
      normalizeString(keyword) === normalizedInput
    );

    // 2. Feedback Message
    if (isCorrect) {
      const phrase = CORRECT_PHRASES[Math.floor(Math.random() * CORRECT_PHRASES.length)];
      addMessage(phrase, 'entity', 'success');
    } else {
      const phrase = INCORRECT_PHRASES[Math.floor(Math.random() * INCORRECT_PHRASES.length)];
      addMessage(phrase, 'entity', 'error');
      setState(prev => ({ ...prev, errors: prev.errors + 1 }));
    }

    await new Promise(r => setTimeout(r, 1200));

    // 3. Entity Thinking Message
    addMessage(ENTITY_THINKING_TEXT, 'entity', 'system');

    await new Promise(r => setTimeout(r, 2000));

    // 4. Next Riddle or Finish
    setState(prev => {
      const nextIndex = prev.currentRiddleIndex + 1;
      
      // Filter out previous riddles and hints to make them "disappear" from history
      // We keep the conversation (answers and feedback) but remove the questions
      const historyWithoutPreviousRiddles = prev.messages.filter(msg => !msg.isRiddle);

      if (nextIndex >= activeRiddles.length) {
        return { 
          ...prev, 
          phase: 'finished', 
          endTime: Date.now(),
          isProcessing: false,
          messages: historyWithoutPreviousRiddles
        };
      } else {
        // Add next riddle to messages immediately inside the state update
        const nextRiddle = activeRiddles[nextIndex];
        return {
          ...prev,
          currentRiddleIndex: nextIndex,
          isProcessing: false,
          messages: [
            ...historyWithoutPreviousRiddles,
            {
              id: Date.now().toString(),
              sender: 'entity',
              text: nextRiddle.question,
              variant: 'default',
              isRiddle: true // Mark new riddle to disappear later
            }
          ]
        };
      }
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- RENDERERS ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center cursor-pointer" onClick={handleStart}>
      <div className="max-w-2xl space-y-12">
        <GlitchText 
          text="LO HAS VISTO" 
          as="h1" 
          className="text-6xl md:text-8xl font-serif tracking-widest text-blood" 
        />
        <p className="text-xl md:text-2xl font-serif text-ash italic leading-relaxed animate-pulse-slow">
          "{OPENING_PHRASE}"
        </p>
        <div className="mt-16">
          <span className="text-sm font-mono text-red-900/80 border border-red-900/50 px-6 py-3 rounded-full hover:bg-red-900/10 transition-all animate-bounce">
            [ CLIC PARA ENTRAR AL VACÍO ]
          </span>
        </div>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleRegister} className="w-full max-w-md space-y-8 bg-black/40 backdrop-blur-md p-10 border border-zinc-800 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-serif text-gray-200 mb-6 text-center tracking-widest">IDENTIFICACIÓN</h2>
        
        <div className="space-y-6 font-mono text-ash">
          <div className="group relative">
            <input 
              ref={inputRef}
              type="text" 
              name="name"
              required
              autoComplete="off"
              value={state.player.name}
              onChange={handleInputChange}
              placeholder="Nombre Completo"
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3 focus:border-red-900 outline-none transition-all text-gray-300 placeholder-zinc-700"
            />
          </div>
          <div className="group">
            <input 
              type="text" 
              name="group"
              required
              autoComplete="off"
              value={state.player.group}
              onChange={handleInputChange}
              placeholder="Grupo"
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3 focus:border-red-900 outline-none transition-all text-gray-300 placeholder-zinc-700"
            />
          </div>
          <div className="group">
            <input 
              type="number" 
              name="listNumber"
              required
              autoComplete="off"
              value={state.player.listNumber}
              onChange={handleInputChange}
              placeholder="Número de Lista"
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3 focus:border-red-900 outline-none transition-all text-gray-300 placeholder-zinc-700"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full mt-4 py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-900/30 rounded-xl text-red-500 font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg"
        >
          Iniciar
        </button>
      </form>
    </div>
  );

  const renderChatBubble = (msg: ChatMessage) => {
    const isEntity = msg.sender === 'entity';
    const isSystem = msg.variant === 'system';

    // System messages (hints, thinking) are centered text, not bubbles
    if (isSystem) {
      return (
        <div key={msg.id} className="flex w-full justify-center my-4 animate-pulse">
          <span className="text-[10px] md:text-xs font-mono text-zinc-600 uppercase tracking-[0.2em] text-center px-4">
            {msg.text}
          </span>
        </div>
      );
    }
    
    // Bubble Styles
    const baseStyle = "max-w-[85%] md:max-w-[70%] p-5 text-sm md:text-base font-serif leading-7 shadow-lg backdrop-blur-sm transition-all duration-500 ease-out";
    
    let bubbleStyle = "";
    if (isEntity) {
      bubbleStyle = `${baseStyle} bg-[#111111]/90 border border-zinc-800/80 rounded-2xl rounded-tl-sm self-start text-gray-300`;
      if (msg.variant === 'error') bubbleStyle += " border-red-900/40 bg-red-950/20 text-red-300";
      if (msg.variant === 'success') bubbleStyle += " border-green-900/30 bg-green-950/10 text-green-200/80";
    } else {
      bubbleStyle = `${baseStyle} bg-red-900/10 border border-red-900/20 rounded-2xl rounded-tr-sm self-end text-gray-200`;
    }

    return (
      <div key={msg.id} className={`flex w-full mb-4 ${isEntity ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
        <div className={bubbleStyle}>
          {msg.text}
        </div>
      </div>
    );
  };

  const renderChatInterface = () => {
    return (
      <div className="flex flex-col h-screen w-full relative bg-black/40 overflow-hidden">
        
        {/* Header / Status Bar */}
        <div className="absolute top-0 left-0 w-full p-4 z-20 bg-gradient-to-b from-black via-black/80 to-transparent flex justify-between items-center pointer-events-none">
          <div className="flex items-center space-x-3 pl-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <span className="text-[10px] font-mono text-red-500/70 tracking-[0.3em]">CONEXIÓN ESTABLECIDA</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto px-4 pt-20 pb-32 flex flex-col scroll-smooth w-full max-w-5xl mx-auto">
          {state.messages.map(renderChatBubble)}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-black via-black/95 to-transparent">
          <form onSubmit={handleAnswerSubmit} className="relative w-full max-w-3xl mx-auto mb-2">
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                disabled={state.isProcessing}
                placeholder={state.isProcessing ? "Procesando..." : "Responde aquí..."}
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-full py-4 pl-6 pr-32 text-gray-200 font-sans shadow-2xl focus:border-red-900/60 focus:ring-1 focus:ring-red-900/20 outline-none transition-all placeholder-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="off"
              />
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleRequestHint}
                  disabled={state.isProcessing}
                  className="text-zinc-600 hover:text-zinc-300 disabled:opacity-30 transition-colors px-4 py-2 text-[10px] uppercase tracking-widest font-mono border-r border-zinc-800"
                  title="Pedir Pista"
                >
                  Pista
                </button>
                <button 
                  type="submit" 
                  disabled={!inputValue.trim() || state.isProcessing}
                  className="bg-red-900/20 hover:bg-red-900/40 text-red-500 hover:text-red-400 rounded-full p-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed m-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
          <div className="text-center mt-2 opacity-40">
            <span className="text-[9px] text-gray-500 font-mono tracking-[0.3em] uppercase">No relates nada</span>
          </div>
        </div>
      </div>
    );
  };

  const renderFinished = () => {
    const timeSpent = (state.endTime || 0) - (state.startTime || 0);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black">
        <div className="w-full max-w-2xl border border-zinc-800 bg-[#080808] p-8 md:p-12 relative overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(20,0,0,0.5)]">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-200 mb-8 text-center uppercase tracking-[0.2em]">
            Resultado Final
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-sm mb-12 border-t border-b border-zinc-900 py-8">
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-zinc-600 uppercase text-[10px] tracking-widest mb-1">Nombre</span>
                <span className="text-gray-300 text-lg">{state.player.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-600 uppercase text-[10px] tracking-widest mb-1">Grupo</span>
                <span className="text-gray-300 text-lg">{state.player.group}</span>
              </div>
            </div>

            <div className="space-y-4 md:text-right">
              <div className="flex flex-col md:items-end">
                <span className="text-zinc-600 uppercase text-[10px] tracking-widest mb-1">Tiempo</span>
                <span className="text-gray-300 text-lg">{formatTime(timeSpent)}</span>
              </div>
              <div className="flex flex-col md:items-end">
                <span className="text-zinc-600 uppercase text-[10px] tracking-widest mb-1">Errores</span>
                <span className="text-red-500 text-lg">{state.errors}</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-8">
            <p className="font-serif italic text-zinc-500">
              "La entidad ha terminado contigo."
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs font-mono text-red-900 hover:text-red-500 uppercase tracking-widest transition-colors border-b border-transparent hover:border-red-500 pb-1"
            >
              Reiniciar Ciclo
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-void min-h-screen w-full overflow-hidden relative selection:bg-red-900 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black opacity-60"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5"></div>
      </div>

      {/* Sound Control */}
      <button 
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 text-red-900 hover:text-red-500 transition-colors p-2 mix-blend-screen"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 21 12m0 0-3.75 2.25M21 12l-3.75-2.25m-10.5-6 4.75 4.5h2.5a2.25 2.25 0 0 1 2.25 2.25v5.25a2.25 2.25 0 0 1-2.25 2.25h-2.5l-4.75 4.5M12 12a3 3 0 0 0-3 3m-3-3a3 3 0 0 1 3-3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.75-4.5h2.5a2.25 2.25 0 0 1 2.25 2.25v5.25a2.25 2.25 0 0 1-2.25 2.25h-2.5l-4.75 4.5m0-13.5L12 3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.5" />
          </svg>
        )}
      </button>

      <div className="relative z-10">
        {state.phase === 'intro' && renderIntro()}
        {state.phase === 'register' && renderRegister()}
        {state.phase === 'playing' && renderChatInterface()}
        {state.phase === 'finished' && renderFinished()}
      </div>
    </div>
  );
};

export default App;