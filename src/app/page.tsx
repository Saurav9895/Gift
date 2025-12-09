import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/layout/HeroBanner';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
            Featured Gifts
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Handpicked for you, by us.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
