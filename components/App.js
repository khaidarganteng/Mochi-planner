'use client';
import { useEffect, useState } from 'react';
import { useStored, uid, dayKey } from '@/lib/store';
import Mochi from './Mochi';
import Dashboard from './views/Dashboard';
import Tasks from './views/Tasks';
import Habits from './views/Habits';
import Focus from './views/Focus';
import Money from './views/Money';
import Notes from './views/Notes';

const NAV = [['home', 'Beranda', '🏡'], ['tasks', 'Tugas', '📝'], ['habits', 'Kebiasaan', '🌱'], ['focus', 'Fokus', '🍅'], ['money', 'Uang', '🪙'], ['notes', 'Catatan', '📌']];

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState('home');
  const [tasks, setTasks, tr] = useStored('mochi:tasks', []);
  const [habits, setHabits, hr] = useStored('mochi:habits', []);
  const [notes, setNotes] = useStored('mochi:notes', []);
  const [tx, setTx] = useStored('mochi:tx', []);
  const [budget, setBudget] = useStored('mochi:budget', 0);
  const [sessions, setSessions] = useStored('mochi:sessions', []);
  const [seeded, setSeeded, sr] = useStored('mochi:seeded', false);

  useEffect(() => {
    setMounted(true);
    const h = window.location.hash.slice(1);
    if (NAV.some((n) => n[0] === h)) setTab(h);
  }, []);

  // Isi contoh pertama kali supaya aplikasi tidak terlihat kosong
  useEffect(() => {
    if (!(tr && hr && sr) || seeded) return;
    if (!tasks.length) setTasks([
      { id: uid(), title: 'Coba tambah tugas pertamamu 🍓', prio: 'mid', due: '', status: 'todo', created: Date.now() },
      { id: uid(), title: 'Seret kartu ini ke kolom lain', prio: 'low', due: '', status: 'doing', created: Date.now() },
      { id: uid(), title: 'Buka Mochi Planner', prio: 'low', due: '', status: 'done', created: Date.now() },
    ]);
    if (!habits.length) setHabits([
      { id: uid(), name: 'Minum air', emoji: '💧', done: { [dayKey()]: true } },
      { id: uid(), name: 'Baca 10 menit', emoji: '📖', done: {} },
    ]);
    setSeeded(true);
  }, [tr, hr, sr, seeded]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (id) => { setTab(id); window.history.replaceState(null, '', '#' + id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (!mounted) {
    return <div className="grid min-h-screen place-items-center"><div className="text-center"><Mochi size={110} className="mx-auto animate-bob" /><p className="mt-2 font-display text-xl text-mochi-muted">Menyiapkan mochi...</p></div></div>;
  }

  const data = { tasks, habits, notes, tx, budget, sessions };
  const restore = (d) => {
    if (d.tasks) setTasks(d.tasks); if (d.habits) setHabits(d.habits); if (d.notes) setNotes(d.notes);
    if (d.tx) setTx(d.tx); if (typeof d.budget === 'number') setBudget(d.budget); if (d.sessions) setSessions(d.sessions);
  };
  const wipe = () => { setTasks([]); setHabits([]); setNotes([]); setTx([]); setBudget(0); setSessions([]); };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 pb-28 pt-5 lg:pb-8">
      <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-64 flex-none flex-col rounded-[32px] border-2 border-mochi-line bg-white/90 p-5 shadow-soft lg:flex">
        <div className="text-center"><Mochi size={96} className="mx-auto animate-bob" /><div className="font-display text-2xl">Mochi <span className="text-mochi-peach">Planner</span></div></div>
        <nav className="mt-6 space-y-1.5">
          {NAV.map(([id, label, ico]) => (
            <button key={id} onClick={() => go(id)} aria-current={tab === id}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition ${tab === id ? 'bg-mochi-peach/40 shadow-pop' : 'hover:bg-mochi-cream'}`}>
              <span className="text-xl">{ico}</span>{label}
            </button>
          ))}
        </nav>
        <p className="mt-auto rounded-2xl bg-mochi-lav/25 p-3 text-center text-xs text-mochi-muted">Data tersimpan aman di browser kamu 🔒</p>
      </aside>

      <main className="min-w-0 flex-1 animate-rise" key={tab}>
        {tab === 'home' && <Dashboard data={data} go={go} setHabits={setHabits} restore={restore} wipe={wipe} />}
        {tab === 'tasks' && <Tasks tasks={tasks} setTasks={setTasks} />}
        {tab === 'habits' && <Habits habits={habits} setHabits={setHabits} />}
        {tab === 'focus' && <Focus sessions={sessions} setSessions={setSessions} tasks={tasks} />}
        {tab === 'money' && <Money tx={tx} setTx={setTx} budget={budget} setBudget={setBudget} />}
        {tab === 'notes' && <Notes notes={notes} setNotes={setNotes} />}
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-[28px] border-2 border-mochi-line bg-white/95 p-2 shadow-soft backdrop-blur lg:hidden" aria-label="Navigasi">
        {NAV.map(([id, label, ico]) => (
          <button key={id} onClick={() => go(id)} aria-current={tab === id}
            className={`flex flex-col items-center rounded-2xl px-2.5 py-1.5 text-[11px] font-bold ${tab === id ? 'bg-mochi-peach/40' : 'text-mochi-muted'}`}>
            <span className="text-xl">{ico}</span>{label}
          </button>
        ))}
      </nav>
    </div>
  );
}
