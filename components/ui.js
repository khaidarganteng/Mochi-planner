'use client';

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-mochi-ink/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="card max-h-[90vh] w-full max-w-md animate-pop overflow-auto p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-2xl">{title}</h3>
          <button type="button" className="btn-ghost !px-3 !py-1" onClick={onClose} aria-label="Tutup">✕</button></div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ emoji = '🍡', text }) {
  return <div className="py-10 text-center text-mochi-muted"><div className="text-4xl">{emoji}</div><p className="mt-2 text-sm">{text}</p></div>;
}

export function Ring({ value, size = 90, color = '#ffb899', children }) {
  const r = 38, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f6ebe4" strokeWidth="12" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} style={{ transition: 'stroke-dashoffset .6s' }} />
      </svg>
      <div className="absolute text-center font-display text-lg leading-none">{children}</div>
    </div>
  );
}

export function PageHead({ emoji, title, sub, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-3xl md:text-4xl"><span className="mr-2">{emoji}</span>{title}</h1><p className="text-mochi-muted">{sub}</p></div>
      {children}
    </div>
  );
}
