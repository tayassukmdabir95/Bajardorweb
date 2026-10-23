
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import ProductCard from "@/components/home/ProductCard";
import { getProducts } from "@/lib/bazardor";

const API_BASE =
  "https://openapi.programming-hero.com/api/bazardor";

const FALLBACK_CATEGORIES = [
  { slug: "chal", nameBn: "চাল", icon: "🍚" },
  { slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { slug: "tel", nameBn: "তেল", icon: "🫙" },
  { slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥚" },
  { slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

function getArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (Array.isArray(payload?.data?.categories)) {
    return payload.data.categories;
  }
  return [];
}

function getSlug(category) {
  return String(category?.slug ?? category?.id ?? "");
}

function getCategoryName(category) {
  return (
    category?.nameBn ??
    category?.name ??
    category?.title ??
    "ক্যাটাগরি"
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="card border border-base-200 bg-base-100"
        >
          <div className="card-body gap-4 p-5">
            <div className="skeleton h-16 w-16 rounded-2xl" />
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton mt-3 h-8 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title }) {
  return (
    <div className="rounded-3xl border border-dashed border-base-300 px-5 py-16 text-center">
      <div className="text-5xl" aria-hidden="true">
        🧺
      </div>
      <h2 className="mt-4 text-xl font-bold">
        {title}
      </h2>
      <p className="mt-2 text-sm text-base-content/60">
        অন্য ক্যাটাগরি দেখুন অথবা সব পণ্যের তালিকায় ফিরে যান।
      </p>
      <Link href="/" className="btn btn-success mt-6 text-white">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}

export default function CategoryProducts({ slug }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(false);

      try {
        const [productData, categoryResponse] = await Promise.all([
          getProducts(),
          fetch(`${API_BASE}/categories`),
        ]);

        if (!categoryResponse.ok) {
          throw new Error("ক্যাটাগরি লোড করা যায়নি।");
        }

        const categoryPayload = await categoryResponse.json();
        const categoryData = getArray(categoryPayload);

        if (cancelled) return;

        setProducts(productData);

        if (categoryData.length > 0) {
          setCategories(categoryData);
        }
      } catch (err) {
        console.error("Category page loading error:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const category = useMemo(
    () => categories.find((item) => getSlug(item) === slug),
    [categories, slug]
  );

  const categoryProducts = useMemo(() => {
    const matching = products.filter(
      (product) => product.category === slug
    );

    const sorted = [...matching];

    if (sortOrder === "asc") {
      sorted.sort(
        (a, b) =>
          (a.price ?? Number.POSITIVE_INFINITY) -
          (b.price ?? Number.POSITIVE_INFINITY)
      );
    } else if (sortOrder === "desc") {
      sorted.sort(
        (a, b) =>
          (b.price ?? Number.NEGATIVE_INFINITY) -
          (a.price ?? Number.NEGATIVE_INFINITY)
      );
    }

    return sorted;
  }, [products, slug, sortOrder]);

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10 sm:py-14">
        <div className="skeleton mb-3 h-9 w-56" />
        <div className="skeleton mb-8 h-5 w-72 max-w-full" />
        <SkeletonGrid />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <EmptyState title="পণ্যের তথ্য লোড করা যায়নি" />
      </main>
    );
  }

  if (!category) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <EmptyState title="ক্যাটাগরি খুঁজে পাওয়া যায়নি" />
      </main>
    );
  }

return (
    <main className="min-h-screen bg-[#f4f7f5] px-4 py-8 font-sans">
      <div className="mx-auto max-w-6xl text-gray-900">
        
        {/* Category Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 flex items-center gap-5 shadow-sm">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f0f3f1] text-3xl">
            <span aria-hidden="true">{category.icon ?? "🛒"}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getCategoryName(category)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              প্রতি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* Sorting Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 mb-8 flex justify-end items-center shadow-sm">
          <label className="flex items-center gap-3 text-sm font-medium text-gray-600 cursor-pointer">
            সাজান
            <select
              className="select select-sm select-bordered bg-gray-50 border-gray-200 text-gray-700 focus:outline-none focus:border-[#0c8a43] focus:ring-1 focus:ring-[#0c8a43] min-w-[120px]"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              aria-label="পণ্যের দাম অনুযায়ী সাজান"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
          </label>
        </div>

        {categoryProducts.length === 0 ? (
          <EmptyState title="এই ক্যাটাগরিতে কোনো পণ্য নেই" />
        ) : (
          <div>
            {/* Product Count Text */}
            <p className="text-sm font-medium text-gray-500 mb-4 px-1">
              মোট {categoryProducts.length}টি পণ্য দেখানো হচ্ছে
            </p>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );}