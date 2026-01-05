import { index } from '@/routes/cart';
import { index as productsIndex, show } from '@/routes/products';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import {
    Home,
    Package,
    ShoppingBag,
    ShoppingCart,
    TrendingUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
    image_url?: string;
}

interface CartItem {
    id: number;
    quantity: number;
    total_price: number;
    product: Product;
}

interface DashboardProps {
    cartItems: CartItem[];
    cartTotal: number;
    cartCount: number;
    featuredProducts: Product[];
}

export default function Dashboard({
    cartItems,
    cartTotal,
    cartCount,
    featuredProducts,
}: DashboardProps) {
    const hasCartItems = cartItems.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome Back!</h1>
                        <p className="text-muted-foreground">
                            Here's an overview of your account
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={home().url}>
                            <Home className="mr-2 size-4" />
                            Back to Shop
                        </Link>
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cart Items
                            </CardTitle>
                            <ShoppingCart className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{cartCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Items in your cart
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cart Total
                            </CardTitle>
                            <TrendingUp className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${cartTotal.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total cart value
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Quick Actions
                            </CardTitle>
                            <Package className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={productsIndex().url}>
                                        Browse Products
                                    </Link>
                                </Button>
                                {hasCartItems && (
                                    <Button asChild size="sm">
                                        <Link href={index().url}>View Cart</Link>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cart Summary */}
                {hasCartItems ? (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Shopping Cart</CardTitle>
                                    <CardDescription>
                                        {cartItems.length} item(s) in your cart
                                    </CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href={index().url}>
                                        <ShoppingBag className="mr-2 size-4" />
                                        View Full Cart
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead className="text-right">
                                                Total
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cartItems.slice(0, 5).map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {item.product.image_url && (
                                                            <img
                                                                src={item.product.image_url}
                                                                alt={item.product.name}
                                                                className="size-10 rounded object-cover"
                                                            />
                                                        )}
                                                        <Link
                                                            href={show(
                                                                item.product.id
                                                            ).url}
                                                            className="font-medium hover:underline"
                                                        >
                                                            {item.product.name}
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell>
                                                    $
                                                    {parseFloat(
                                                        item.product.price
                                                    ).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    ${item.total_price.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {cartItems.length > 5 && (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    And {cartItems.length - 5} more item(s)...
                                </p>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total
                                </p>
                                <p className="text-2xl font-bold">
                                    ${cartTotal.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <Button asChild>
                                <Link href={index().url}>Go to Cart</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ShoppingCart className="mb-4 size-12 text-muted-foreground" />
                            <CardTitle className="mb-2">
                                Your cart is empty
                            </CardTitle>
                            <CardDescription className="mb-4">
                                Start shopping to add items to your cart
                            </CardDescription>
                            <Button asChild>
                                <Link href={productsIndex().url}>
                                    Browse Products
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recommended Products</CardTitle>
                                    <CardDescription>
                                        Products you might be interested in
                                    </CardDescription>
                                </div>
                                <Button variant="outline" asChild>
                                    <Link href={productsIndex().url}>
                                        View All
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {featuredProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={show(product.id).url}
                                        className="group"
                                    >
                                        <Card className="overflow-hidden transition-shadow hover:shadow-md">
                                            {product.image_url && (
                                                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader>
                                                <CardTitle className="line-clamp-2 text-lg">
                                                    {product.name}
                                                </CardTitle>
                                                <CardDescription className="text-lg font-semibold text-foreground">
                                                    $
                                                    {parseFloat(
                                                        product.price
                                                    ).toFixed(2)}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
