"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
useEffect(() => {
  fetchCourses();
}, []);

async function fetchCourses() {
  setLoading(true);

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  } else {
    setCourses(data || []);
  }

  setLoading(false);
}

async function deleteCourse(id: string) {
  if (!confirm("Delete this course?")) return;

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  fetchCourses();
}
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Manage Courses
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        {loading ? (
  <p>Loading...</p>
) : (
  <div className="space-y-4">
    {courses.map((course) => (
      <div
        key={course.id}
        className="border rounded-lg p-4 flex justify-between items-center"
      >
        <div>
          <h2 className="font-bold text-lg">{course.title}</h2>
          <p className="text-gray-600">
            ₹ {course.price}
          </p>
        </div>

        <div className="flex items-center gap-3">
  {course.is_published ? (
    <span className="text-green-600 font-semibold">
      Published
    </span>
  ) : (
    <span className="text-red-600 font-semibold">
      Draft
    </span>
  )}

  <button
    className="bg-blue-600 text-white px-3 py-1 rounded"
    onClick={() => router.push(`/admin/courses/edit/${course.id}`)}
  >
    Edit
  </button>

  <button
    className="bg-red-600 text-white px-3 py-1 rounded"
    onClick={() => deleteCourse(course.id)}
  >
    Delete
  </button>
</div>

      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}