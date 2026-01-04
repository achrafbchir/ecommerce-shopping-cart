<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductIndexRequest;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(ProductIndexRequest $request): Response
    {
        $query = Product::query();

        // Search filter
        $query->when($request->search, function ($q, $search) {
            $q->where('name', 'like', "%{$search}%");
        });

        // Price range filter
        $query->when($request->min_price, function ($q, $minPrice) {
            $q->where('price', '>=', $minPrice);
        });

        $query->when($request->max_price, function ($q, $maxPrice) {
            $q->where('price', '<=', $maxPrice);
        });

        // Stock status filter
        $query->when($request->stock_status, function ($q, $status) {
            $threshold = config('ecommerce.low_stock_threshold', 10);
            match ($status) {
                'in_stock' => $q->where('stock_quantity', '>', 0),
                'low_stock' => $q->where('stock_quantity', '>', 0)
                    ->where('stock_quantity', '<=', $threshold),
                'out_of_stock' => $q->where('stock_quantity', '=', 0),
                default => $q,
            };
        });

        // Sorting
        $sortBy = $request->get('sort_by', 'latest');
        match ($sortBy) {
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            'stock_high' => $query->orderBy('stock_quantity', 'desc'),
            'stock_low' => $query->orderBy('stock_quantity', 'asc'),
            default => $query->latest(),
        };

        $products = $query->paginate(12)->withQueryString();

        // Add image_url to each product
        $products->getCollection()->transform(function ($product) {
            $product->image_url = $product->getImageUrl();

            return $product;
        });

        // Get price range for filter UI
        $priceRange = [
            'min' => (float) Product::min('price'),
            'max' => (float) Product::max('price'),
        ];

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'min_price', 'max_price', 'stock_status', 'sort_by']),
            'priceRange' => $priceRange,
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): Response
    {
        $product->load('cartItems');
        $product->image_url = $product->getImageUrl();

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
