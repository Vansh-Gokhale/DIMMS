'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { login } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = login(email, password);
      if (user) {
        // Redirect based on role
        switch (user.role) {
          case 'admin':
            router.push('/admin');
            break;
          case 'student':
            router.push('/student');
            break;
          case 'mentor':
            router.push('/mentor');
            break;
          case 'faculty':
            router.push('/faculty');
            break;
          default:
            router.push('/');
        }
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">DIMMS</h1>
          <p className="text-muted-foreground">
            Digital Internship & Mentorship Management System
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t space-y-3">
              <p className="text-xs text-muted-foreground text-center font-medium">
                Demo Credentials
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-semibold">Student</p>
                  <p className="text-muted-foreground">student@example.com</p>
                  <p className="text-muted-foreground">student123</p>
                </div>
                <div>
                  <p className="font-semibold">Mentor</p>
                  <p className="text-muted-foreground">mentor@example.com</p>
                  <p className="text-muted-foreground">mentor123</p>
                </div>
                <div>
                  <p className="font-semibold">Faculty</p>
                  <p className="text-muted-foreground">faculty@university.edu</p>
                  <p className="text-muted-foreground">faculty123</p>
                </div>
                <div>
                  <p className="font-semibold">Admin</p>
                  <p className="text-muted-foreground">admin@dimms.com</p>
                  <p className="text-muted-foreground">admin123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          DIMMS © 2026 - All Rights Reserved
        </p>
      </div>
    </div>
  );
}
