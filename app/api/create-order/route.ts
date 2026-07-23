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

    const { courseId, userId } = body;

    if (!courseId || !userId) {
      return NextResponse.json(
        { error: "Missing courseId or userId" },
        { status: 400 }
      );
    }

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

    const amount = Number(course.price);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid course price" },
        { status: 400 }
      );
    }
        console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET_PRESENT:", !!process.env.RAZORPAY_KEY_SECRET);

let razorpayOrder;

try {
  razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `ord_${Date.now()}`,
  });

  console.log("ORDER CREATED:", razorpayOrder.id);
} catch (err: any) {
  console.error("RAZORPAY ERROR:", JSON.stringify(err, null, 2));
  throw err;
}

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: amount,
        payment_status: "pending",
        razorpay_order_id: razorpayOrder.id,
      })
      .select()
      .single();

    if (orderError) {
      console.error(orderError);

      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }
        return NextResponse.json({
      success: true,
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      course,
    });

  } catch (error: any) {
  console.error("CREATE ORDER ERROR:", error);

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