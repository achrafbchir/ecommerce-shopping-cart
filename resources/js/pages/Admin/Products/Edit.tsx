import AdminProductController from '@/actions/App/Http/Controllers/Admin/AdminProductController';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import ProductForm from './Form';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
    image_url?: string;
    image_path?: string;
}

interface EditProductProps {
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
        title: 'Edit Product',
        href: '#',
    },
];

export default function EditProduct({ product }: EditProductProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/products">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Product</h1>
                        <p className="text-muted-foreground">
                            Update product information
                        </p>
                    </div>
                </div>

                <ProductForm
                    product={product}
                    action={AdminProductController.update.url(product.id)}
                    method="put"
                    submitLabel="Update Product"
                />
            </div>
        </AppLayout>
    );
}

