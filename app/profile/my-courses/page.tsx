"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";


interface Course {
  id: string;
  title: string;
  price: number;
  thumbnail_url: string | null;
  pdf_path: string | null;
  whatsapp_group_url: string | null;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_courses")
      .select(`
  course_id,
  courses (
    id,
    title,
    price,
    thumbnail_url,
    pdf_path,
    whatsapp_group_url
  )
`)
      .eq("user_id", user.id);

      console.log("COURSES:", data);
console.log("ERROR:", error);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const list =
      data?.map((item: any) => item.courses).filter(Boolean) ?? [];

    setCourses(list);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="container py-10">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="mt-6">Loading...</p>
      </main>
    );
  }

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>

      {courses.length === 0 ? (
        <p>You haven't purchased any course yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded-xl p-5 shadow-sm"
            >
              {course.thumbnail_url && (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              <h2 className="text-xl font-semibold mt-4">
                {course.title}
              </h2>

              <p className="mt-2">₹{course.price}</p>

              <div className="mt-5">
                <button
  className="btn btn-primary"
  onClick={async () => {
    const {
    data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("/api/download-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
        },
      body: JSON.stringify({
        courseId: course.id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    const a = document.createElement("a");
    a.href = data.url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }}
>
  Download PDF
</button>

{course.whatsapp_group_url && (
  <a
    href={course.whatsapp_group_url}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-3 inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-white font-semibold hover:bg-green-700 transition"
  >
    💬 Join WhatsApp Group
  </a>
)}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}