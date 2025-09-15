import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ToastContainer from '@/components/toast-container';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'PTQ Twibbon',
  description: 'Aplikasi untuk membuat twibbon keren dan modern.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="container-fluid flex-grow-1 py-4">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}