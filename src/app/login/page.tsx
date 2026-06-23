"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendLink = async () => {
    if (!email) return;
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/farms` },
    });
    if (error) setError(error.message);
    else setSent(true);
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

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Check your inbox</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              We sent a magic link to <span className="font-medium text-green-700">{email}</span>.<br />
              Click it to sign in — no password needed.
            </p>
            <button onClick={() => { setSent(false); setEmail(""); }}
              className="mt-6 text-sm text-green-700 hover:underline">
              Use a different email
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Your email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendLink()}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button onClick={sendLink} disabled={loading || !email}
              className="w-full bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition-colors">
              {loading ? "Sending..." : "Send Magic Link"}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              New or returning — one link signs you in or creates your account.
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing you agree to Thoppu&apos;s Terms of Service
        </p>
      </div>
    </div>
  );
}
