
'use client';

import { useCart } from '@/lib/cart-provider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';

export default function SideCart() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, isCartOpen, setIsCartOpen } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 p-6">
          <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
          <Separator />
        </SheetHeader>

        {cartCount > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <div className="flex flex-col gap-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} / unit
                      </span>
                      <div className="flex items-center">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                           <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="h-4 w-4" />
                          </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <SheetFooter className="mt-auto flex-col space-y-4 border-t bg-background p-6">
              <div className="flex justify-end font-semibold">
                <span>Subtotal: ${subtotal.toFixed(2)}</span>
              </div>
              <Button asChild className="w-full" size="lg" onClick={() => setIsCartOpen(false)}>
                <Link href="/cart">Proceed to Checkout</Link>
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <p className="text-lg text-muted-foreground">Your cart is empty.</p>
            <Button
              variant="outline"
              onClick={() => setIsCartOpen(false)}
              asChild
            >
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
