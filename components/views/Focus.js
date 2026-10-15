'use client';
import { useCallback, useEffect, useState } from 'react';
import { useStored, uid, dayKey, DAYS, lastDays } from '@/lib/store';
import Mochi from '../Mochi';
import { PageHead, Ring } from '../ui';

const MODES = { focus: ['Fokus', '🍅'], short: ['Istirahat', '☕'], long: ['Istirahat panjang', '🛋️'] };

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [660, 880, 1040].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.start(t); o.stop(t + 0.18);
    });
  } catch {}
}
const mmss = (ms) => { const s = Math.ceil(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };

export default function Focus({ sessions, setSessions, tasks }) {
  const [cfg, setCfg] = useStored('mochi:pomocfg', { focus: 25, short: 5, long: 15 });
  const [mode, setMode] = useState('focus');
  const [endAt, setEndAt] = useState(null);
  const [paused, setPaused] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [label, setLabel] = useState('');
  const [msg, setMsg] = useState('');

  const total = cfg[mode] * 60000;
  const running = endAt !== null;
  const remaining = running ? Math.max(0, endAt - now) : paused ?? total;

  const finish = useCallback(() => {
    setEndAt(null); setPaused(null); beep();
    if (mode === 'focus') {
      setSessions((s) => [...s, { id: uid(), date: dayKey(), minutes: cfg.focus, label }]);
      setMsg('Sesi fokus selesai! Waktunya istirahat sebentar 🍵');
    } else setMsg('Istirahat selesai, siap fokus lagi? 🍅');
  }, [mode, cfg.focus, label, setSessions]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => { const n = Date.now(); setNow(n); if (n >= endAt) finish(); }, 250);
    return () => clearInterval(id);
  }, [running, endAt, finish]);

  useEffect(() => {
    const prev = document.title;
    if (running) document.title = `${mmss(remaining)} • ${MODES[mode][0]}`;
    return () => { document.title = prev; };
  }, [running, remaining, mode]);

  const start = () => { setMsg(''); setNow(Date.now()); setEndAt(Date.now() + remaining); setPaused(null); };
  const pause = () => { setPaused(Math.max(0, endAt - Date.now())); setEndAt(null); };
  const reset = () => { setEndAt(null); setPaused(null); setMsg(''); };
  const pick = (m) => { setMode(m); reset(); };

  const today = dayKey();
  const todays = sessions.filter((s) => s.date === today);
  const todayMin = todays.reduce((a, s) => a + s.minutes, 0);
  const week = lastDays(7).map((d) => ({ d, m: sessions.filter((s) => s.date === dayKey(d)).reduce((a, s) => a + s.minutes, 0) }));
  const maxW = Math.max(30, ...week.map((w) => w.m));
  const active = tasks.filter((t) => t.status !== 'done');
  const pct = ((total - remaining) / total) * 100;

  return (
    <>
      <PageHead emoji="🍅" title="Fokus" sub="Teknik Pomodoro: fokus penuh, lalu istirahat." />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="card flex flex-col items-center p-6 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(MODES).map(([k, [l, e]]) => (
              <button key={k} onClick={() => pick(k)} className={`btn ${mode === k ? 'bg-mochi-peach shadow-pop' : 'bg-white'}`}>{e} {l}</button>))}
          </div>
          <div className="relative my-6">
            <Ring value={pct} size={250} color={mode === 'focus' ? '#ffb899' : '#aee8d2'}>
              <div className="text-6xl tabular-nums">{mmss(remaining)}</div>
            </Ring>
            <Mochi size={64} mood={running ? 'cheer' : 'happy'} className={`absolute -right-2 -top-2 ${running ? 'animate-bob' : ''}`} />
          </div>
          <select className="input mb-4 max-w-xs" value={label} onChange={(e) => setLabel(e.target.value)} aria-label="Tugas yang difokuskan">
            <option value="">Fokus ke... (opsional)</option>{active.map((t) => <option key={t.id}>{t.title}</option>)}
          </select>
          <div className="flex gap-3">
            {running ? <button className="btn-lav !px-8 !py-3 text-base" onClick={pause}>⏸ Jeda</button> : <button className="btn-peach !px-8 !py-3 text-base" onClick={start}>▶ {paused ? 'Lanjut' : 'Mulai'}</button>}
            <button className="btn-ghost !py-3" onClick={reset}>↺ Ulang</button>
          </div>
          {msg && <p className="mt-4 rounded-2xl bg-mochi-mint/40 px-4 py-2 text-sm">{msg}</p>}
          <details className="mt-5 text-sm text-mochi-muted"><summary className="cursor-pointer">⚙ Atur durasi (menit)</summary>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {Object.entries(MODES).map(([k, [l]]) => (
                <label key={k} className="text-left"><span className="lbl">{l}</span>
                  <input type="number" min="1" max="120" className="input" value={cfg[k]} onChange={(e) => { setCfg({ ...cfg, [k]: Math.max(1, Math.min(120, +e.target.value || 1)) }); reset(); }} /></label>))}
            </div></details>
        </section>

        <div className="space-y-6">
          <section className="card p-6"><h2 className="text-2xl">Hari ini</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-mochi-pink/30 p-4"><div className="font-display text-3xl">{todays.length}</div><div className="text-xs text-mochi-muted">sesi selesai</div></div>
              <div className="rounded-2xl bg-mochi-butter/70 p-4"><div className="font-display text-3xl">{todayMin}</div><div className="text-xs text-mochi-muted">menit fokus</div></div>
            </div>
            {todays.length > 0 && <ul className="mt-3 space-y-1 text-sm">{[...todays].reverse().slice(0, 4).map((s) => <li key={s.id} className="flex justify-between rounded-xl bg-mochi-cream px-3 py-2"><span className="truncate">🍅 {s.label || 'Fokus'}</span><span className="text-mochi-muted">{s.minutes}m</span></li>)}</ul>}
          </section>
          <section className="card p-6"><h2 className="text-2xl">7 hari terakhir</h2>
            <div className="mt-4 flex h-32 items-end gap-2">
              {week.map(({ d, m }) => (
                <div key={dayKey(d)} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-mochi-peach to-mochi-pink" style={{ height: `${Math.max(4, (m / maxW) * 100)}%` }} title={`${m} menit`} />
                  <span className="text-[11px] text-mochi-muted">{DAYS[d.getDay()]}</span>
                </div>))}
            </div></section>
        </div>
      </div>
    </>
  );
}
