<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_index_page_can_be_rendered(): void
    {
        Product::factory()->count(5)->create();

        $this->get(route('products.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Products/Index')
                ->has('products.data', 5)
            );
    }

    public function test_products_can_be_searched(): void
    {
        Product::factory()->create(['name' => 'Laptop Computer']);
        Product::factory()->create(['name' => 'Wireless Mouse']);

        $this->get(route('products.index', ['search' => 'Laptop']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Products/Index')
                ->has('products.data', 1)
                ->where('products.data.0.name', 'Laptop Computer')
            );
    }

    public function test_product_show_page_can_be_rendered(): void
    {
        $product = Product::factory()->create();

        $this->get(route('products.show', $product))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Products/Show')
                ->where('product.id', $product->id)
                ->where('product.name', $product->name)
            );
    }

    public function test_products_are_paginated(): void
    {
        Product::factory()->count(15)->create();

        $this->get(route('products.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Products/Index')
                ->has('products.data', 12)
                ->where('products.last_page', 2)
            );
    }
}
