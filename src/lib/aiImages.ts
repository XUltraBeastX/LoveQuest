/**
 * Calls the Anthropic API to generate a short emoji/icon description
 * and returns a data-URI SVG placeholder with AI-generated content.
 * 
 * In production you'd call an image generation API (e.g. Stability AI, DALL-E).
 * For now this creates beautiful SVG cards with AI-generated flavor text.
 */

const COLORS: Record<string, { bg: string; accent: string; icon: string }> = {
  quest: { bg: '#2a1a4e', accent: '#9d7fe0', icon: '⚔️' },
  skin:  { bg: '#1a2e1a', accent: '#4caf72', icon: '✨' },
  shop:  { bg: '#2e1a10', accent: '#f0c040', icon: '🛍️' },
};

export async function generateImageForName(
  name: string,
  type: 'quest' | 'skin' | 'shop' = 'quest'
): Promise<string> {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 60,
        messages: [{
          role: 'user',
          content: `Give me ONE emoji (2 chars max) that perfectly represents this RPG ${type}: "${name}". Reply with only the emoji, nothing else.`,
        }],
      }),
    });
    const data = await res.json();
    const emoji = data?.content?.[0]?.text?.trim() || '✦';
    return buildSVG(name, emoji, type);
  } catch {
    return buildSVG(name, type === 'quest' ? '⚔️' : type === 'skin' ? '✨' : '🛍️', type);
  }
}

function buildSVG(name: string, emoji: string, type: 'quest' | 'skin' | 'shop'): string {
  const c = COLORS[type];
  const short = name.length > 14 ? name.slice(0, 13) + '…' : name;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c.bg}"/>
      <stop offset="100%" stop-color="${c.accent}22"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="16" fill="url(#g)"/>
  <rect width="120" height="120" rx="16" fill="none" stroke="${c.accent}" stroke-width="1" opacity="0.4"/>
  <text x="60" y="62" font-size="40" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  <text x="60" y="100" font-size="9" text-anchor="middle" fill="${c.accent}" font-family="system-ui" opacity="0.9">${short}</text>
</svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}
