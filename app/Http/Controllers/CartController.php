<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Http\Requests\StoreCartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService
    ) {}

    /**
     * Display the user's shopping cart.
     */
    public function index(Request $request): Response
    {
        $data = $this->cartService->getUserCart($request->user());

        return Inertia::render('Cart/Index', $data);
    }

    /**
     * Add a product to the cart.
     */
    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $this->cartService->addToCart(
            $request->user(),
            $request->product_id,
            $request->quantity
        );

        return redirect()->route('cart.index')->with('success', 'Product added to cart.');
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        $this->cartService->updateCartItem(
            $cartItem,
            $request->user(),
            $request->quantity
        );

        return redirect()->route('cart.index')->with('success', 'Cart updated.');
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->cartService->removeFromCart($cartItem, $request->user());

        return redirect()->route('cart.index')->with('success', 'Item removed from cart.');
    }

    /**
     * Checkout - convert cart items to sales.
     */
    public function checkout(CheckoutRequest $request): RedirectResponse
    {
        $this->cartService->checkout($request->user());

        return redirect()->route('products.index')->with('success', 'Order placed successfully!');
    }
}
