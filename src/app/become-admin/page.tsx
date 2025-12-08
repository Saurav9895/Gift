
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/lib/auth-provider';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function BecomeAdminPage() {
  const { user, userRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleBecomeAdmin() {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'You must be logged in to become an admin.',
      });
      return;
    }

    if (userRole === 'admin') {
      toast({
        title: 'Already an admin',
        description: 'You already have administrative privileges.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        role: 'admin',
      });
      toast({
        title: 'Success!',
        description: 'You have been granted admin privileges. You will be redirected shortly.',
      });
      // A short delay to allow the auth provider to pick up the new role
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update your role. Please try again.',
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Elevate Your Privileges
          </CardTitle>
          <CardDescription>
            Click the button below to assign yourself the 'admin' role. This
            will grant you access to the administrative dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleBecomeAdmin}
            disabled={isLoading || userRole === 'admin'}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {userRole === 'admin' ? 'You are Already an Admin' : 'Become an Admin'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
