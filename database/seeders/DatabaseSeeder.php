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
        User::firstOrCreate(
            ['email' => config('ecommerce.admin_email', 'admin@example.com')],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

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
            ],
            [
                'name' => 'Wireless Mouse',
                'price' => 29.99,
                'stock_quantity' => 50,
            ],
            [
                'name' => 'Mechanical Keyboard',
                'price' => 149.99,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Monitor 27"',
                'price' => 299.99,
                'stock_quantity' => 8,
            ],
            [
                'name' => 'USB-C Cable',
                'price' => 19.99,
                'stock_quantity' => 100,
            ],
            [
                'name' => 'Webcam HD',
                'price' => 79.99,
                'stock_quantity' => 12,
            ],
            [
                'name' => 'Headphones',
                'price' => 89.99,
                'stock_quantity' => 5,
            ],
            [
                'name' => 'Desk Lamp',
                'price' => 39.99,
                'stock_quantity' => 30,
            ],
        ];

        foreach ($products as $productData) {
            Product::firstOrCreate(
                ['name' => $productData['name']],
                $productData
            );
        }
    }
}
