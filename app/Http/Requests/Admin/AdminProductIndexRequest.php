<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminProductIndexRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
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
            'stock_status' => ['nullable', 'string', 'in:in_stock,low_stock,out_of_stock'],
            'sort_by' => ['nullable', 'string', 'in:latest,name_asc,name_desc,price_low,price_high,stock_high,stock_low'],
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
            'stock_status.in' => 'Invalid stock status filter.',
            'sort_by.in' => 'Invalid sort option.',
        ];
    }
}
