import CartController from '@/actions/App/Http/Controllers/CartController';
import { checkout, index } from '@/routes/cart';
import { Form } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

import CartItemRow from '@/components/products/cart-item-row';
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
import ShopLayout from '@/layouts/shop-layout';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
}

interface CartItem {
    id: number;
    quantity: number;
    product: Product;
    total_price: string;
}

interface CartIndexProps {
    cartItems: CartItem[];
    total: string;
}

export default function CartIndex({ cartItems, total }: CartIndexProps) {
    const isEmpty = cartItems.length === 0;

    return (
        <ShopLayout title="Shopping Cart">

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div>
                    <h1 className="text-3xl font-bold">Shopping Cart</h1>
                    <p className="mt-2 text-muted-foreground">
                        Review your items and proceed to checkout
                    </p>
                </div>

                {isEmpty ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ShoppingBag className="mb-4 size-12 text-muted-foreground" />
                            <CardTitle className="mb-2">Your cart is empty</CardTitle>
                            <CardDescription className="mb-4">
                                Start shopping to add items to your cart
                            </CardDescription>
                            <Button asChild>
                                <a href="/products">Browse Products</a>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cart Items</CardTitle>
                                    <CardDescription>
                                        {cartItems.length} item(s) in your cart
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Stock</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead className="w-[100px]">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cartItems.map((cartItem) => (
                                                <CartItemRow
                                                    key={cartItem.id}
                                                    cartItem={cartItem}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Subtotal
                                        </span>
                                        <span className="font-medium">
                                            ${parseFloat(total).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span>${parseFloat(total).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Form
                                        {...CartController.checkout.form()}
                                        className="w-full"
                                    >
                                        <input type="hidden" name="confirm" value="1" />
                                        <Button type="submit" className="w-full" size="lg">
                                            Checkout
                                        </Button>
                                    </Form>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}

