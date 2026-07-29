// Deterministic "identicon substitute": derives initials + a stable HSL color
// from a username so every profile gets a consistent, collision-resistant
// avatar without relying on stock photography.

const PALETTE = [
  "199 89% 48%", // blue
  "262 83% 58%", // violet
  "142 71% 35%", // green
  "24 95% 53%",  // orange
  "339 82% 52%", // pink
  "199 60% 40%", // teal-blue
  "45 93% 47%",  // amber
  "271 68% 55%", // purple
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarColor(seed) {
  const hash = hashString(seed || "devlink");
  return PALETTE[hash % PALETTE.length];
}

export function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function avatarProps(seed, displayName) {
  return {
    initials: getInitials(displayName || seed),
    color: getAvatarColor(seed),
  };
}
