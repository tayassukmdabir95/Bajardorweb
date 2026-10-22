
const API_BASE =
  "https://openapi.programming-hero.com/api/bazardor";

export async function getProducts() {
  const response = await fetch(`${API_BASE}/products`);

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  const result = await response.json();

  const products = Array.isArray(result)
    ? result
    : Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result?.products)
        ? result.products
        : [];

  return products.map(normalizeProduct);
}

export async function getProductBySlug(slug) {
  const products = await getProducts();

  return products.find(
    (product) =>
      product.slug === String(slug) ||
      product.id === String(slug)
  ) ?? null;
}

function firstValue(...values) {
  return values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== ""
  );
}

function normalizeUnit(unit) {
  const units = {
    kg: "প্রতি কেজি",
    gram: "প্রতি গ্রাম",
    g: "প্রতি গ্রাম",
    litre: "প্রতি লিটার",
    liter: "প্রতি লিটার",
    l: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pieces: "প্রতি পিস",
    pcs: "প্রতি পিস",
  };

  const value = String(unit ?? "").trim().toLowerCase();

  return units[value] || (value ? `প্রতি ${value}` : "একক উল্লেখ নেই");
}

export function normalizeProduct(product = {}) {
  const today = Number(product.today);
  const yesterday = Number(product.yesterday);

  // The API provides positive percentages and a direction separately.
  const rawPercent = Number(product.change?.pct ?? 0);
  const direction = product.change?.dir ?? "flat";

  const changePercent =
    direction === "down"
      ? -Math.abs(rawPercent)
      : direction === "up"
        ? Math.abs(rawPercent)
        : 0;

  return {
    ...product,

    id: String(
      firstValue(product.id, product._id, product.slug, "")
    ),

    slug: String(
      firstValue(product.slug, product.id, product._id, "")
    ),

    name: String(
      firstValue(
        product.nameBn,
        product.name,
        product.title,
        "নাম পাওয়া যায়নি"
      )
    ),

    category: String(
      firstValue(product.category, product.categorySlug, "")
    ),

    categoryName: String(
      firstValue(
        product.categoryNameBn,
        product.categoryName,
        product.category,
        ""
      )
    ),

    categoryIcon: String(product.categoryIcon ?? "🛒"),

    unit: normalizeUnit(product.unit),

    // In this API, the emoji is stored in "image".
    emoji: String(
      firstValue(product.image, product.emoji, product.icon, "🛒")
    ),

    // Use the real API price fields.
    price: Number.isFinite(today) ? today : null,
    previousPrice: Number.isFinite(yesterday) ? yesterday : null,

    changePercent: Number.isFinite(changePercent)
      ? changePercent
      : 0,

    changeDirection: direction,

    // Keep historical prices and market data available for detail pages.
    lastWeek: product.lastWeek ?? null,
    lastMonth: product.lastMonth ?? null,
    markets: Array.isArray(product.markets)
      ? product.markets
      : [],
  };
}

export function toBanglaNumber(value) {
  return String(value).replace(
    /\d/g,
    (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]
  );
}

export function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "তথ্য নেই";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "তথ্য নেই";
  }

  return toBanglaNumber(
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(number)
  );
}

export function getProductEmoji(product = {}) {
  const suppliedEmoji = product.emoji;

  if (
    suppliedEmoji &&
    suppliedEmoji !== "undefined" &&
    suppliedEmoji !== "null"
  ) {
    return suppliedEmoji;
  }

  const text =
    `${product.name ?? ""} ${product.category ?? ""}`.toLowerCase();

  if (/চাল|rice|chal/.test(text)) return "🍚";
  if (/ডাল|lentil|dal/.test(text)) return "🫘";
  if (/তেল|oil|tel/.test(text)) return "🫙";
  if (/আলু|potato|alu/.test(text)) return "🥔";
  if (/পেঁয়াজ|পিয়াজ|পেঁয়াজ|onion|peyaj/.test(text)) return "🧅";
  if (/মরিচ|মসলা|chili|spice|mosla/.test(text)) return "🌶️";
  if (/মাছ|fish|mach/.test(text)) return "🐟";
  if (/মাংস|chicken|meat|mangsho/.test(text)) return "🍗";
  if (/ডিম|egg|dim/.test(text)) return "🥚";
  if (/আদা|ginger/.test(text)) return "🫚";
  if (/রসুন|garlic/.test(text)) return "🧄";
  if (/সবজি|vegetable|sobji/.test(text)) return "🥬";

  return "🛒";
}
