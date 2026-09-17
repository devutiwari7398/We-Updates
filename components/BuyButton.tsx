"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type BuyButtonProps = {
  courseId: string;
};

export default function BuyButton({ courseId }: BuyButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function openForm() {
    setShowForm(true);
  }

  async function handlePayment() {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!phone.trim() || phone.length !== 10) {
      alert("Please enter a valid 10 digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      console.log("Creating guest order...");

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          customerName: name.trim(),
          customerEmail: email.trim().toLowerCase(),
          customerPhone: phone.trim(),
        }),
      });

      const result = await response.json();

      console.log("Create order response:", result);

      if (!response.ok) {
        alert(result.error || "Failed to create order");
        return;
      }

      const RazorpayConstructor = window.Razorpay;

      if (!RazorpayConstructor) {
        alert("Razorpay SDK not loaded.");
        return;
      }

      const options = {
        key: result.key,
        amount: result.amount,
        currency: result.currency,
        name: "WeUpdates",
        description: result.course.title,
        order_id: result.razorpayOrderId,

        handler: async function (razorpayResponse: any) {
          try {
            console.log("Payment successful:", razorpayResponse);

            const verifyResponse = await fetch(
              "/api/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: result.orderId,

                  razorpay_order_id:
                    razorpayResponse.razorpay_order_id,

                  razorpay_payment_id:
                    razorpayResponse.razorpay_payment_id,

                  razorpay_signature:
                    razorpayResponse.razorpay_signature,
                }),
              }
            );

            const verifyResult = await verifyResponse.json();

            console.log(
              "Payment verification response:",
              verifyResult
            );

            if (!verifyResponse.ok) {
              alert(
                verifyResult.error ||
                  "Payment verification failed"
              );
              return;
            }

            // Payment verified successfully.
            // Next step will create the user's account.
            router.push(
              `/payment/success?orderId=${result.orderId}`
            );
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert("Payment verification failed.");
          }
        },

        prefill: {
          name: name,
          email: email,
          contact: phone,
        },

        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject =
        new RazorpayConstructor(options);

      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={openForm}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Loading..." : "Buy Now"}
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Complete Payment Details
            </h2>

            <p className="mb-5 text-sm text-gray-600">
              Enter your details to continue with payment.
            </p>

            <div className="space-y-4">
              {/* Name */}
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
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                />
              </div>

              {/* Phone */}
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                />
              </div>

              {/* Continue Payment */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading
                  ? "Processing..."
                  : "Continue to Payment"}
              </button>

              {/* Cancel */}
              <button
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}