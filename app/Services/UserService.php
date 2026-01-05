<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    /**
     * Get paginated list of users with filters.
     */
    public function getPaginatedUsers(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = User::where('is_admin', false);

        // Search filter
        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }

        // Filter by email verification status
        if (! empty($filters['email_verified'])) {
            match ($filters['email_verified']) {
                'verified' => $query->whereNotNull('email_verified_at'),
                'unverified' => $query->whereNull('email_verified_at'),
                default => $query,
            };
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'latest';
        match ($sortBy) {
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            'email_asc' => $query->orderBy('email', 'asc'),
            'email_desc' => $query->orderBy('email', 'desc'),
            'oldest' => $query->oldest(),
            default => $query->latest(),
        };

        return $query->withCount('cartItems')
            ->paginate($perPage)
            ->withQueryString()
            ->through(function ($user) {
                $user->has_active_cart = $user->cart_items_count > 0;

                return $user;
            });
    }

    /**
     * Get user with cart information.
     */
    public function getUserWithCart(User $user): array
    {
        if ($user->isAdmin()) {
            abort(404);
        }

        $user->loadCount('cartItems');
        $cartItems = $user->cartItems()->with('product')->get();

        // Calculate cart statistics
        $cartTotal = $cartItems->sum(function ($item) {
            return $item->quantity * (float) $item->product->price;
        });

        // Add image URLs to cart items
        $cartItems->transform(function ($item) {
            $item->product->image_url = $item->product->getImageUrl();
            $item->total_price = $item->quantity * (float) $item->product->price;

            return $item;
        });

        return [
            'user' => $user,
            'cartItems' => $cartItems,
            'cartTotal' => $cartTotal,
        ];
    }

    /**
     * Delete a user.
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    public function deleteUser(User $user, User $currentUser): string
    {
        // Prevent deleting admin users
        if ($user->isAdmin()) {
            abort(403, 'Cannot delete admin users.');
        }

        // Prevent deleting yourself
        if ($user->id === $currentUser->id) {
            abort(403, 'You cannot delete your own account.');
        }

        $userName = $user->name;
        $user->delete();

        return $userName;
    }
}
