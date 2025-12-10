
"use client";

import { useAdminOrders } from "@/lib/orders";
import { useUsers } from "@/lib/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { orders, loading: ordersLoading, error: ordersError } = useAdminOrders();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const router = useRouter();

  const getUserName = (userId: string) => {
    const user = users.find(u => u.uid === userId);
    return user?.name || "Unknown User";
  };
  
  const isLoading = ordersLoading || usersLoading;
  const error = ordersError || usersError;

  const handleRowClick = (order: any) => {
    router.push(`/admin/orders/${order.userId}/${order.id}`);
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Orders</h1>
        <p className="text-muted-foreground">View and manage all customer orders.</p>
      </header>
      
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && <div className="text-center text-destructive">{error}</div>}

      {!isLoading && !error && (
        <div className="bg-card rounded-lg border">
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id} onClick={() => handleRowClick(order)} className="cursor-pointer">
                        <TableCell className="font-medium">#{order.id.substring(0, 7)}</TableCell>
                        <TableCell>{getUserName(order.userId)}</TableCell>
                        <TableCell>{format(order.createdAt.toDate(), "PPP")}</TableCell>
                        <TableCell>
                            <Badge 
                                variant={
                                    order.status === 'Delivered' ? 'default' :
                                    order.status === 'Canceled' ? 'destructive' :
                                    'secondary'
                                }
                                className="capitalize"
                            >
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
      )}
    </div>
  );
}
