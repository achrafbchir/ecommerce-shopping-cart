<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    /**
     * Get paginated list of products with filters (public).
     */
    public function getPaginatedProducts(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Product::query();

        logger()->info('Filters', ['filters' => $filters]);

        // Search filter
        if (! empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        // Price range filter
        if (! empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (! empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        // Stock status filter
        if (! empty($filters['stock_status']) && $filters['stock_status'] !== 'all') {
            $threshold = config('ecommerce.low_stock_threshold', 10);
            match ($filters['stock_status']) {
                'in_stock' => $query->where('stock_quantity', '>', 0),
                'low_stock' => $query->where('stock_quantity', '>', 0)
                    ->where('stock_quantity', '<=', $threshold),
                'out_of_stock' => $query->where('stock_quantity', '=', 0),
                default => $query,
            };
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'latest';
        match ($sortBy) {
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            'stock_high' => $query->orderBy('stock_quantity', 'desc'),
            'stock_low' => $query->orderBy('stock_quantity', 'asc'),
            default => $query->latest(),
        };

        $products = $query->paginate($perPage)->withQueryString();

        // Add image_url to each product
        $products->getCollection()->transform(function ($product) {
            $product->image_url = $product->getImageUrl();

            return $product;
        });

        return $products;
    }

    /**
     * Get paginated list of products with filters (admin).
     */
    public function getPaginatedProductsForAdmin(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Product::query();

        // Search filter
        if (! empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        // Stock status filter
        if (! empty($filters['stock_status'])) {
            $threshold = config('ecommerce.low_stock_threshold', 10);
            match ($filters['stock_status']) {
                'in_stock' => $query->where('stock_quantity', '>', 0),
                'low_stock' => $query->where('stock_quantity', '>', 0)
                    ->where('stock_quantity', '<=', $threshold),
                'out_of_stock' => $query->where('stock_quantity', '=', 0),
                default => $query,
            };
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'latest';
        match ($sortBy) {
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'stock_high' => $query->orderBy('stock_quantity', 'desc'),
            'stock_low' => $query->orderBy('stock_quantity', 'asc'),
            default => $query->latest(),
        };

        $products = $query->paginate($perPage)->withQueryString();

        // Add image_url to each product
        $products->getCollection()->transform(function ($product) {
            $product->image_url = $product->getImageUrl();

            return $product;
        });

        return $products;
    }

    /**
     * Get product with image URL.
     */
    public function getProductWithImage(Product $product): Product
    {
        $product->image_url = $product->getImageUrl();

        return $product;
    }

    /**
     * Create a new product.
     */
    public function createProduct(array $data, ?UploadedFile $image = null): Product
    {
        // Handle image upload
        if ($image) {
            $imagePath = $image->store('products', 'public');
            $data['image_path'] = $imagePath;
        }

        unset($data['image']);

        return Product::create($data);
    }

    /**
     * Update a product.
     */
    public function updateProduct(Product $product, array $data, ?UploadedFile $image = null): Product
    {
        // Handle image upload
        if ($image) {
            // Delete old image if exists
            if ($product->image_path && Storage::disk('public')->exists($product->image_path)) {
                Storage::disk('public')->delete($product->image_path);
            }

            $imagePath = $image->store('products', 'public');
            $data['image_path'] = $imagePath;
            $data['image_url'] = null; // Clear image_url if uploading new image
        }

        unset($data['image']);

        $product->update($data);

        return $product;
    }

    /**
     * Delete a product.
     */
    public function deleteProduct(Product $product): void
    {
        // Delete associated image if exists
        if ($product->image_path && Storage::disk('public')->exists($product->image_path)) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();
    }

    /**
     * Get price range for products.
     */
    public function getPriceRange(): array
    {
        return [
            'min' => (float) Product::min('price'),
            'max' => (float) Product::max('price'),
        ];
    }
}
