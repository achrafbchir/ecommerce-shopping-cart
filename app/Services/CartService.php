<?php

namespace App\Services;

use App\Jobs\CheckLowStockJob;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CartService
{
    /**
     * Get user's cart items with totals.
     */
    public function getUserCart(User $user): array
    {
        $cartItems = $user->cartItems()
            ->with('product')
            ->latest()
            ->get()
            ->map(function ($item) {
                $item->product->image_url = $item->product->getImageUrl();
                $item->total_price = $item->quantity * (float) $item->product->price;

                return $item;
            });

        $total = $cartItems->sum('total_price');
        $cartCount = $cartItems->sum('quantity');

        return [
            'cartItems' => $cartItems,
            'total' => $total,
            'cartCount' => $cartCount,
        ];
    }

    /**
     * Add product to cart.
     */
    public function addToCart(User $user, int $productId, int $quantity): void
    {
        $product = Product::findOrFail($productId);

        $cartItem = $user->cartItems()
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->update(['quantity' => $cartItem->quantity + $quantity]);
        } else {
            $user->cartItems()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
            ]);
        }

        // Check for low stock after adding to cart
        if ($product->fresh()->isLowStock()) {
            CheckLowStockJob::dispatch($product->fresh());
        }
    }

    /**
     * Update cart item quantity.
     */
    public function updateCartItem(CartItem $cartItem, User $user, int $quantity): void
    {
        if ($cartItem->user_id !== $user->id) {
            abort(403);
        }

        $cartItem->update(['quantity' => $quantity]);

        // Check for low stock after updating
        if ($cartItem->product->fresh()->isLowStock()) {
            CheckLowStockJob::dispatch($cartItem->product->fresh());
        }
    }

    /**
     * Remove item from cart.
     */
    public function removeFromCart(CartItem $cartItem, User $user): void
    {
        if ($cartItem->user_id !== $user->id) {
            abort(403);
        }

        $cartItem->delete();
    }

    /**
     * Process checkout - convert cart items to sales.
     */
    public function checkout(User $user): void
    {
        $cartItems = $user->cartItems()
            ->with('product')
            ->get();

        DB::transaction(function () use ($cartItems) {
            foreach ($cartItems as $cartItem) {
                // Create sale record
                Sale::create([
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                    'sold_at' => now(),
                ]);

                // Update product stock
                $cartItem->product->decrement('stock_quantity', $cartItem->quantity);

                // Check for low stock
                if ($cartItem->product->fresh()->isLowStock()) {
                    CheckLowStockJob::dispatch($cartItem->product->fresh());
                }
            }

            // Clear cart
            $cartItems->each->delete();
        });
    }
}
