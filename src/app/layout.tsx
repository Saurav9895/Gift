
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth-provider';
import { CartProvider } from '@/lib/cart-provider';
import { WishlistProvider } from '@/lib/wishlist-provider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { usePathname } from 'next/navigation';
import SideCart from '@/components/layout/SideCart';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Giftopia - Find the perfect gift for every occasion.</title>
        <meta name="description" content="Find the perfect gift for every occasion." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="relative flex min-h-dvh flex-col bg-background">
                {!isAdminPage && <Header />}
                <main className="flex-1">{children}</main>
                {!isAdminPage && <Footer />}
                <SideCart />
              </div>
            </WishlistProvider>
          </CartProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
