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

    const minValid = Number.isFinite(min) ? min : null;
    const maxValid = Number.isFinite(max) ? max : null;

    let avg = null;

    if (minValid !== null && maxValid !== null) {
      avg = (minValid + maxValid) / 2;
    } else if (minValid !== null) {
      avg = minValid;
    } else if (maxValid !== null) {
      avg = maxValid;
    }

    return {
      name:
        market.market ??
        market.nameBn ??
        market.marketNameBn ??
        market.name ??
        market.marketName ??
        "স্থানীয় বাজার",

      division:
        market.divisionBn ??
        market.division ??
        "-",

      min: minValid,
      max: maxValid,
      avg,
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
  
  // দামের পার্থক্য এবং টেক্সট নির্ধারণ
  const previousPrice = product.previousPrice ?? product.price;
  const priceDiff = Math.abs(product.price - previousPrice);
  const changeStatusText = change > 0 ? "বেড়েছে" : change < 0 ? "কমেছে" : "অপরিবর্তিত আছে";

  const changeColor =
    change > 0
      ? "text-[#e11d48]" // Red for price increase
      : change < 0
        ? "text-[#059669]" // Green for price decrease
        : "text-gray-600";

  const categoryName = product.categoryName || product.category || "পণ্য";

  return (
    <main className="min-h-screen bg-[#f4f7f5] px-4 py-6 sm:py-10 font-sans">
      <div className="mx-auto max-w-6xl">
        
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm font-medium text-gray-500 gap-2">
          <Link href="/" className="hover:text-black transition-colors">
            হোম
          </Link>
          <span>›</span>
          <span className="cursor-default">{categoryName}</span>
          <span>›</span>
          <span className="text-black">{product.name}</span>
        </div>

        {/* Product overview Card */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-8">
          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-5">
              {/* Product Emoji/Image Box */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#f0f3f1] text-5xl">
                {getProductEmoji(product)}
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 mb-3">
                  প্রতি {product.unit} · {categoryName}
                </p>
                <p className="text-sm text-gray-700">
                  গতকালের তুলনায় আজ দাম <span className="font-semibold">{changeStatusText}</span> {priceDiff > 0 && `· ${formatPrice(priceDiff)} টাকা`}
                </p>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#f2f7f4] rounded-2xl p-5 min-w-[140px] text-center shrink-0">
              <p className="text-xs font-medium text-gray-500 mb-1">আজকের দাম</p>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatPrice(product.price)}
              </div>
              <p className="text-xs text-gray-500 mb-2">টাকা / {product.unit}</p>
              {change !== 0 && (
                <div className={`text-sm font-bold ${changeColor}`}>
                  {change > 0 ? "▲" : "▼"} {formatPrice(Math.abs(change))}%
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Price summary */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                title: "সর্বনিম্ন দাম",
                value: minPrice,
                style: "text-[#059669]", // Green
                subtitle: "সবচেয়ে কম দামের বাজার",
              },
              {
                title: "সর্বোচ্চ দাম",
                value: maxPrice,
                style: "text-[#e11d48]", // Red
                subtitle: "সবচেয়ে বেশি দামের বাজার",
              },
              {
                title: "গড় দাম",
                value: averagePrice,
                style: "text-[#059669]", // Green
                subtitle: `প্রতি ${product.unit}-এর হিসাবে`,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col justify-center"
              >
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {item.title}
                </p>
                <p className={`text-2xl font-bold ${item.style} mb-1`}>
                  {item.value === null || item.value === undefined
                    ? "তথ্য নেই"
                    : `${formatPrice(item.value)} টাকা`}
                </p>
                <p className="text-xs text-gray-500">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Market-wise prices */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              বাজারভিত্তিক আজকের দাম
            </h2>
          </div>

          {marketPrices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium">
                    <th className="py-3 px-4 font-medium w-1/4">বাজার</th>
                    <th className="py-3 px-4 font-medium w-1/4">বিভাগ</th>
                    <th className="py-3 px-4 font-medium">সর্বনিম্ন</th>
                    <th className="py-3 px-4 font-medium">সর্বোচ্চ</th>
                    <th className="py-3 px-4 font-medium text-right">গড়</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 font-medium">
                  {marketPrices.map((market, index) => (
                    <tr
                      key={`${market.name}-${index}`}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-4">{market.name}</td>
                      <td className="py-4 px-4 text-gray-500">{market.division}</td>
                      <td className="py-4 px-4">
                        {market.min === null
                          ? "তথ্য নেই"
                          : `${formatPrice(market.min)} টাকা`}
                      </td>
                      <td className="py-4 px-4">
                        {market.max === null
                          ? "তথ্য নেই"
                          : `${formatPrice(market.max)} টাকা`}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {market.avg === null
                          ? "তথ্য নেই"
                          : `${formatPrice(market.avg)} টাকা`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
              <div className="text-4xl mb-3">🏪</div>
              <p className="font-bold text-gray-800">
                বাজারভিত্তিক তথ্য পাওয়া যায়নি
              </p>
              <p className="mt-1 text-sm text-gray-500">
                এই পণ্যের API-তে আলাদা বাজারের দাম দেওয়া নেই।
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}