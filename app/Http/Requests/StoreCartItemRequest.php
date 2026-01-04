<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class StoreCartItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $product = Product::find($this->product_id);

            if (! $product) {
                return;
            }

            // Check if user already has this product in cart
            $existingCartItem = $this->user()
                ->cartItems()
                ->where('product_id', $product->id)
                ->first();

            $requestedQuantity = (int) $this->quantity;
            $totalQuantity = $existingCartItem
                ? $existingCartItem->quantity + $requestedQuantity
                : $requestedQuantity;

            if ($totalQuantity > $product->stock_quantity) {
                $validator->errors()->add(
                    'quantity',
                    'The total quantity cannot exceed the available stock.'
                );
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'Please select a product.',
            'product_id.exists' => 'The selected product does not exist.',
            'quantity.required' => 'Please specify a quantity.',
            'quantity.integer' => 'Quantity must be a whole number.',
            'quantity.min' => 'Quantity must be at least 1.',
        ];
    }
}
