
"use client";

import { useCart } from "@/lib/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardDescription,
} from "@/components/ui/card";
import { useAddresses, addAddress } from "@/lib/addresses";
import { useAuth } from "@/lib/auth-provider";
import { Loader2, PlusCircle, MapPin } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  homeFloor: z.string().min(1, "This field is required"),
  locality: z.string().min(1, "This field is required"),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export default function CheckoutPage() {
  const { cartItems, cartCount, subtotal } = useCart();
  const { user, userProfile } = useAuth();
  const { addresses, loading: addressesLoading } = useAddresses(user?.uid);
  const { toast } = useToast();

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const deliveryFee = cartItems.length > 0 ? 10.00 : 0;
  const total = subtotal + deliveryFee;

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "", homeFloor: "", locality: "", landmark: "",
      city: "", state: "", postalCode: "", country: "", phone: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
        addressForm.setValue("name", userProfile.name || "");
        addressForm.setValue("phone", userProfile.phone || "");
    }
  }, [userProfile, addressForm]);

  const handleFetchLocation = async () => {
    if (!navigator.geolocation) {
      toast({ variant: "destructive", title: "Geolocation is not supported by your browser." });
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const { address } = data;
          addressForm.reset({
            locality: `${address.road || ''}${address.house_number ? ' ' + address.house_number : ''}`,
            city: address.city || address.town || address.village || '',
            state: address.state || '',
            postalCode: address.postcode || '',
            country: address.country || '',
            name: userProfile?.name || '',
            phone: userProfile?.phone || '',
            homeFloor: '',
            landmark: '',
          });
           toast({ title: "Location fetched!", description: "Address fields have been pre-filled." });
        } catch (error) {
          toast({ variant: "destructive", title: "Failed to fetch address details." });
        } finally {
            setIsFetchingLocation(false);
        }
      },
      (error) => {
        toast({ variant: "destructive", title: "Unable to retrieve your location.", description: error.message });
        setIsFetchingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const onAddAddressSubmit = async (values: z.infer<typeof addressSchema>) => {
    if (!user) return;
    try {
      await addAddress(user.uid, values);
      toast({ title: "Address added successfully" });
      setIsAddAddressOpen(false);
      addressForm.reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to add address" });
    }
  };
  
  if (cartCount === 0) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-semibold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">You have no items in your shopping cart.</p>
            <Button asChild>
                <Link href="/">Continue Shopping</Link>
            </Button>
        </div>
    )
  }

  return (
    <>
    <div className="bg-muted/20">
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-headline font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Select a saved address or add a new one.</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsAddAddressOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
              </Button>
            </CardHeader>
            <CardContent>
              {addressesLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin"/>
                </div>
              ) : (
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a saved address" />
                    </SelectTrigger>
                    <SelectContent>
                        {addresses.map(addr => (
                            <SelectItem key={addr.id} value={addr.id}>
                                {`${addr.name}, ${addr.homeFloor}, ${addr.locality}, ${addr.city}, ${addr.state} ${addr.postalCode}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

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
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                        {item.imageUrl && (
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        )}
                        </div>
                        <div className="flex-grow">
                        <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm whitespace-nowrap">
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
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Promo Code</span>
                         <Link href="#" className="text-primary hover:underline">Add Code</Link>
                    </div>
                    <Separator className="my-2"/>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>Rs{total.toFixed(2)}</span>
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
    </div>
    
    <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
        <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh] sm:max-h-[80vh]">
            <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                    Fill in the details below or fetch your current location.
                </DialogDescription>
            </DialogHeader>
            <Form {...addressForm}>
                <form onSubmit={addressForm.handleSubmit(onAddAddressSubmit)} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4">
                        <Button type="button" variant="outline" className="w-full" onClick={handleFetchLocation} disabled={isFetchingLocation}>
                            {isFetchingLocation ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            ) : (
                                <MapPin className="mr-2 h-4 w-4" />
                            )}
                            Fetch my current location
                        </Button>
                        <div className="relative my-4">
                            <Separator />
                            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-sm text-muted-foreground">OR</span>
                        </div>

                        <FormField control={addressForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g. John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={addressForm.control} name="homeFloor" render={({ field }) => (
                            <FormItem><FormLabel>Home/Floor/Building</FormLabel><FormControl><Input placeholder="e.g. Appt 123, Sunshine Apartments" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={addressForm.control} name="locality" render={({ field }) => (
                            <FormItem><FormLabel>Locality/Area/Street</FormLabel><FormControl><Input placeholder="e.g. Main Street" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={addressForm.control} name="landmark" render={({ field }) => (
                            <FormItem><FormLabel>Landmark (Optional)</FormLabel><FormControl><Input placeholder="e.g. Near City Park" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={addressForm.control} name="city" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={addressForm.control} name="state" render={({ field }) => (
                                <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={addressForm.control} name="postalCode" render={({ field }) => (
                                <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={addressForm.control} name="country" render={({ field }) => (
                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={addressForm.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <DialogFooter className="pt-4 border-t mt-auto bg-background">
                        <Button type="button" variant="outline" onClick={() => setIsAddAddressOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={addressForm.formState.isSubmitting}>
                            {addressForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Save Address
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    </>
  );
}

    