'use client';
import { useState } from 'react';
import { uid, dayKey } from '@/lib/store';
import { Empty, Modal, PageHead, Ring } from '../ui';

const COLS = [['todo', 'Mau dikerjakan', '🍓', 'bg-mochi-pink/30'], ['doing', 'Lagi jalan', '🍑', 'bg-mochi-butter/70'], ['done', 'Selesai', '🍵', 'bg-mochi-mint/40']];
const PRIO = { low: ['Santai', 'bg-mochi-mint'], mid: ['Sedang', 'bg-mochi-sky'], high: ['Penting', 'bg-mochi-pink'] };

export default function Tasks({ tasks, setTasks }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: '', prio: 'mid', due: '' });
  const [q, setQ] = useState('');
  const [drag, setDrag] = useState(null);
  const today = dayKey();

  const add = (e) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    setTasks((t) => [{ id: uid(), title: f.title.trim(), prio: f.prio, due: f.due, status: 'todo', created: Date.now() }, ...t]);
    setF({ title: '', prio: 'mid', due: '' }); setOpen(false);
  };
  const move = (id, status) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, status } : x)));
  const del = (id) => setTasks((t) => t.filter((x) => x.id !== id));
  const shown = tasks.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
  const done = tasks.filter((t) => t.status === 'done').length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const order = COLS.map((c) => c[0]);

  return (
    <>
      <PageHead emoji="📝" title="Tugas" sub="Seret kartu antar kolom, atau pakai tombol panah.">
        <div className="flex items-center gap-3"><Ring value={pct} size={56} color="#ffb899"><span className="text-sm">{pct}%</span></Ring>
          <button className="btn-peach" onClick={() => setOpen(true)}>+ Tugas baru</button></div>
      </PageHead>
      <input className="input mb-5 max-w-sm" placeholder="🔍 Cari tugas..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari tugas" />

      <div className="grid gap-4 lg:grid-cols-3">
        {COLS.map(([key, label, emo, bg]) => {
          const list = shown.filter((t) => t.status === key);
          return (
            <section key={key} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag) move(drag, key); setDrag(null); }}
              className={`min-h-[240px] rounded-[28px] border-2 border-dashed border-mochi-line p-4 ${bg}`}>
              <h2 className="mb-3 flex items-center justify-between text-xl"><span>{emo} {label}</span><span className="chip bg-white">{list.length}</span></h2>
              <div className="space-y-3">
                {list.map((t) => {
                  const late = t.due && t.due < today && t.status !== 'done';
                  const i = order.indexOf(t.status);
                  return (
                    <article key={t.id} draggable onDragStart={() => setDrag(t.id)} className="cursor-grab rounded-2xl border-2 border-white bg-white p-3 shadow-pop active:cursor-grabbing">
                      <div className="flex items-start justify-between gap-2"><p className={`font-bold ${t.status === 'done' ? 'text-mochi-muted line-through' : ''}`}>{t.title}</p>
                        <span className={`chip flex-none ${PRIO[t.prio][1]}`}>{PRIO[t.prio][0]}</span></div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-xs ${late ? 'font-extrabold text-red-400' : 'text-mochi-muted'}`}>{t.due ? `📅 ${t.due.split('-').reverse().join('/')}${late ? ' · telat' : ''}` : ' '}</span>
                        <span className="flex gap-1">
                          {i > 0 && <button className="btn-ghost !px-2.5 !py-1" onClick={() => move(t.id, order[i - 1])} aria-label="Mundur">←</button>}
                          {i < 2 && <button className="btn-ghost !px-2.5 !py-1" onClick={() => move(t.id, order[i + 1])} aria-label="Maju">→</button>}
                          <button className="btn-ghost !px-2.5 !py-1" onClick={() => del(t.id)} aria-label="Hapus">✕</button>
                        </span>
                      </div>
                    </article>
                  );
                })}
                {list.length === 0 && <Empty emoji="🍡" text="Kosong" />}
              </div>
            </section>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Tugas baru 🍓">
        <form onSubmit={add} className="space-y-4">
          <div><label className="lbl" htmlFor="tt">Judul</label><input id="tt" autoFocus className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Mau mengerjakan apa?" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="lbl" htmlFor="tp">Prioritas</label><select id="tp" className="input" value={f.prio} onChange={(e) => setF({ ...f, prio: e.target.value })}><option value="low">Santai</option><option value="mid">Sedang</option><option value="high">Penting</option></select></div>
            <div><label className="lbl" htmlFor="td">Tenggat</label><input id="td" type="date" className="input" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} /></div>
          </div>
          <button className="btn-peach w-full">Simpan</button>
        </form>
      </Modal>
    </>
  );
}
