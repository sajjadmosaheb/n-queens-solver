import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Queen's Gambit Visualizer",
  description: 'Visually explore the 8-Queens problem with backtracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
