export default function Mochi({ size = 120, mood = 'happy', className = '' }) {
  const mouth = mood === 'sleepy' ? <path d="M44 67q6 3 12 0" fill="none" stroke="#4a3b52" strokeWidth="2.5" strokeLinecap="round" />
    : mood === 'cheer' ? <path d="M42 62q8 13 16 0z" fill="#ff8fa8" stroke="#4a3b52" strokeWidth="2" strokeLinejoin="round" />
    : <path d="M43 64q7 7 14 0" fill="none" stroke="#4a3b52" strokeWidth="2.5" strokeLinecap="round" />;
  const eyes = mood === 'sleepy'
    ? <><path d="M30 55q4 3 8 0M62 55q4 3 8 0" fill="none" stroke="#4a3b52" strokeWidth="2.5" strokeLinecap="round" /></>
    : <><circle cx="34" cy="54" r="4" fill="#4a3b52" /><circle cx="66" cy="54" r="4" fill="#4a3b52" /><circle cx="35.5" cy="52.5" r="1.4" fill="#fff" /><circle cx="67.5" cy="52.5" r="1.4" fill="#fff" /></>;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <ellipse cx="50" cy="92" rx="30" ry="5" fill="#4a3b52" opacity=".08" />
      <path d="M50 24c-22 0-36 14-36 34 0 17 14 30 36 30s36-13 36-30c0-20-14-34-36-34z" fill="#fff" stroke="#f1d9cf" strokeWidth="3" />
      <path d="M50 25c-2-9 4-15 13-15 0 9-5 14-13 15z" fill="#aee8d2" stroke="#7fcfb0" strokeWidth="2" />
      {eyes}
      <ellipse cx="25" cy="63" rx="6" ry="4" fill="#ffb3d1" opacity=".75" />
      <ellipse cx="75" cy="63" rx="6" ry="4" fill="#ffb3d1" opacity=".75" />
      {mouth}
    </svg>
  );
}
