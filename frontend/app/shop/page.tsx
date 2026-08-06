import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/api";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-heading text-3xl font-extrabold">متجر GLOSSIA</h1>
      <p className="mt-2 text-textmuted">منتجات أصلية للعناية بالشعر والبشرة واللحية.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
