
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import {
  getProductBySlug,
  formatPrice,
  getProductEmoji,
} from "@/lib/bazardor";

export default async function ProductPage({ params }) {
  const { slug } = await params;



const product = await getProductBySlug(decodeURIComponent(slug));
if (!product) {
  notFound();
}
const session = await auth.api.getSession({
  headers: await headers(),
});
if (!session) {
  redirect(
    `/signin?callbackURL=${encodeURIComponent(`/product/${slug}`)}`
  );
}


  const marketPrices = (product.markets || [])
    .map((market) => {
      const min = Number(
        market.min ?? market.minimum ?? market.minPrice ?? market.price
      );
      const max = Number(
        market.max ?? market.maximum ?? market.maxPrice ?? market.price
      );

      return {
        name:
          market.nameBn ??
          market.marketNameBn ??
          market.name ??
          market.marketName ??
          "স্থানীয় বাজার",
        min: Number.isFinite(min) ? min : null,
        max: Number.isFinite(max) ? max : null,
      };
    })
    .filter((market) => market.min !== null || market.max !== null);

  const allPrices = marketPrices.flatMap((market) =>
    [market.min, market.max].filter(
      (price) => price !== null && price > 0
    )
  );

  const minPrice = allPrices.length
    ? Math.min(...allPrices)
    : product.price;

  const maxPrice = allPrices.length
    ? Math.max(...allPrices)
    : product.price;

  const averagePrice = allPrices.length
    ? allPrices.reduce((sum, price) => sum + price, 0) /
      allPrices.length
    : product.price;

  const change = Number(product.changePercent) || 0;
  const changeColor =
    change > 0
      ? "text-rose-600"
      : change < 0
        ? "text-emerald-600"
        : "text-base-content/60";

  return (
    <main className="min-h-screen bg-base-200 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-success hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </Link>

        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-6 p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-success/10 text-6xl">
                {getProductEmoji(product)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="badge badge-success badge-outline">
                    {product.categoryName || product.category || "পণ্য"}
                  </span>
                  <span className="badge badge-ghost">
                    {product.unit}
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold sm:text-4xl">
                  {product.name}
                </h1>

                <p className="mt-2 text-sm text-base-content/60">
                  বিভিন্ন বাজারের দামের তথ্য এক নজরে দেখুন।
                </p>

                <p className="mt-4 text-sm text-base-content/60">
                  আজকের দাম
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <p className="text-3xl font-extrabold text-success">
                    {formatPrice(product.price)} টাকা
                  </p>
                  <span className={`text-sm font-bold ${changeColor}`}>
                    {change > 0 ? "▲" : change < 0 ? "▼" : "—"}{" "}
                    {formatPrice(Math.abs(change))}%
                  </span>
                </div>

                {product.previousPrice !== null && (
                  <p className="mt-2 text-sm text-base-content/60">
                    গতকালের দাম: {formatPrice(product.previousPrice)} টাকা
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-extrabold">
            দাম সংক্ষেপে
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                title: "সর্বনিম্ন দাম",
                value: minPrice,
                style: "text-emerald-600",
              },
              {
                title: "সর্বোচ্চ দাম",
                value: maxPrice,
                style: "text-rose-600",
              },
              {
                title: "গড় দাম",
                value: averagePrice,
                style: "text-success",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body p-5">
                  <p className="text-sm text-base-content/60">
                    {item.title}
                  </p>
                  <p className={`text-2xl font-extrabold ${item.style}`}>
                    {item.value === null || item.value === undefined
                      ? "তথ্য নেই"
                      : `${formatPrice(item.value)} টাকা`}
                  </p>
                  <p className="text-xs text-base-content/50">
                    বাজারের উপলব্ধ দামের ভিত্তিতে
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-2xl font-extrabold">
              বাজারভিত্তিক আজকের দাম
            </h2>
            <p className="mt-1 text-sm text-base-content/60">
              বাজারভেদে দামের পার্থক্য দেখুন।
            </p>
          </div>

          {marketPrices.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>বাজার</th>
                    <th>সর্বনিম্ন দাম</th>
                    <th>সর্বোচ্চ দাম</th>
                  </tr>
                </thead>
                <tbody>
                  {marketPrices.map((market, index) => (
                    <tr key={`${market.name}-${index}`}>
                      <td className="font-semibold">{market.name}</td>
                      <td>
                        {market.min === null
                          ? "তথ্য নেই"
                          : `${formatPrice(market.min)} টাকা`}
                      </td>
                      <td>
                        {market.max === null
                          ? "তথ্য নেই"
                          : `${formatPrice(market.max)} টাকা`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center">
              <div className="text-4xl">🏪</div>
              <p className="mt-3 font-bold">
                বাজারভিত্তিক তথ্য পাওয়া যায়নি
              </p>
              <p className="mt-1 text-sm text-base-content/60">
                এই পণ্যের API-তে আলাদা বাজারের দাম দেওয়া নেই।
              </p>
            </div>
          )}
        </section>

        <p className="mt-8 text-xs text-base-content/50">
          দ্রষ্টব্য: প্রদর্শিত দাম API-তে থাকা তথ্যের ওপর নির্ভরশীল।
          বাজারের প্রকৃত দাম পরিবর্তিত হতে পারে।
        </p>
      </div>
    </main>
  );
}
