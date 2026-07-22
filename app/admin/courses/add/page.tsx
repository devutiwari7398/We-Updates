"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  async function handlePublish() {
    const {
  data: { session },
} = await supabase.auth.getSession();

console.log("SESSION:", session);
    setLoading(true);
    if (!thumbnail) {
  alert("Please select thumbnail");
  return;
}

const thumbnailExtension = thumbnail.name.split(".").pop();
const thumbnailName = `${Date.now()}.${thumbnailExtension}`;

const { data: thumbnailData, error: thumbnailError } =
  await supabase.storage
  .from("thumbnails")
  .upload(thumbnailName, thumbnail, {
    upsert: true,
    contentType: thumbnail.type,
  });;

if (thumbnailError) {
  alert(thumbnailError.message);
  return;
}

const { data: thumbnailUrlData } = supabase.storage
  .from("thumbnails")
  .getPublicUrl(thumbnailName);

const thumbnailUrl = thumbnailUrlData.publicUrl;

if (!pdf) {
  alert("Please select PDF");
  return;
}

const pdfExtension = pdf.name.split(".").pop();
const pdfName = `${Date.now()}.${pdfExtension}`;

const { error: pdfError } = await supabase.storage
  .from("pdfs")
  .upload(pdfName, pdf, {
    upsert: true,
    contentType: "application/pdf",
  });

if (pdfError) {
  alert(pdfError.message);
  return;
}

const result = await supabase
  .from("courses")
  .insert({
  title,
  slug: title.toLowerCase().replace(/\s+/g, "-"),
  description,
  price: Number(price),
  content_type: "pdf",

  thumbnail_url: thumbnailUrl,
  pdf_path: pdfName,

  is_published: true,
})
  .select();

  console.log("Thumbnail URL:", thumbnailUrl);
console.log("PDF PATH:", pdfName);
console.log("INSERT RESULT:", result);

console.log("INSERT RESULT", result);

alert("Course Published Successfully!");
setLoading(false);
setTitle("");
setDescription("");
setPrice("");
setCategory("");
setThumbnail(null);
setPdf(null);

}

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Add New Course
      </h1>

      <div className="space-y-5">

        <div>
          <label className="block mb-2 font-medium">
            Course Title
          </label>
          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>
          <textarea
            rows={5}
            className="w-full border rounded-lg p-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Price (₹)
          </label>
          <input
            type="number"
            className="w-full border rounded-lg p-3"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Category
          </label>
          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setThumbnail(e.target.files?.[0] || null)
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            PDF File
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setPdf(e.target.files?.[0] || null)
            }
          />
        </div>

        <button
  onClick={handlePublish}
  disabled={loading}
  className="bg-blue-600 text-white px-6 py-3 rounded-lg"
>
          Publish Course
        </button>

      </div>
    </div>
  );
}