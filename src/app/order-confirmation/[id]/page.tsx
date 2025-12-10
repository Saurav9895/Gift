
"use client";

import { useOrder } from "@/lib/orders";
import { useAuth } from "@/lib/auth-provider";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

export default function OrderConfirmationPage() {
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

    return (
        <div className="bg-muted/20">
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader className="text-center">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                        <CardTitle className="text-3xl font-headline">Thank you for your order!</CardTitle>
                        <CardDescription className="text-lg">
                            Your order has been placed successfully.
                        </CardDescription>
                        <p className="text-sm text-muted-foreground pt-2">Order ID: {order.id}</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-base">Shipping Address</h3>
                                <p>{address.name}</p>
                                <p>{address.homeFloor}, {address.locality}</p>
                                <p>{address.city}, {address.state} {address.postalCode}</p>
                                <p>{address.country}</p>
                                <p>Phone: {address.phone}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-base">Order Summary</h3>
                                <div className="flex justify-between"><span>Order Date:</span> <span>{order.createdAt ? format(order.createdAt, "PPP") : 'N/A'}</span></div>
                                <div className="flex justify-between"><span>Payment Method:</span> <span className="uppercase">{order.paymentMethod}</span></div>
                                <div className="flex justify-between"><span>Status:</span> <span>{order.status}</span></div>
                            </div>
                        </div>
                        
                        <Separator />

                        <div>
                            <h3 className="font-semibold text-base mb-4">Items Ordered</h3>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-start gap-4 text-sm">
                                        <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />
                        
                        <div className="space-y-2 text-sm">
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery Fee</span>
                                <span>${order.deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 pt-4">
                            <Button asChild>
                                <Link href="/">Continue Shopping</Link>
                            </Button>
                             <Button variant="outline" asChild>
                                <Link href="/profile/orders">View My Orders</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
