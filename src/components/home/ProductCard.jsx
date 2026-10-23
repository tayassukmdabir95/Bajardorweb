
import Link from "next/link";
import {
  formatPrice,
  getProductEmoji,
} from "@/lib/bazardor";

export default function ProductCard({ product }) {
  const change = Number(product.changePercent ?? 0);

  const changeStyle =
    change > 0
      ? "bg-rose-50 text-rose-700"
      : change < 0
        ? "bg-emerald-50 text-emerald-700"
        : "bg-gray-100 text-gray-700";

  const changeSymbol =
    change > 0 ? "▲" : change < 0 ? "▼" : "—";

  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug || product.id)}`}
      className="card h-full border border-gray-200 bg-white text-gray-900 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-400 hover:shadow-lg"
    >
      <div className="card-body gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-4xl">
            {getProductEmoji(product)}
          </div>

          <span
            className={`badge border-0 px-3 py-3 text-xs font-bold ${changeStyle}`}
          >
            {changeSymbol} {formatPrice(Math.abs(change))}%
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug text-gray-900">
            {product.name}
          </h3>

          <p className="mt-1 text-sm font-medium text-gray-700">
            {product.unit}
          </p>
        </div>

        <div className="mt-auto border-t border-gray-200 pt-3">
          <p className="text-sm font-medium text-gray-700">
            আজকের দাম
          </p>

          <p className="mt-1 text-xl font-extrabold text-green-700">
            {formatPrice(product.price)} টাকা
          </p>
        </div>
      </div>
    </Link>
  );
}
