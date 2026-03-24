"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [founderType, setFounderType] = useState("solopreneur");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          founder_type: founderType,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session === null) {
      // Supabase requires email confirmation by default
      setSuccessMsg("Success! Please check your email to confirm your account before logging in.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl mt-12 mb-12">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-bold text-white text-2xl mb-4">V</div>
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground text-sm mt-1">Start dominating Reddit today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 text-sm text-green-600 bg-green-500/10 border border-green-500/20 rounded-md">
              {successMsg}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Doe" 
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com" 
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••" 
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type of Founder</label>
            <select 
              value={founderType}
              onChange={(e) => setFounderType(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors appearance-none"
            >
              <option value="solopreneur">Solopreneur</option>
              <option value="agency_owner">Agency Owner</option>
              <option value="student">Student</option>
              <option value="brand">Brand</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Button className="w-full py-6 mt-4" type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
