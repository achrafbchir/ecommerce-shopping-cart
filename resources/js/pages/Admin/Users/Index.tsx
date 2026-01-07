import AdminUserController from '@/actions/App/Http/Controllers/Admin/AdminUserController';
import { router } from '@inertiajs/react';
import { Eye, Mail, Search, Trash2, UserCheck, UserX } from 'lucide-react';
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

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    cart_items_count: number;
    has_active_cart: boolean;
}

interface PaginatedUsers {
    data: User[];
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

interface UsersIndexProps {
    users: PaginatedUsers;
    filters: {
        search?: string;
        email_verified?: string;
        sort_by?: string;
    };
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
];

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [emailVerified, setEmailVerified] = useState(
        filters.email_verified || 'all'
    );
    const [sortBy, setSortBy] = useState(filters.sort_by || 'latest');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string | undefined> = {
            search: search || undefined,
            email_verified:
                emailVerified === 'all' ? undefined : emailVerified,
            sort_by: sortBy === 'latest' ? undefined : sortBy,
        };

        Object.keys(params).forEach(
            (key) => params[key] === undefined && delete params[key]
        );

        router.get('/admin/users', params, {
            preserveState: false,
            preserveScroll: false,
        });
    };

    const handleDelete = (userId: number) => {
        router.delete(AdminUserController.destroy.url(userId), {
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
                        <h1 className="text-3xl font-bold">Users Management</h1>
                        <p className="text-muted-foreground">
                            Manage registered users
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Filter and search users</CardDescription>
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
                                            type="text"
                                            placeholder="Search by name or email..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email_verified">
                                        Email Verification
                                    </Label>
                                    <Select
                                        value={emailVerified}
                                        onValueChange={setEmailVerified}
                                    >
                                        <SelectTrigger id="email_verified">
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Statuses
                                            </SelectItem>
                                            <SelectItem value="verified">
                                                Verified
                                            </SelectItem>
                                            <SelectItem value="unverified">
                                                Unverified
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_by">Sort By</Label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger id="sort_by">
                                            <SelectValue placeholder="Sort by..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="latest">
                                                Latest First
                                            </SelectItem>
                                            <SelectItem value="oldest">
                                                Oldest First
                                            </SelectItem>
                                            <SelectItem value="name_asc">
                                                Name (A-Z)
                                            </SelectItem>
                                            <SelectItem value="name_desc">
                                                Name (Z-A)
                                            </SelectItem>
                                            <SelectItem value="email_asc">
                                                Email (A-Z)
                                            </SelectItem>
                                            <SelectItem value="email_desc">
                                                Email (Z-A)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button type="submit">Apply Filters</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users ({users.total})</CardTitle>
                        <CardDescription>
                            List of all registered users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.data.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No users found.
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Cart Items</TableHead>
                                                <TableHead>Registered</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.data.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">
                                                        {user.name}
                                                    </TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>
                                                        {user.email_verified_at ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                <UserCheck className="size-3" />
                                                                Verified
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                                <UserX className="size-3" />
                                                                Unverified
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.has_active_cart ? (
                                                            <span className="font-medium text-primary">
                                                                {user.cart_items_count} items
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                No items
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(
                                                            user.created_at
                                                        ).toLocaleDateString()}
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
                                                                    <a
                                                                        href={AdminUserController.show.url(
                                                                            user.id
                                                                        )}
                                                                    >
                                                                        <Eye className="mr-2 size-4" />
                                                                        View Details
                                                                    </a>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        setDeleteId(
                                                                            user.id
                                                                        )
                                                                    }
                                                                    className="text-destructive"
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
                                {users.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            Showing{' '}
                                            {(users.current_page - 1) *
                                                users.per_page +
                                                1}{' '}
                                            to{' '}
                                            {Math.min(
                                                users.current_page *
                                                    users.per_page,
                                                users.total
                                            )}{' '}
                                            of {users.total} users
                                        </div>
                                        <div className="flex gap-2">
                                            {users.links.map((link, index) => {
                                                if (
                                                    link.label === '&laquo; Previous' ||
                                                    link.label === 'Next &raquo;'
                                                ) {
                                                    return null;
                                                }

                                                if (link.url === null) {
                                                    return (
                                                        <Button
                                                            key={index}
                                                            variant="outline"
                                                            size="sm"
                                                            disabled
                                                        >
                                                            {link.label.replace(
                                                                /&[^;]+;/g,
                                                                ''
                                                            )}
                                                        </Button>
                                                    );
                                                }

                                                return (
                                                    <Button
                                                        key={index}
                                                        variant={
                                                            link.active
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a href={link.url}>
                                                            {link.label.replace(
                                                                /&[^;]+;/g,
                                                                ''
                                                            )}
                                                        </a>
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
                                <CardTitle>Delete User</CardTitle>
                                <CardDescription>
                                    Are you sure you want to delete this user?
                                    This action cannot be undone.
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

