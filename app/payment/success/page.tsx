"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleCreateAccount() {
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!phone.trim() || phone.length !== 10) {
      alert("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!orderId) {
      alert("Order information is missing.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/complete-purchase",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password,
          }),
        }
      );

      const result = await response.json();

      console.log(
        "Complete purchase response:",
        result
      );

      if (!response.ok) {
        alert(
          result.error ||
            "Failed to create your account."
        );
        return;
      }

      /*
       * Account successfully created.
       * Now automatically login the user.
       */
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password,
        });

      if (loginError) {
        console.error(
          "AUTO LOGIN ERROR:",
          loginError
        );

        alert(
          "Account created, but automatic login failed. Please login manually."
        );

        window.location.href = "/login";
        return;
      }

      /*
       * Automatic login successful.
       * Send user directly to My Courses.
       */
      alert(
        "Account created successfully! Your course has been unlocked."
      );

      window.location.href =
        "/profile/my-courses";
    } catch (error) {
      console.error(
        "Complete purchase error:",
        error
      );

      alert(
        "Something went wrong while creating your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-lg">

        {/* Payment Success */}
        <div className="mb-6 rounded-2xl bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl">
              ✓
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </h1>

          <p className="mt-2 text-gray-600">
            Your payment has been received successfully.
          </p>
        </div>

        {/* Account Form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Complete Your Account
          </h2>

          <p className="mt-2 mb-6 text-sm text-gray-600">
            Create your account to access your purchased course.
          </p>

          <div className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Mobile Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  )
                }
                placeholder="10 digit mobile number"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Create Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Minimum 6 characters"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            {/* Create Account */}
            <button
              onClick={handleCreateAccount}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : "Create Account & Access Course"}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            Your payment is already completed. Create your account
            to access your course.
          </p>
        </div>
      </div>
    </main>
  );
}

/*
 * Suspense is required because PaymentSuccessContent
 * uses useSearchParams().
 *
 * This prevents the Vercel production build error:
 * "useSearchParams() should be wrapped in a suspense boundary"
 */
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}