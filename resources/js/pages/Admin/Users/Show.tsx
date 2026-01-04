import AdminUserController from '@/actions/App/Http/Controllers/Admin/AdminUserController';
import { router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Mail,
    ShoppingCart,
    Trash2,
    User,
    UserCheck,
    UserX,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
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

interface Product {
    id: number;
    name: string;
    price: string;
    image_url?: string;
}

interface CartItem {
    id: number;
    quantity: number;
    total_price: number;
    product: Product;
}

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    cart_items_count: number;
}

interface UserShowProps {
    user: User;
    cartItems: CartItem[];
    cartTotal: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
    {
        title: 'User Details',
        href: '#',
    },
];

export default function UserShow({
    user,
    cartItems,
    cartTotal,
}: UserShowProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        router.delete(AdminUserController.destroy.url(user.id), {
            onSuccess: () => {
                router.visit('/admin/users');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <a href="/admin/users">
                                <ArrowLeft className="mr-2 size-4" />
                                Back to Users
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">User Details</h1>
                            <p className="text-muted-foreground">
                                View and manage user information
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={() => setDeleteId(user.id)}
                    >
                        <Trash2 className="mr-2 size-4" />
                        Delete User
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* User Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                            <CardDescription>
                                Basic user account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                                    <User className="size-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {user.name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                                    <Mail className="size-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                                    {user.email_verified_at ? (
                                        <UserCheck className="size-6 text-green-600" />
                                    ) : (
                                        <UserX className="size-6 text-yellow-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Email Status
                                    </p>
                                    {user.email_verified_at ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                            <UserCheck className="size-4" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                            <UserX className="size-4" />
                                            Unverified
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                                    <Calendar className="size-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Registered
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {new Date(
                                            user.created_at
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cart Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cart Summary</CardTitle>
                            <CardDescription>
                                Current shopping cart status
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                                    <ShoppingCart className="size-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Cart Items
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {cartItems.length} item
                                        {cartItems.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                                    <span className="text-lg font-bold text-primary">
                                        $
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Value
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {cartTotal.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cart Items */}
                {cartItems.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Cart Items</CardTitle>
                            <CardDescription>
                                Products in the user&apos;s shopping cart
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead className="text-right">
                                                Total
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cartItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {item.product.image_url && (
                                                            <img
                                                                src={
                                                                    item.product
                                                                        .image_url
                                                                }
                                                                alt={
                                                                    item.product
                                                                        .name
                                                                }
                                                                className="size-12 rounded object-cover"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-medium">
                                                                {
                                                                    item.product
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    $
                                                    {parseFloat(
                                                        item.product.price
                                                    ).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    $
                                                    {item.total_price.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Delete Confirmation Dialog */}
                {deleteId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Delete User</CardTitle>
                                <CardDescription>
                                    Are you sure you want to delete{' '}
                                    <strong>{user.name}</strong>? This action
                                    cannot be undone and will also delete all
                                    associated cart items.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteId(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

