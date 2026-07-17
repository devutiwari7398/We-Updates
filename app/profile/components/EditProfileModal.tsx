"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type EditProfileModalProps = {
  open: boolean;
  onClose: () => void;
  user: any;
  fullName: string;
  phone: string;
};

export default function EditProfileModal({
  open,
  onClose,
  user,
  fullName,
  phone,
}: EditProfileModalProps) {
    const [name, setName] = useState(fullName);
const [mobile, setMobile] = useState(phone);
const [saving, setSaving] = useState(false);
async function saveProfile() {
  if (!user) return;

  setSaving(true);

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: name,
      phone: mobile,
    })
    .eq("id", user.id);

  setSaving(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Profile updated successfully!");
  window.location.reload();
}
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        <h2 className="mb-5 text-2xl font-bold">
          Edit Profile
        </h2>

        <div className="space-y-4">

          <div>
            <label className="mb-1 block text-sm">
              Full Name
            </label>

            <input
              value={name}
onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              Email
            </label>

            <input
              value={user?.email || ""}
              disabled
              className="w-full rounded-lg border bg-gray-100 p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              Phone
            </label>

            <input
              value={mobile}
onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
  onClick={saveProfile}
  disabled={saving}
  className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
>
  {saving ? "Saving..." : "Save"}
</button>
        </div>

      </div>
    </div>
  );
}