<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
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
            'confirm' => ['required', 'accepted'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'confirm.required' => 'Please confirm your order.',
            'confirm.accepted' => 'You must confirm your order to proceed.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $cartItems = $this->user()->cartItems()->with('product')->get();

            if ($cartItems->isEmpty()) {
                $validator->errors()->add('cart', 'Your cart is empty.');
            }

            // Validate stock availability
            foreach ($cartItems as $cartItem) {
                if ($cartItem->quantity > $cartItem->product->stock_quantity) {
                    $validator->errors()->add(
                        'cart',
                        "Insufficient stock for {$cartItem->product->name}."
                    );
                }
            }
        });
    }
}
