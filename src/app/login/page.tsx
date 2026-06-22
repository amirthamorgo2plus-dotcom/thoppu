"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handle = async () => {
    setError(""); setMessage(""); setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account, then log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/farms");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Thoppu" width={72} height={72} className="mb-3" />
          <h1 className="text-2xl font-bold text-green-900">Thoppu</h1>
          <p className="text-gray-500 text-sm mt-1">Your farm, in your palm</p>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === m ? "bg-white text-green-800 shadow-sm" : "text-gray-500"}`}>
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Your Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya Devi"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button onClick={handle} disabled={loading}
            className="w-full bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition-colors">
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing you agree to Thoppu&apos;s Terms of Service
        </p>
      </div>
    </div>
  );
}
