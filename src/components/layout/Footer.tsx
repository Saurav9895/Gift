import { Gift } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
             <Gift className="h-6 w-6 text-primary" />
             <Link href="/" className="font-bold font-headline text-lg">
              Giftopia
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Giftopia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
