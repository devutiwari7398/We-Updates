"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditCoursePage() {
  const params = useParams();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

useEffect(() => {
  fetchCourse();
}, []);

async function fetchCourse() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  setCourse(data);
  setTitle(data.title || "");
  setDescription(data.description || "");
  setPrice(String(data.price || ""));
  setLoading(false);
}

async function updateCourse() {
  if (!course) return;

  setSaving(true);

  const { error } = await supabase
    .from("courses")
    .update({
      title,
      description,
      price: Number(price),
      updated_at: new Date().toISOString(),
    })
    .eq("id", course.id);

  setSaving(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Course Updated Successfully");
}
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Edit Course
      </h1>

      {loading ? (
  <p>Loading...</p>
) : (
  <div className="space-y-4">

    <div>
      <label>Title</label>
      <input
        className="w-full border rounded-lg p-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>

    <div>
      <label>Description</label>
      <textarea
        className="w-full border rounded-lg p-3"
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>

    <div>
      <label>Price</label>
      <input
        className="w-full border rounded-lg p-3"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    </div>

    <div>
      <label>Thumbnail</label>
      <img
        src={course.thumbnail_url}
        className="w-64 rounded-lg border"
      />
    </div>

    <div>
      <label>PDF URL</label>
      <input
        className="w-full border rounded-lg p-3"
        value={course.pdf_url}
        readOnly
      />

    </div>
<button
  className="bg-blue-600 text-white px-6 py-3 rounded-lg"
  onClick={updateCourse}
  disabled={saving}
>
  {saving ? "Updating..." : "Update Course"}
</button>

  </div>
)}
    </div>
  );
}