
"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-provider";
import { useOrder } from "@/lib/orders";
import { Loader2, CheckCircle, Package, Truck, HomeIcon, Bike } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusSteps = [
    { name: "Processing", status: "Processing", icon: Package },
    { name: "Shipped", status: "Shipped", icon: Truck },
    { name: "Out for Delivery", status: "Out for Delivery", icon: Bike },
    { name: "Delivered", status: "Delivered", icon: HomeIcon },
];

export default function OrderDetailPage() {
    const { id } = useParams();
    const orderId = Array.isArray(id) ? id[0] : id;
    const { user } = useAuth();
    const { order, loading, error } = useOrder(user?.uid, orderId);

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            </div>
        );
    }

    if (error) {
         return <div className="container mx-auto py-20 text-center text-destructive">{error}</div>;
    }

    if (!order) {
        return <div className="container mx-auto py-20 text-center">Order not found.</div>;
    }

    const { shippingAddress: address } = order;
    
    let currentStatusIndex = statusSteps.findIndex(step => step.status === order.status);
    if (order.status === 'Canceled') {
        currentStatusIndex = -1; // Or handle canceled state separately
    }


    return (
        <div className="bg-muted/20">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline">Track Your Order</CardTitle>
                            <CardDescription>See the current status of your delivery.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex justify-between items-start pt-4">
                                {statusSteps.map((step, index) => {
                                    const isActive = index <= currentStatusIndex;
                                    const isCompleted = index < currentStatusIndex;
                                    
                                    return (
                                        <div key={step.name} className="flex-1 flex flex-col items-center relative">
                                            {index > 0 && (
                                                <div className={cn(
                                                    "absolute top-[18px] right-1/2 w-full h-0.5",
                                                    isCompleted || isActive ? 'bg-primary' : 'bg-border'
                                                )}></div>
                                            )}
                                            <div className="relative z-10">
                                                <div className={cn(
                                                    "flex items-center justify-center w-10 h-10 rounded-full",
                                                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border-2"
                                                )}>
                                                    <step.icon className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <p className={cn(
                                                "text-xs mt-2 text-center font-semibold",
                                                !isActive && "text-muted-foreground font-normal"
                                            )}>{step.name}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Products Ordered</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[80px]">Image</TableHead>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="rounded-md object-cover" />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell>x{item.quantity}</TableCell>
                                                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                             <Card>
                                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between"><span>Order Date:</span> <span>{order.createdAt ? format(order.createdAt, "PPP") : 'N/A'}</span></div>
                                    <div className="flex justify-between items-center"><span>Status:</span> <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Canceled' ? 'destructive' : 'secondary'} className="capitalize">{order.status}</Badge></div>
                                    <div className="flex justify-between"><span>Payment:</span> <span className="uppercase">{order.paymentMethod}</span></div>
                                    <Separator />
                                    <div className="flex justify-between"><span>Subtotal:</span> <span>${order.subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>Delivery:</span> <span>${order.deliveryFee.toFixed(2)}</span></div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-base"><span>Total:</span> <span>${order.total.toFixed(2)}</span></div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <p className="font-semibold">{address.name}</p>
                                    <p className="text-muted-foreground">{address.homeFloor}, {address.locality}</p>
                                    <p className="text-muted-foreground">{address.city}, {address.state} {address.postalCode}</p>
                                    <p className="text-muted-foreground">{address.country}</p>
                                    <p className="text-muted-foreground">Phone: {address.phone}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
