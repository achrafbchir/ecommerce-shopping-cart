import { index } from '@/routes/products';
import { Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';

import ProductCard from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ShopLayout from '@/layouts/shop-layout';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface ProductsIndexProps {
    products: PaginatedProducts;
    filters: {
        search?: string;
    };
}

export default function ProductsIndex({
    products,
    filters,
}: ProductsIndexProps) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;

        router.get(index().url, { search: search || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <ShopLayout title="Products">

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">All Products</h1>
                        <p className="mt-2 text-muted-foreground">
                            Browse our complete collection of products
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            name="search"
                            type="search"
                            placeholder="Search products..."
                            defaultValue={filters.search}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit">Search</Button>
                </form>

                {products.data.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-12 text-center">
                        <p className="text-muted-foreground">
                            No products found. Try adjusting your search.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {products.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {products.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        disabled={!link.url || link.active}
                                        className={`
                                            rounded-md px-3 py-2 text-sm font-medium
                                            ${
                                                link.active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : link.url
                                                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                                      : 'cursor-not-allowed opacity-50'
                                            }
                                        `}
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </ShopLayout>
    );
}

