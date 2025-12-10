"use client";

import { useCart } from "@/lib/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  const taxes = subtotal * 0.08; // Example 8% tax
  const total = subtotal + shipping + taxes;

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          Checkout
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
          <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-sm">
             <h2 className="text-2xl font-headline font-semibold mb-4">Order Summary</h2>
             <Separator />
            <div className="space-y-4 mt-4">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                        {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        )}
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold w-20 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                        </Button>
                    </div>
                    </div>
                ))}
            </div>
            <Separator className="my-6"/>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>${taxes.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
          </div>
          <div className="lg:col-span-1">
             <div className="bg-card p-6 rounded-lg shadow-sm space-y-4">
                <h2 className="text-2xl font-headline font-semibold">Payment Information</h2>
                <Separator />
                <div className="space-y-4">
                    <Input placeholder="Card Number" />
                    <div className="flex gap-4">
                        <Input placeholder="MM / YY" />
                        <Input placeholder="CVC" />
                    </div>
                    <Input placeholder="Name on Card" />
                </div>
                <Button className="w-full" size="lg">Pay Now</Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
