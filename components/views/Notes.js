'use client';
import { useState } from 'react';
import { uid } from '@/lib/store';
import { Empty, Modal, PageHead } from '../ui';

const COLORS = ['#ffe0d1', '#e5dcff', '#d4f5e8', '#ffd9e8', '#d9eeff', '#fff3c4'];
const BLANK = { id: null, title: '', body: '', color: COLORS[0], pinned: false };

export default function Notes({ notes, setNotes }) {
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);

  const save = (e) => {
    e.preventDefault();
    if (!edit.title.trim() && !edit.body.trim()) return;
    if (edit.id) setNotes((n) => n.map((x) => (x.id === edit.id ? { ...edit, updated: Date.now() } : x)));
    else setNotes((n) => [{ ...edit, id: uid(), updated: Date.now() }, ...n]);
    setEdit(null);
  };
  const del = () => { setNotes((n) => n.filter((x) => x.id !== edit.id)); setEdit(null); };
  const pin = (id) => setNotes((n) => n.map((x) => (x.id === id ? { ...x, pinned: !x.pinned } : x)));

  const s = q.toLowerCase();
  const shown = notes.filter((n) => (n.title + ' ' + n.body).toLowerCase().includes(s))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updated - a.updated);

  return (
    <>
      <PageHead emoji="📌" title="Catatan" sub="Tempel ide, daftar belanja, atau apa pun yang perlu diingat.">
        <button className="btn-peach" onClick={() => setEdit({ ...BLANK })}>+ Catatan baru</button>
      </PageHead>
      <input className="input mb-5 max-w-sm" placeholder="🔍 Cari catatan..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari catatan" />

      {shown.length === 0 ? <div className="card"><Empty emoji="📌" text={notes.length ? 'Tidak ada catatan yang cocok.' : 'Belum ada catatan. Tulis yang pertama!'} /></div> : (
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          {shown.map((n, i) => (
            <article key={n.id} className="relative mb-4 break-inside-avoid rounded-[24px] border-2 border-white p-5 shadow-soft transition hover:-translate-y-1" style={{ background: n.color, transform: `rotate(${(i % 3 - 1) * 0.6}deg)` }}>
              <button onClick={() => pin(n.id)} className="absolute right-3 top-3 text-lg" aria-label={n.pinned ? 'Lepas pin' : 'Pin'}>{n.pinned ? '📌' : '📍'}</button>
              <button onClick={() => setEdit(n)} className="block w-full pr-7 text-left">
                {n.title && <h2 className="text-xl">{n.title}</h2>}
                <p className="mt-1 whitespace-pre-wrap break-words text-sm">{n.body}</p>
              </button>
            </article>
          ))}
        </div>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Ubah catatan ✏️' : 'Catatan baru 📌'}>
        {edit && (
          <form onSubmit={save} className="space-y-4">
            <div><label className="lbl" htmlFor="nt">Judul</label><input id="nt" autoFocus className="input" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></div>
            <div><label className="lbl" htmlFor="nb">Isi</label><textarea id="nb" rows={6} className="input" value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} /></div>
            <div><span className="lbl">Warna</span><div className="flex gap-2">{COLORS.map((c) => <button type="button" key={c} onClick={() => setEdit({ ...edit, color: c })} aria-label={`Warna ${c}`}
              className={`h-9 w-9 rounded-full border-4 ${edit.color === c ? 'border-mochi-ink/40' : 'border-white'}`} style={{ background: c }} />)}</div></div>
            <div className="flex gap-2"><button className="btn-peach flex-1">Simpan</button>{edit.id && <button type="button" className="btn-ghost" onClick={del}>🗑 Hapus</button>}</div>
          </form>
        )}
      </Modal>
    </>
  );
}
