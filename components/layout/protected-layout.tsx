'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthUser, logout } from '@/lib/auth';
import { User } from '@/lib/mock-db';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedLayout({ children, allowedRoles }: ProtectedLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = getAuthUser();

    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [router, allowedRoles]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg">DIMMS</h1>
            {user && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                  {user?.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-sm">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
