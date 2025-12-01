import { Riddle } from './types';

export const OPENING_PHRASE = "No estás solo. Nunca lo has estado. ¿Crees que puedes escapar de lo que ya te ha visto?";

export const ENTITY_THINKING_TEXT = "La entidad está pensando...";

export const HORROR_AUDIO_URL = "https://actions.google.com/sounds/v1/horror/ambient_hum_creepy.ogg";

export const CORRECT_PHRASES = [
  "Correcto. Pero no te confíes.",
  "Bien. La entidad se apacigua... por ahora.",
  "Has visto la verdad.",
  "Acertaste. Sientes cómo te observa menos.",
  "Verdad aceptada."
];

export const INCORRECT_PHRASES = [
  "Incorrecto. La oscuridad se ríe de ti.",
  "Te equivocas. Sientes una respiración en tu nuca.",
  "No es eso. La entidad se acerca.",
  "Error. Tu miedo alimenta su hambre.",
  "Falso. Estás perdiendo tiempo de vida."
];

// VERSION 1: SHADOWS & REFLECTIONS
const VERSION_1: Riddle[] = [
  {
    id: 1,
    question: "Estoy contigo todo el día, pero desaparezco cuando el sol se oculta o cuando la luz es total. Si me miras, no tengo rostro. ¿Qué soy?",
    answerKeywords: ["sombra", "la sombra", "sombras"],
    hint: "Soy tu compañera oscura pegada a tus pies."
  },
  {
    id: 2,
    question: "Tengo ojos pero no veo, tengo boca pero no hablo, y aunque no estoy vivo, puedo mostrarte tu propia muerte. ¿Qué soy?",
    answerKeywords: ["calavera", "craneo", "cráneo", "muerte", "reflejo", "espejo"],
    hint: "La sonrisa eterna bajo tu piel."
  },
  {
    id: 3,
    question: "Cuanto más hay de mí, menos ves. Soy el hogar de las criaturas que temes.",
    answerKeywords: ["oscuridad", "la oscuridad", "noche", "tinieblas"],
    hint: "Apaga la luz y ahí estaré."
  },
  {
    id: 4,
    question: "Muchos me han escuchado, pero nadie me ha visto. No camino, pero corro si tienes miedo. Soy el sonido de tu vida escapando.",
    answerKeywords: ["latido", "corazon", "corazón", "sangre", "pulso"],
    hint: "Bum... bum... bum... en tu pecho."
  },
  {
    id: 5,
    question: "Pertenezco al pasado, pero te persigo en el presente. Soy el error que cometiste y que la entidad no olvida.",
    answerKeywords: ["culpa", "recuerdo", "memoria", "pecado", "remordimiento"],
    hint: "Ese peso en tu conciencia que no te deja dormir."
  },
  {
    id: 6,
    question: "Todos lo tienen, algunos intentan ocultarlo. Es lo único que la entidad puede oler en ti ahora mismo.",
    answerKeywords: ["miedo", "temor", "pánico", "terror"],
    hint: "Lo que sientes al leer estas palabras."
  },
  {
    id: 7,
    question: "Rompo sin ser tocado. Lloro sin tener ojos. Vuelo sin tener alas. Y cuando llego, la luz se va.",
    answerKeywords: ["noche", "silencio", "oscuridad", "tormenta"],
    hint: "Oscurezco el cielo y traigo truenos."
  },
  {
    id: 8,
    question: "Puedes correr, pero siempre estoy delante de ti. Nunca me alcanzas, pero al final, siempre te atrapo.",
    answerKeywords: ["futuro", "destino", "muerte", "final"],
    hint: "El final inevitable de todo camino."
  },
  {
    id: 9,
    question: "No soy de carne, ni de hueso, pero si me nombras, me rompes.",
    answerKeywords: ["silencio", "el silencio"],
    hint: "Shhhh..."
  },
  {
    id: 10,
    question: "¿Quién te ha estado observando desde que empezaste a leer esto?",
    answerKeywords: ["tu", "la entidad", "entidad", "nadie", "libro", "tonatihu", "yo", "lo has visto"],
    hint: "Mira detrás de ti. O en el título del libro."
  }
];

// VERSION 2: TIME & MADNESS
const VERSION_2: Riddle[] = [
  { 
    id: 1, 
    question: "Devoro todo: pájaros, bestias, árboles y flores. Muerdo el hierro y roo el acero. Mato reyes y destruyo ciudades. ¿Qué soy?", 
    answerKeywords: ["tiempo", "el tiempo"],
    hint: "Tic, tac. Se acaba." 
  },
  { 
    id: 2, 
    question: "Solo existo cuando me nombras mal. Si me nombras bien, desaparezco porque soy una mentira.", 
    answerKeywords: ["secreto", "mentira", "silencio"],
    hint: "Si lo cuentas, deja de serlo." 
  },
  { 
    id: 3, 
    question: "Tengo ciudades, pero no casas. Montañas, pero no árboles. Agua, pero no peces. Soy el mapa de tu perdición.", 
    answerKeywords: ["mapa", "el mapa"],
    hint: "Guía de papel plano." 
  },
  { 
    id: 4, 
    question: "Nazco grande y muero pequeño. Alumbro tu miedo hasta que me consumo.", 
    answerKeywords: ["vela", "candelabro", "esperanza"],
    hint: "Lloro cera mientras muero." 
  },
  { 
    id: 5, 
    question: "No tengo vida, pero puedo morir. No tengo cuerpo, pero puedo ser herido. Soy lo que pierdes cuando te rindes.", 
    answerKeywords: ["esperanza", "fe", "voluntad"],
    hint: "Lo último que quedó en la caja de Pandora." 
  },
  { 
    id: 6, 
    question: "Camino sin pies, vuelo sin alas y lloro sin ojos. Soy el lamento de los olvidados.", 
    answerKeywords: ["viento", "nube", "alma"],
    hint: "Muevo los árboles pero no me ves." 
  },
  { 
    id: 7, 
    question: "Cuanto más quitas, más grande me hago. Soy el agujero donde caerás.", 
    answerKeywords: ["agujero", "hueco", "fosa", "tumba"],
    hint: "Vacío en la tierra." 
  },
  { 
    id: 8, 
    question: "Vengo de noche sin que me llamen, y me voy de día sin que me roben. Soy la visión que te atormenta.", 
    answerKeywords: ["estrella", "sueño", "pesadilla"],
    hint: "Ocurre cuando cierras los ojos." 
  },
  { 
    id: 9, 
    question: "Tengo llaves pero no abro cerraduras. Tengo espacio pero no habitaciones. Puedes entrar, pero nunca salir.", 
    answerKeywords: ["piano", "mente", "locura"],
    hint: "Música negra y blanca, o tu propia cabeza." 
  },
  { 
    id: 10, 
    question: "¿Qué es aquello que te pertenece, pero los demás lo usan más que tú?", 
    answerKeywords: ["nombre", "tu nombre", "vida"],
    hint: "Te lo pusieron al nacer." 
  }
];

// VERSION 3: THE BODY & THE SENSES
const VERSION_3: Riddle[] = [
  { 
    id: 1, 
    question: "Cinco hermanos muy unidos, que no se pueden mirar. Si uno se corta, los otros no sangran, pero todos dejan de agarrar.", 
    answerKeywords: ["dedos", "mano", "los dedos"],
    hint: "Están al final de tus brazos." 
  },
  { 
    id: 2, 
    question: "Una caja sin bisagras, llave o tapa, pero dentro hay un tesoro dorado... o un corazón podrido.", 
    answerKeywords: ["huevo", "alma", "cuerpo"],
    hint: "Frágil cáscara blanca." 
  },
  { 
    id: 3, 
    question: "Treinta y dos caballeros blancos en una colina roja. Primero mastican, luego golpean, y al final esperan.", 
    answerKeywords: ["dientes", "los dientes"],
    hint: "Sonríe y los mostrarás." 
  },
  { 
    id: 4, 
    question: "Soy rojo, soy vida, soy caliente. Si me derramo, te enfrías para siempre.", 
    answerKeywords: ["sangre", "la sangre"],
    hint: "Corre por tus venas." 
  },
  { 
    id: 5, 
    question: "Dos hermanas que ven todo, pero no se pueden ver entre ellas. Lloran juntas cuando estás triste.", 
    answerKeywords: ["ojos", "los ojos"],
    hint: "Ventanas del alma." 
  },
  { 
    id: 6, 
    question: "Crezco en la oscuridad, en lo profundo de tu mente. Soy la idea que no puedes sacar.", 
    answerKeywords: ["obsesion", "locura", "miedo"],
    hint: "Pensamiento fijo." 
  },
  { 
    id: 7, 
    question: "No tengo voz, pero grito cuando me rompes. Soy blanco y duro, lo último que queda de ti.", 
    answerKeywords: ["hueso", "esqueleto", "calavera"],
    hint: "Tu estructura interna." 
  },
  { 
    id: 8, 
    question: "Tengo cuello pero no cabeza. Tengo brazos pero no manos. Me pongo sobre ti.", 
    answerKeywords: ["camisa", "camisa de fuerza", "fuerza"],
    hint: "Ropa que atrapa." 
  },
  { 
    id: 9, 
    question: "Solo tengo un ojo y una cola larga. Atravieso todo lo que toco.", 
    answerKeywords: ["aguja", "la aguja"],
    hint: "Pincha y cose." 
  },
  { 
    id: 10, 
    question: "¿Qué baja pero nunca sube?", 
    answerKeywords: ["lluvia", "vida", "edad", "tiempo"],
    hint: "Cae del cielo." 
  }
];

// VERSION 4: THE VOID & THE UNKNOWN
const VERSION_4: Riddle[] = [
  { 
    id: 1, 
    question: "Soy el principio del fin, y el final del tiempo y el espacio. Estoy en medio de la nada.", 
    answerKeywords: ["letra n", "n", "nada"],
    hint: "Fíjate en la palabra fiN." 
  },
  { 
    id: 2, 
    question: "Doy vueltas y vueltas pero nunca me muevo. No tengo boca pero me trago todo.", 
    answerKeywords: ["remolino", "agujero negro", "vacio"],
    hint: "Espiralo de agua o gravedad." 
  },
  { 
    id: 3, 
    question: "Siempre estoy hambriento, debo ser alimentado. El dedo que me lame se quemará pronto.", 
    answerKeywords: ["fuego", "el fuego"],
    hint: "Caliente y brillante." 
  },
  { 
    id: 4, 
    question: "No se puede ver, no se puede sentir. No se puede oír, no se puede oler. Yace detrás de las estrellas y bajo las colinas.", 
    answerKeywords: ["oscuridad", "vacio", "nada"],
    hint: "La ausencia de todo." 
  },
  { 
    id: 5, 
    question: "Cuanto más seca, más mojada se pone. Absorbe tus lágrimas.", 
    answerKeywords: ["toalla", "tierra"],
    hint: "Tela para secar." 
  },
  { 
    id: 6, 
    question: "Tengo ríos pero no agua, bosques pero no árboles, ciudades pero no gente.", 
    answerKeywords: ["mapa", "mundo"],
    hint: "Representación en papel." 
  },
  { 
    id: 7, 
    question: "Si me tienes, quieres compartirme. Si me compartes, ya no me tienes.", 
    answerKeywords: ["secreto", "el secreto"],
    hint: "Guárdalo bien." 
  },
  { 
    id: 8, 
    question: "Soy ligero como una pluma, pero ni el hombre más fuerte puede sostenerme por mucho tiempo.", 
    answerKeywords: ["aliento", "respiracion", "aire"],
    hint: "Aguanta la respiración..." 
  },
  { 
    id: 9, 
    question: "Vengo sin que me veas. Te envuelvo sin tocarte. Y cuando te das cuenta, ya estás dormido.", 
    answerKeywords: ["sueño", "muerte", "noche"],
    hint: "Pequeña muerte nocturna." 
  },
  { 
    id: 10, 
    question: "¿Quién es el único que puede sacarte de aquí?", 
    answerKeywords: ["yo", "nadie", "tu mismo", "entidad"],
    hint: "Tú." 
  }
];

export const GAME_VERSIONS = [VERSION_1, VERSION_2, VERSION_3, VERSION_4];