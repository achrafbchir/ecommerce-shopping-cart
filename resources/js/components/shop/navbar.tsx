import { index } from '@/routes/cart';
import { index as productsIndex } from '@/routes/products';
import { login, register } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type SharedData } from '@/types';
import AppLogo from '../app-logo';

export default function Navbar() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const isAuthenticated = !!auth?.user;

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center">
                        <AppLogo />
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href={productsIndex().url}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Products
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link href={index().url}>
                                <Button variant="ghost" size="icon" className="relative">
                                    <ShoppingCart className="size-5" />
                                    {page.props.cartCount > 0 && (
                                        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                            {page.props.cartCount > 99 ? '99+' : page.props.cartCount}
                                        </span>
                                    )}
                                    <span className="sr-only">Shopping Cart</span>
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <User className="size-5" />
                                        <span className="sr-only">User menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {auth.user?.is_admin ? (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings/profile">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="w-full"
                                        >
                                            Logout
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link href={login().url}>Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href={register().url}>Register</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

