@component('mail::message')
# Daily Sales Report

## {{ now()->format('F j, Y') }}

@if($sales->isEmpty())
No sales were recorded today.
@else
**Total Sales:** {{ $sales->count() }} transaction(s)

**Total Revenue:** ${{ number_format($sales->sum('total'), 2) }}

**Total Items Sold:** {{ $sales->sum('quantity') }} unit(s)

## Sales Breakdown

@component('mail::table')
| Product | Quantity | Price | Total |
|:--------|:--------:|:-----:|:-----:|
@foreach($sales as $sale)
| {{ $sale->product->name }} | {{ $sale->quantity }} | ${{ number_format($sale->price, 2) }} | ${{ number_format($sale->total, 2) }} |
@endforeach
| **Total** | **{{ $sales->sum('quantity') }}** | - | **${{ number_format($sales->sum('total'), 2) }}** |
@endcomponent
@endif

Thanks,<br>
{{ config('app.name') }}
@endcomponent

