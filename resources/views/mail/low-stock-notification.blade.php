@component('mail::message')
# Low Stock Alert

The product **{{ $product->name }}** is running low on stock.

**Current Stock:** {{ $product->stock_quantity }} units

**Price:** ${{ number_format($product->price, 2) }}

Please consider restocking this product soon.

@component('mail::button', ['url' => route('products.index')])
View Products
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent

