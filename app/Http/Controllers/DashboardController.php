<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        // Redirect admins to admin dashboard
        if ($request->user()?->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        $user = $request->user();
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

        return Inertia::render('dashboard', [
            'cartItems' => $cartItems,
            'cartTotal' => $cartTotal,
            'cartCount' => $cartCount,
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
