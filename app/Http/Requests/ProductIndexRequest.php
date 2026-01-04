<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductIndexRequest extends FormRequest
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
            'search' => ['nullable', 'string', 'max:255'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'stock_status' => ['nullable', 'string', 'in:in_stock,low_stock,out_of_stock'],
            'sort_by' => ['nullable', 'string', 'in:latest,price_low,price_high,name_asc,name_desc,stock_high,stock_low'],
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
            'search.max' => 'Search term cannot exceed 255 characters.',
            'min_price.numeric' => 'Minimum price must be a valid number.',
            'min_price.min' => 'Minimum price cannot be negative.',
            'max_price.numeric' => 'Maximum price must be a valid number.',
            'max_price.min' => 'Maximum price cannot be negative.',
            'max_price.gte' => 'Maximum price must be greater than or equal to minimum price.',
            'stock_status.in' => 'Invalid stock status filter.',
            'sort_by.in' => 'Invalid sort option.',
        ];
    }
}
