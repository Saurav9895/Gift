

"use client";

import { useCart } from "@/lib/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Plus, Minus, X } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-provider";
import { useStoreSettings } from "@/lib/settings";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function CartPage() {
  const { cartItems, updateQuantity, cartCount } = useCart();
  const { user } = useAuth();
  const { settings, loading: settingsLoading } = useStoreSettings();
  const { toast } = useToast();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: string; value: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  const deliveryFee = useMemo(() => {
    if (!settings || subtotal === 0) return 0;
    if (appliedPromo?.type === "Free Delivery") return 0;
    if (settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold) {
      return 0;
    }
    return settings.deliveryFee;
  }, [settings, subtotal, appliedPromo]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === "Percentage") {
      return (subtotal * appliedPromo.value) / 100;
    }
    if (appliedPromo.type === "Fixed") {
      return appliedPromo.value;
    }
    return 0;
  }, [appliedPromo, subtotal]);

  const total = useMemo(() => {
    const calculatedTotal = subtotal + deliveryFee - discount;
    return Math.max(0, calculatedTotal);
  }, [subtotal, deliveryFee, discount]);
  
  const handleApplyPromo = () => {
    setPromoError(null);
    const code = settings?.promoCodes?.find(p => p.code.toLowerCase() === promoCode.toLowerCase());
    if (code) {
        setAppliedPromo(code);
        toast({ title: "Promo code applied!" });
    } else {
        setPromoError("Invalid promo code.");
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError(null);
  }

  if (cartCount === 0) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-semibold mb-4">Your Cart is Empty</h1>
            <Button asChild>
                <Link href="/">Continue Shopping</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="bg-muted/20">
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-headline font-bold mb-8">My Cart</h1>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Column */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-0">
             <div className="flex flex-col">
                {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                    {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    )}
                    </div>
                    <div className="flex-grow">
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4"/></Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                         <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4"/></Button>
                    </div>
                    </div>
                    <p className="font-semibold text-base">
                        ${(item.price * item.quantity).toFixed(2)}
                    </p>
                </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
                </div>
                {appliedPromo && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span className="text-muted-foreground">Discount ({appliedPromo.code})</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                )}
                <Separator />
                 <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
             </CardContent>
            <Separator />
            <CardContent>
                 <div className="space-y-2">
                    <Label htmlFor="promo">Promo Code</Label>
                    <div className="flex gap-2">
                        <Input id="promo" placeholder="Enter code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} disabled={!!appliedPromo}/>
                        <Button onClick={handleApplyPromo} disabled={!!appliedPromo || !promoCode}>Apply</Button>
                    </div>
                    {promoError && <p className="text-xs text-destructive">{promoError}</p>}
                    {appliedPromo && (
                        <Badge variant="secondary" className="flex justify-between items-center">
                            <span>Code "{appliedPromo.code}" applied</span>
                            <button onClick={handleRemovePromo} className="ml-2 rounded-full p-0.5 hover:bg-muted-foreground/20">
                                <X className="h-3 w-3"/>
                            </button>
                        </Badge>
                    )}
                 </div>
            </CardContent>
            </Card>
             <Button size="lg" className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
