'use client';
import { useMemo, useState } from 'react';
import { uid, dayKey, rupiah } from '@/lib/store';
import { Empty, Modal, PageHead } from '../ui';

const OUT = ['Makan', 'Transport', 'Belanja', 'Tagihan', 'Hiburan', 'Lainnya'];
const IN = ['Uang saku', 'Gaji', 'Bonus', 'Lainnya'];
const EMO = { Makan: '🍜', Transport: '🚌', Belanja: '🛍️', Tagihan: '🧾', Hiburan: '🎮', 'Uang saku': '💌', Gaji: '💼', Bonus: '🎁', Lainnya: '✨' };
const BAR = ['#ffb899', '#c9b6ff', '#aee8d2', '#ffb3d1', '#b8e0ff', '#ffe58f'];

export default function Money({ tx, setTx, budget, setBudget }) {
  const n = new Date();
  const [ym, setYm] = useState({ y: n.getFullYear(), m: n.getMonth() });
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [f, setF] = useState({ type: 'out', amount: '', cat: 'Makan', note: '', date: dayKey() });

  const prefix = `${ym.y}-${String(ym.m + 1).padStart(2, '0')}`;
  const label = new Date(ym.y, ym.m, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const shift = (d) => setYm(({ y, m }) => { const x = new Date(y, m + d, 1); return { y: x.getFullYear(), m: x.getMonth() }; });

  const s = useMemo(() => {
    const month = tx.filter((t) => t.date.startsWith(prefix));
    const inc = month.filter((t) => t.type === 'in').reduce((a, t) => a + t.amount, 0);
    const out = month.filter((t) => t.type === 'out').reduce((a, t) => a + t.amount, 0);
    const balance = tx.reduce((a, t) => a + (t.type === 'in' ? t.amount : -t.amount), 0);
    const byCat = OUT.map((c) => [c, month.filter((t) => t.type === 'out' && t.cat === c).reduce((a, t) => a + t.amount, 0)]).filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1]);
    const days = new Date(ym.y, ym.m + 1, 0).getDate();
    const daily = Array.from({ length: days }, (_, i) => month.filter((t) => t.type === 'out' && t.date === `${prefix}-${String(i + 1).padStart(2, '0')}`).reduce((a, t) => a + t.amount, 0));
    return { month, inc, out, balance, byCat, daily };
  }, [tx, prefix, ym]);

  const list = s.month.filter((t) => filter === 'all' || t.type === filter).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const maxDaily = Math.max(1, ...s.daily);
  const used = budget > 0 ? Math.min(100, (s.out / budget) * 100) : 0;

  const add = (e) => {
    e.preventDefault();
    const amount = Number(f.amount);
    if (!(amount > 0)) return;
    setTx((t) => [...t, { id: uid(), type: f.type, amount, cat: f.cat, note: f.note.trim(), date: f.date }]);
    setF({ ...f, amount: '', note: '' }); setOpen(false);
  };

  return (
    <>
      <PageHead emoji="🪙" title="Keuangan" sub="Catat pemasukan dan pengeluaran supaya dompet tetap senang.">
        <button className="btn-peach" onClick={() => setOpen(true)}>+ Catat</button>
      </PageHead>

      <div className="mb-5 flex items-center justify-center gap-3">
        <button className="btn-ghost !px-4" onClick={() => shift(-1)} aria-label="Bulan sebelumnya">‹</button>
        <span className="min-w-[160px] text-center font-display text-xl capitalize">{label}</span>
        <button className="btn-ghost !px-4" onClick={() => shift(1)} aria-label="Bulan berikutnya">›</button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card bg-mochi-lav/30 p-5"><div className="text-xs text-mochi-muted">Saldo total</div><div className={`font-display text-2xl ${s.balance < 0 ? 'text-red-400' : ''}`}>{rupiah(s.balance)}</div></div>
        <div className="card bg-mochi-mint/40 p-5"><div className="text-xs text-mochi-muted">Pemasukan bulan ini</div><div className="font-display text-2xl">{rupiah(s.inc)}</div></div>
        <div className="card bg-mochi-pink/30 p-5"><div className="text-xs text-mochi-muted">Pengeluaran bulan ini</div><div className="font-display text-2xl">{rupiah(s.out)}</div></div>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <div className="flex items-center justify-between"><h2 className="text-2xl">Anggaran bulanan</h2></div>
          <div className="mt-3 flex gap-2"><input type="number" min="0" className="input" placeholder="Anggaran (Rp)" value={budget || ''} onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))} aria-label="Anggaran bulanan" /></div>
          {budget > 0 && <div className="mt-4"><div className="h-4 overflow-hidden rounded-full bg-mochi-cream"><div className={`h-full rounded-full transition-all ${used >= 90 ? 'bg-red-300' : used >= 70 ? 'bg-mochi-butter' : 'bg-mochi-mint'}`} style={{ width: `${used}%` }} /></div>
            <p className="mt-2 text-sm text-mochi-muted">{used >= 100 ? 'Anggaran terlampaui, yuk rem sedikit 🐢' : `Terpakai ${Math.round(used)}% · sisa ${rupiah(Math.max(0, budget - s.out))}`}</p></div>}
          <h3 className="mb-2 mt-6 text-lg">Per kategori</h3>
          {s.byCat.length === 0 ? <p className="text-sm text-mochi-muted">Belum ada pengeluaran bulan ini.</p> : (
            <ul className="space-y-3">{s.byCat.map(([c, v], i) => (
              <li key={c}><div className="mb-1 flex justify-between text-sm"><span>{EMO[c]} {c}</span><span className="text-mochi-muted">{rupiah(v)}</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-mochi-cream"><div className="h-full rounded-full" style={{ width: `${(v / s.out) * 100}%`, background: BAR[i % BAR.length] }} /></div></li>))}</ul>)}
        </section>
        <section className="card p-6"><h2 className="text-2xl">Pengeluaran harian</h2>
          <div className="mt-4 flex h-40 items-end gap-[3px]" aria-label="Grafik pengeluaran harian">
            {s.daily.map((v, i) => <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-mochi-peach to-mochi-pink" style={{ height: `${Math.max(3, (v / maxDaily) * 100)}%`, opacity: v ? 1 : 0.25 }} title={`Tgl ${i + 1}: ${rupiah(v)}`} />)}
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-mochi-muted"><span>1</span><span>{Math.ceil(s.daily.length / 2)}</span><span>{s.daily.length}</span></div>
        </section>
      </div>

      <section className="card p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-2xl">Transaksi</h2>
          <div className="flex gap-2">{[['all', 'Semua'], ['in', 'Masuk'], ['out', 'Keluar']].map(([k, l]) => <button key={k} onClick={() => setFilter(k)} className={`chip ${filter === k ? 'bg-mochi-peach' : 'bg-mochi-cream'}`}>{l}</button>)}</div></div>
        {list.length === 0 ? <Empty emoji="🪙" text="Belum ada transaksi di bulan ini." /> : (
          <ul className="divide-y-2 divide-mochi-line">{list.map((t) => (
            <li key={t.id} className="flex items-center gap-3 py-3">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-mochi-cream text-xl">{EMO[t.cat]}</span>
              <div className="min-w-0 flex-1"><div className="truncate font-bold">{t.note || t.cat}</div><div className="text-xs text-mochi-muted">{t.cat} · {t.date.split('-').reverse().join('/')}</div></div>
              <div className={`font-display text-lg ${t.type === 'in' ? 'text-emerald-500' : ''}`}>{t.type === 'in' ? '+' : '−'}{rupiah(t.amount)}</div>
              <button className="btn-ghost !px-2.5 !py-1" onClick={() => setTx((x) => x.filter((y) => y.id !== t.id))} aria-label="Hapus">✕</button>
            </li>))}</ul>)}
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Catat transaksi 🪙">
        <form onSubmit={add} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">{[['out', 'Pengeluaran'], ['in', 'Pemasukan']].map(([k, l]) => <button type="button" key={k} onClick={() => setF({ ...f, type: k, cat: k === 'out' ? OUT[0] : IN[0] })} className={`btn ${f.type === k ? 'bg-mochi-peach shadow-pop' : 'bg-white'}`}>{l}</button>)}</div>
          <div><label className="lbl" htmlFor="ma">Jumlah (Rp)</label><input id="ma" type="number" min="1" autoFocus className="input" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder="25000" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="lbl" htmlFor="mc">Kategori</label><select id="mc" className="input" value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>{(f.type === 'out' ? OUT : IN).map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><label className="lbl" htmlFor="md">Tanggal</label><input id="md" type="date" className="input" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></div>
          </div>
          <div><label className="lbl" htmlFor="mn">Catatan</label><input id="mn" className="input" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Contoh: Bakso depan kampus" /></div>
          <button className="btn-peach w-full">Simpan</button>
        </form>
      </Modal>
    </>
  );
}
