<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Get admin dashboard statistics.
     */
    public function getAdminDashboardStatistics(): array
    {
        return [
            'statistics' => $this->getStatistics(),
            'lowStockProducts' => $this->getLowStockProducts(),
            'topSellingProducts' => $this->getTopSellingProducts(),
            'recentSales' => $this->getRecentSales(),
            'salesChartData' => $this->getSalesChartData(),
            'revenueChartData' => $this->getRevenueChartData(),
            'userRegistrationChartData' => $this->getUserRegistrationChartData(),
        ];
    }

    /**
     * Get user dashboard data.
     */
    public function getUserDashboardData(User $user): array
    {
        $cartItems = $user->cartItems()->with('product')->get();

        // Calculate cart statistics
        $cartTotal = $cartItems->sum(function ($item) {
            return $item->quantity * (float) $item->product->price;
        });
        $cartCount = $cartItems->sum('quantity');

        // Add image URLs to cart items
        $cartItems->transform(function ($item) {
            $item->product->image_url = $item->product->getImageUrl();
            $item->total_price = $item->quantity * (float) $item->product->price;

            return $item;
        });

        // Get featured products for recommendations
        $featuredProducts = Product::where('stock_quantity', '>', 0)
            ->inRandomOrder()
            ->limit(6)
            ->get()
            ->map(function ($product) {
                $product->image_url = $product->getImageUrl();

                return $product;
            });

        return [
            'cartItems' => $cartItems,
            'cartTotal' => $cartTotal,
            'cartCount' => $cartCount,
            'featuredProducts' => $featuredProducts,
        ];
    }

    /**
     * Get all statistics.
     */
    private function getStatistics(): array
    {
        // Total statistics
        $totalUsers = User::where('is_admin', false)->count();
        $totalProducts = Product::count();
        $totalSales = Sale::count();
        $totalRevenue = Sale::sum(DB::raw('quantity * price'));

        // User statistics
        $newUsersToday = User::where('is_admin', false)
            ->whereDate('created_at', today())
            ->count();
        $newUsersThisMonth = User::where('is_admin', false)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $verifiedUsers = User::where('is_admin', false)
            ->whereNotNull('email_verified_at')
            ->count();
        $usersWithActiveCart = User::where('is_admin', false)
            ->has('cartItems')
            ->count();
        $totalCartItems = DB::table('cart_items')
            ->join('users', 'cart_items.user_id', '=', 'users.id')
            ->where('users.is_admin', false)
            ->count();

        // Today's statistics
        $todaySales = Sale::whereDate('sold_at', today())->count();
        $todayRevenue = Sale::whereDate('sold_at', today())
            ->sum(DB::raw('quantity * price'));

        // This month's statistics
        $monthSales = Sale::whereMonth('sold_at', now()->month)
            ->whereYear('sold_at', now()->year)
            ->count();
        $monthRevenue = Sale::whereMonth('sold_at', now()->month)
            ->whereYear('sold_at', now()->year)
            ->sum(DB::raw('quantity * price'));

        // Out of stock products
        $outOfStockProducts = Product::where('stock_quantity', 0)->count();

        return [
            'totalUsers' => $totalUsers,
            'totalProducts' => $totalProducts,
            'totalSales' => $totalSales,
            'totalRevenue' => (float) $totalRevenue,
            'todaySales' => $todaySales,
            'todayRevenue' => (float) $todayRevenue,
            'monthSales' => $monthSales,
            'monthRevenue' => (float) $monthRevenue,
            'outOfStockProducts' => $outOfStockProducts,
            'newUsersToday' => $newUsersToday,
            'newUsersThisMonth' => $newUsersThisMonth,
            'verifiedUsers' => $verifiedUsers,
            'usersWithActiveCart' => $usersWithActiveCart,
            'totalCartItems' => $totalCartItems,
        ];
    }

    /**
     * Get low stock products.
     */
    private function getLowStockProducts(): array
    {
        $lowStockThreshold = config('ecommerce.low_stock_threshold', 10);

        return Product::where('stock_quantity', '<=', $lowStockThreshold)
            ->orderBy('stock_quantity', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($product) {
                $product->image_url = $product->getImageUrl();

                return $product;
            })
            ->toArray();
    }

    /**
     * Get top selling products.
     */
    private function getTopSellingProducts(): array
    {
        return Sale::select('product_id', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(quantity * price) as total_revenue'))
            ->where('sold_at', '>=', now()->subDays(30))
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->with('product')
            ->get()
            ->map(function ($sale) {
                $sale->product->image_url = $sale->product->getImageUrl();
                $sale->total_revenue = (float) $sale->total_revenue;
                $sale->total_sold = (int) $sale->total_sold;

                return $sale;
            })
            ->toArray();
    }

    /**
     * Get recent sales.
     */
    private function getRecentSales(): array
    {
        return Sale::with('product')
            ->latest('sold_at')
            ->limit(10)
            ->get()
            ->map(function ($sale) {
                $sale->product->image_url = $sale->product->getImageUrl();
                $sale->total = $sale->quantity * (float) $sale->price;

                return $sale;
            })
            ->toArray();
    }

    /**
     * Get sales chart data (last 7 days).
     */
    private function getSalesChartData(): array
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $daySales = Sale::whereDate('sold_at', $date)->count();
            $dayRevenue = Sale::whereDate('sold_at', $date)
                ->sum(DB::raw('quantity * price'));

            $data[] = [
                'date' => $date->format('M j'),
                'sales' => $daySales,
                'revenue' => (float) $dayRevenue,
            ];
        }

        return $data;
    }

    /**
     * Get revenue chart data (last 7 days).
     */
    private function getRevenueChartData(): array
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayRevenue = Sale::whereDate('sold_at', $date)
                ->sum(DB::raw('quantity * price'));

            $data[] = [
                'date' => $date->format('M j'),
                'revenue' => (float) $dayRevenue,
            ];
        }

        return $data;
    }

    /**
     * Get user registration chart data (last 7 days).
     */
    private function getUserRegistrationChartData(): array
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayUsers = User::where('is_admin', false)
                ->whereDate('created_at', $date)
                ->count();

            $data[] = [
                'date' => $date->format('M j'),
                'users' => $dayUsers,
            ];
        }

        return $data;
    }
}
