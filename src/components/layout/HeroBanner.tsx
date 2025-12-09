"use client"

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HeroBanner() {
    return (
        <div className="relative bg-cover bg-center py-24 md:py-40" style={{ backgroundImage: "url('https://picsum.photos/seed/1/1200/400')" }}>
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="container mx-auto px-4 relative z-10 text-center text-white">
                <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
                    Find the Perfect Gift
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    Search our curated collection to find something special for every occasion.
                </p>
                <div className="max-w-xl mx-auto">
                    <form className="flex gap-2 bg-white p-2 rounded-lg shadow-lg">
                        <Input 
                            type="text" 
                            placeholder="Search for gifts..." 
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        />
                        <Button type="submit" size="lg">
                            <Search className="mr-2 h-5 w-5" />
                            Search
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
