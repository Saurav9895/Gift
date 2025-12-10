
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

const passwordSchema = z.object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters."),
    newPassword: z.string().min(6, "Password must be at least 6 characters."),
}).refine(data => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
});


const phoneSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 digits."),
});

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, signOut, updateUserPassword, updateUserProfile } = useAuth();
  const { addresses, loading: addressesLoading } = useAddresses(user?.uid);
  const router = useRouter();
  const { toast } = useToast();

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);

  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "", addressLine1: "", city: "",
      state: "", postalCode: "", country: "", phone: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
      resolver: zodResolver(passwordSchema),
      defaultValues: { currentPassword: "", newPassword: "" },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
      resolver: zodResolver(phoneSchema),
      defaultValues: { phone: userProfile?.phone || "" },
  });

   useEffect(() => {
    if (userProfile?.phone) {
      phoneForm.setValue("phone", userProfile.phone);
    }
  }, [userProfile, phoneForm]);
  
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
            addressLine1: `${address.road || ''}${address.house_number ? ' ' + address.house_number : ''}`,
            city: address.city || address.town || address.village || '',
            state: address.state || '',
            postalCode: address.postcode || '',
            country: address.country || '',
            name: userProfile?.name || '',
            phone: userProfile?.phone || '',
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
      addressForm.reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to add address" });
    }
  };

   const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
        await updateUserPassword(values.currentPassword, values.newPassword);
        toast({ title: "Password updated successfully" });
        setIsPasswordOpen(false);
        passwordForm.reset();
    } catch (error: any) {
        toast({ variant: "destructive", title: "Failed to update password", description: error.message });
    }
   }

   const onPhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
        if (!userProfile) return;
        try {
            await updateUserProfile({ phone: values.phone });
            toast({ title: "Phone number updated" });
            setIsPhoneOpen(false);
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to update phone number" });
        }
   }

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
                        <Button variant="outline" size="sm" onClick={() => setIsPasswordOpen(true)}>Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                             <div>
                                <p className="font-medium">Mobile Number</p>
                                <p className="text-xs text-muted-foreground">{userProfile.phone || "Not set"}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsPhoneOpen(true)}>Edit</Button>
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

    {/* Add Address Dialog */}
    <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                    Fill in the details below or fetch your current location.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
            <Form {...addressForm}>
                <form onSubmit={addressForm.handleSubmit(onAddAddressSubmit)} className="space-y-4">
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
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={addressForm.control} name="addressLine1" render={({ field }) => (
                        <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddAddressOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={addressForm.formState.isSubmitting}>
                            {addressForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Save Address
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
            </div>
        </DialogContent>
    </Dialog>

    {/* Change Password Dialog */}
    <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                    Enter your current and new password below.
                </DialogDescription>
            </DialogHeader>
             <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 pt-4">
                     <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                        <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                        <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsPasswordOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                            {passwordForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Save Password
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>

    {/* Change Phone Dialog */}
    <Dialog open={isPhoneOpen} onOpenChange={setIsPhoneOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Change Mobile Number</DialogTitle>
                <DialogDescription>
                    Enter your new mobile number below.
                </DialogDescription>
            </DialogHeader>
             <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4 pt-4">
                     <FormField control={phoneForm.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsPhoneOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={phoneForm.formState.isSubmitting}>
                            {phoneForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Save Number
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>


    {/* Delete Address Dialog */}
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
