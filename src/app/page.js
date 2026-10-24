
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/home/ProductCard";
import { getProducts } from "@/lib/bazardor";

function ProductSkeleton() {
  return (
    <div className="card border border-gray-200 bg-white">
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
    <section id={id} className="scroll-mt-44 py-7 sm:py-9">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm leading-6 text-gray-700 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-gray-900">
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-gray-700">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

  const bengaliDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <main className="min-h-screen bg-white">
     
      <section className="bg-[#f0f6f1] px-2 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 rounded-xl border border-gray-200 bg-white px-4 py-5 sm:grid-cols-[1.35fr_0.65fr] sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
        
          <div className="flex flex-col items-start justify-center">
           
            <div className="mb-3 inline-flex w-fit rounded-md bg-gray-100 px-2.5 py-1 text-sm font-semibold text-green-700">
              {bengaliDate}
            </div>

            <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-[42px]">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-700 sm:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="#সব-পণ্য"
                className="btn btn-success btn-sm border-0 px-4 text-white sm:btn-md"
              >
                সব পণ্য দেখুন
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

      
          <div className="flex items-center justify-center sm:justify-end">
            <Image
              src="/hero.png"
              alt="বাজারের নিত্যপ্রয়োজনীয় পণ্য"
              width={400}
              height={320}
              priority
              className="h-auto w-40 object-contain sm:w-48 lg:w-56"
            />
          </div>
        </div>
      </section>

    
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4">
        <ProductSection
          id="দাম-বেড়েছে"
          title="🔺 আজ দাম বেড়েছে"
          subtitle="যেসব পণ্যের দাম তুলনামূলক বেড়েছে"
          products={risers}
          loading={loading}
          error={error}
          emptyMessage="দাম বৃদ্ধির তথ্য এখন পাওয়া যাচ্ছে না।"
        />

        <div className="border-t border-gray-200" />

        <ProductSection
          id="দাম-কমেছে"
          title="▼ আজ দাম কমেছে"
          subtitle="যেসব পণ্যের দাম তুলনামূলক কমেছে"
          products={fallers}
          loading={loading}
          error={error}
          emptyMessage="দাম কমার তথ্য এখন পাওয়া যাচ্ছে না।"
        />

        <div className="border-t border-gray-200" />

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
