import CartController from '@/actions/App/Http/Controllers/CartController';
import { login } from '@/routes';
import { show } from '@/routes/products';
import { Form, Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

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

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
    image_url?: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;
    const isOutOfStock = product.stock_quantity === 0;

    return (
        <Card className="flex flex-col overflow-hidden">
            {product.image_url && (
                <Link href={show(product.id).url} className="block">
                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                </Link>
            )}
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                    <StockBadge stockQuantity={product.stock_quantity} />
                </div>
                <CardDescription className="text-lg font-semibold text-foreground">
                    ${parseFloat(product.price).toFixed(2)}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                    Stock: {product.stock_quantity} units
                </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Link
                    href={show(product.id).url}
                    className="w-full"
                >
                    <Button variant="outline" className="w-full">
                        View Details
                    </Button>
                </Link>
                {isAuthenticated ? (
                    <Form
                        {...CartController.store.form()}
                        className="w-full"
                    >
                        <input type="hidden" name="product_id" value={product.id} />
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Label htmlFor={`quantity-${product.id}`} className="sr-only">
                                    Quantity
                                </Label>
                                <Input
                                    id={`quantity-${product.id}`}
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
                                className="shrink-0"
                            >
                                <ShoppingCart className="size-4" />
                                <span className="sr-only md:not-sr-only md:ml-2">
                                    Add to Cart
                                </span>
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <Button
                        asChild
                        disabled={isOutOfStock}
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
    );
}

