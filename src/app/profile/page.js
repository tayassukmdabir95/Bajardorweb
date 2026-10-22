
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin?callbackURL=/profile");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-3xl p-6">
        <div className="skeleton h-40 w-full rounded-2xl" />
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="min-h-[70vh] bg-base-200 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-semibold text-success hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </Link>

        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body items-center p-6 text-center sm:p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-4xl">
              👤
            </div>

            <h1 className="mt-2 text-3xl font-extrabold">
              আমার প্রোফাইল
            </h1>

            <div className="mt-5 w-full space-y-4 text-left">
              <div className="rounded-xl bg-base-200 p-4">
                <p className="text-sm text-base-content/60">নাম</p>
                <p className="mt-1 font-bold">
                  {user.name || "নাম দেওয়া হয়নি"}
                </p>
              </div>

              <div className="rounded-xl bg-base-200 p-4">
                <p className="text-sm text-base-content/60">ইমেইল</p>
                <p className="mt-1 break-all font-semibold">
                  {user.email}
                </p>
              </div>
            </div>

            <Link
              href="/profile/update"
              className="btn btn-success mt-6 w-full sm:w-auto"
            >
              তথ্য আপডেট করুন
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
