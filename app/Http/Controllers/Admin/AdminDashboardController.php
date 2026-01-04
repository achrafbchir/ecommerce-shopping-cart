<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
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

        // User registration chart data (last 7 days)
        $userRegistrationChartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayUsers = User::where('is_admin', false)
                ->whereDate('created_at', $date)
                ->count();

            $userRegistrationChartData[] = [
                'date' => $date->format('M j'),
                'users' => $dayUsers,
            ];
        }

        // Low stock products
        $lowStockThreshold = config('ecommerce.low_stock_threshold', 10);
        $lowStockProducts = Product::where('stock_quantity', '<=', $lowStockThreshold)
            ->orderBy('stock_quantity', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($product) {
                $product->image_url = $product->getImageUrl();

                return $product;
            });

        // Top selling products (last 30 days)
        $topSellingProducts = Sale::select('product_id', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(quantity * price) as total_revenue'))
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
            });

        // Recent sales (last 10)
        $recentSales = Sale::with('product')
            ->latest('sold_at')
            ->limit(10)
            ->get()
            ->map(function ($sale) {
                $sale->product->image_url = $sale->product->getImageUrl();
                $sale->total = $sale->quantity * (float) $sale->price;

                return $sale;
            });

        // Sales chart data (last 7 days)
        $salesChartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $daySales = Sale::whereDate('sold_at', $date)->count();
            $dayRevenue = Sale::whereDate('sold_at', $date)
                ->sum(DB::raw('quantity * price'));

            $salesChartData[] = [
                'date' => $date->format('M j'),
                'sales' => $daySales,
                'revenue' => (float) $dayRevenue,
            ];
        }

        // Revenue chart data (last 7 days)
        $revenueChartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayRevenue = Sale::whereDate('sold_at', $date)
                ->sum(DB::raw('quantity * price'));

            $revenueChartData[] = [
                'date' => $date->format('M j'),
                'revenue' => (float) $dayRevenue,
            ];
        }

        // Out of stock products
        $outOfStockProducts = Product::where('stock_quantity', 0)->count();

        return Inertia::render('Admin/Dashboard', [
            'statistics' => [
                'totalUsers' => $totalUsers,
                'totalProducts' => $totalProducts,
                'totalSales' => $totalSales,
                'totalRevenue' => (float) $totalRevenue,
                'todaySales' => $todaySales,
                'todayRevenue' => (float) $todayRevenue,
                'monthSales' => $monthSales,
                'monthRevenue' => (float) $monthRevenue,
                'outOfStockProducts' => $outOfStockProducts,
                // User statistics
                'newUsersToday' => $newUsersToday,
                'newUsersThisMonth' => $newUsersThisMonth,
                'verifiedUsers' => $verifiedUsers,
                'usersWithActiveCart' => $usersWithActiveCart,
                'totalCartItems' => $totalCartItems,
            ],
            'lowStockProducts' => $lowStockProducts,
            'topSellingProducts' => $topSellingProducts,
            'recentSales' => $recentSales,
            'salesChartData' => $salesChartData,
            'revenueChartData' => $revenueChartData,
            'userRegistrationChartData' => $userRegistrationChartData,
        ]);
    }
}
