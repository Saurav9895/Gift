
"use client";

import { useParams, useRouter } from "next/navigation";
import { useOrder, updateOrderStatus } from "@/lib/orders";
import { useUsers } from "@/lib/users";
import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types";
import { cn } from "@/lib/utils";

export default function OrderDetailPage() {
  const { userId, orderId } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const { order, loading: orderLoading, error: orderError } = useOrder(
    Array.isArray(userId) ? userId[0] : userId,
    Array.isArray(orderId) ? orderId[0] : orderId
  );
  
  const { users, loading: usersLoading } = useUsers();
  const [customer, setCustomer] = useState<any>(null);
  const [status, setStatus] = useState<Order['status'] | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (order && users.length > 0) {
      const foundCustomer = users.find(u => u.uid === order.userId);
      setCustomer(foundCustomer);
    }
    if(order) {
        setStatus(order.status);
    }
  }, [order, users]);

  const handleStatusUpdate = async () => {
    if(!order || !status) return;
    setIsUpdating(true);
    try {
        await updateOrderStatus(order.userId, order.id, status as Order['status']);
        toast({ title: "Status Updated", description: "Order status has been successfully updated."});
    } catch(err) {
        toast({ variant: 'destructive', title: "Update Failed", description: "Could not update order status."});
    } finally {
        setIsUpdating(false);
    }
  };

  const isLoading = orderLoading || usersLoading;

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (orderError || !order) {
    return <div className="text-center py-10">{orderError || "Order not found."}</div>;
  }

  const getBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'default';
      case 'Canceled':
        return 'destructive';
      case 'Shipped':
      case 'Out for Delivery':
        return 'secondary';
      default:
        return 'outline';
    }
  };


  const { shippingAddress: address } = order;

  return (
    <div>
        <header className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold font-headline">Order Details</h1>
                <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
            </div>
             <Button variant="outline" className="ml-auto" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
            </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader><CardTitle>Products</CardTitle></CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="rounded-md object-cover" />
                                        </TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
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
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Order Placed</span>
                            <span>{order.createdAt ? format(order.createdAt, "PPP") : 'N/A'}</span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Status</span>
                             <Badge variant={getBadgeVariant(order.status)} className="capitalize">{order.status}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Delivery</span>
                            <span>${order.deliveryFee.toFixed(2)}</span>
                        </div>
                         <Separator />
                         <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                             <Select value={status} onValueChange={(value) => setStatus(value as Order['status'])}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Update status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                    <SelectItem value="Canceled">Canceled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="w-full" onClick={handleStatusUpdate} disabled={isUpdating}>
                                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Status
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle>Customer & Shipping</CardTitle></CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        {customer && (
                            <div>
                                <p className="font-semibold">{customer.name}</p>
                                <p className="text-muted-foreground">{customer.email}</p>
                            </div>
                        )}
                        <Separator />
                        <div>
                             <p className="font-semibold">{address.name}</p>
                             <p className="text-muted-foreground">{address.homeFloor}, {address.locality}</p>
                             <p className="text-muted-foreground">{address.city}, {address.state} {address.postalCode}</p>
                             <p className="text-muted-foreground">{address.country}</p>
                             <p className="text-muted-foreground">Phone: {address.phone}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
