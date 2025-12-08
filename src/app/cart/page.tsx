"use client";

import { useCart } from "@/lib/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { X } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          Shopping Cart
        </h1>
      </header>
      
      {cartCount === 0 ? (
        <div className="text-center py-20 bg-card rounded-lg border-dashed border-2">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const placeholder = PlaceHolderImages.find(p => p.id === item.imageId);
              return (
                <div key={item.id} className="flex items-center gap-4 bg-card p-4 rounded-lg shadow-sm">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden">
                    {placeholder && (
                      <Image src={placeholder.imageUrl} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 text-center"
                    />
                  </div>
                   <p className="font-semibold w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <X className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="lg:col-span-1">
             <div className="bg-card p-6 rounded-lg shadow-sm space-y-4">
                <h2 className="text-2xl font-headline font-semibold">Order Summary</h2>
                <Separator />
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Shipping</span>
                    <span>$5.00</span>
                </div>
                 <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                </div>
                <Separator />
                 <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(subtotal + 5.00).toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg">Proceed to Checkout</Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
