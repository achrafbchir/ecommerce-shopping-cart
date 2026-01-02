<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => config('ecommerce.admin_email', 'admin@example.com')],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_admin' => true,
            ]
        );

        // Ensure existing admin user has is_admin set to true
        if (! $admin->wasRecentlyCreated && ! $admin->is_admin) {
            $admin->update(['is_admin' => true]);
        }

        // Create test user
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create sample products
        $products = [
            [
                'name' => 'Laptop Computer',
                'price' => 999.99,
                'stock_quantity' => 15,
                'image_url' => 'https://picsum.photos/seed/laptop/400/400',
            ],
            [
                'name' => 'Wireless Mouse',
                'price' => 29.99,
                'stock_quantity' => 50,
                'image_url' => 'https://picsum.photos/seed/mouse/400/400',
            ],
            [
                'name' => 'Mechanical Keyboard',
                'price' => 149.99,
                'stock_quantity' => 25,
                'image_url' => 'https://picsum.photos/seed/keyboard/400/400',
            ],
            [
                'name' => 'Monitor 27"',
                'price' => 299.99,
                'stock_quantity' => 8,
                'image_url' => 'https://picsum.photos/seed/monitor/400/400',
            ],
            [
                'name' => 'USB-C Cable',
                'price' => 19.99,
                'stock_quantity' => 100,
                'image_url' => 'https://picsum.photos/seed/cable/400/400',
            ],
            [
                'name' => 'Webcam HD',
                'price' => 79.99,
                'stock_quantity' => 12,
                'image_url' => 'https://picsum.photos/seed/webcam/400/400',
            ],
            [
                'name' => 'Headphones',
                'price' => 89.99,
                'stock_quantity' => 5,
                'image_url' => 'https://picsum.photos/seed/headphones/400/400',
            ],
            [
                'name' => 'Desk Lamp',
                'price' => 39.99,
                'stock_quantity' => 30,
                'image_url' => 'https://picsum.photos/seed/lamp/400/400',
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::firstOrCreate(
                ['name' => $productData['name']],
                $productData
            );

            // Update image_url if product already exists
            if ($product->wasRecentlyCreated === false && ! $product->image_url) {
                $product->update(['image_url' => $productData['image_url']]);
            }
        }
    }
}
