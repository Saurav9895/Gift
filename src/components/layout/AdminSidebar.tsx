"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ListTree, PanelLeft, ShoppingBag, Gift, Users, ArrowLeftCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const adminNavLinks = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: ListTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
];

function NavContent() {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col gap-2">
            {adminNavLinks.map((link) => {
                const isActive = pathname.startsWith(link.href) && (link.href !== "/admin" || pathname === "/admin");
                return (
                <Link key={link.href} href={link.href}>
                    <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                    </Button>
                </Link>
                );
            })}
        </nav>
    )
}

function SidebarHeader() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <Gift className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl font-headline">Giftopia</span>
        </Link>
    )
}

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile Sidebar */}
            <div className="md:hidden m-4">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <PanelLeft className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-4 flex flex-col">
                        <div className="mb-8">
                            <SidebarHeader />
                        </div>
                        <NavContent />
                        <div className="mt-auto">
                            <Separator className="my-4"/>
                            <Link href="/">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <ArrowLeftCircle className="h-5 w-5" />
                                    <span>Back to Site</span>
                                </Button>
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card">
                <div className="p-4 border-b h-16 flex items-center">
                    <SidebarHeader />
                </div>
                <div className="flex-1 p-4">
                   <NavContent />
                </div>
                 <div className="p-4 border-t">
                    <Link href="/">
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <ArrowLeftCircle className="h-5 w-5" />
                            <span>Back to Site</span>
                        </Button>
                    </Link>
                </div>
            </aside>
        </>
    );
}