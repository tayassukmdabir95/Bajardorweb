
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  getProducts,
  formatPrice,
  getProductEmoji,
} from "@/lib/bazardor";

const fallbackCategories = [
  { slug: "chal", name: "চাল", icon: "🍚" },
  { slug: "dal", name: "ডাল", icon: "🫘" },
  { slug: "tel", name: "তেল", icon: "🫙" },
  { slug: "sobji", name: "সবজি", icon: "🥬" },
  { slug: "mach", name: "মাছ", icon: "🐟" },
  { slug: "mangsho", name: "মাংস", icon: "🍗" },
];

function getBanglaDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [categories, setCategories] = useState(fallbackCategories);
  const [products, setProducts] = useState([]);

  const banglaDate = useMemo(() => getBanglaDate(), []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (!cancelled) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Ticker products could not load:", error);
      }
    }

    async function loadCategories() {
      try {
        const response = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/categories"
        );

        if (!response.ok) return;

        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.categories)
              ? result.categories
              : [];

        const normalized = data
          .map((category) => ({
            slug: String(category.slug ?? category.id ?? ""),
            name: String(
              category.nameBn ??
              category.name ??
              category.title ??
              ""
            ),
            icon: String(category.icon ?? category.emoji ?? "🛒"),
          }))
          .filter((category) => category.slug && category.name);

        if (!cancelled && normalized.length) {
          setCategories(normalized);
        }
      } catch (error) {
        console.error("Categories could not load:", error);
      }
    }

    loadProducts();
    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const tickerProducts = useMemo(() => {
    return products.length ? products : [];
  }, [products]);

  async function handleSignOut() {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করার সময় সমস্যা হয়েছে।");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-3 py-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 sm:gap-3"
            aria-label="বাজার দর হোম পেজ"
          >
            <Image
              src="/logo.png"
              alt="বাজার দর লোগো"
              width={48}
              height={48}
              className="h-10 w-10 shrink-0 rounded-xl object-contain sm:h-12 sm:w-12"
              priority
            />

            <div className="min-w-0">
              <span className="block text-lg font-extrabold leading-tight sm:text-2xl">
                বাজার দর
              </span>
              <span className="mt-1 block text-[10px] text-base-content/60 sm:text-xs">
                {banglaDate}
              </span>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {isPending ? (
              <span className="loading loading-spinner loading-sm text-success" />
            ) : session ? (
              <>
                <Link
                  href="/profile"
                  className="btn btn-ghost btn-sm"
                >
                  <span aria-hidden="true">👤</span>
                  <span className="hidden sm:inline">
                    {session.user?.name || "প্রোফাইল"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn btn-outline btn-error btn-sm"
                >
                  সাইন আউট
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="btn btn-ghost btn-sm"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="btn btn-success btn-sm"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        <nav
          aria-label="পণ্যের বিভাগ"
          className="flex gap-2 overflow-x-auto border-t border-base-200 py-2"
        >
          <Link
            href="/"
            className={`btn btn-sm shrink-0 ${
              pathname === "/"
                ? "btn-success"
                : "btn-ghost"
            }`}
          >
            সব পণ্য
          </Link>

          {categories.map((category) => {
            const active = pathname === `/category/${category.slug}`;

            return (
              <Link
                key={category.slug}
                href={`/category/${encodeURIComponent(category.slug)}`}
                className={`btn btn-sm shrink-0 ${
                  active ? "btn-success" : "btn-ghost"
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        className="overflow-hidden border-t border-base-200 bg-base-200/70"
        aria-label="আজকের পণ্যের দামের পরিবর্তন"
      >
        <div className="flex min-h-10 items-center gap-6 overflow-hidden px-3">
          {tickerProducts.length ? (
            <div className="bazar-ticker-track flex w-max shrink-0 items-center gap-8 whitespace-nowrap py-2">
              {[...tickerProducts, ...tickerProducts].map(
                (product, index) => {
                  const change = Number(product.changePercent) || 0;

                  const color =
                    change > 0
                      ? "text-rose-600"
                      : change < 0
                        ? "text-emerald-600"
                        : "text-base-content/60";

                  return (
                    <span
                      key={`${product.id}-${index}`}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm"
                    >
                      <span>{getProductEmoji(product)}</span>
                      <span className="font-semibold">
                        {product.name}
                      </span>
                      <span className="font-bold">
                        {formatPrice(product.price)} টাকা
                        {product.unit ? ` / ${product.unit}` : ""}
                      </span>
                      <span className={`font-bold ${color}`}>
                        {change > 0
                          ? "▲"
                          : change < 0
                            ? "▼"
                            : "—"}
                        {" "}
                        {formatPrice(Math.abs(change))}%
                      </span>
                    </span>
                  );
                }
              )}
            </div>
          ) : (
            <p className="py-2 text-xs text-base-content/60">
              আজকের পণ্যের দাম লোড হচ্ছে...
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
