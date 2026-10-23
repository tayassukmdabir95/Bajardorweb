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
  const [confirmPassword, setConfirmPassword] = useState(""); // নতুন স্টেট
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না। আবার চেষ্টা করুন।");
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
        toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
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
      toast.error(`${provider} লগইন করতে সমস্যা হয়েছে।`);
    }
  }

  return (
    <main className="min-h-screen bg-[#f2f5f3] flex flex-col items-center justify-center px-4 py-10 font-sans">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-base-content mb-2">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-base-content/70">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      {/* Main Card */}
      <div className="card w-full max-w-[500px] bg-base-100 shadow-sm border border-base-200/60 rounded-2xl">
        <div className="card-body p-8 gap-5">
          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Name Input */}
            <div className="form-control w-full">
              <label className="label px-0 pb-2 pt-0">
                <span className="label-text font-medium text-base-content">নাম</span>
              </label>
              <input
                className="input input-bordered w-full placeholder:text-[#737d74] focus:outline-none focus:border-success focus:ring-1 focus:ring-success"
                type="text"
                placeholder="যেমন: রহিম উদ্দিন"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>

            {/* Email Input */}
            <div className="form-control w-full">
              <label className="label px-0 pb-2 pt-0">
                <span className="label-text font-medium text-base-content">ইমেইল</span>
              </label>
              <input
                className="input input-bordered w-full placeholder:text-[#737d74] focus:outline-none focus:border-success focus:ring-1 focus:ring-success"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-control w-full">
              <label className="label px-0 pb-2 pt-0">
                <span className="label-text font-medium text-base-content">পাসওয়ার্ড</span>
              </label>
              <input
                className="input input-bordered w-full placeholder:text-[#737d74] focus:outline-none focus:border-success focus:ring-1 focus:ring-success"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="form-control w-full">
              <label className="label px-0 pb-2 pt-0">
                <span className="label-text font-medium text-base-content">পাসওয়ার্ড নিশ্চিত করুন</span>
              </label>
              <input
                className="input input-bordered w-full placeholder:text-[#737d74] focus:outline-none focus:border-success focus:ring-1 focus:ring-success"
                type="password"
                placeholder="আবার লিখুন"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              className="btn bg-[#0c8a43] hover:bg-[#0a7538] text-white border-none w-full mt-2 text-base"
              type="submit"
              disabled={loading}
            >
              {loading ? "প্রসেস হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-base-content/60 my-2">অথবা</div>

          {/* Social Buttons (Side by Side) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content flex-1 font-normal bg-transparent"
              onClick={() => handleSocialSignup("google")}
            >
              {/* Google Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-1">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              Google দিয়ে চালিয়ে যান
            </button>

            <button
              type="button"
              className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content flex-1 font-normal bg-transparent"
              onClick={() => handleSocialSignup("github")}
            >
              {/* GitHub Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-1" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub দিয়ে চালিয়ে যান
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <span className="text-base-content/80">অ্যাকাউন্ট আছে? </span>
            <Link href="/signin" className="font-semibold text-[#0c8a43] hover:underline">
              সাইন ইন করুন
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="mt-8">
        <Link href="/" className="text-base-content/60 hover:text-base-content transition-colors">
          &larr; হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}