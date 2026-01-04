<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('products', [ProductController::class, 'index'])->name('products.index');
Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('cart')->name('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/', [CartController::class, 'store'])->name('store');
        Route::put('{cartItem}', [CartController::class, 'update'])->name('update');
        Route::delete('{cartItem}', [CartController::class, 'destroy'])->name('destroy');
        Route::post('checkout', [CartController::class, 'checkout'])->name('checkout');
    });

    // Admin routes
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Product management
        Route::resource('products', AdminProductController::class);

        // User management (no create/store routes)
        Route::resource('users', AdminUserController::class)->except(['create', 'store']);
    });
});

require __DIR__.'/settings.php';
