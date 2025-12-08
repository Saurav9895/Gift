"use client";

import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (userRole !== 'admin') {
        router.push('/');
      }
    }
  }, [user, loading, userRole, router]);

  if (loading || userRole !== 'admin') {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            <h1 className="text-xl font-semibold font-headline">Verifying Access</h1>
            <p className="text-muted-foreground">Please wait while we confirm your permissions.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
