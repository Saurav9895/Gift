
import { Gift, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">
          
          {/* Column 1: Brand and Social */}
          <div className="lg:col-span-2">
             <Link href="/" className="flex items-center gap-2 mb-4">
                <Gift className="h-7 w-7 text-primary" />
                <span className="font-bold text-xl font-headline">Giftopia</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Discover the perfect gift for every occasion. Our curated collection offers unique and thoughtful presents to make every celebration special.
            </p>
            <div className="flex space-x-2">
                <Button variant="ghost" size="icon" asChild><a href="#"><Facebook className="h-5 w-5"/></a></Button>
                <Button variant="ghost" size="icon" asChild><a href="#"><Instagram className="h-5 w-5"/></a></Button>
                <Button variant="ghost" size="icon" asChild><a href="#"><Twitter className="h-5 w-5"/></a></Button>
                <Button variant="ghost" size="icon" asChild><a href="#"><Youtube className="h-5 w-5"/></a></Button>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h3 className="font-headline font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">My Account</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 3: Main Menu */}
          <div>
            <h3 className="font-headline font-semibold mb-4">Main Menu</h3>
            <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/recommendations" className="text-sm text-muted-foreground hover:text-primary transition-colors">Offers</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Contact Us */}
           <div>
            <h3 className="font-headline font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">Email: <a href="mailto:info@giftopia.com" className="ml-1 text-primary hover:underline">info@giftopia.com</a></li>
                <li className="flex items-start">Phone: <a href="tel:1234567890" className="ml-1 text-primary hover:underline">(123) 456-7890</a></li>
                <li className="flex items-start">123 Gift Lane, Celebration City, 12345</li>
            </ul>
          </div>

        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto py-4 px-4 text-center">
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Giftopia. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
