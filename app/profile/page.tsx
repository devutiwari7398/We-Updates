"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import EditProfileModal from "./components/EditProfileModal";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [saving, setSaving] = useState(false);
const [editModal, setEditModal] = useState(false);
const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }
console.log(user);
      setUser(user);
  const { data: profile, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();

console.log("Searching ID:", user.id);

console.log("Profile:", profile);
console.log("Error:", error);
  console.log("User ID:", user.id);
console.log("Profile:", profile);

if (profile) {
  setFullName(profile.full_name || "");
  setPhone(profile.phone || "");
  console.log("Full Name:", profile?.full_name);
}
    }

    loadUser();
  }, []);

  async function saveProfile() {
  if (!user) return;

  setSaving(true);

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone,
    })
    .eq("id", user.id);

  setSaving(false);

  if (error) {
    alert(error.message);
    return;
  }
  setIsEditing(false);
  alert("Profile updated successfully!");
}

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!user) {
    return (
      <div className="py-24 text-center">
        Loading...
      </div>

    );
  }

  return (
    <>
    <div className="container mx-auto max-w-2xl py-20">

      <div className="rounded-2xl border p-8 shadow">

        <div className="flex flex-col items-center">

  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 text-5xl font-bold text-white shadow-lg">
    {(user.user_metadata?.name || user.email)
      ?.charAt(0)
      .toUpperCase()}
  </div>

  <h1 className="mt-6 text-3xl font-bold">
  {fullName || "Student"}
</h1>

  <p className="mt-2 text-gray-500">
    {user.email}
  </p>
  <div className="mt-8 w-full space-y-5">

  <div className="mt-8 border-t pt-6">
  <div className="space-y-5">

    <div>
      <p className="text-sm text-gray-500">
        Full Name
      </p>
      {isEditing ? (
  <input
    type="text"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    className="w-full rounded-lg border p-3"
  />
) : (
  <p className="text-lg font-semibold">
    {fullName || "Not added"}
  </p>
)}
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Email
      </p>
      <p className="text-lg">
        {user?.email}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Phone Number
      </p>
      {isEditing ? (
  <input
    type="text"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full rounded-lg border p-3"
  />
) : (
  <p className="text-lg">
    {phone || "Not added"}
  </p>
)}
    </div>

    <button
  onClick={() => setEditModal(true)}
  className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
>
  ✏ Edit Profile
</button>

  </div>
</div>

</div>

</div>

        <hr className="my-8" />

        <div className="space-y-3">

  <button
    className="w-full rounded-lg border p-4 text-left hover:bg-gray-50"
  >
    📚 My Courses
  </button>

  <button
    className="w-full rounded-lg border p-4 text-left hover:bg-gray-50"
  >
    ❤️ Wishlist
  </button>

  <button
    className="w-full rounded-lg border p-4 text-left hover:bg-gray-50"
  >
    ⚙️ Account Settings
  </button>

  <button
    className="w-full rounded-lg border p-4 text-left hover:bg-gray-50"
  >
    🔒 Change Password
  </button>

</div>

        <div className="mt-10">

<button
  onClick={logout}
  className="w-full rounded-lg bg-red-600 py-3 text-white hover:bg-red-700"
>
  Logout
</button>

</div>

      </div>

    </div>
    <EditProfileModal
  open={editModal}
  onClose={() => setEditModal(false)}
  user={user}
  fullName={fullName}
  phone={phone}
/>
</>
  );
}