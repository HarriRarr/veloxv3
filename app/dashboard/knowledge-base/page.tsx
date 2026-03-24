"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Mic, Save, RotateCcw, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<"business" | "voice">("business");
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Business State
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState("");

  // Writer Voice State
  const defaultVoice = {
    tone: "Conversational and authentic — like talking to a friend who happens to be an expert",
    writingStyle: "Short paragraphs, direct sentences. Use analogies. Break complex ideas into digestible bites.",
    personality: "Helpful, slightly opinionated, grounded in real experience. Not salesy.",
    examplePhrases: "Here's what actually worked for me...\nHonestly, most people overcomplicate this.\nThe thing nobody tells you is...",
    avoidPhrases: "Buy now!\nGame-changer\nRevolutionary\n10x your results",
    examplePosts: ""
  };

  const [voice, setVoice] = useState(defaultVoice);

  const [saveBusinessStatus, setSaveBusinessStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [saveVoiceStatus, setSaveVoiceStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [resetStatus, setResetStatus] = useState<"idle" | "resetting" | "reset">("idle");

  // Load from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);

      const { data, error } = await supabase
        .from("knowledge_base")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data && !error) {
        // Load Business Data
        setBusinessName(data.business_name || "");
        setBusinessDescription(data.business_description || "");
        setTargetAudience(data.target_audience || "");
        setKeyFeatures(data.key_features || "");
        setUniqueSellingPoints(data.unique_selling_points || "");

        // Load Voice Data
        setVoice({
          tone: data.tone || defaultVoice.tone,
          writingStyle: data.writing_style || defaultVoice.writingStyle,
          personality: data.personality || defaultVoice.personality,
          examplePhrases: data.example_phrases || defaultVoice.examplePhrases,
          avoidPhrases: data.avoid_phrases || defaultVoice.avoidPhrases,
          examplePosts: data.example_posts || defaultVoice.examplePosts,
        });
      }
      setIsLoading(false);
    };

    loadData();
  }, [supabase]);

  const handleSaveBusiness = async () => {
    if (!userId) return;
    setSaveBusinessStatus("saving");
    
    const { error } = await supabase
      .from("knowledge_base")
      .upsert({
        user_id: userId,
        business_name: businessName,
        business_description: businessDescription,
        target_audience: targetAudience,
        key_features: keyFeatures,
        unique_selling_points: uniqueSellingPoints,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (!error) {
      setSaveBusinessStatus("saved");
      setTimeout(() => setSaveBusinessStatus("idle"), 2000);
    } else {
      console.error("Failed to save business info:", error);
      setSaveBusinessStatus("idle");
    }
  };

  const handleSaveVoice = async () => {
    if (!userId) return;
    setSaveVoiceStatus("saving");
    
    const { error } = await supabase
      .from("knowledge_base")
      .upsert({
        user_id: userId,
        tone: voice.tone,
        writing_style: voice.writingStyle,
        personality: voice.personality,
        example_phrases: voice.examplePhrases,
        avoid_phrases: voice.avoidPhrases,
        example_posts: voice.examplePosts,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (!error) {
      setSaveVoiceStatus("saved");
      setTimeout(() => setSaveVoiceStatus("idle"), 2000);
    } else {
      console.error("Failed to save voice info:", error);
      setSaveVoiceStatus("idle");
    }
  };

  const handleResetDefaults = async () => {
    setResetStatus("resetting");
    setVoice(defaultVoice);
    
    if (userId) {
      await supabase
        .from("knowledge_base")
        .upsert({
          user_id: userId,
          tone: defaultVoice.tone,
          writing_style: defaultVoice.writingStyle,
          personality: defaultVoice.personality,
          example_phrases: defaultVoice.examplePhrases,
          avoid_phrases: defaultVoice.avoidPhrases,
          example_posts: defaultVoice.examplePosts,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
    }

    setResetStatus("reset");
    setTimeout(() => setResetStatus("idle"), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">
          Teach the AI about your business and writing style
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-card/50 p-1 rounded-lg border border-border w-fit">
        <button
          onClick={() => setActiveTab("business")}
          className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "business"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Business
        </button>
        <button
          onClick={() => setActiveTab("voice")}
          className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "voice"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mic className="w-4 h-4" />
          Writer Voice
        </button>
      </div>

      {/* Business Tab */}
      {activeTab === "business" && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Business / Product Name</label>
            <input
              type="text"
              placeholder="e.g., Subclimb"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Business Description</label>
            <textarea
              placeholder="What does your business do? What problem does it solve?"
              rows={3}
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Target Audience</label>
            <textarea
              placeholder="Who are you trying to reach? Be specific (e.g., solo founders building SaaS products)"
              rows={3}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Key Features / Value Props</label>
            <textarea
              placeholder="What are the main features or benefits? What makes your product valuable?"
              rows={3}
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Unique Selling Points</label>
            <textarea
              placeholder="What makes you different from competitors? Why should people choose you?"
              rows={3}
              value={uniqueSellingPoints}
              onChange={(e) => setUniqueSellingPoints(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="pt-4">
            <Button 
              className="flex items-center gap-2" 
              onClick={handleSaveBusiness}
              disabled={saveBusinessStatus !== "idle"}
            >
              {saveBusinessStatus === "idle" && <Save className="w-4 h-4" />}
              {saveBusinessStatus === "saving" && <Loader2 className="w-4 h-4 animate-spin" />}
              {saveBusinessStatus === "saved" && <Check className="w-4 h-4" />}
              {saveBusinessStatus === "idle" ? "Save Knowledge Base" : saveBusinessStatus === "saving" ? "Saving..." : "Saved!"}
            </Button>
          </div>
        </div>
      )}

      {/* Writer Voice Tab */}
      {activeTab === "voice" && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">
              Customize how the AI writes. These defaults are tuned for authentic Reddit engagement.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetDefaults} 
              disabled={resetStatus !== "idle"}
              className="flex items-center gap-2"
            >
              {resetStatus === "idle" && <RotateCcw className="w-3 h-3" />}
              {resetStatus === "resetting" && <Loader2 className="w-3 h-3 animate-spin" />}
              {resetStatus === "reset" && <Check className="w-3 h-3" />}
              {resetStatus === "idle" ? "Reset Defaults" : resetStatus === "resetting" ? "Resetting..." : "Reset!"}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tone</label>
            <textarea
              rows={2}
              value={voice.tone}
              onChange={(e) => setVoice({ ...voice, tone: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Writing Style</label>
            <textarea
              rows={2}
              value={voice.writingStyle}
              onChange={(e) => setVoice({ ...voice, writingStyle: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Personality</label>
            <textarea
              rows={2}
              value={voice.personality}
              onChange={(e) => setVoice({ ...voice, personality: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Example Phrases (one per line)</label>
            <textarea
              rows={4}
              value={voice.examplePhrases}
              onChange={(e) => setVoice({ ...voice, examplePhrases: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Avoid These Phrases (one per line)</label>
            <textarea
              rows={4}
              value={voice.avoidPhrases}
              onChange={(e) => setVoice({ ...voice, avoidPhrases: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Example Reddit Posts (Viral posts to emulate)</label>
            <textarea
              placeholder="Paste examples of viral Reddit posts here that you want the AI to model its writing off of. Separate multiple posts clearly."
              rows={6}
              value={voice.examplePosts}
              onChange={(e) => setVoice({ ...voice, examplePosts: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none font-mono text-xs"
            />
          </div>

          <div className="pt-4">
            <Button 
              className="flex items-center gap-2"
              onClick={handleSaveVoice}
              disabled={saveVoiceStatus !== "idle"}
            >
              {saveVoiceStatus === "idle" && <Save className="w-4 h-4" />}
              {saveVoiceStatus === "saving" && <Loader2 className="w-4 h-4 animate-spin" />}
              {saveVoiceStatus === "saved" && <Check className="w-4 h-4" />}
              {saveVoiceStatus === "idle" ? "Save Writer Voice" : saveVoiceStatus === "saving" ? "Saving..." : "Saved!"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
