import React from 'react';

interface ISLSignGraphicProps {
  gloss: string;
  className?: string;
  animate?: boolean;
}

export const ISLSignGraphic: React.FC<ISLSignGraphicProps> = ({
  gloss,
  className = 'w-full h-full',
  animate = true,
}) => {
  const normalized = gloss.toUpperCase().replace(/\s+/g, '_');

  // Render dedicated SVG hand gesture diagrams based on ISL Gloss
  switch (normalized) {
    case 'POINT':
    case 'I':
    case 'YOU':
    case 'ME':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Glow */}
          <circle cx="100" cy="100" r="85" className="fill-blue-500/10 stroke-blue-400/30" strokeWidth="2" />
          {/* Hand Wrist & Palm */}
          <path d="M75 160 L75 125 C75 110 85 105 95 105 L105 105 C115 105 125 110 125 125 L125 160 Z" className="fill-blue-600/30 stroke-blue-400" strokeWidth="4" strokeLinejoin="round" />
          {/* Folded Fingers (Thumb, Middle, Ring, Pinky) */}
          <path d="M100 110 C100 100 115 100 115 110 L115 130" className="stroke-blue-300" strokeWidth="4" strokeLinecap="round" />
          <path d="M110 112 C110 102 122 102 122 112 L122 132" className="stroke-blue-300" strokeWidth="4" strokeLinecap="round" />
          <path d="M82 122 C82 112 70 115 75 128" className="stroke-blue-300" strokeWidth="4" strokeLinecap="round" />
          {/* Extended Index Finger Pointing */}
          <path d="M92 105 L92 45 C92 38 100 38 100 45 L100 105" className="fill-blue-500/40 stroke-blue-400" strokeWidth="4" strokeLinejoin="round" />
          {/* Pointing Direction Arrow */}
          <path
            d="M96 32 L96 18 M90 24 L96 18 L102 24"
            className={`stroke-teal-400 ${animate ? 'animate-bounce' : ''}`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Hand Pointing Label */}
          <text x="100" y="182" textAnchor="middle" className="fill-slate-300 text-[11px] font-mono font-bold">
            Index Pointing Gesture
          </text>
        </svg>
      );

    case 'NEED':
    case 'WANT':
    case 'REQUIRE':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Glow */}
          <circle cx="100" cy="100" r="85" className="fill-indigo-500/10 stroke-indigo-400/30" strokeWidth="2" />
          {/* Wrist */}
          <path d="M80 160 L80 120 L120 120 L120 160 Z" className="fill-indigo-600/30 stroke-indigo-400" strokeWidth="4" strokeLinejoin="round" />
          {/* Bent Hooked Index Finger */}
          <path d="M90 120 L90 70 C90 52 110 52 110 65 C110 75 102 82 102 95 L102 120" className="fill-indigo-500/40 stroke-indigo-400" strokeWidth="4" strokeLinejoin="round" />
          {/* Folded Fingers & Thumb */}
          <path d="M78 122 C70 115 80 100 90 115" className="stroke-indigo-300" strokeWidth="4" strokeLinecap="round" />
          <path d="M102 120 L115 120 C122 120 122 135 112 135" className="stroke-indigo-300" strokeWidth="4" strokeLinecap="round" />
          {/* Downward Pulling Motion Arrow */}
          <g className={animate ? 'animate-pulse' : ''}>
            <path d="M135 70 L135 120" className="stroke-teal-400" strokeWidth="4" strokeDasharray="4 4" strokeLinecap="round" />
            <path d="M128 112 L135 122 L142 112" className="stroke-teal-400" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {/* Motion Curved Arc */}
          <path d="M70 70 Q55 95 70 120" className="stroke-indigo-400/60" strokeWidth="3" strokeDasharray="3 3" />
          <text x="100" y="182" textAnchor="middle" className="fill-slate-300 text-[11px] font-mono font-bold">
            Hooked Pull Downward
          </text>
        </svg>
      );

    case 'WATER':
    case 'DRINK':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Glow */}
          <circle cx="100" cy="100" r="85" className="fill-cyan-500/10 stroke-cyan-400/30" strokeWidth="2" />
          {/* Water Drops */}
          <path d="M150 45 C150 40 156 32 156 32 C156 32 162 40 162 45 C162 49 156 52 150 45 Z" className="fill-cyan-400/80" />
          <path d="M165 65 C165 61 170 55 170 55 C170 55 175 61 175 65 C175 68 170 71 165 65 Z" className="fill-cyan-300/60" />
          {/* Hand Wrist */}
          <path d="M75 160 L75 130 C75 120 85 115 95 115 L105 115 C115 115 125 120 125 130 L125 160 Z" className="fill-cyan-600/30 stroke-cyan-400" strokeWidth="4" strokeLinejoin="round" />
          {/* 'W' Handshape (Index, Middle, Ring Fingers Extended) */}
          <path d="M85 115 L80 45 C80 38 88 38 88 45 L93 115" className="fill-cyan-500/40 stroke-cyan-400" strokeWidth="4" strokeLinejoin="round" />
          <path d="M95 115 L100 40 C100 33 108 33 108 40 L108 115" className="fill-cyan-500/40 stroke-cyan-400" strokeWidth="4" strokeLinejoin="round" />
          <path d="M108 115 L120 48 C120 41 128 41 128 48 L120 115" className="fill-cyan-500/40 stroke-cyan-400" strokeWidth="4" strokeLinejoin="round" />
          {/* Folded Pinky & Tucked Thumb */}
          <path d="M120 120 C130 120 130 135 120 135" className="stroke-cyan-300" strokeWidth="4" strokeLinecap="round" />
          <path d="M78 125 C68 125 68 138 80 135" className="stroke-cyan-300" strokeWidth="4" strokeLinecap="round" />
          {/* Tapping Motion Rings at Chin */}
          <circle cx="100" cy="30" r="12" className={`stroke-cyan-300/70 ${animate ? 'animate-ping' : ''}`} strokeWidth="2" />
          <text x="100" y="182" textAnchor="middle" className="fill-slate-300 text-[11px] font-mono font-bold">
            'W' Shape Tapped at Chin
          </text>
        </svg>
      );

    case 'HELLO':
    case 'HI':
    case 'NAMASTE':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" className="fill-emerald-500/10 stroke-emerald-400/30" strokeWidth="2" />
          {/* Open Hand Wave Palm */}
          <path d="M70 160 L70 120 Q70 100 90 100 L110 100 Q130 100 130 120 L130 160 Z" className="fill-emerald-600/30 stroke-emerald-400" strokeWidth="4" />
          {/* 4 Extended Fingers */}
          <path d="M80 100 L80 42 C80 35 88 35 88 42 L88 100" className="fill-emerald-500/40 stroke-emerald-400" strokeWidth="3.5" />
          <path d="M92 100 L93 35 C93 28 101 28 101 35 L100 100" className="fill-emerald-500/40 stroke-emerald-400" strokeWidth="3.5" />
          <path d="M104 100 L108 40 C108 33 116 33 116 40 L112 100" className="fill-emerald-500/40 stroke-emerald-400" strokeWidth="3.5" />
          <path d="M116 100 L123 50 C123 43 130 43 130 50 L123 100" className="fill-emerald-500/40 stroke-emerald-400" strokeWidth="3.5" />
          {/* Extended Thumb */}
          <path d="M70 120 C52 115 52 100 68 105" className="stroke-emerald-300" strokeWidth="4" strokeLinecap="round" />
          {/* Waving Arcs */}
          <g className={animate ? 'animate-pulse' : ''}>
            <path d="M142 55 Q155 70 142 85" className="stroke-emerald-300" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M152 48 Q170 70 152 92" className="stroke-emerald-400" strokeWidth="3" strokeLinecap="round" />
          </g>
          <text x="100" y="182" textAnchor="middle" className="fill-slate-300 text-[11px] font-mono font-bold">
            Open Palm Wave / Greeting
          </text>
        </svg>
      );

    case 'THANK_YOU':
    case 'THANKS':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" className="fill-blue-500/10 stroke-blue-400/30" strokeWidth="2" />
          {/* Hand Palm at Chin */}
          <path d="M75 145 C75 120 85 110 100 110 L115 110 C130 110 135 125 135 145 Z" className="fill-blue-600/30 stroke-blue-400" strokeWidth="4" />
          <path d="M85 110 L85 55 C85 48 93 48 93 55 L93 110" className="fill-blue-500/40 stroke-blue-400" strokeWidth="3.5" />
          <path d="M96 110 L97 48 C97 41 105 41 105 48 L104 110" className="fill-blue-500/40 stroke-blue-400" strokeWidth="3.5" />
          <path d="M107 110 L112 55 C112 48 120 48 120 55 L115 110" className="fill-blue-500/40 stroke-blue-400" strokeWidth="3.5" />
          {/* Motion Arrow Forward */}
          <path d="M125 90 L160 90 M152 82 L162 90 L152 98" className={`stroke-teal-400 ${animate ? 'animate-bounce' : ''}`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="100" y="182" textAnchor="middle" className="fill-slate-300 text-[11px] font-mono font-bold">
            Flat Palm Chin Forward
          </text>
        </svg>
      );

    case 'HELP':
    case 'ASSIST':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" className="fill-amber-500/10 stroke-amber-400/30" strokeWidth="2" />
          {/* Flat Supporting Base Hand */}
          <path d="M45 135 L155 135 C160 135 160 150 155 150 L45 150 C40 150 40 135 45 135 Z" className="fill-amber-600/30 stroke-amber-400" strokeWidth="4" />
          {/* Top Fist Resting on Palm */}
          <circle cx="100" cy="100" r="28" className="fill-amber-500/40 stroke-amber-300" strokeWidth="4" />
          {/* Upward Support Arrow */}
          <path d="M100 130 L100 60 M92 70 L100 60 L108 70" className={`stroke-amber-400 ${animate ? 'animate-bounce' : ''}`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <text x="100" y="182" textAnchor="middle" className="fill-slate-300 text-[11px] font-mono font-bold">
            Fist Lifted on Open Palm
          </text>
        </svg>
      );

    case 'PLEASE':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" className="fill-teal-500/10 stroke-teal-400/30" strokeWidth="2" />
          {/* Chest Heart Backdrop */}
          <path d="M100 130 C80 110 65 95 65 75 C65 60 78 50 90 50 C96 50 100 55 100 55 C100 55 104 50 110 50 C122 50 135 60 135 75 C135 95 120 110 100 130 Z" className="fill-teal-500/20 stroke-teal-400/40" strokeWidth="2" />
          {/* Circular Rub Motion Arrow */}
          <path d="M100 45 A 35 35 0 1 1 65 80" className={`stroke-teal-300 ${animate ? 'animate-spin' : ''}`} strokeWidth="3.5" strokeDasharray="6 4" strokeLinecap="round" />
          <path d="M60 72 L65 82 L75 75" className="stroke-teal-300" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Flat Palm */}
          <rect x="80" y="70" width="40" height="50" rx="10" className="fill-teal-600/40 stroke-teal-300" strokeWidth="3" />
          <text x="100" y="182" textAnchor="middle" className="fill-slate-300 text-[11px] font-mono font-bold">
            Circular Rub Over Chest
          </text>
        </svg>
      );

    case 'GOOD':
    case 'YES':
    case 'OK':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" className="fill-emerald-500/10 stroke-emerald-400/30" strokeWidth="2" />
          {/* Thumbs Up Hand */}
          <path d="M70 150 L70 110 L115 110 L115 150 Z" className="fill-emerald-600/30 stroke-emerald-400" strokeWidth="4" />
          {/* Extended Thumb Up */}
          <path d="M85 110 L85 45 C85 38 98 38 98 45 L98 110" className="fill-emerald-500/40 stroke-emerald-400" strokeWidth="4" />
          {/* Folded Finger Knuckles */}
          <path d="M115 115 C125 115 125 125 115 125" className="stroke-emerald-300" strokeWidth="3.5" />
          <path d="M115 125 C125 125 125 135 115 135" className="stroke-emerald-300" strokeWidth="3.5" />
          <path d="M115 135 C125 135 125 145 115 145" className="stroke-emerald-300" strokeWidth="3.5" />
          {/* Sparkle Rays */}
          <g className={animate ? 'animate-pulse' : ''}>
            <line x1="92" y1="22" x2="92" y2="30" className="stroke-emerald-300" strokeWidth="3" strokeLinecap="round" />
            <line x1="75" y1="30" x2="80" y2="35" className="stroke-emerald-300" strokeWidth="3" strokeLinecap="round" />
            <line x1="108" y1="30" x2="103" y2="35" className="stroke-emerald-300" strokeWidth="3" strokeLinecap="round" />
          </g>
          <text x="100" y="182" textAnchor="middle" className="fill-slate-300 text-[11px] font-mono font-bold">
            Upright Thumb Gesture
          </text>
        </svg>
      );

    case 'HOW':
    case 'WHERE':
    case 'WHAT':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" className="fill-purple-500/10 stroke-purple-400/30" strokeWidth="2" />
          {/* Two Open Cupped Palms Turning Upward */}
          <path d="M40 120 C40 145 75 145 80 120 L70 95 C65 90 45 90 40 120 Z" className="fill-purple-600/30 stroke-purple-400" strokeWidth="3.5" />
          <path d="M160 120 C160 145 125 145 120 120 L130 95 C135 90 155 90 160 120 Z" className="fill-purple-600/30 stroke-purple-400" strokeWidth="3.5" />
          {/* Question Mark Center */}
          <path d="M92 70 C92 55 108 55 108 68 C108 80 98 82 98 92" className="stroke-purple-300" strokeWidth="4" strokeLinecap="round" />
          <circle cx="98" cy="105" r="3" className="fill-purple-300" />
          {/* Side Shake Arrows */}
          <path d="M30 100 L20 100 M170 100 L180 100" className={`stroke-purple-400 ${animate ? 'animate-pulse' : ''}`} strokeWidth="3" strokeLinecap="round" />
          <text x="100" y="182" textAnchor="middle" className="fill-slate-300 text-[11px] font-mono font-bold">
            Cupped Palms Question Gesture
          </text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" className="fill-slate-500/10 stroke-slate-400/30" strokeWidth="2" />
          {/* Generalized ISL Hand Pose Icon */}
          <rect x="75" y="90" width="50" height="55" rx="12" className="fill-slate-700/40 stroke-blue-400" strokeWidth="3.5" />
          <path d="M85 90 L85 50 C85 43 93 43 93 50 L93 90" className="fill-slate-600/40 stroke-blue-400" strokeWidth="3" />
          <path d="M96 90 L97 45 C97 38 105 38 105 45 L104 90" className="fill-slate-600/40 stroke-blue-400" strokeWidth="3" />
          <path d="M107 90 L112 50 C112 43 120 43 120 50 L115 90" className="fill-slate-600/40 stroke-blue-400" strokeWidth="3" />
          {/* Gloss Name Label inside SVG */}
          <text x="100" y="165" textAnchor="middle" className="fill-blue-300 text-[13px] font-mono font-bold uppercase tracking-wider">
            {gloss}
          </text>
          <text x="100" y="182" textAnchor="middle" className="fill-slate-400 text-[10px] font-mono">
            ISL Sign Gesture
          </text>
        </svg>
      );
  }
};
