import CartController from '@/actions/App/Http/Controllers/CartController';
import { index, show } from '@/routes/products';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

import StockBadge from '@/components/products/stock-badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
}

interface ProductsShowProps {
    product: Product;
}

const breadcrumbs = (product: Product): BreadcrumbItem[] => [
    {
        title: 'Products',
        href: index().url,
    },
    {
        title: product.name,
        href: show(product.id).url,
    },
];

export default function ProductsShow({ product }: ProductsShowProps) {
    const isOutOfStock = product.stock_quantity === 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs(product)}>
            <Head title={product.name} />

            <div className="space-y-6">
                <Link
                    href={index().url}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to Products
                </Link>

                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-3xl">{product.name}</CardTitle>
                                <CardDescription className="mt-2 text-2xl font-semibold text-foreground">
                                    ${parseFloat(product.price).toFixed(2)}
                                </CardDescription>
                            </div>
                            <StockBadge stockQuantity={product.stock_quantity} />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Stock Information</h3>
                            <p className="text-muted-foreground">
                                Available: {product.stock_quantity} units
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Form
                            {...CartController.store.form()}
                            className="w-full"
                        >
                            <input type="hidden" name="product_id" value={product.id} />
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Label htmlFor="quantity" className="sr-only">
                                        Quantity
                                    </Label>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        min="1"
                                        max={product.stock_quantity}
                                        defaultValue="1"
                                        disabled={isOutOfStock}
                                        className="w-full"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isOutOfStock}
                                    size="lg"
                                    className="shrink-0"
                                >
                                    <ShoppingCart className="size-4" />
                                    <span className="ml-2">Add to Cart</span>
                                </Button>
                            </div>
                        </Form>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}

