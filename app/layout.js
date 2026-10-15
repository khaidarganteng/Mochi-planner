import './globals.css';
import { Baloo_2, Nunito } from 'next/font/google';

const baloo = Baloo_2({ subsets: ['latin'], variable: '--font-baloo', weight: ['500', '600', '700'] });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', weight: ['600', '700', '800'] });

export const metadata = {
  title: 'Mochi Planner — Planner serba ada yang imut',
  description: 'Tugas, kebiasaan, timer fokus, catatan keuangan, dan catatan cepat dalam satu aplikasi pastel yang menggemaskan.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${baloo.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
