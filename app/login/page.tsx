"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/profile");
  }

  return (
    <div className="container mx-auto max-w-md py-20">
      <h1 className="text-3xl font-bold mb-8">
        Login
      </h1>

      <form
        onSubmit={login}
        className="space-y-5"
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white rounded-lg p-3"
        >
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
  Don't have an account?{" "}
  <Link
    href="/register"
    className="font-semibold text-blue-600 hover:underline"
  >
    Create Account
  </Link>
</p>
    </div>
  );
}