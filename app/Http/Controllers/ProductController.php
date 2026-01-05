<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductIndexRequest;
use App\Models\Product;
use App\Services\ProductService;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {}

    /**
     * Display a listing of the products.
     */
    public function index(ProductIndexRequest $request): Response
    {
        logger()->info('Request', ['request' => $request->all()]);
        $products = $this->productService->getPaginatedProducts(
            $request->only(['search', 'min_price', 'max_price', 'stock_status', 'sort_by'])
        );

        $priceRange = $this->productService->getPriceRange();

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
        $product = $this->productService->getProductWithImage($product);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
