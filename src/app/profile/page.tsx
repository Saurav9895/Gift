
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
import { useEffect } from "react";
import { LogOut, KeyRound, Phone, Home, List, MapPin, Pencil, Trash2, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { user, userProfile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading || !userProfile) {
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

  // Mock data for addresses
  const addresses = [
    {
        name: "Saurav Yadav",
        address: "SI shelter flat 504, 4th Cross Road, Bengaluru, KA 560016",
        country: "India",
        phone: "9842483338"
    },
    {
        name: "Saurav Yadav",
        address: "Annapurna Store, Manohara Phant, Madhyapur Thimi, Bagmati Province 44600",
        country: "Nepal",
        phone: "9155917535"
    },
    {
        name: "Saurav",
        address: "International Hostel, IIt ISM, Lohar Kulli, Dhanbad, JH 826007",
        country: "India",
        phone: "9155917535"
    }
  ]

  return (
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
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {addresses.map((address, index) => (
                        <div key={index} className="p-4 border rounded-lg flex gap-4">
                            <Home className="h-5 w-5 text-muted-foreground mt-1"/>
                            <div className="flex-grow">
                                <p className="font-semibold">{address.name}</p>
                                <p className="text-sm text-muted-foreground">{address.address}</p>
                                <p className="text-sm text-muted-foreground">{address.country}</p>
                                <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                                <Button variant="link" className="p-0 h-auto text-primary">
                                    <MapPin className="mr-1 h-4 w-4" /> View on Map
                                </Button>
                            </div>
                             <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                                <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4"/>
                                </Button>
                                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    