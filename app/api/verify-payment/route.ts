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
    } = body;

    // Basic validation
    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          error: "Missing required payment fields",
        },
        { status: 400 }
      );
    }

    // Get our order from Supabase
    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

    if (orderError || !order) {
      console.error("ORDER NOT FOUND:", orderError);

      return NextResponse.json(
        {
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    // Make sure Razorpay order belongs to our order
    if (
      order.razorpay_order_id !== razorpay_order_id
    ) {
      return NextResponse.json(
        {
          error: "Razorpay order mismatch",
        },
        { status: 400 }
      );
    }

    // If this order is already paid,
    // don't process it again.
    if (order.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
      });
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (
      generatedSignature !== razorpay_signature
    ) {
      console.error("INVALID RAZORPAY SIGNATURE");

      return NextResponse.json(
        {
          error: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    // Payment is verified.
    // Mark the order as paid.
    const { error: updateError } =
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          razorpay_payment_id:
            razorpay_payment_id,
        })
        .eq("id", orderId);

    if (updateError) {
      console.error(
        "ORDER UPDATE ERROR:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Payment verified but failed to update order.",
        },
        { status: 500 }
      );
    }

    // Create order item if it doesn't already exist.
    const { data: existingItem } =
      await supabase
        .from("order_items")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle();

    if (!existingItem) {
      if (!order.course_id) {
        console.error(
          "COURSE ID MISSING FROM ORDER"
        );

        return NextResponse.json(
          {
            error:
              "Course information missing from order.",
          },
          { status: 500 }
        );
      }

      const { error: itemError } =
        await supabase
          .from("order_items")
          .insert({
            order_id: orderId,
            course_id: order.course_id,
            price: order.total_amount,
          });

      if (itemError) {
        console.error(
          "ORDER ITEM ERROR:",
          itemError
        );

        return NextResponse.json(
          {
            error:
              "Payment verified but failed to save order item.",
          },
          { status: 500 }
        );
      }
    }

    // IMPORTANT:
    // We DO NOT insert into user_courses here.
    //
    // The user is still a guest.
    // After payment, the user will create an account.
    // Then the order will be linked to that user
    // and user_courses will be created.

    console.log(
      "PAYMENT VERIFIED SUCCESSFULLY:",
      orderId
    );

    return NextResponse.json({
      success: true,
      orderId: orderId,
      courseId: order.course_id,
      message:
        "Payment verified successfully.",
    });
  } catch (error) {
    console.error(
      "VERIFY PAYMENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}