"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);


    console.log("Supabase Client:", supabase);
console.log("Supabase Auth:", supabase?.auth);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Registration successful! Please verify your email before logging in."
    );

    router.push("/courses");
  }

  return (
    <div className="container mx-auto max-w-md py-20">
      <h1 className="text-3xl font-bold mb-8">
        Create Account
      </h1>

      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg p-3"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
  Already have an account?{" "}
  <Link
    href="/login"
    className="font-semibold text-blue-600 hover:underline"
  >
    Log In
  </Link>
</p>
    </div>
  );
}