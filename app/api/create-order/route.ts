import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      courseId,
      customerName,
      customerEmail,
      customerPhone,
    } = body;

    // Guest payment ke liye userId ki zarurat nahi hai.
    if (
      !courseId ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter your name, email and mobile number.",
        },
        { status: 400 }
      );
    }

    // Course database se fetch karo
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Price hamesha database se lena hai.
    const amount = Number(course.price);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid course price" },
        { status: 400 }
      );
    }

    console.log("Creating Razorpay order for:", {
      courseId,
      amount,
      customerEmail,
    });

    // Razorpay order create karo
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `ord_${Date.now()}`,
    });

    console.log(
      "RAZORPAY ORDER CREATED:",
      razorpayOrder.id
    );

    // Order database me save karo
    // user_id abhi NULL rahega.
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: null,

        total_amount: amount,
        payment_status: "pending",
        razorpay_order_id: razorpayOrder.id,

        customer_name: customerName.trim(),
        customer_email: customerEmail.trim().toLowerCase(),
        customer_phone: customerPhone.trim(),

        course_id: courseId,
      })
      .select()
      .single();

    if (orderError) {
      console.error(
        "ORDER DATABASE ERROR:",
        orderError
      );

      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,

      // Hamare Supabase order ka ID
      orderId: order.id,

      // Razorpay order ID
      razorpayOrderId: razorpayOrder.id,

      // Razorpay amount paise me deta hai
      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      key: process.env.RAZORPAY_KEY_ID,

      course,
    });
  } catch (error: any) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

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