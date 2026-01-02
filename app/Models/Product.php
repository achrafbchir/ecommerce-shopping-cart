<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'price',
        'stock_quantity',
        'image_path',
        'image_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }

    /**
     * Get the cart items for the product.
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get the sales for the product.
     */
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    /**
     * Check if product is low in stock.
     */
    public function isLowStock(?int $threshold = null): bool
    {
        $threshold = $threshold ?? config('ecommerce.low_stock_threshold', 10);

        return $this->stock_quantity <= $threshold;
    }

    /**
     * Get the product image URL with fallback to placeholder.
     */
    public function getImageUrl(): string
    {
        if ($this->attributes['image_url'] ?? null) {
            return $this->attributes['image_url'];
        }

        if ($this->attributes['image_path'] ?? null) {
            return asset('storage/'.$this->attributes['image_path']);
        }

        // Return placeholder if no image
        $seed = $this->id ?? crc32($this->name);
        $width = 400;
        $height = 400;

        return "https://picsum.photos/seed/{$seed}/{$width}/{$height}";
    }
}
