"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Will I get banned from Reddit?",
      answer: "We take account safety seriously. Velox provides AI-driven tone checks and strict posting limits to ensure you behave like a helpful community member, not a spammer. However, you are responsible for the final content you post."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, absolutely. You can cancel your subscription with one click from your dashboard settings. You'll retain access until the end of your billing period."
    },
    {
      question: "When does billing start?",
      answer: "Billing starts when you subscribe to the Pro plan. You can cancel anytime from your dashboard settings."
    },
    {
      question: "How does the AI generate posts?",
      answer: "We analyze the top-performing posts in your target subreddits to understand what content resonates. Then, we combine your brand's value proposition with those patterns to create authentic, engaging posts."
    }
  ];

  return (
    <main className="flex-1 flex flex-col items-center">
      {/* Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Velox Logo" className="w-8 h-8 rounded-md" />
          <span className="font-bold text-xl tracking-tight">Velox</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Button asChild className="rounded-full px-6">
            <Link href="/signup">Get Velox</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium mb-8 text-muted-foreground">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          Access Reddit&apos;s 1 Billion Monthly Users
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
          Turn Reddit into your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
            #1 Source of Revenue
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Generate viral posts, monitor conversations, and grow your business
          organically—without the fear of getting banned.
        </p>

        <div className="flex flex-col sm:flex-row w-full max-w-md gap-3">
          <input
            type="url"
            placeholder="Enter your website link..."
            className="flex-1 rounded-md border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
          />
          <Button size="lg" className="rounded-md px-8 font-semibold" asChild>
            <Link href="/signup">Start Growing</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Reddit has over 1 Billion monthly active users. Are you ignoring them?
        </p>
      </section>

      {/* Comparison Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* The Old Way */}
          <div className="rounded-2xl border border-border bg-card/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">😫</span>
              <h3 className="text-xl font-semibold text-red-400">
                The Old Way
              </h3>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-muted-foreground">
                <XCircle className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                <span>4.5 hrs finding subreddits</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <XCircle className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                <span>2.5 hrs building posts that flop</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <XCircle className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                <span>5.0 hrs planning strategy</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <XCircle className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                <span>∞ hrs getting suspended</span>
              </li>
            </ul>
            <div className="pt-6 border-t border-border">
              <p className="font-medium">
                Total: <span className="text-red-400">10+ hours wasted.</span>
              </p>
            </div>
          </div>

          {/* The Velox Way */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3 mb-6 relative">
              <span className="text-2xl">🚀</span>
              <h3 className="text-xl font-semibold text-primary">
                The Velox Way
              </h3>
            </div>
            <ul className="space-y-4 mb-8 relative">
              <li className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>WE find the perfect communities</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Auto-generate viral posts</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Ban-Safe posting limits</span>
              </li>
              <li className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Keyword scanning across ALL of Reddit</span>
              </li>
            </ul>
            <div className="pt-6 border-t border-border/50 relative">
              <p className="font-medium">
                Total: <span className="text-primary">10 minutes/week.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-6xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Everything you need to <br />
              <span className="text-primary">dominate Reddit.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Powerful tools designed to turn casual scrollers into paying
              customers.
            </p>

            <div className="space-y-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 text-primary">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Viral Post Creator
                  </h3>
                  <p className="text-muted-foreground">
                    Stop guessing. Our AI writes posts that Redditors actually
                    upvote, tailored to each subreddit&apos;s culture.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 text-primary">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Subreddit Scout
                  </h3>
                  <p className="text-muted-foreground">
                    Find hidden gem communities where your exact customers hang
                    out, waiting for your solution.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 text-primary">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Smart Lead Monitor
                  </h3>
                  <p className="text-muted-foreground">
                    Never miss a buying signal. Monitor keywords and instantly
                    draft contextual replies to slide into high-intent
                    conversations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full"></div>
            <div className="relative rounded-xl border border-border bg-card p-2 shadow-2xl">
              <div className="rounded-lg border border-border/50 bg-background p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-xs font-medium text-muted-foreground">
                    AI Post Creator
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-muted rounded"></div>
                  <div className="h-24 w-full bg-muted/50 rounded-md border border-border/50 p-4">
                    <div className="h-3 w-full bg-muted rounded mb-2"></div>
                    <div className="h-3 w-5/6 bg-muted rounded mb-2"></div>
                    <div className="h-3 w-4/6 bg-muted rounded"></div>
                  </div>
                  <div className="flex justify-end">
                    <div className="h-8 w-24 bg-primary rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full max-w-3xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-16">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-xl overflow-hidden bg-card/30"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-card/50 transition-colors"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border mt-24 py-12 text-center text-sm text-muted-foreground">
        <p>© 2026 Velox. All rights reserved.</p>
      </footer>
    </main>
  );
}
