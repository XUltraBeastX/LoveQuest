interface Props { skinType?: string | null; size?: number; }

const THEMES: Record<string, { dress: string; shade: string; glow: string }> = {
  default:  { dress: '#7c5cbf', shade: '#5a3d99', glow: 'rgba(124,92,191,0.4)' },
  ld:       { dress: '#4a2d88', shade: '#33206a', glow: 'rgba(74,45,136,0.5)'  },
  princess: { dress: '#c04880', shade: '#992060', glow: 'rgba(192,72,128,0.4)' },
  nature:   { dress: '#3a7a40', shade: '#2a5a2e', glow: 'rgba(58,122,64,0.4)'  },
  healing:  { dress: '#2a7a8a', shade: '#1a5a6a', glow: 'rgba(42,122,138,0.4)' },
  combat:   { dress: '#8a2a2a', shade: '#6a1a1a', glow: 'rgba(138,42,42,0.4)'  },
};

export function CharacterSVG({ skinType, size = 120 }: Props) {
  const t = THEMES[skinType ?? 'default'] ?? THEMES.default;

  return (
    <svg
      width={size} height={Math.round(size * 1.2)}
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 4px 16px ${t.glow})` }}
      aria-label="Player character"
    >
      {/* Glow aura */}
      <ellipse cx="50" cy="108" rx="22" ry="4" fill={t.glow} opacity="0.6"/>

      {/* ── Dress ── */}
      <path d="M26 84 Q24 114 50 116 Q76 114 74 84 Q64 76 50 74 Q36 76 26 84Z" fill={t.dress}/>
      <path d="M26 84 Q28 100 34 110 Q30 96 30 84Z" fill={t.shade} opacity="0.5"/>
      <path d="M74 84 Q72 100 66 110 Q70 96 70 84Z" fill={t.shade} opacity="0.5"/>

      {/* Arms */}
      <path d="M32 86 Q16 92 14 106 Q18 112 26 108 Q22 100 30 92Z" fill={t.shade}/>
      <path d="M68 86 Q84 92 86 106 Q82 112 74 108 Q78 100 70 92Z" fill={t.shade}/>
      <circle cx="14" cy="107" r="5" fill="#e8c090"/>
      <circle cx="86" cy="107" r="5" fill="#e8c090"/>

      {/* Collar */}
      <ellipse cx="50" cy="78" rx="18" ry="5" fill="rgba(255,255,255,0.12)"/>

      {/* ── Hair back ── */}
      <path d="M26 46 Q20 66 22 84 Q26 90 32 84 Q26 66 30 46Z" fill="#6a4018"/>
      <path d="M74 46 Q80 66 78 84 Q74 90 68 84 Q74 66 70 46Z" fill="#6a4018"/>
      <path d="M22 84 Q18 96 22 106 Q24 104 26 98 Q22 90 26 84Z" fill="#5a3010" opacity="0.8"/>
      <path d="M78 84 Q82 96 78 106 Q76 104 74 98 Q78 90 74 84Z" fill="#5a3010" opacity="0.8"/>

      {/* ── Head ── */}
      <circle cx="50" cy="48" r="22" fill="#e8c090"/>

      {/* ── Hair top ── */}
      <path d="M28 46 Q32 22 50 18 Q68 22 72 46 Q68 26 50 24 Q32 26 28 46Z" fill="#7a5020"/>
      <path d="M28 46 Q24 38 26 30 Q32 22 37 26 Q27 34 28 46Z" fill="#6a4018"/>
      <path d="M72 46 Q76 38 74 30 Q68 22 63 26 Q73 34 72 46Z" fill="#6a4018"/>
      <path d="M38 24 Q50 16 62 24 Q55 18 50 18 Q45 18 38 24Z" fill="#9a6a28" opacity="0.5"/>

      {/* Curly strands */}
      <path d="M27 48 Q22 58 24 70" stroke="#6a4018" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M73 48 Q78 58 76 70" stroke="#6a4018" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="24" cy="72" r="3" fill="#6a4018"/>
      <circle cx="76" cy="72" r="3" fill="#6a4018"/>

      {/* ── Face ── */}
      <ellipse cx="41" cy="50" rx="3" ry="3.5" fill="#1a0c04"/>
      <ellipse cx="59" cy="50" rx="3" ry="3.5" fill="#1a0c04"/>
      <ellipse cx="42" cy="49" rx="1.1" ry="1.3" fill="white" opacity="0.75"/>
      <ellipse cx="60" cy="49" rx="1.1" ry="1.3" fill="white" opacity="0.75"/>
      <path d="M38 44 Q41 42 44 43.5" stroke="#5a3010" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M56 43.5 Q59 42 62 44" stroke="#5a3010" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M45 62 Q50 67 55 62" stroke="#c08878" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <ellipse cx="39" cy="57" rx="4" ry="2.5" fill="#f09878" opacity="0.4"/>
      <ellipse cx="61" cy="57" rx="4" ry="2.5" fill="#f09878" opacity="0.4"/>

      {/* ── Accessories by skin ── */}
      {skinType === 'princess' && (
        <polygon points="50,8 53,17 62,17 55,23 57,32 50,27 43,32 45,23 38,17 47,17"
                 fill="#f0c040" opacity="0.95"/>
      )}
      {skinType === 'nature' && (
        <g opacity="0.85">
          <ellipse cx="40" cy="18" rx="8" ry="5" fill="#5aaa30"/>
          <ellipse cx="50" cy="13" rx="7" ry="4.5" fill="#70cc40"/>
          <ellipse cx="60" cy="18" rx="8" ry="5" fill="#5aaa30"/>
        </g>
      )}
      {skinType === 'ld' && (
        <g transform="translate(40,74)">
          <path d="M10 0 L20 4 L20 12 Q20 18 10 22 Q0 18 0 12 L0 4Z" fill="rgba(157,127,224,0.4)"/>
          <path d="M10 4 L15 6 L15 12 Q15 16 10 18 Q5 16 5 12 L5 6Z" fill="rgba(220,200,255,0.5)"/>
        </g>
      )}

      {/* Sparkle detail on dress */}
      <text x="46" y="96" fontSize="10" opacity="0.4" fill="white">✦</text>
      <text x="56" y="108" fontSize="7" opacity="0.3" fill="white">✦</text>
    </svg>
  );
}
