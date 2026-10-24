
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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

function getInitials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "U";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [categories, setCategories] = useState(fallbackCategories);
  const [products, setProducts] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const banglaDate = useMemo(() => getBanglaDate(), []);

  const user = session?.user;
  const userName = user?.name?.trim() || "ব্যবহারকারী";
  const userEmail = user?.email || "";

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (!cancelled) setProducts(data);
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
              category.nameBn ?? category.name ?? category.title ?? ""
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


  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const tickerProducts = useMemo(
    () => (products.length ? products : []),
    [products]
  );

  async function handleSignOut() {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      setProfileOpen(false);
      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করার সময় সমস্যা হয়েছে।");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
       
        <div className="flex min-h-20 items-center justify-between gap-3 py-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 sm:gap-3"
            aria-label="বাজার দর হোম পেজ"
          >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-700 bg-emerald-500 p-2 sm:h-12 sm:w-12 sm:p-2.5">
  <Image
    src="/logo.png"
    alt="বাজার দর লোগো"
    width={32}
    height={32}
    className="h-full w-full object-contain"
    priority
  />
</div>

            <div className="min-w-0">
              <span className="block text-xl font-extrabold leading-tight text-gray-950 sm:text-2xl">
                বাজার দর
              </span>
              <span className="mt-1 block text-xs font-medium leading-snug text-gray-700">
                {banglaDate}
              </span>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {isPending ? (
              <span className="loading loading-spinner loading-sm text-success" />
            ) : session ? (
              <div className="relative" ref={profileRef}>
           
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  aria-label="প্রোফাইল মেনু খুলুন"
                  className="flex max-w-[190px] items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-2.5 text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:max-w-[240px] sm:gap-2.5 sm:pr-3"
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={userName}
                      width={36}
                      height={36}
                      unoptimized
                      className="h-9 w-9 shrink-0 rounded-full border border-gray-200 object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                      {getInitials(userName)}
                    </span>
                  )}

                  <span className="truncate text-sm font-semibold">
                    {userName}
                  </span>

                  <svg
                    className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                </button>

         
                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-[60] mt-3 w-[min(320px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-gray-100 bg-white p-2.5 text-gray-900 shadow-xl shadow-gray-900/10"
                  >
            
                    <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={userName}
                          width={48}
                          height={48}
                          unoptimized
                          className="h-12 w-12 shrink-0 rounded-full border border-gray-200 object-cover"
                        />
                      ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base font-bold text-emerald-800">
                          {getInitials(userName)}
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {userName}
                        </p>
                        <p className="mt-1 break-all text-xs leading-5 text-gray-500">
                          {userEmail || "ইমেইল দেওয়া নেই"}
                        </p>
                      </div>
                    </div>

                    <div className="my-1 border-t border-gray-100" />

           
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-950 focus:bg-gray-50 focus:outline-none"
                    >
                      <svg
                        className="h-5 w-5 shrink-0 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="8" r="3.5" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 20v-1.5a7 7 0 0 1 14 0V20"
                        />
                      </svg>
                      <span>প্রোফাইল</span>
                    </Link>

                
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                    >
                      <svg
                        className="h-5 w-5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M10 17l5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                      </svg>
                      <span>সাইন আউট</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="btn btn-ghost btn-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="btn btn-success btn-sm font-semibold"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

     
        <nav
          aria-label="পণ্যের বিভাগ"
          className="flex gap-2 overflow-x-auto border-t border-gray-100 py-2"
        >
          <Link
            href="/"
            className={`btn btn-sm shrink-0 font-semibold ${
              pathname === "/"
                ? "btn-success"
                : "btn-ghost text-gray-800 hover:bg-gray-100"
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
                className={`btn btn-sm shrink-0 font-semibold ${
                  active
                    ? "btn-success"
                    : "btn-ghost text-gray-800 hover:bg-gray-100"
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
        className="overflow-hidden border-t border-gray-200 bg-gray-50"
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
                        : "text-gray-600";

                  return (
                    <span
                      key={`${product.id}-${index}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-800"
                    >
                      <span>{getProductEmoji(product)}</span>
                      <span className="font-semibold">{product.name}</span>
                      <span className="font-bold">
                        {formatPrice(product.price)} টাকা
                        {product.unit ? ` / ${product.unit}` : ""}
                      </span>
                      <span className={`font-bold ${color}`}>
                        {change > 0 ? "▲" : change < 0 ? "▼" : "—"}{" "}
                        {formatPrice(Math.abs(change))}%
                      </span>
                    </span>
                  );
                }
              )}
            </div>
          ) : (
            <p className="py-2 text-sm font-medium text-gray-700">
              আজকের পণ্যের দাম লোড হচ্ছে...
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
