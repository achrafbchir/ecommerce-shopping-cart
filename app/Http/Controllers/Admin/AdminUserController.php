<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminUserIndexRequest;
use App\Http\Requests\Admin\DeleteUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(AdminUserIndexRequest $request): Response
    {
        $query = User::where('is_admin', false);

        // Search filter
        $query->when($request->search, function ($q, $search) {
            $q->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        });

        // Filter by email verification status
        $query->when($request->email_verified, function ($q, $verified) {
            if ($verified === 'verified') {
                $q->whereNotNull('email_verified_at');
            } elseif ($verified === 'unverified') {
                $q->whereNull('email_verified_at');
            }
        });

        // Sorting
        $sortBy = $request->get('sort_by', 'latest');
        match ($sortBy) {
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            'email_asc' => $query->orderBy('email', 'asc'),
            'email_desc' => $query->orderBy('email', 'desc'),
            'oldest' => $query->oldest(),
            default => $query->latest(),
        };

        $users = $query->withCount('cartItems')
            ->paginate(15)
            ->withQueryString()
            ->through(function ($user) {
                $user->cart_items_count = $user->cart_items_count;
                $user->has_active_cart = $user->cart_items_count > 0;

                return $user;
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'email_verified', 'sort_by']),
        ]);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        // Prevent viewing admin users
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

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'cartItems' => $cartItems,
            'cartTotal' => $cartTotal,
        ]);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(DeleteUserRequest $request, User $user): RedirectResponse
    {
        // Prevent deleting admin users
        if ($user->isAdmin()) {
            abort(403, 'Cannot delete admin users.');
        }

        // Prevent deleting yourself
        if ($user->id === $request->user()->id) {
            return redirect()->route('admin.users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $userName = $user->name;
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', "User {$userName} has been deleted successfully.");
    }
}
