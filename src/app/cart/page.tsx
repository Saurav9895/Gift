
"use client";

import { useCart } from "@/lib/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Plus, Minus, MapPin } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";


export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 10.00 : 0;
  const total = subtotal + deliveryFee;

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
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Shipping Address */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Shipping Address</CardTitle>
            <Button variant="outline" size="sm">
              <MapPin className="mr-2 h-4 w-4" />
              Select on Map
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Saved Addresses</Label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Saurav Yadav, 4th Cross Road" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="addr1">Saurav Yadav, 4th Cross Road</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Saurav Yadav" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="9842483338" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apartment">Apartment, suite, etc.</Label>
              <Input id="apartment" placeholder="SI shelter flat 504" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" placeholder="4th Cross Road" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Bengaluru" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" placeholder="KA" />
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP / Postal Code</Label>
                <Input id="zip" placeholder="560016" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="India" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="cod">
              <div className="space-y-4">
                <Label htmlFor="cod" className="flex items-center space-x-3 p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="cod" id="cod" />
                  <span>Cash on Delivery (COD)</span>
                </Label>
                <Label htmlFor="online" className="flex items-center space-x-3 p-4 border rounded-md text-muted-foreground cursor-not-allowed">
                  <RadioGroupItem value="online" id="online" disabled />
                  <span>Online Payment (Coming Soon)</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order Summary</CardTitle>
                <Button variant="outline" asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                    {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    )}
                    </div>
                    <div className="flex-grow">
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3"/></Button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                         <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3"/></Button>
                    </div>
                    </div>
                    <p className="font-semibold text-sm">
                        Rs{item.price.toFixed(2)}
                    </p>
                </div>
                ))}
            </CardContent>
            <Separator />
             <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rs{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>Rs{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rs{total.toFixed(2)}</span>
                </div>
             </CardContent>
            <Separator />
            <CardContent>
                 <div className="space-y-2">
                    <Label htmlFor="promo">Have a promo code?</Label>
                    <div className="flex gap-2">
                        <Input id="promo" placeholder="Enter code" />
                        <Button>Apply</Button>
                    </div>
                 </div>
            </CardContent>
            </Card>
             <Button size="lg" className="w-full">
                Place Order
            </Button>
        </div>
      </div>
    </div>
    </div>
  );
}
