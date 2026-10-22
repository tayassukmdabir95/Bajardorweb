
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।"
        );
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignup(provider) {
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "লগইন করা যায়নি।");
      }
    } catch {
      toast.error(
        `${provider} লগইন করতে সমস্যা হয়েছে।`
      );
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-base-200 px-4 py-10">
      <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body gap-4 p-6 sm:p-8">
          <div className="text-center">
            <div className="mb-3 text-5xl">🛒</div>
            <h1 className="text-3xl font-extrabold">
              অ্যাকাউন্ট তৈরি করুন
            </h1>
            <p className="mt-2 text-sm text-base-content/60">
              বাজার দর-এর সঙ্গে যুক্ত হোন
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <label className="form-control w-full">
              <span className="label-text mb-2">
                আপনার নাম
              </span>
              <input
                className="input input-bordered w-full"
                type="text"
                placeholder="আপনার নাম লিখুন"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-2">
                ইমেইল
              </span>
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
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            <button
              className="btn btn-success w-full text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ"}
            </button>
          </form>

          <div className="divider">অথবা</div>

          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => handleSocialSignup("google")}
          >
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => handleSocialSignup("github")}
          >
            GitHub দিয়ে চালিয়ে যান
          </button>

          <p className="text-center text-sm">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="font-bold text-success hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
