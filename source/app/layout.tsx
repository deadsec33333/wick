import type { Metadata } from 'next';
import { brand } from '@/lib/simulation/config.mjs';
import './globals.css';
export const metadata: Metadata = { title: `${brand.name} — ${brand.tagline}`, description: 'A simulated fee lottery. Everyone gets called equally often. Demo market data. No funds are distributed.', icons: {icon:'/favicon.svg',shortcut:'/favicon.svg'} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
