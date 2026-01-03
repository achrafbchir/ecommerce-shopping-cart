import AdminProductController from '@/actions/App/Http/Controllers/Admin/AdminProductController';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import ProductForm from './Form';

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
        title: 'Create Product',
        href: '/admin/products/create',
    },
];

export default function CreateProduct() {
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
                        <h1 className="text-3xl font-bold">Create Product</h1>
                        <p className="text-muted-foreground">
                            Add a new product to your catalog
                        </p>
                    </div>
                </div>

                <ProductForm
                    action={AdminProductController.store.url()}
                    method="post"
                    submitLabel="Create Product"
                />
            </div>
        </AppLayout>
    );
}

