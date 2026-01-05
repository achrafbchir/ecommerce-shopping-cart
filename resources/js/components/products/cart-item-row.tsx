import CartController from '@/actions/App/Http/Controllers/CartController';
import { destroy, update } from '@/routes/cart';
import { Form, Link, router } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';

import StockBadge from '@/components/products/stock-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    TableBody,
    TableCell,
    TableRow,
} from '@/components/ui/table';

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

interface CartItemRowProps {
    cartItem: CartItem;
}

export default function CartItemRow({ cartItem }: CartItemRowProps) {
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > cartItem.product.stock_quantity) {
            return;
        }

        router.put(
            update(cartItem.id).url,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                preserveState: false,
            }
        );
    };

    return (
        <TableRow>
            <TableCell>
                <Link
                    href={`/products/${cartItem.product.id}`}
                    className="font-medium hover:underline"
                >
                    {cartItem.product.name}
                </Link>
            </TableCell>
            <TableCell>
                <StockBadge stockQuantity={cartItem.product.stock_quantity} />
            </TableCell>
            <TableCell>
                ${parseFloat(cartItem.product.price).toFixed(2)}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                        disabled={cartItem.quantity <= 1}
                    >
                        <Minus className="size-4" />
                    </Button>
                    <Input
                        type="number"
                        min="1"
                        max={cartItem.product.stock_quantity}
                        value={cartItem.quantity}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value)) {
                                handleQuantityChange(value);
                            }
                        }}
                        className="w-20 text-center"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                        disabled={
                            cartItem.quantity >= cartItem.product.stock_quantity
                        }
                    >
                        <Plus className="size-4" />
                    </Button>
                </div>
            </TableCell>
            <TableCell className="font-medium">
                $
                {(
                    parseFloat(cartItem.product.price) * cartItem.quantity
                ).toFixed(2)}
            </TableCell>
            <TableCell>
                <Form
                    action={CartController.destroy.url(cartItem.id)}
                    method="delete"
                >
                    <Button
                        type="submit"
                        variant="destructive"
                        size="icon"
                    >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Remove</span>
                    </Button>
                </Form>
            </TableCell>
        </TableRow>
    );
}

