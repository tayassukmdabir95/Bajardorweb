
const API_BASE =
  "https://openapi.programming-hero.com/api/bazardor";

export async function getProducts() {
  const response = await fetch(`${API_BASE}/products`);

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  const result = await response.json();

  // APIs may return an array directly or wrap it in "data".
  const products = Array.isArray(result)
    ? result
    : Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result?.products)
        ? result.products
        : [];

  return products.map(normalizeProduct);
}

function firstValue(...values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== ""
  );
}

export function normalizeProduct(product) {
  const currentPrice = Number(
    firstValue(
      product.currentPrice,
      product.todayPrice,
      product.priceToday,
      product.price,
      product.averagePrice,
      product.minPrice,
      product.min_price,
      0
    )
  );

  const previousPrice = Number(
    firstValue(
      product.previousPrice,
      product.previous_price,
      product.yesterdayPrice,
      product.yesterday_price,
      product.oldPrice,
      currentPrice
    )
  );

  const suppliedChange = firstValue(
    product.changePercent,
    product.change_percent,
    product.priceChangePercent,
    product.price_change_percent
  );

  const changePercent =
    suppliedChange !== undefined
      ? Number(suppliedChange)
      : previousPrice !== 0
        ? ((currentPrice - previousPrice) / previousPrice) * 100
        : 0;

  return {
    ...product,
    id: String(firstValue(product.id, product._id, product.slug, "")),
    slug: String(
      firstValue(
        product.slug,
        product.id,
        product._id,
        ""
      )
    ),
    name: String(
      firstValue(
        product.nameBn,
        product.name_bn,
        product.name,
        product.title,
        product.productName,
        product.product_name,
        "নাম পাওয়া যায়নি"
      )
    ),
    category: String(
      firstValue(
        product.categorySlug,
        product.category_slug,
        product.categoryId,
        product.category_id,
        product.category,
        product.categoryName,
        ""
      )
    ),
    unit: String(
      firstValue(
        product.unitBn,
        product.unit_bn,
        product.unit,
        product.unitName,
        product.unit_name,
        "প্রতি কেজি"
      )
    ),
    emoji: String(
      firstValue(
        product.emoji,
        product.icon,
        product.imageEmoji,
        product.image_emoji,
        ""
      )
    ),
    price: Number.isFinite(currentPrice) ? currentPrice : 0,
    changePercent: Number.isFinite(changePercent)
      ? changePercent
      : 0,
  };
}

export function toBanglaNumber(value) {
  return String(value).replace(
    /\d/g,
    (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]
  );
}

export function formatPrice(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return "০";

  return toBanglaNumber(
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(number)
  );
}

export function getProductEmoji(product) {
  if (product.emoji) return product.emoji;

  const text = `${product.name} ${product.category}`.toLowerCase();

  if (/চাল|rice|chal/.test(text)) return "🍚";
  if (/ডাল|lentil|dal/.test(text)) return "🫘";
  if (/তেল|oil|tel/.test(text)) return "🫙";
  if (/আলু|potato|alu/.test(text)) return "🥔";
  if (/পেঁয়াজ|পিয়াজ|onion|peyaj/.test(text)) return "🧅";
  if (/মরিচ|মসলা|chili|spice|mosla/.test(text)) return "🌶️";
  if (/মাছ|fish|mach/.test(text)) return "🐟";
  if (/মাংস|chicken|meat|mangsho/.test(text)) return "🍗";
  if (/ডিম|egg|dim/.test(text)) return "🥚";
  if (/আদা|ginger/.test(text)) return "🫚";
  if (/রসুন|garlic/.test(text)) return "🧄";
  if (/সবজি|vegetable|sobji/.test(text)) return "🥬";

  return "🛒";
}
