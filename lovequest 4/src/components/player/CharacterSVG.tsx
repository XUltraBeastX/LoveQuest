interface CharacterSVGProps {
  skinType?: string | null;
  size?: number;
}

const THEMES: Record<string, { dress: string; dressShade: string; collar: string; shoes: string; extra?: string }> = {
  default:  { dress: '#B088E0', dressShade: '#9068C8', collar: '#DEC8F8', shoes: '#7B5EA7' },
  ld:       { dress: '#7B55CC', dressShade: '#6A44BB', collar: '#C8A8F8', shoes: '#5533AA' },
  princess: { dress: '#E86099', dressShade: '#CC4880', collar: '#F8B8D4', shoes: '#AA2260' },
  nature:   { dress: '#68BB44', dressShade: '#55AA33', collar: '#B8EE88', shoes: '#337722' },
  healing:  { dress: '#44AABB', dressShade: '#3399AA', collar: '#88DDEE', shoes: '#226688' },
  combat:   { dress: '#CC5544', dressShade: '#BB4433', collar: '#EE9988', shoes: '#882222' },
};

export function CharacterSVG({ skinType, size = 140 }: CharacterSVGProps) {
  const t = THEMES[skinType ?? 'default'] ?? THEMES.default;

  return (
    <svg
      width={size}
      height={Math.round(size * 1.15)}
      viewBox="0 0 110 126"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 6px 18px rgba(100,60,160,0.18))' }}
      aria-label="Player character illustration"
      role="img"
    >
      {/* ── Ground shadow ── */}
      <ellipse cx="55" cy="122" rx="24" ry="3.5" fill="#C8A8E8" opacity="0.25"/>

      {/* ── Dress / body ── */}
      <path d="M28 90 Q26 124 55 124 Q84 124 82 90 Q72 82 55 80 Q38 82 28 90Z" fill={t.dress}/>

      {/* Dress shading fold */}
      <path d="M28 90 Q30 108 38 118 Q36 104 34 92Z" fill={t.dressShade} opacity="0.6"/>
      <path d="M82 90 Q80 108 72 118 Q74 104 76 92Z" fill={t.dressShade} opacity="0.6"/>

      {/* Arms */}
      <path d="M34 92 Q18 98 16 112 Q20 120 28 116 Q24 106 32 98Z" fill={t.dressShade}/>
      <path d="M76 92 Q92 98 94 112 Q90 120 82 116 Q86 106 78 98Z" fill={t.dressShade}/>

      {/* Hands */}
      <circle cx="16.5" cy="114" r="5.5" fill="#F4CCA8"/>
      <circle cx="93.5" cy="114" r="5.5" fill="#F4CCA8"/>

      {/* Collar accent */}
      <ellipse cx="55" cy="84" rx="20" ry="5" fill={t.collar} opacity="0.75"/>

      {/* ── Hair (back layer, behind head) ── */}
      <path d="M29 50 Q24 70 26 90 Q30 96 36 90 Q28 72 33 50Z" fill="#8B5E28"/>
      <path d="M81 50 Q86 70 84 90 Q80 96 74 90 Q82 72 77 50Z" fill="#8B5E28"/>

      {/* Long curly back strands */}
      <path d="M26 90 Q22 100 26 110 Q28 108 30 102 Q26 96 30 90Z" fill="#7A5020" opacity="0.7"/>
      <path d="M84 90 Q88 100 84 110 Q82 108 80 102 Q84 96 80 90Z" fill="#7A5020" opacity="0.7"/>

      {/* ── Head ── */}
      <circle cx="55" cy="56" r="25" fill="#F4CCA8"/>

      {/* ── Hair top ── */}
      <path d="M30 52 Q34 24 55 20 Q76 24 80 52 Q76 30 55 28 Q34 30 30 52Z" fill="#9A6A30"/>
      {/* Side volume */}
      <path d="M30 52 Q26 44 28 36 Q34 28 38 32 Q28 40 30 52Z" fill="#8B5E28"/>
      <path d="M80 52 Q84 44 82 36 Q76 28 72 32 Q82 40 80 52Z" fill="#8B5E28"/>
      {/* Top highlight */}
      <path d="M40 28 Q55 18 70 28 Q62 20 55 20 Q48 20 40 28Z" fill="#B8864A" opacity="0.5"/>

      {/* Curly strand details on sides */}
      <path d="M29 52 Q24 62 26 74" stroke="#7A5020" strokeWidth="3.5" fill="none"
            strokeLinecap="round"/>
      <path d="M81 52 Q86 62 84 74" stroke="#7A5020" strokeWidth="3.5" fill="none"
            strokeLinecap="round"/>
      <circle cx="26" cy="76" r="3.5" fill="#7A5020"/>
      <circle cx="84" cy="76" r="3.5" fill="#7A5020"/>

      {/* ── Face ── */}
      {/* Eyes */}
      <ellipse cx="45" cy="58" rx="3.5" ry="4" fill="#2C1A08"/>
      <ellipse cx="65" cy="58" rx="3.5" ry="4" fill="#2C1A08"/>
      {/* Eye shine */}
      <ellipse cx="46.2" cy="56.5" rx="1.3" ry="1.5" fill="white" opacity="0.8"/>
      <ellipse cx="66.2" cy="56.5" rx="1.3" ry="1.5" fill="white" opacity="0.8"/>
      {/* Lower eye shine (gives depth) */}
      <ellipse cx="44.5" cy="60" rx="0.7" ry="0.8" fill="white" opacity="0.35"/>
      <ellipse cx="64.5" cy="60" rx="0.7" ry="0.8" fill="white" opacity="0.35"/>

      {/* Eyebrows — soft arch */}
      <path d="M41 52 Q45 49.5 49 51.5" stroke="#7A5030" strokeWidth="1.4"
            fill="none" strokeLinecap="round"/>
      <path d="M61 51.5 Q65 49.5 69 52" stroke="#7A5030" strokeWidth="1.4"
            fill="none" strokeLinecap="round"/>

      {/* Nose — tiny */}
      <path d="M54 63 Q55 65 56 63" stroke="#D4967A" strokeWidth="1" fill="none"
            strokeLinecap="round"/>

      {/* Mouth — gentle smile */}
      <path d="M49.5 70 Q55 75.5 60.5 70" stroke="#C4788A" strokeWidth="1.8"
            fill="none" strokeLinecap="round"/>
      {/* Subtle lip fill */}
      <path d="M49.5 70 Q55 73 60.5 70 Q55 71.5 49.5 70Z" fill="#E4A0AA" opacity="0.4"/>

      {/* Blush */}
      <ellipse cx="43" cy="66" rx="5" ry="3" fill="#F8B0A8" opacity="0.45"/>
      <ellipse cx="67" cy="66" rx="5" ry="3" fill="#F8B0A8" opacity="0.45"/>

      {/* ── Skin-specific accessories ── */}
      {skinType === 'princess' && (
        <g>
          <polygon points="55,10 58.5,20 68,20 60.5,26 63,36 55,30 47,36 49.5,26 42,20 51.5,20"
                   fill="#F5C830" opacity="0.95"/>
          <polygon points="55,10 58.5,20 68,20 60.5,26 63,36 55,30 47,36 49.5,26 42,20 51.5,20"
                   fill="none" stroke="#E8A820" strokeWidth="0.8" opacity="0.6"/>
        </g>
      )}
      {skinType === 'nature' && (
        <g opacity="0.85">
          <ellipse cx="43" cy="22" rx="9" ry="6" fill="#7ACC44"/>
          <ellipse cx="55" cy="17" rx="8" ry="5.5" fill="#88DD55"/>
          <ellipse cx="67" cy="22" rx="9" ry="6" fill="#7ACC44"/>
          <ellipse cx="35" cy="28" rx="7" ry="4.5" fill="#66BB33"/>
          <ellipse cx="75" cy="28" rx="7" ry="4.5" fill="#66BB33"/>
        </g>
      )}
      {skinType === 'ld' && (
        <g transform="translate(44, 80)">
          <path d="M11 0 L22 5 L22 15 Q22 23 11 28 Q0 23 0 15 L0 5Z"
                fill="#AA88EE" opacity="0.5"/>
          <path d="M11 5 L17 8 L17 15 Q17 20 11 23 Q5 20 5 15 L5 8Z"
                fill="#DEC8F8" opacity="0.65"/>
        </g>
      )}
      {skinType === 'healing' && (
        <g>
          <path d="M45 20 Q55 12 65 20 Q60 14 55 13 Q50 14 45 20Z"
                fill="#88DDEE" opacity="0.7"/>
          <ellipse cx="55" cy="13" rx="6" ry="3.5" fill="#AAEEFF" opacity="0.6"/>
        </g>
      )}
    </svg>
  );
}
