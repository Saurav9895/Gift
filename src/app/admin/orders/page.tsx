
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for orders
const orders = [
  {
    id: "ORD001",
    customer: "Liam Johnson",
    date: "2023-11-23",
    total: 150.00,
    status: "Delivered",
  },
  {
    id: "ORD002",
    customer: "Olivia Smith",
    date: "2023-11-24",
    total: 45.50,
    status: "Shipped",
  },
  {
    id: "ORD003",
    customer: "Noah Williams",
    date: "2023-11-25",
    total: 210.75,
    status: "Processing",
  },
    {
    id: "ORD004",
    customer: "Emma Brown",
    date: "2023-11-26",
    total: 89.99,
    status: "Delivered",
  },
  {
    id: "ORD005",
    customer: "Ava Jones",
    date: "2023-11-27",
    total: 5.00,
    status: "Canceled",
  },
];

export default function OrdersPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders.</p>
      </header>
      
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
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
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
    </div>
  );
}
