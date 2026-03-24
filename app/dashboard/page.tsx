"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MessageSquare, TrendingUp, Eye, Copy, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data && !error) {
        setPosts(data);

        // Calculate chart data (posts per day for the last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toLocaleDateString("en-US", { weekday: "short" });
        }).reverse();

        const postCounts = last7Days.map((day) => {
          const count = data.filter((post) => {
            const postDate = new Date(post.created_at);
            return postDate.toLocaleDateString("en-US", { weekday: "short" }) === day;
          }).length;
          return { name: day, posts: count };
        });

        setChartData(postCounts);
      }
      setIsLoading(false);
    };

    fetchDashboardData();
  }, [supabase]);

  const handleCopy = async (content: string, id: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Clipboard API failed, using fallback", err);
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed', fallbackErr);
        alert("Failed to copy to clipboard. Please select the text and copy manually.");
      }
      document.body.removeChild(textArea);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back. Here&apos;s how your Reddit marketing is performing.
          </p>
        </div>
        <Button asChild>
          <a href="/dashboard/create">Create New Post</a>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Posts Generated
            </h3>
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">{posts.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Estimated Views
            </h3>
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">{posts.length * 150}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on average subreddit reach
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Avg. Upvotes
            </h3>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">~12</div>
          <p className="text-xs text-muted-foreground mt-1">
            Estimated average
          </p>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-6">
          Post Quantity (Last 7 Days)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#222"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "#1a1a1a" }}
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #222",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="posts" fill="#FF4500" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Generated Posts</h3>
        {posts.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            You haven&apos;t generated any posts yet. Click &quot;Create New Post&quot; to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {post.subreddit}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground">{post.title || post.topic}</h4>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 flex items-center gap-2"
                  onClick={() => handleCopy(post.content, post.id)}
                >
                  {copiedId === post.id ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copiedId === post.id ? "Copied!" : "Copy Post"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
