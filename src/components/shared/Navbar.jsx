
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  getProducts,
  getProductEmoji,
  formatPrice,
} from "@/lib/bazardor";

const API_BASE =
  "https://openapi.programming-hero.com/api/bazardor";

const FALLBACK_CATEGORIES = [
  { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

function getBanglaDate() {
  return new Intl.DateTimeFormat("bn-BD-u-ca-bengali", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function getArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.categories)) return payload.categories;
  return [];
}

export default function Navbar() {
  const pathname = usePathname();

  const [categories, setCategories] = useState(
    FALLBACK_CATEGORIES
  );
  const [products, setProducts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    setBanglaDate(getBanglaDate());

    let cancelled = false;

    async function loadNavbarData() {
      try {
        // Categories come from their endpoint.
        // Products use the shared normalizer from bazardor.js.
        const [categoryResponse, productData] = await Promise.all([
          fetch(`${API_BASE}/categories`),
          getProducts(),
        ]);

        if (!categoryResponse.ok) {
          throw new Error("ক্যাটাগরির তথ্য লোড করা যায়নি।");
        }

        const categoryPayload = await categoryResponse.json();
        const categoryData = getArray(categoryPayload);

        if (cancelled) return;

        if (categoryData.length > 0) {
          setCategories(categoryData);
        }

        setProducts(productData);
      } catch (error) {
        if (!cancelled) {
          console.error("Navbar API error:", error);
        }
      }
    }

    loadNavbarData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isCategoryActive = (slug) =>
    pathname === `/category/${slug}`;

  function renderTickerItem(product, index, copy) {
    const change = Number(product.changePercent ?? 0);
    const productId = product.id || product.slug;

    const changeColor =
      change > 0
        ? "font-bold text-lime-300"
        : change < 0
          ? "font-bold text-rose-300"
          : "font-bold text-gray-300";

    const arrow =
      change > 0 ? "▲" : change < 0 ? "▼" : "—";

    const unit = String(product.unit || "একক উল্লেখ নেই")
      .replace(/^প্রতি\s*/, "");

    return (
      <Link
        key={`${copy}-${productId || index}`}
        href={
          productId
            ? `/product/${encodeURIComponent(product.slug || product.id)}`
            : "/"
        }
        className="ticker-item"
        aria-label={`${product.name} এর দাম`}
      >
        <span className="text-xl">
          {getProductEmoji(product)}
        </span>

        <span className="font-semibold">
          {product.name}
        </span>

        <span className="whitespace-nowrap text-white/80">
          {formatPrice(product.price)} টাকা/{unit}
        </span>

        <span className={changeColor}>
          {arrow} {formatPrice(Math.abs(change))}%
        </span>
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
      {/* Logo, date, and authentication links */}
      <div className="border-b border-base-200">
        <div className="navbar mx-auto min-h-20 max-w-6xl px-4">
          <div className="flex-1">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="বাজার দর হোম পেজ"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-3xl">
                🛒
              </span>

              <span>
                <span className="block text-xl font-extrabold tracking-tight text-success sm:text-2xl">
                  বাজার দর
                </span>

                <span className="block text-xs text-base-content/60">
                  {banglaDate || "বাংলা তারিখ"}
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/signin"
              className="btn btn-ghost btn-sm sm:btn-md"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="btn btn-success btn-sm text-white sm:btn-md"
            >
              সাইন আপ
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-square sm:hidden"
            aria-label={
              mobileMenuOpen
                ? "মেনু বন্ধ করুন"
                : "মেনু খুলুন"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setMobileMenuOpen((previous) => !previous)
            }
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Category navigation */}
      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className={`border-b border-base-200 ${
          mobileMenuOpen ? "block" : "hidden"
        } sm:block`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-center sm:gap-2">
          <Link
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              pathname === "/"
                ? "bg-success text-white"
                : "text-base-content/70 hover:bg-success/10 hover:text-success"
            }`}
          >
            সব পণ্য
          </Link>

          {categories.map((category) => {
            const slug = category.slug || category.id;
            const label =
              category.nameBn ||
              category.name ||
              category.title ||
              "ক্যাটাগরি";

            return (
              <Link
                key={slug}
                href={`/category/${slug}`}
                aria-current={
                  isCategoryActive(slug) ? "page" : undefined
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isCategoryActive(slug)
                    ? "bg-success text-white"
                    : "text-base-content/70 hover:bg-success/10 hover:text-success"
                }`}
              >
                {category.icon || "🛒"} {label}
              </Link>
            );
          })}

          {/* Mobile authentication links */}
          <div className="mt-2 flex gap-2 border-t border-base-200 pt-3 sm:hidden">
            <Link
              href="/signin"
              className="btn btn-outline btn-success btn-sm flex-1"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="btn btn-success btn-sm flex-1 text-white"
            >
              সাইন আপ
            </Link>
          </div>
        </div>
      </nav>

      {/* Infinite scrolling price ticker */}
      <div className="ticker-shell bg-neutral text-neutral-content">
        <div className="ticker-heading">
          <span className="text-lg">📊</span>

          <span className="whitespace-nowrap text-xs font-bold sm:text-sm">
            আজকের বাজারদর
          </span>
        </div>

        <div className="ticker-viewport">
          {products.length > 0 ? (
            <div className="ticker-track">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="ticker-group"
                  aria-hidden={copy === 1}
                >
                  {products.map((product, index) =>
                    renderTickerItem(product, index, copy)
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center px-4 text-sm text-white/70">
              বাজারদরের তথ্য লোড হচ্ছে…
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
