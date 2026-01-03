<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request): Response
    {
        $query = Product::query();

        // Search filter
        $query->when($request->search, function ($q, $search) {
            $q->where('name', 'like', "%{$search}%");
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
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'stock_high' => $query->orderBy('stock_quantity', 'desc'),
            'stock_low' => $query->orderBy('stock_quantity', 'asc'),
            default => $query->latest(),
        };

        $products = $query->paginate(15)->withQueryString();

        // Add image_url to each product
        $products->getCollection()->transform(function ($product) {
            $product->image_url = $product->getImageUrl();

            return $product;
        });

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'stock_status', 'sort_by']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create');
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $data['image_path'] = $imagePath;
            unset($data['image']);
        }

        $product = Product::create($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): Response
    {
        $product->image_url = $product->getImageUrl();

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): Response
    {
        $product->image_url = $product->getImageUrl();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image_path && Storage::disk('public')->exists($product->image_path)) {
                Storage::disk('public')->delete($product->image_path);
            }

            $imagePath = $request->file('image')->store('products', 'public');
            $data['image_path'] = $imagePath;
            $data['image_url'] = null; // Clear image_url if uploading new image
            unset($data['image']);
        }

        $product->update($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        // Delete associated image if exists
        if ($product->image_path && Storage::disk('public')->exists($product->image_path)) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
