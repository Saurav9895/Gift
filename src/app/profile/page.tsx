
"use client";

import { useAuth } from "@/lib/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, KeyRound, Phone, Home, List, MapPin, Pencil, Trash2, PlusCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAddresses, addAddress, deleteAddress } from "@/lib/addresses";
import type { Address } from "@/types";
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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  addressLine1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, signOut } = useAuth();
  const { addresses, loading: addressesLoading } = useAddresses(user?.uid);
  const router = useRouter();
  const { toast } = useToast();

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "", addressLine1: "", city: "",
      state: "", postalCode: "", country: "", phone: "",
    },
  });
  
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
          form.reset({
            addressLine1: `${address.road || ''}${address.house_number ? ' ' + address.house_number : ''}`,
            city: address.city || address.town || address.village || '',
            state: address.state || '',
            postalCode: address.postcode || '',
            country: address.country || '',
            name: userProfile?.name || '',
            phone: '',
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
      }
    );
  };


  const onAddAddressSubmit = async (values: z.infer<typeof addressSchema>) => {
    if (!user) return;
    try {
      await addAddress(user.uid, values);
      toast({ title: "Address added successfully" });
      setIsAddAddressOpen(false);
      form.reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to add address" });
    }
  };

  const handleDeleteAddress = async () => {
    if (!user || !addressToDelete) return;
    setIsDeleting(true);
    try {
        await deleteAddress(user.uid, addressToDelete.id);
        toast({ title: "Address deleted" });
    } catch (error) {
        toast({ variant: "destructive", title: "Failed to delete address" });
    } finally {
        setIsDeleting(false);
        setAddressToDelete(null);
    }
  };


  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (authLoading || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-1/4 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto px-4 py-12 bg-muted/20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">My Account</h1>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                        <AvatarFallback className="text-3xl">
                            {getInitials(userProfile.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                        {userProfile.role === 'admin' && <Badge>Main Admin</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                    <Separator className="my-4"/>
                    <Button variant="ghost" className="w-full" onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <KeyRound className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Password</p>
                                <p className="text-xs text-muted-foreground">Change your account password</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                             <div>
                                <p className="font-medium">Mobile Number</p>
                                <p className="text-xs text-muted-foreground">9842483338</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Account Overview</CardTitle>
                    <CardDescription>Manage your orders and saved addresses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <List className="h-6 w-6 text-muted-foreground"/>
                            <div>
                                <h3 className="font-semibold">My Orders</h3>
                                <p className="text-sm text-muted-foreground">View your order history and track shipments.</p>
                            </div>
                        </div>
                        <Button variant="outline">View Orders</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Shipping Addresses</CardTitle>
                        <CardDescription>Manage your saved addresses.</CardDescription>
                    </div>
                    <Button onClick={() => setIsAddAddressOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {addressesLoading ? (
                        <div className="flex items-center justify-center p-4">
                             <Loader2 className="h-6 w-6 animate-spin"/>
                        </div>
                    ) : addresses.length === 0 ? (
                        <p className="text-muted-foreground text-sm p-4 text-center">No saved addresses found.</p>
                    ) : (
                        addresses.map((address) => (
                        <div key={address.id} className="p-4 border rounded-lg flex gap-4">
                            <Home className="h-5 w-5 text-muted-foreground mt-1"/>
                            <div className="flex-grow">
                                <p className="font-semibold">{address.name}</p>
                                <p className="text-sm text-muted-foreground">{address.addressLine1}, {address.city}, {address.state} {address.postalCode}</p>
                                <p className="text-sm text-muted-foreground">{address.country}</p>
                                <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                                <Button variant="link" className="p-0 h-auto text-primary">
                                    <MapPin className="mr-1 h-4 w-4" /> View on Map
                                </Button>
                            </div>
                             <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                                <Button variant="ghost" size="icon" disabled>
                                    <Pencil className="h-4 w-4"/>
                                </Button>
                                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setAddressToDelete(address)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    )))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
    <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh]">
            <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                    Fill in the details below or fetch your current location.
                </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto px-1">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onAddAddressSubmit)} className="space-y-4">
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

                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="addressLine1" render={({ field }) => (
                        <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="state" render={({ field }) => (
                            <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="postalCode" render={({ field }) => (
                            <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="country" render={({ field }) => (
                            <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddAddressOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Save Address
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
            </div>
        </DialogContent>
    </Dialog>
    <AlertDialog open={!!addressToDelete} onOpenChange={(open) => !open && setAddressToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete this address. This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAddress} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

    