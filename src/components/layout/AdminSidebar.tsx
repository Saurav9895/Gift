"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PackagePlus, ListTree, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const adminNavLinks = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/add-product", label: "Add Product", icon: PackagePlus },
  { href: "/admin/add-category", label: "Add Categories", icon: ListTree },
];

function NavContent() {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col gap-2">
            {adminNavLinks.map((link) => {
                const isActive = pathname === link.href;
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
                    <SheetContent side="left" className="w-64 p-4">
                         <h2 className="text-lg font-headline font-semibold mb-4">Admin Menu</h2>
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card">
                <div className="p-4">
                    <h2 className="text-lg font-headline font-semibold">Admin Menu</h2>
                </div>
                <div className="flex-1 p-4">
                   <NavContent />
                </div>
            </aside>
        </>
    );
}
