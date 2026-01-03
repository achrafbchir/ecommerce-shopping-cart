import AdminProductController from '@/actions/App/Http/Controllers/Admin/AdminProductController';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

import StockBadge from '@/components/products/stock-badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
    image_url?: string;
}

interface ShowProductProps {
    product: Product;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Products',
        href: '/admin/products',
    },
    {
        title: 'Product Details',
        href: '#',
    },
];

export default function ShowProduct({ product }: ShowProductProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = () => {
        router.delete(AdminProductController.destroy.url(product.id), {
            onSuccess: () => {
                router.visit('/admin/products');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/products">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{product.name}</h1>
                            <p className="text-muted-foreground">
                                Product details and information
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                                <Edit className="mr-2 size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Product Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
                                    <p className="text-muted-foreground">No image</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Product Name
                                </p>
                                <p className="text-lg font-semibold">{product.name}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Price
                                </p>
                                <p className="text-2xl font-bold">
                                    ${parseFloat(product.price).toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Stock Quantity
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <p className="text-lg font-semibold">
                                        {product.stock_quantity} units
                                    </p>
                                    <StockBadge stockQuantity={product.stock_quantity} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Delete Product</CardTitle>
                                <CardDescription>
                                    Are you sure you want to delete &quot;{product.name}&quot;?
                                    This action cannot be undone.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDelete}>
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

