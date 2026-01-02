import { index as productsIndex } from '@/routes/products';
import { Link } from '@inertiajs/react';
import { ArrowRight, ShoppingBag } from 'lucide-react';

import ProductCard from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import ShopLayout from '@/layouts/shop-layout';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
    image_url?: string;
}

interface HomeProps {
    featuredProducts?: Product[];
}

export default function Home({ featuredProducts = [] }: HomeProps) {
    return (
        <ShopLayout title="Home">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/10 to-background py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Welcome to Our Store
                        </h1>
                        <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                            Discover amazing products at unbeatable prices. Shop
                            with confidence and enjoy fast, reliable delivery.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Button size="lg" asChild>
                                <Link href={productsIndex().url}>
                                    Shop Now
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href={productsIndex().url}>Browse Products</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold">Featured Products</h2>
                                <p className="mt-2 text-muted-foreground">
                                    Handpicked selections just for you
                                </p>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href={productsIndex().url}>
                                    View All
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Empty State */}
            {featuredProducts.length === 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                            <ShoppingBag className="mb-4 size-12 text-muted-foreground" />
                            <h3 className="mb-2 text-xl font-semibold">No Products Yet</h3>
                            <p className="mb-4 text-muted-foreground">
                                Check back soon for amazing products!
                            </p>
                            <Button asChild>
                                <Link href={productsIndex().url}>Browse All Products</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </ShopLayout>
    );
}

