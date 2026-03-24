"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Mail, Briefcase, Save } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [founderType, setFounderType] = useState("solopreneur");

  const handleSave = () => {
    // In a real app, this would save to Supabase
    alert("Profile saved!");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and account settings.
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-8">
        <div className="flex items-center gap-6 border-b border-border pb-8">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary text-4xl font-bold">
            {name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Type of Founder
            </label>
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
        </div>
      </div>
    </div>
  );
}
