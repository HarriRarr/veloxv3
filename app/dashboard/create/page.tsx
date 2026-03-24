"use client";

import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, CheckCircle2, Sparkles, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const [topic, setTopic] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [context, setContext] = useState("");
  const [style, setStyle] = useState("informational");
  const [generatedPost, setGeneratedPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleGenerate = async () => {
    if (!topic || !subreddit) return;

    setIsGenerating(true);
    setGeneratedPost("");
    setSaved(false);

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      });

      // Fetch knowledge base from Supabase
      let businessData = "";
      let voiceData = "";
      let examplePosts = "";

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from("knowledge_base")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (data && !error) {
          businessData = `
            Business Name: ${data.business_name || ""}
            Business Description: ${data.business_description || ""}
            Target Audience: ${data.target_audience || ""}
            Key Features: ${data.key_features || ""}
            Unique Selling Points: ${data.unique_selling_points || ""}
          `;
          
          voiceData = `
            Tone: ${data.tone || ""}
            Writing Style: ${data.writing_style || ""}
            Personality: ${data.personality || ""}
            Example Phrases to Use: ${data.example_phrases || ""}
            Phrases to Avoid: ${data.avoid_phrases || ""}
          `;
          
          examplePosts = data.example_posts || "";
        }
      }

      const prompt = `
        You are an expert Reddit marketer. Write a highly engaging, native-feeling Reddit post for the subreddit ${subreddit}.
        
        Topic/Idea: ${topic}
        Additional Context: ${context}
        Style: ${style}
        
        Use the following knowledge base about my business to subtly weave in value or context where appropriate.
        
        Business Details:
        ${businessData || "No business details provided."}
        
        Writer Voice & Personality:
        ${voiceData || "No specific voice provided. Be helpful and authentic."}
        
        ${examplePosts ? `Here are some example viral posts to emulate the structure and vibe of:\n${examplePosts}` : ""}
        
        Format the output with a catchy title on the first line (prefix with "Title: "), followed by an empty line, and then the body of the post. Use markdown formatting.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text || "Failed to generate post.";
      setGeneratedPost(text);

    } catch (error: any) {
      console.error("Error generating post:", error);
      setGeneratedPost(
        `An error occurred while generating the post: ${error.message || "Unknown error"}. Please try again.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePost = async () => {
    if (!generatedPost || generatedPost.includes("An error occurred")) return;
    
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to save posts.");
        setIsSaving(false);
        return;
      }

      let title = "Generated Post";
      let content = generatedPost;
      const lines = generatedPost.split("\n");
      if (lines[0].startsWith("Title: ")) {
        title = lines[0].replace("Title: ", "").trim();
        content = lines.slice(1).join("\n").trim();
      }

      const { error: insertError } = await supabase.from("posts").insert({
        user_id: user.id,
        topic: topic,
        subreddit: subreddit,
        title: title,
        content: content,
      });

      if (!insertError) {
        setSaved(true);
        router.refresh();
      } else {
        console.error("Failed to save post:", insertError);
        alert(`Failed to save post: ${insertError.message}`);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard API failed, using fallback", err);
      const textArea = document.createElement("textarea");
      textArea.value = generatedPost;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed', fallbackErr);
        alert("Failed to copy to clipboard. Please select the text and copy manually.");
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left Column - Controls */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Post Creator
          </h1>
          <p className="text-muted-foreground text-sm">
            Generate viral Reddit posts tailored to your brand.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Control Panel</h2>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Target Subreddit</label>
            <input
              type="text"
              placeholder="e.g. r/SaaS"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Topic / Idea</label>
            <textarea
              placeholder="What do you want to talk about? e.g. How I saved 10 hours a week automating my marketing..."
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Additional Context</label>
            <textarea
              placeholder="Any specific details, links, or points you want to make sure are included?"
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors appearance-none"
            >
              <option value="informational">Informational / Educational</option>
              <option value="storytelling">Storytelling / Founder Journey</option>
              <option value="salesy">Salesy / Promotional</option>
              <option value="controversial">Controversial / Hot Take</option>
            </select>
          </div>

          <Button
            className="w-full font-semibold"
            onClick={handleGenerate}
            disabled={isGenerating || !topic || !subreddit}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Post"
            )}
          </Button>
        </div>
      </div>

      {/* Right Column - Editor/Preview */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <div className="bg-card border border-border rounded-xl flex-1 flex flex-col overflow-hidden min-h-[600px]">
          <div className="flex items-center justify-between border-b border-border p-4 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                Post Editor
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSavePost}
                disabled={!generatedPost || isSaving || saved || generatedPost.includes("An error occurred")}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : saved ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saved ? "Saved!" : "Save Post"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!generatedPost || generatedPost.includes("An error occurred")}
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-auto bg-background/50">
            {generatedPost ? (
              <div className="prose prose-invert max-w-none">
                {/* Simple markdown rendering for preview */}
                {generatedPost.split("\n").map((line, i) => {
                  if (line.startsWith("Title: ")) {
                    return (
                      <h1
                        key={i}
                        className="text-2xl font-bold mb-6 text-foreground"
                      >
                        {line.replace("Title: ", "")}
                      </h1>
                    );
                  }
                  if (line.trim() === "") return <br key={i} />;
                  return (
                    <p
                      key={i}
                      className="mb-4 text-muted-foreground leading-relaxed"
                    >
                      {line}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p>
                  Fill out the controls and click generate to see your post
                  here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
