
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/home/ProductCard";
import { getProducts } from "@/lib/bazardor";

function ProductSkeleton() {
  return (
    <div className="card border border-base-200 bg-base-100">
      <div className="card-body gap-4 p-5">
        <div className="skeleton h-16 w-16 rounded-2xl" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton mt-3 h-8 w-2/3" />
      </div>
    </div>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  loading,
  error,
  emptyMessage,
  id,
}) {
  return (
    <section
      id={id}
      className="scroll-mt-44 py-10 sm:py-14"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 text-sm text-base-content/60 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-warning">
          <span>{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-300 p-8 text-center">
          <p className="text-base-content/70">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={`${product.id || product.slug}-${index}`}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "দুঃখিত, পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।"
          );
          console.error("Product loading error:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const risers = [...products]
    .filter((product) => product.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => product.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-base-100">
      {/* Hero / Banner */}
      <section className="overflow-hidden bg-gradient-to-br from-success/10 via-base-100 to-warning/10">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
          <div>
            <div className="badge badge-success badge-outline mb-5 gap-2 px-3 py-4 font-semibold">
              🇧🇩 আপনার প্রতিদিনের বাজার সঙ্গী
            </div>

            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              প্রতিদিনের বাজারদর,
              <span className="mt-2 block text-success">
                এক নজরে
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-base-content/70 sm:text-lg">
              চাল, ডাল, সবজি, মাছ ও নিত্যপ্রয়োজনীয়
              পণ্যের দাম জানুন সহজেই। বাজারে যাওয়ার
              আগেই জেনে নিন আজকের সম্ভাব্য বাজারদর।
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#সব-পণ্য"
                className="btn btn-success btn-md text-white sm:btn-lg"
              >
                সব পণ্যের দাম দেখুন
                <span aria-hidden="true">→</span>
              </a>

              <span className="text-sm text-base-content/60">
                সহজ • দ্রুত • বাংলা
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-base-content/70">
              <span>✓ সহজে দাম দেখুন</span>
              <span>✓ পরিবর্তন বুঝুন</span>
              <span>✓ পণ্য অনুযায়ী খুঁজুন</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-success/10 blur-3xl" />

            <Image
              src="/hero.png"
              alt="বাজারের নিত্যপ্রয়োজনীয় পণ্য"
              width={700}
              height={560}
              priority
              className="relative h-auto max-h-[440px] w-full object-contain"
            />

            <div className="absolute bottom-2 left-2 rounded-2xl border border-base-200 bg-base-100/95 p-3 shadow-lg sm:bottom-5 sm:left-0 sm:p-4">
              <p className="text-xs text-base-content/60">
                বাজারদর দেখুন
              </p>
              <p className="mt-1 font-bold text-success">
                আপনার সুবিধামতো
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product sections */}
      <div className="mx-auto max-w-6xl px-4">
        <ProductSection
          id="দাম-বেড়েছে"
          title="আজ দাম বেড়েছে ▲"
          subtitle="যেসব পণ্যের দাম তুলনামূলক বেড়েছে"
          products={risers}
          loading={loading}
          error={error}
          emptyMessage="দাম বৃদ্ধির তথ্য এখন পাওয়া যাচ্ছে না।"
        />

        <div className="border-t border-base-200" />

        <ProductSection
          id="দাম-কমেছে"
          title="আজ দাম কমেছে ▼"
          subtitle="যেসব পণ্যের দাম তুলনামূলক কমেছে"
          products={fallers}
          loading={loading}
          error={error}
          emptyMessage="দাম কমার তথ্য এখন পাওয়া যাচ্ছে না।"
        />

        <div className="border-t border-base-200" />

        <ProductSection
          id="সব-পণ্য"
          title="সব পণ্য"
          subtitle="নিত্যপ্রয়োজনীয় পণ্যের সম্ভাব্য দাম এক জায়গায় দেখুন।"
          products={products}
          loading={loading}
          error={error}
          emptyMessage="এখন কোনো পণ্য পাওয়া যায়নি।"
        />
      </div>
    </main>
  );
}
