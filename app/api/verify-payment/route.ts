import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
      price,
    } = body;

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courseId ||
      !userId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Signature Verify
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update Order
    const { error: orderUpdateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        razorpay_payment_id,
      })
      .eq("id", orderId);

    if (orderUpdateError) {
      console.error(orderUpdateError);

      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    // Order Item Insert
    const { error: itemError } = await supabase
      .from("order_items")
      .insert({
        order_id: orderId,
        course_id: courseId,
        price,
      });

    if (itemError) {
      console.error(itemError);

      return NextResponse.json(
        { error: "Failed to save order item" },
        { status: 500 }
      );
    }

    // User Course Insert
    const { error: courseError } = await supabase
      .from("user_courses")
      .insert({
        user_id: userId,
        course_id: courseId,
      });

    if (courseError) {
      console.error(courseError);

      return NextResponse.json(
        { error: "Failed to unlock course" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}