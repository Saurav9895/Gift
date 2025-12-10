
"use client";

import { useAuth } from "@/lib/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">My Profile</h1>
        <p className="text-muted-foreground">View and manage your account details.</p>
      </header>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl">
                {getInitials(userProfile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
              <CardDescription>{userProfile.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Future profile editing form can go here */}
          <p className="text-sm text-muted-foreground">
            More profile management features coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
