
"use client";

import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/users";
import { useOrders } from "@/lib/orders";
import { useAddresses } from "@/lib/addresses";
import { Loader2, ArrowLeft, Mail, Phone, Home } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function UserDetailPage() {
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const { user, loading: userLoading, error: userError } = useUser(userId);
  const { orders, loading: ordersLoading, error: ordersError } = useOrders(userId);
  const { addresses, loading: addressesLoading, error: addressesError } = useAddresses(userId);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };
  
  const isLoading = userLoading || ordersLoading || addressesLoading;
  const error = userError || ordersError || addressesError;

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error || !user) {
    return <div className="text-center py-10">{error || "User not found."}</div>;
  }

  return (
    <div>
        <header className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold font-headline">User Details</h1>
                <p className="text-sm text-muted-foreground">User ID: {user.uid}</p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 text-4xl">
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-semibold font-headline">{user.name}</h2>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize mt-1">{user.role}</Badge>
                         <div className="text-muted-foreground text-sm mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                             {user.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{user.phone}</span>
                                </div>
                             )}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Addresses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {addresses.length > 0 ? (
                            <div className="space-y-4">
                            {addresses.map(addr => (
                                <div key={addr.id} className="text-sm p-3 border rounded-md">
                                    <p className="font-semibold">{addr.name}</p>
                                    <p className="text-muted-foreground">{addr.homeFloor}, {addr.locality}</p>
                                    <p className="text-muted-foreground">{addr.city}, {addr.state} {addr.postalCode}</p>
                                    <p className="text-muted-foreground">{addr.country}</p>
                                    <p className="text-muted-foreground">Phone: {addr.phone}</p>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm text-center py-4">No saved addresses.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>This user has placed {orders.length} orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {orders.length > 0 ? (
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id} onClick={() => router.push(`/admin/orders/${order.userId}/${order.id}`)} className="cursor-pointer">
                                            <TableCell className="font-medium">#{order.id.substring(0, 7)}</TableCell>
                                            <TableCell>{format(order.createdAt.toDate(), "PPP")}</TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Canceled' ? 'destructive' : 'secondary'} className="capitalize">{order.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         ) : (
                            <p className="text-muted-foreground text-sm text-center py-8">This user has not placed any orders yet.</p>
                         )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
