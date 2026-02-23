'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (password.trim()) {
        onLogin();
      } else {
        setError('Password is required.');
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Branding */}
        <div className="text-center space-y-2">
          <img src="/oa-logo.png" alt="Open Agent" className="mx-auto h-24 w-auto" />
          <h1 className="text-2xl font-bold tracking-tight">Open Agent</h1>
          <p className="text-muted-foreground text-sm">
            SEC-Compliant Equity Management Platform
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value="oa_admin@openagent.io"
                  readOnly
                  className="bg-muted/50 text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={error ? 'border-destructive' : ''}
                  autoFocus
                />
                {error && (
                  <p className="text-destructive text-sm flex items-center gap-1.5">
                    <Lock className="h-3 w-3" />
                    {error}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading || !password}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Regulated by SEC · FINRA · DTCC compliant · All activity logged
        </p>
      </div>
    </div>
  );
}
