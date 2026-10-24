"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin?callbackURL=/profile/update");
    }
  }, [isPending, session, router]);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error(
          result.error.message || "তথ্য আপডেট করা যায়নি।"
        );
        return;
      }

      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে!");
      router.push("/profile");
    } catch {
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-2xl p-6">
        <div className="skeleton h-64 w-full rounded-2xl" />
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-base-200 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <Link
          href="/profile"
          className="mb-6 inline-block text-sm font-semibold text-green-800 hover:underline"
        >
          ← প্রোফাইলে ফিরে যান
        </Link>

        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              তথ্য আপডেট করুন
            </h1>

            <p className="text-sm text-gray-700">
              আপনার প্রোফাইলের নাম পরিবর্তন করুন।
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <label className="form-control w-full">
                <span className="label-text mb-2 font-semibold text-gray-900">
                  নাম
                </span>

                <input
                  type="text"
                  className="input input-bordered w-full text-gray-900 placeholder:text-gray-500"
                  placeholder="আপনার নাম লিখুন"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={100}
                  required
                />
              </label>

              <button
                type="submit"
                className="btn btn-success w-full"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  "Update Information"
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}