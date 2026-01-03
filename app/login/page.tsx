'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card, CardContent, CardHeader } from "@/components/Card";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf7ef] p-4">
      <Card className="w-full max-w-md shadow-xl border-[#d6c4a5]">
        <CardHeader className="text-center border-b-[#d6c4a5]/30">
          <div className="w-16 h-16 bg-[#C9A24D] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-[#1c1208] font-bold text-2xl">SM</span>
          </div>
          <h1 className="text-2xl font-display text-[#2c1a0a]">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to manage your website</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 text-center">
                {error}
              </div>
            )}
            
            <Input
              label="Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
            
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A24D] hover:bg-[#b89342] text-[#1c1208] font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
