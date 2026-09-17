import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      orderId,
      name,
      email,
      phone,
      password,
    } = body;

    // Validate required fields
    if (!orderId || !name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Get the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("ORDER ERROR:", orderError);

      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Payment must already be successful
    if (order.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment has not been completed" },
        { status: 400 }
      );
    }

    // Get purchased course
    const { data: orderItem, error: itemError } = await supabaseAdmin
      .from("order_items")
      .select("course_id, price")
      .eq("order_id", orderId)
      .single();

    if (itemError || !orderItem) {
      console.error("ORDER ITEM ERROR:", itemError);

      return NextResponse.json(
        { error: "Course information not found" },
        { status: 404 }
      );
    }

    // Create Supabase Auth user
    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name.trim(),
        phone: phone.trim(),
      },
    });

    if (authError || !authData.user) {
      console.error("AUTH USER ERROR:", authError);

      return NextResponse.json(
        {
          error:
            authError?.message || "Failed to create account",
        },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // Create / update profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          role: "student",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

    if (profileError) {
      console.error("PROFILE ERROR:", profileError);

      // Remove auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }

    // Attach the paid order to the new user
    const { error: updateOrderError } = await supabaseAdmin
      .from("orders")
      .update({
        user_id: userId,
        customer_name: name.trim(),
        customer_email: email.trim().toLowerCase(),
        customer_phone: phone.trim(),
      })
      .eq("id", orderId);

    if (updateOrderError) {
      console.error("ORDER UPDATE ERROR:", updateOrderError);

      await supabaseAdmin.auth.admin.deleteUser(userId);

      return NextResponse.json(
        { error: "Failed to link order to account" },
        { status: 500 }
      );
    }

    // Give the user access to the purchased course
    const { error: courseError } = await supabaseAdmin
      .from("user_courses")
      .upsert(
        {
          user_id: userId,
          course_id: orderItem.course_id,
        },
        {
          onConflict: "user_id,course_id",
        }
      );

    if (courseError) {
      console.error("USER COURSE ERROR:", courseError);

      return NextResponse.json(
        { error: "Failed to unlock course" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      courseId: orderItem.course_id,
      message: "Account created and course unlocked",
    });
  } catch (error) {
    console.error("COMPLETE PURCHASE ERROR:", error);

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