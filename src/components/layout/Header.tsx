
"use client";

import Link from "next/link";
import { Heart, Menu, ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, Gift } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-provider";
import { useCart } from "@/lib/cart-provider";
import { useWishlist } from "@/lib/wishlist-provider";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user, userProfile, signOut, userRole } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "All Products" },
    { href: "/recommendations", label: "Recommendations" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Gift className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-lg">
              Giftopia
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
             {userRole === 'admin' && (
                <Link href="/admin" className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium">
                    Admin
                </Link>
             )}
          </nav>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <Gift className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-lg">Giftopia</span>
              </Link>
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                ))}
                 {userRole === 'admin' && (
                    <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                        Admin
                    </Link>
                 )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             {/* Future search bar */}
          </div>
          <nav className="flex items-center gap-2">
             <Link
              href="/wishlist"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'relative'
              )}
            >
              <Heart className="h-5 w-5" />
              {isClient && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 text-xs text-white bg-primary rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
               <span className="sr-only">Wishlist</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'relative'
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              {isClient && cartCount > 0 && (
                <span className="absolute top-0 right-0 text-xs text-white bg-primary rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {userProfile?.name || "My Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                  {userRole === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
