import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Logged in user
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid user" },
        { status: 401 }
      );
    }

    const { courseId } = await req.json();

    // Purchase check
    const { data: purchased } = await supabaseAdmin
      .from("user_courses")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (!purchased) {
      return NextResponse.json(
        { error: "Course not purchased" },
        { status: 403 }
      );
    }

    // Get PDF path
    const { data: course } = await supabaseAdmin
      .from("courses")
      .select("pdf_path")
      .eq("id", courseId)
      .single();

    if (!course?.pdf_path) {
      return NextResponse.json(
        { error: "PDF not found" },
        { status: 404 }
      );
    }

    // Signed URL
    const { data, error } = await supabaseAdmin.storage
      .from("pdfs")
      .createSignedUrl(course.pdf_path, 300);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.signedUrl,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}