
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Suspense } from 'react';
import ProductsClientPage from './ProductsClientPage';

export default function AllProductsPage() {

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8">
         <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-4xl font-headline font-bold text-foreground mt-4">
          All Products
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Browse our entire collection of unique and thoughtful gifts.
        </p>
      </header>
      <Suspense>
        <ProductsClientPage />
      </Suspense>
    </div>
  );
}
