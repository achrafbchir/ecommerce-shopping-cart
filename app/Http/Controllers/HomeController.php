<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the home page with featured products.
     */
    public function index(Request $request): Response
    {
        $featuredProducts = Product::inRandomOrder()
            ->limit(8)
            ->get()
            ->map(function ($product) {
                $product->image_url = $product->getImageUrl();

                return $product;
            });

        return Inertia::render('Shop/Home', [
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
