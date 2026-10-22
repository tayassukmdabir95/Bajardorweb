
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignin(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।"
        );
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignin(provider) {
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || "সোশ্যাল লগইন শুরু করা যায়নি।"
        );
      }
    } catch {
      toast.error("লগইন করতে সমস্যা হয়েছে।");
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-base-200 px-4 py-10">
      <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body gap-4 p-6 sm:p-8">
          <div className="text-center">
            <div className="mb-3 text-5xl">🛒</div>
            <h1 className="text-3xl font-extrabold">
              আবার স্বাগতম!
            </h1>
            <p className="mt-2 text-sm text-base-content/60">
              আপনার বাজার দর অ্যাকাউন্টে সাইন ইন করুন
            </p>
          </div>

          <form onSubmit={handleSignin} className="space-y-4">
            <label className="form-control w-full">
              <span className="label-text mb-2">ইমেইল</span>
              <input
                className="input input-bordered w-full"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-2">
                পাসওয়ার্ড
              </span>
              <input
                className="input input-bordered w-full"
                type="password"
                placeholder="আপনার পাসওয়ার্ড"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <button
              className="btn btn-success w-full text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          <div className="divider">অথবা</div>

          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => handleSocialSignin("google")}
          >
            Google দিয়ে সাইন ইন
          </button>

          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => handleSocialSignin("github")}
          >
            GitHub দিয়ে সাইন ইন
          </button>

          <p className="text-center text-sm">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-bold text-success hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
