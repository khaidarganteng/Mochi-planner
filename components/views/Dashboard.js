'use client';
import { useRef } from 'react';
import { dayKey, rupiah } from '@/lib/store';
import Mochi from '../Mochi';
import { Ring, PageHead, Empty } from '../ui';

const QUOTES = ['Pelan-pelan juga maju, kok 🐢', 'Satu langkah kecil hari ini sudah cukup 🌸', 'Istirahat itu bagian dari produktif 🍵', 'Kamu sudah melakukan yang terbaik ✨', 'Kerjakan yang kecil dulu, yang besar menyusul 🍡'];

export default function Dashboard({ data, go, setHabits, restore, wipe }) {
  const { tasks, habits, notes, tx, sessions } = data;
  const today = dayKey();
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam';
  const open = tasks.filter((t) => t.status !== 'done');
  const doneN = tasks.filter((t) => t.status === 'done').length;
  const pct = tasks.length ? Math.round((doneN / tasks.length) * 100) : 0;
  const habDone = habits.filter((h) => h.done?.[today]).length;
  const focusMin = sessions.filter((s) => s.date === today).reduce((a, s) => a + s.minutes, 0);
  const ym = today.slice(0, 7);
  const out = tx.filter((t) => t.type === 'out' && t.date.startsWith(ym)).reduce((a, t) => a + t.amount, 0);
  const order = { high: 0, mid: 1, low: 2 };
  const next = [...open].sort((a, b) => order[a.prio] - order[b.prio] || (a.due || '9').localeCompare(b.due || '9')).slice(0, 4);
  const mood = pct >= 70 ? 'cheer' : hour >= 22 || hour < 5 ? 'sleepy' : 'happy';
  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  const file = useRef(null);

  const toggle = (id) => setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: { ...h.done, [today]: !h.done?.[today] } } : h)));
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `mochi-backup-${today}.json`; a.click(); URL.revokeObjectURL(a.href);
  };
  const importData = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { restore(JSON.parse(String(r.result))); alert('Data berhasil dipulihkan 🎉'); } catch { alert('File tidak valid.'); } };
    r.readAsText(f); e.target.value = '';
  };

  return (
    <>
      <div className="card mb-6 flex flex-col items-center gap-5 bg-gradient-to-br from-mochi-pink/40 via-white to-mochi-lav/40 p-6 text-center sm:flex-row sm:text-left">
        <Mochi size={120} mood={mood} className="flex-none animate-bob" />
        <div><h1 className="text-3xl md:text-4xl">{greet}! 🌷</h1><p className="mt-1 text-mochi-muted">{quote}</p>
          <p className="mt-3 text-sm">Hari ini ada <b>{open.length}</b> tugas aktif dan <b>{habits.length - habDone}</b> kebiasaan menunggu.</p></div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button onClick={() => go('tasks')} className="card flex items-center gap-3 p-4 text-left transition hover:-translate-y-1"><Ring value={pct} size={70} color="#ffb899">{pct}%</Ring><div><div className="text-xs text-mochi-muted">Tugas selesai</div><div className="font-display text-xl">{doneN}/{tasks.length}</div></div></button>
        <button onClick={() => go('habits')} className="card flex items-center gap-3 p-4 text-left transition hover:-translate-y-1"><Ring value={habits.length ? (habDone / habits.length) * 100 : 0} size={70} color="#aee8d2">{habDone}</Ring><div><div className="text-xs text-mochi-muted">Kebiasaan</div><div className="font-display text-xl">{habDone}/{habits.length}</div></div></button>
        <button onClick={() => go('focus')} className="card flex items-center gap-3 p-4 text-left transition hover:-translate-y-1"><div className="grid h-[70px] w-[70px] place-items-center rounded-full bg-mochi-pink/40 text-3xl">🍅</div><div><div className="text-xs text-mochi-muted">Fokus hari ini</div><div className="font-display text-xl">{focusMin} mnt</div></div></button>
        <button onClick={() => go('money')} className="card flex items-center gap-3 p-4 text-left transition hover:-translate-y-1"><div className="grid h-[70px] w-[70px] place-items-center rounded-full bg-mochi-butter text-3xl">🪙</div><div><div className="text-xs text-mochi-muted">Pengeluaran bulan ini</div><div className="font-display text-lg leading-tight">{rupiah(out)}</div></div></button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6"><h2 className="mb-3 text-2xl">Yang perlu dikerjakan</h2>
          {next.length === 0 ? <Empty emoji="🎉" text="Semua beres! Waktunya santai." /> : (
            <ul className="space-y-2">{next.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2 rounded-2xl bg-mochi-cream px-4 py-3"><span className="truncate">{t.title}</span>
                {t.due && <span className="chip flex-none bg-mochi-butter">{t.due.slice(5).split('-').reverse().join('/')}</span>}</li>))}</ul>)}
        </section>
        <section className="card p-6"><h2 className="mb-3 text-2xl">Kebiasaan hari ini</h2>
          {habits.length === 0 ? <Empty emoji="🌱" text="Belum ada kebiasaan." /> : (
            <ul className="space-y-2">{habits.map((h) => { const on = h.done?.[today]; return (
              <li key={h.id}><button onClick={() => toggle(h.id)} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${on ? 'bg-mochi-mint/50' : 'bg-mochi-cream hover:bg-mochi-mint/20'}`}>
                <span>{h.emoji} {h.name}</span><span className="text-xl">{on ? '✅' : '⚪'}</span></button></li>); })}</ul>)}
        </section>
      </div>

      <section className="card mt-6 flex flex-wrap items-center justify-between gap-3 p-5">
        <div><h3 className="text-xl">Cadangan data</h3><p className="text-sm text-mochi-muted">{notes.length} catatan · {tx.length} transaksi · simpan cadangan sebelum ganti perangkat.</p></div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-lav" onClick={exportData}>⬇ Ekspor</button>
          <button className="btn-ghost" onClick={() => file.current?.click()}>⬆ Impor</button>
          <input ref={file} type="file" accept="application/json" className="hidden" onChange={importData} />
          <button className="btn-ghost" onClick={() => confirm('Hapus semua data? Tindakan ini tidak bisa dibatalkan.') && wipe()}>🗑 Reset</button>
        </div>
      </section>
    </>
  );
}
