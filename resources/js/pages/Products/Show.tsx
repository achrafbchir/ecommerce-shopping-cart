import CartController from '@/actions/App/Http/Controllers/CartController';
import { login } from '@/routes';
import { index, show } from '@/routes/products';
import { Form, Link, usePage } from '@inertiajs/react';
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
import { type SharedData } from '@/types';
import ShopLayout from '@/layouts/shop-layout';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
    image_url?: string;
}

interface ProductsShowProps {
    product: Product;
}

export default function ProductsShow({ product }: ProductsShowProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;
    const isOutOfStock = product.stock_quantity === 0;

    return (
        <ShopLayout title={product.name}>

            <div className="container mx-auto space-y-6 px-4 py-8">
                <Link
                    href={index().url}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to Products
                </Link>

                <Card>
                    {product.image_url && (
                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}
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
                        {isAuthenticated ? (
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
                        ) : (
                            <Button
                                asChild
                                disabled={isOutOfStock}
                                size="lg"
                                className="w-full"
                            >
                                <Link href={login().url}>
                                    <ShoppingCart className="size-4" />
                                    <span className="ml-2">Login to Add to Cart</span>
                                </Link>
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </ShopLayout>
    );
}

