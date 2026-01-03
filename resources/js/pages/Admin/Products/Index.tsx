import AdminProductController from '@/actions/App/Http/Controllers/Admin/AdminProductController';
import { index } from '@/routes/products';
import { router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    stock_quantity: number;
    image_url?: string;
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface ProductsIndexProps {
    products: PaginatedProducts;
    filters: {
        search?: string;
        stock_status?: string;
        sort_by?: string;
    };
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
];

export default function ProductsIndex({ products, filters }: ProductsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [stockStatus, setStockStatus] = useState(filters.stock_status || 'all');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'latest');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string | undefined> = {
            search: search || undefined,
            stock_status: stockStatus === 'all' ? undefined : stockStatus,
            sort_by: sortBy === 'latest' ? undefined : sortBy,
        };

        Object.keys(params).forEach(
            (key) => params[key] === undefined && delete params[key]
        );

        router.get('/admin/products', params, {
            preserveState: false,
            preserveScroll: false,
        });
    };

    const handleDelete = (productId: number) => {
        router.delete(AdminProductController.destroy.url(productId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteId(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Products Management</h1>
                        <p className="text-muted-foreground">
                            Manage your product catalog
                        </p>
                    </div>
                    <Button asChild>
                        <a href="/admin/products/create">
                            <Plus className="mr-2 size-4" />
                            Add Product
                        </a>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>
                            Filter and search products
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="search">Search</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="search"
                                            placeholder="Search products..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock_status">Stock Status</Label>
                                    <Select
                                        value={stockStatus}
                                        onValueChange={setStockStatus}
                                    >
                                        <SelectTrigger id="stock_status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="in_stock">In Stock</SelectItem>
                                            <SelectItem value="low_stock">Low Stock</SelectItem>
                                            <SelectItem value="out_of_stock">
                                                Out of Stock
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_by">Sort By</Label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger id="sort_by">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="latest">Latest First</SelectItem>
                                            <SelectItem value="name_asc">Name: A to Z</SelectItem>
                                            <SelectItem value="name_desc">Name: Z to A</SelectItem>
                                            <SelectItem value="price_low">
                                                Price: Low to High
                                            </SelectItem>
                                            <SelectItem value="price_high">
                                                Price: High to Low
                                            </SelectItem>
                                            <SelectItem value="stock_high">
                                                Stock: High to Low
                                            </SelectItem>
                                            <SelectItem value="stock_low">
                                                Stock: Low to High
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">Apply Filters</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearch('');
                                        setStockStatus('all');
                                        setSortBy('latest');
                                        router.get('/admin/products');
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products ({products.total})</CardTitle>
                        <CardDescription>
                            {products.total} product(s) found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {products.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No products found. Create your first product!
                                </p>
                                <Button asChild className="mt-4">
                                    <a href="/admin/products/create">
                                        <Plus className="mr-2 size-4" />
                                        Add Product
                                    </a>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Image</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Stock</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products.data.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell>
                                                        {product.image_url ? (
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="size-12 rounded object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex size-12 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {product.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        $
                                                        {parseFloat(product.price).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {product.stock_quantity}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StockBadge
                                                            stockQuantity={
                                                                product.stock_quantity
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <span className="sr-only">
                                                                        Open menu
                                                                    </span>
                                                                    <svg
                                                                        className="size-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                                        />
                                                                    </svg>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <a href={`/admin/products/${product.id}`}>
                                                                        <Eye className="mr-2 size-4" />
                                                                        View
                                                                    </a>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <a href={`/admin/products/${product.id}/edit`}>
                                                                        <Edit className="mr-2 size-4" />
                                                                        Edit
                                                                    </a>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() =>
                                                                        setDeleteId(product.id)
                                                                    }
                                                                >
                                                                    <Trash2 className="mr-2 size-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">
                                            Showing {products.data.length} of{' '}
                                            {products.total} products
                                        </p>
                                        <div className="flex gap-2">
                                            {products.links.map((link, index) => {
                                                if (
                                                    link.url === null ||
                                                    (index === 0 && link.label === 'Previous') ||
                                                    (index ===
                                                        products.links.length - 1 &&
                                                        link.label === 'Next')
                                                ) {
                                                    return (
                                                        <Button
                                                            key={index}
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={link.url === null}
                                                            onClick={() => {
                                                                if (link.url) {
                                                                    router.get(link.url);
                                                                }
                                                            }}
                                                        >
                                                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                                        </Button>
                                                    );
                                                }

                                                if (link.active) {
                                                    return (
                                                        <Button
                                                            key={index}
                                                            variant="default"
                                                            size="sm"
                                                        >
                                                            {link.label}
                                                        </Button>
                                                    );
                                                }

                                                return (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (link.url) {
                                                                router.get(link.url);
                                                            }
                                                        }}
                                                    >
                                                        {link.label}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                {deleteId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Delete Product</CardTitle>
                                <CardDescription>
                                    Are you sure you want to delete this product? This
                                    action cannot be undone.
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
                                    onClick={() => handleDelete(deleteId)}
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

