
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
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f1f6f1] px-4 py-10">
      {/* Sign-in card */}
      <div className="w-full max-w-[440px] rounded-[17px] border border-[#dce9dc] bg-[#fbfdfb] p-5 shadow-[0_4px_18px_rgba(30,70,40,0.04)] sm:p-[26px]">
        <div className="flex flex-col gap-5">
          {/* Heading */}
          <div className="text-center">
            

            <h1 className="text-2xl font-extrabold tracking-tight text-[#20372a] sm:text-3xl">
              সাইন ইন
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#65766a]">
                 বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।            </p>
          </div>

          {/* Email and password form */}
          <form onSubmit={handleSignin} className="space-y-4">
            <label className="block w-full">
              <span className="mb-2 block text-sm font-semibold text-[#304638]">
                ইমেইল
              </span>

              <input
                className="h-[43px] w-full rounded-[10px] border border-[#d5e2d6] bg-white px-3 text-sm text-[#24372a] outline-none transition placeholder:text-[#9aa99d] focus:border-[#008747] focus:ring-2 focus:ring-[#008747]/10"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="block w-full">
              <span className="mb-2 block text-sm font-semibold text-[#304638]">
                পাসওয়ার্ড
              </span>

              <input
                className="h-[43px] w-full rounded-[10px] border border-[#d5e2d6] bg-white px-3 text-sm text-[#24372a] outline-none transition placeholder:text-[#9aa99d] focus:border-[#008747] focus:ring-2 focus:ring-[#008747]/10"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <button
              className="flex h-[44px] w-full items-center justify-center rounded-[10px] bg-[#008747] px-4 text-sm font-semibold text-white shadow-[0_3px_7px_rgba(0,135,71,0.16)] transition hover:bg-[#006f3a] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3" aria-label="অথবা">
            <div className="h-px flex-1 bg-[#dce5dc]" />
            <span className="text-xs font-medium text-[#829086]">
              অথবা
            </span>
            <div className="h-px flex-1 bg-[#dce5dc]" />
          </div>

          {/* Social sign-in buttons */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="flex h-[43px] min-w-0 items-center justify-center gap-2 rounded-[10px] border border-[#d5e2d6] bg-white px-3 text-sm font-semibold text-[#304638] transition hover:bg-[#f2f7f2] disabled:opacity-60"
              onClick={() => handleSocialSignin("google")}
            >
              {/* Google icon */}
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-[18px] w-[18px] shrink-0"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                  transform="translate(0 4)"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.65 5.93c4.46-4.12 7.12-10.19 7.12-17.58Z"
                  transform="translate(0 0)"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.96 23.96 0 0 0 0 21.56l7.98-6.19Z"
                  transform="translate(0 0)"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.87l-7.65-5.93c-2.13 1.43-4.87 2.28-8.26 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  transform="translate(0 0)"
                />
              </svg>

              <span className="truncate">Google দিয়ে সাইন ইন</span>
            </button>

            <button
              type="button"
              className="flex h-[43px] min-w-0 items-center justify-center gap-2 rounded-[10px] border border-[#d5e2d6] bg-white px-3 text-sm font-semibold text-[#304638] transition hover:bg-[#f2f7f2] disabled:opacity-60"
              onClick={() => handleSocialSignin("github")}
            >
              {/* GitHub icon */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-[19px] w-[19px] shrink-0"
              >
                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.64-1.24-1.64-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.6 1.2 3.23.92.1-.72.39-1.2.7-1.48-2.47-.28-5.07-1.24-5.07-5.5 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.77 1.15 2.99 0 4.27-2.6 5.21-5.08 5.49.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.76.54A11.1 11.1 0 0 0 12 .9Z" />
              </svg>

              <span className="truncate">GitHub দিয়ে সাইন ইন</span>
            </button>
          </div>

          {/* Sign-up link */}
          <p className="text-center text-sm text-[#526459]">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#008747] transition hover:text-[#006f3a] hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
