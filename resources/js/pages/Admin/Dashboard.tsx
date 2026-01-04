import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    DollarSign,
    Package,
    Plus,
    ShoppingBag,
    Users,
} from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    price: string;
    stock_quantity: number;
    image_url?: string;
}

interface Sale {
    id: number;
    quantity: number;
    price: string;
    sold_at: string;
    total: number;
    product: Product;
}

interface TopSellingProduct {
    product_id: number;
    total_sold: number;
    total_revenue: number | string;
    product: Product;
}

interface Statistics {
    totalUsers: number;
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    todaySales: number;
    todayRevenue: number;
    monthSales: number;
    monthRevenue: number;
    outOfStockProducts: number;
    newUsersToday: number;
    newUsersThisMonth: number;
    verifiedUsers: number;
    usersWithActiveCart: number;
    totalCartItems: number;
}

interface ChartData {
    date: string;
    sales: number;
    revenue: number;
}

interface UserRegistrationChartData {
    date: string;
    users: number;
}

interface AdminDashboardProps {
    statistics: Statistics;
    lowStockProducts: Product[];
    topSellingProducts: TopSellingProduct[];
    recentSales: Sale[];
    salesChartData: ChartData[];
    revenueChartData: ChartData[];
    userRegistrationChartData: UserRegistrationChartData[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({
    statistics,
    lowStockProducts,
    topSellingProducts,
    recentSales,
    salesChartData,
    revenueChartData,
    userRegistrationChartData,
}: AdminDashboardProps) {
    const maxSales = Math.max(...salesChartData.map((d) => d.sales), 1);
    const maxRevenue = Math.max(...revenueChartData.map((d) => d.revenue), 1);
    const maxUsers = Math.max(...userRegistrationChartData.map((d) => d.users), 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">
                            Overview of your e-commerce store performance
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/admin/users">
                                <Users className="mr-2 size-4" />
                                Manage Users
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/products">
                                <Package className="mr-2 size-4" />
                                Manage Products
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/products/create">
                                <Plus className="mr-2 size-4" />
                                Add Product
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${statistics.totalRevenue.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All-time total revenue
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Sales
                            </CardTitle>
                            <ShoppingBag className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.totalSales.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total transactions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Products
                            </CardTitle>
                            <Package className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.totalProducts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Products in catalog
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.totalUsers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Registered customers
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Today & Month Stats */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Today&apos;s Performance</CardTitle>
                            <CardDescription>
                                Sales and revenue for today
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Sales
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {statistics.todaySales}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">
                                        Revenue
                                    </p>
                                    <p className="text-2xl font-bold">
                                        $
                                        {statistics.todayRevenue.toLocaleString(
                                            'en-US',
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>This Month</CardTitle>
                            <CardDescription>
                                Sales and revenue for this month
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Sales
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {statistics.monthSales}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">
                                        Revenue
                                    </p>
                                    <p className="text-2xl font-bold">
                                        $
                                        {statistics.monthRevenue.toLocaleString(
                                            'en-US',
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* User Statistics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                New Users Today
                            </CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.newUsersToday}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Registered today
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                New Users This Month
                            </CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.newUsersThisMonth}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Registered this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Verified Users
                            </CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.verifiedUsers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Email verified
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Carts
                            </CardTitle>
                            <ShoppingBag className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.usersWithActiveCart}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.totalCartItems} items in carts
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales (Last 7 Days)</CardTitle>
                            <CardDescription>
                                Number of sales per day
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[200px] items-end justify-between gap-2">
                                {salesChartData.map((data, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-1 flex-col items-center gap-2"
                                    >
                                        <div className="relative flex w-full flex-col items-center justify-end">
                                            <div
                                                className="w-full rounded-t bg-primary transition-all hover:bg-primary/80"
                                                style={{
                                                    height: `${
                                                        (data.sales / maxSales) *
                                                        100
                                                    }%`,
                                                    minHeight:
                                                        data.sales > 0
                                                            ? '4px'
                                                            : '0px',
                                                }}
                                                title={`${data.date}: ${data.sales} sales`}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {data.date.split(' ')[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue (Last 7 Days)</CardTitle>
                            <CardDescription>
                                Daily revenue in dollars
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[200px] items-end justify-between gap-2">
                                {revenueChartData.map((data, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-1 flex-col items-center gap-2"
                                    >
                                        <div className="relative flex w-full flex-col items-center justify-end">
                                            <div
                                                className="w-full rounded-t bg-green-500 transition-all hover:bg-green-600"
                                                style={{
                                                    height: `${
                                                        (data.revenue /
                                                            maxRevenue) *
                                                        100
                                                    }%`,
                                                    minHeight:
                                                        data.revenue > 0
                                                            ? '4px'
                                                            : '0px',
                                                }}
                                                title={`${data.date}: $${data.revenue.toFixed(2)}`}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {data.date.split(' ')[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>User Registrations</CardTitle>
                            <CardDescription>
                                New users per day (last 7 days)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[200px] items-end justify-between gap-2">
                                {userRegistrationChartData.map((data, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-1 flex-col items-center gap-2"
                                    >
                                        <div className="relative flex w-full flex-col items-center justify-end">
                                            <div
                                                className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                                                style={{
                                                    height: `${
                                                        (data.users / maxUsers) *
                                                        100
                                                    }%`,
                                                    minHeight:
                                                        data.users > 0
                                                            ? '4px'
                                                            : '0px',
                                                }}
                                                title={`${data.date}: ${data.users} users`}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {data.date.split(' ')[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Low Stock & Out of Stock Alert */}
                {(statistics.outOfStockProducts > 0 ||
                    lowStockProducts.length > 0) && (
                    <Card className="border-destructive">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="size-5 text-destructive" />
                                <CardTitle className="text-destructive">
                                    Stock Alerts
                                </CardTitle>
                            </div>
                            <CardDescription>
                                Products that need attention
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {statistics.outOfStockProducts > 0 && (
                                <div className="mb-4 rounded-lg bg-destructive/10 p-4">
                                    <p className="font-semibold text-destructive">
                                        {statistics.outOfStockProducts} product(s)
                                        out of stock
                                    </p>
                                </div>
                            )}
                            {lowStockProducts.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Low Stock Products:
                                    </p>
                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {lowStockProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-3 rounded-lg border p-3"
                                            >
                                                {product.image_url && (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="size-12 rounded object-cover"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Stock:{' '}
                                                        {product.stock_quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Top Selling Products & Recent Sales */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                            <CardDescription>
                                Best sellers in the last 30 days
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topSellingProducts.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No sales in the last 30 days
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {topSellingProducts.map((item, index) => (
                                        <div
                                            key={item.product_id}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="flex size-10 items-center justify-center rounded-full bg-muted font-bold">
                                                {index + 1}
                                            </div>
                                            {item.product.image_url && (
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="size-12 rounded object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.total_sold} sold • $
                                                    {typeof item.total_revenue === 'number'
                                                        ? item.total_revenue.toFixed(2)
                                                        : parseFloat(
                                                              item.total_revenue as string
                                                          ).toFixed(2)}{' '}
                                                    revenue
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Sales</CardTitle>
                            <CardDescription>
                                Latest transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentSales.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No recent sales
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {recentSales.map((sale) => (
                                        <div
                                            key={sale.id}
                                            className="flex items-center gap-4"
                                        >
                                            {sale.product.image_url && (
                                                <img
                                                    src={sale.product.image_url}
                                                    alt={sale.product.name}
                                                    className="size-12 rounded object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {sale.product.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {sale.quantity} × $
                                                    {parseFloat(
                                                        sale.price
                                                    ).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        sale.sold_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    ${sale.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

