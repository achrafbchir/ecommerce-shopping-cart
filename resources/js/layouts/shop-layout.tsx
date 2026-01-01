import Footer from '@/components/shop/footer';
import Navbar from '@/components/shop/navbar';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface ShopLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function ShopLayout({ children, title }: ShopLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Head title={title} />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

