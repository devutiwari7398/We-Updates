import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  PlayCircle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { CourseCard } from "@/components/CourseCard";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  content_type: string | null;
  pdf_url: string | null;
  demo_video_url: string | null;
  full_video_url: string | null;
  price: number;
  discount_price: number | null;
  is_published: boolean;
};

async function getCourse(slug: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Course;
}

async function getRelatedCourses(
  currentId: string
): Promise<Course[]> {
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .neq("id", currentId)
    .limit(3);

  return (data ?? []) as Course[];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const course = await getCourse(slug);

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: course.title,
    description:
      course.short_description ??
      course.description ??
      "",
  };
}

export default async function CourseDetail({
  params,
}: PageProps) {
  const { slug } = await params;

  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  const related = await getRelatedCourses(course.id);
    return (
    <main className="container py-10">
      <Link
        href="/courses"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand"
      >
        <ArrowLeft size={16} />
        Back to courses
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-2xl border">
            <Image
              src={course.thumbnail_url || "/hero-course.jpg"}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
            {course.content_type?.toUpperCase() || "COURSE"}
          </span>

          <h1 className="mt-4 text-4xl font-bold">
            {course.title}
          </h1>

          <p className="mt-4 text-slate-600">
            {course.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl font-bold">
              ${course.price}
            </span>

            {course.discount_price && (
              <span className="text-xl text-slate-400 line-through">
                ${course.discount_price}
              </span>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={18}
                className="text-green-600"
              />
              Lifetime access
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2
                size={18}
                className="text-green-600"
              />
              Premium quality content
            </div>

            <div className="flex items-center gap-3">
              {course.content_type === "pdf" ? (
                <FileText
                  size={18}
                  className="text-brand"
                />
              ) : (
                <PlayCircle
                  size={18}
                  className="text-brand"
                />
              )}

              {course.content_type === "pdf"
                ? "Downloadable PDF"
                : "Video Course"}
            </div>
          </div>

          <div className="mt-10 flex gap-4">
  <BuyButton courseId={course.id} />

  {(course.pdf_url || course.demo_video_url) && (
    <a
      href={
        course.demo_video_url ??
        course.pdf_url ??
        "#"
      }
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-secondary"
    >
      Preview
    </a>
  )}
</div>
        </div>
      </div>
            <section className="mt-16">
        <h2 className="text-3xl font-bold">
          Course Description
        </h2>

        <div className="mt-6 rounded-2xl border bg-white p-6">
          <p className="whitespace-pre-line leading-8 text-slate-700">
            {course.description || "No description available."}
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-bold">
          Course Includes
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <div className="rounded-xl border p-5">
            <div className="flex items-center gap-3">
              {course.content_type === "pdf" ? (
                <FileText className="text-brand" />
              ) : (
                <PlayCircle className="text-brand" />
              )}

              <div>
                <h3 className="font-bold">
                  Content Type
                </h3>

                <p className="text-sm text-slate-600">
                  {course.content_type?.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600" />

              <div>
                <h3 className="font-bold">
                  Access
                </h3>

                <p className="text-sm text-slate-600">
                  Lifetime Access
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600" />

              <div>
                <h3 className="font-bold">
                  Price
                </h3>

                <p className="text-sm text-slate-600">
                  ₹ {course.price}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600" />

              <div>
                <h3 className="font-bold">
                  Published
                </h3>

                <p className="text-sm text-slate-600">
                  {course.is_published ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">
              Related Courses
            </h2>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-brand font-semibold"
            >
              View All
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <CourseCard
                key={item.id}
                course={item}
              />
            ))}
          </div>
        </section>
      )}
     </main>
  );
}