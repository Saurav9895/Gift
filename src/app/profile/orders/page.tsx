
"use client";

import { useOrders } from "@/lib/orders";
import { useAuth } from "@/lib/auth-provider";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Order } from "@/types";


export default function MyOrdersPage() {
  const { user } = useAuth();
  const { orders, loading, error } = useOrders(user?.uid);

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


  return (
    <div className="container mx-auto px-4 py-12">
        <header className="mb-8">
            <h1 className="text-3xl font-bold font-headline">My Orders</h1>
            <p className="text-muted-foreground">View your complete order history.</p>
        </header>

        <Card>
            <CardContent className="p-0">
                {loading && (
                    <div className="flex h-64 w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    </div>
                )}
                {error && <div className="p-8 text-center text-destructive">{error}</div>}

                {!loading && !error && orders.length === 0 && (
                    <div className="p-8 text-center">
                        <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                         <Button asChild>
                            <Link href="/">Start Shopping</Link>
                        </Button>
                    </div>
                )}
                
                {!loading && !error && orders.length > 0 && (
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
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium text-primary hover:underline">
                                        <Link href={`/orders/${order.id}`}>
                                           #{order.id.substring(0, 7)}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(order.createdAt.toDate(), "PPP")}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={getBadgeVariant(order.status)}
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    </div>
  )
}
