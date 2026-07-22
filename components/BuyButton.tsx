"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  async function handleBuyNow() {
    console.log("BUY BUTTON CLICKED");
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      console.log("Calling API...");

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          userId: user.id,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        alert(result.error || "Failed to create order");
        return;
      }

            const options = {
        key: result.key,
        amount: result.amount,
        currency: result.currency,
        name: "WeUpdates",
        description: result.course.title,
        order_id: result.razorpayOrderId,

        handler: async function (response: any) {
  try {
    const verifyResponse = await fetch("/api/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: result.orderId,
        courseId: courseId,
        userId: user.id,
        price: result.course.price,

        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });

    const verifyResult = await verifyResponse.json();

    if (!verifyResponse.ok) {
      alert(verifyResult.error || "Payment verification failed");
      return;
    }

    router.push("/profile/my-courses");

  } catch (error) {
    console.error(error);
    alert("Verification failed.");
  }
},

        prefill: {
          email: user.email ?? "",
        },

        theme: {
          color: "#2563eb",
        },
      };

      const RazorpayConstructor = (window as any).Razorpay;

      if (!RazorpayConstructor) {
        alert("Razorpay SDK not loaded.");
        return;
      }

      const paymentObject = new RazorpayConstructor(options);

      paymentObject.open();
      
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuyNow}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? "Loading..." : "Buy Now"}
    </button>
  );
}