<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {
    }

    /**
     * Display the home page with featured products.
     */
    public function index(Request $request): Response
    {
        $featuredProducts = Product::inRandomOrder()
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return $this->productService->getProductWithImage($product);
            });

        return Inertia::render('Shop/Home', [
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
