<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Http\Requests\StoreCartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Jobs\CheckLowStockJob;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Display the user's shopping cart.
     */
    public function index(Request $request): Response
    {
        $cartItems = $request->user()
            ->cartItems()
            ->with('product')
            ->latest()
            ->get()
            ->map(function ($item) {
                $item->total_price = $item->quantity * (float) $item->product->price;

                return $item;
            });

        $total = $cartItems->sum('total_price');
        $cartCount = $cartItems->sum('quantity');

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'total' => $total,
            'cartCount' => $cartCount,
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $product = Product::findOrFail($request->product_id);

        $cartItem = $request->user()->cartItems()
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->update(['quantity' => $cartItem->quantity + $request->quantity]);
        } else {
            $request->user()->cartItems()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
            ]);
        }

        // Check for low stock after adding to cart
        if ($product->isLowStock()) {
            CheckLowStockJob::dispatch($product);
        }

        return redirect()->route('cart.index')->with('success', 'Product added to cart.');
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403);
        }

        $cartItem->update($request->validated());

        // Check for low stock after updating
        if ($cartItem->product->isLowStock()) {
            CheckLowStockJob::dispatch($cartItem->product);
        }

        return redirect()->route('cart.index')->with('success', 'Cart updated.');
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403);
        }

        $cartItem->delete();

        return redirect()->route('cart.index')->with('success', 'Item removed from cart.');
    }

    /**
     * Checkout - convert cart items to sales.
     */
    public function checkout(CheckoutRequest $request): RedirectResponse
    {
        $cartItems = $request->user()
            ->cartItems()
            ->with('product')
            ->get();

        DB::transaction(function () use ($cartItems, $request) {
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
            $request->user()->cartItems()->delete();
        });

        return redirect()->route('products.index')->with('success', 'Order placed successfully!');
    }
}
