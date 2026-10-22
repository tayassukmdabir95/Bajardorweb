
import CategoryProducts from "@/components/category/CategoryProducts";

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  return <CategoryProducts slug={decodeURIComponent(slug)} />;
}
