<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserIndexRequest extends FormRequest
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
            'email_verified' => ['nullable', 'string', 'in:verified,unverified'],
            'sort_by' => ['nullable', 'string', 'in:latest,oldest,name_asc,name_desc,email_asc,email_desc'],
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
            'email_verified.in' => 'Invalid email verification filter.',
            'sort_by.in' => 'Invalid sort option.',
        ];
    }
}
