import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '', as = 'p' }) => {
  const Tag = as;
  
  return (
    <Tag className={`relative inline-block hover:animate-flicker ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -ml-[2px] text-red-600 opacity-70 mix-blend-multiply animate-pulse z-0 transform skew-x-12">
        {text}
      </span>
      <span className="absolute top-0 left-0 ml-[2px] text-blue-900 opacity-70 mix-blend-multiply animate-pulse delay-75 z-0 transform -skew-x-12">
        {text}
      </span>
    </Tag>
  );
};

export default GlitchText;