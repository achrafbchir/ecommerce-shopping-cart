<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $featuredProducts = \App\Models\Product::inRandomOrder()
        ->limit(8)
        ->get()
        ->map(function ($product) {
            $product->image_url = $product->getImageUrl();

            return $product;
        });

    return Inertia::render('Shop/Home', [
        'featuredProducts' => $featuredProducts,
    ]);
})->name('home');

Route::get('products', [ProductController::class, 'index'])->name('products.index');
Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('cart')->name('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/', [CartController::class, 'store'])->name('store');
        Route::put('{cartItem}', [CartController::class, 'update'])->name('update');
        Route::delete('{cartItem}', [CartController::class, 'destroy'])->name('destroy');
        Route::post('checkout', [CartController::class, 'checkout'])->name('checkout');
    });

    // Admin routes
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('dashboard');

        // Product management
        Route::resource('products', \App\Http\Controllers\Admin\AdminProductController::class);
    });
});

require __DIR__.'/settings.php';
