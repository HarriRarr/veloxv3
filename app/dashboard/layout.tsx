"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, PenTool, BookOpen, User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-bold text-white">
            V
          </div>
          <span className="font-bold text-xl tracking-tight">Velox</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/create"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors"
          >
            <PenTool className="w-4 h-4" />
            AI Post Creator
          </Link>
          <Link
            href="/dashboard/knowledge-base"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Knowledge Base
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          {userEmail && (
            <div className="px-3 py-2 text-xs text-muted-foreground truncate">
              {userEmail}
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-muted text-sm font-medium text-muted-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
