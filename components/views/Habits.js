'use client';
import { useState } from 'react';
import { uid, dayKey, DAYS, lastDays } from '@/lib/store';
import { Empty, Modal, PageHead } from '../ui';

const EMOJIS = ['💧', '📖', '🏃', '🧘', '🥗', '😴', '✍️', '🎸', '🧹', '💊', '🌞', '🐶'];

function streak(done = {}) {
  const d = new Date();
  if (!done[dayKey(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (done[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export default function Habits({ habits, setHabits }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const days = lastDays(7);

  const add = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setHabits((h) => [...h, { id: uid(), name: name.trim(), emoji, done: {} }]);
    setName(''); setOpen(false);
  };
  const toggle = (id, key) => setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: { ...h.done, [key]: !h.done?.[key] } } : h)));
  const del = (id) => confirm('Hapus kebiasaan ini?') && setHabits((hs) => hs.filter((h) => h.id !== id));

  return (
    <>
      <PageHead emoji="🌱" title="Kebiasaan" sub="Centang setiap hari dan jaga streak-mu tetap menyala.">
        <button className="btn-peach" onClick={() => setOpen(true)}>+ Kebiasaan baru</button>
      </PageHead>

      {habits.length === 0 ? <div className="card"><Empty emoji="🌱" text="Belum ada kebiasaan. Mulai dari yang kecil ya!" /></div> : (
        <div className="space-y-4">
          {habits.map((h) => {
            const s = streak(h.done);
            const week = days.filter((d) => h.done?.[dayKey(d)]).length;
            return (
              <article key={h.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-mochi-mint/50 text-2xl">{h.emoji}</span>
                    <div><h2 className="text-xl">{h.name}</h2><p className="text-xs text-mochi-muted">{week}/7 hari minggu ini</p></div></div>
                  <div className="flex items-center gap-2">
                    <span className={`chip ${s > 0 ? 'bg-mochi-butter' : 'bg-mochi-cream text-mochi-muted'}`}>🔥 {s} hari</span>
                    <button className="btn-ghost !px-3 !py-1" onClick={() => del(h.id)} aria-label="Hapus">✕</button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {days.map((d) => {
                    const k = dayKey(d), on = h.done?.[k], isToday = k === dayKey();
                    return (
                      <button key={k} onClick={() => toggle(h.id, k)} aria-pressed={!!on} aria-label={`${DAYS[d.getDay()]} ${d.getDate()}`}
                        className={`rounded-2xl border-2 py-2 text-center transition ${on ? 'border-mochi-mint bg-mochi-mint/60' : 'border-mochi-line bg-mochi-cream hover:bg-mochi-mint/20'} ${isToday ? 'ring-4 ring-mochi-peach/30' : ''}`}>
                        <div className="text-[11px] text-mochi-muted">{DAYS[d.getDay()]}</div>
                        <div className="text-lg">{on ? '✅' : d.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Kebiasaan baru 🌱">
        <form onSubmit={add} className="space-y-4">
          <div><label className="lbl" htmlFor="hn">Nama</label><input id="hn" autoFocus className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Jalan sore" /></div>
          <div><span className="lbl">Ikon</span><div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => <button type="button" key={e} onClick={() => setEmoji(e)} className={`h-11 w-11 rounded-2xl border-2 text-xl ${emoji === e ? 'border-mochi-peach bg-mochi-peach/30' : 'border-mochi-line bg-mochi-cream'}`}>{e}</button>)}</div></div>
          <button className="btn-peach w-full">Simpan</button>
        </form>
      </Modal>
    </>
  );
}
