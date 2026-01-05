<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminUserIndexRequest;
use App\Http\Requests\Admin\DeleteUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    /**
     * Display a listing of the users.
     */
    public function index(AdminUserIndexRequest $request): Response
    {
        $users = $this->userService->getPaginatedUsers(
            $request->only(['search', 'email_verified', 'sort_by'])
        );

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
        $data = $this->userService->getUserWithCart($user);

        return Inertia::render('Admin/Users/Show', $data);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(DeleteUserRequest $request, User $user): RedirectResponse
    {
        try {
            $userName = $this->userService->deleteUser($user, $request->user());

            return redirect()->route('admin.users.index')
                ->with('success', "User {$userName} has been deleted successfully.");
        } catch (\Illuminate\Http\Exceptions\HttpResponseException $e) {
            if ($e->getStatusCode() === 403 && str_contains($e->getMessage(), 'your own account')) {
                return redirect()->route('admin.users.index')
                    ->with('error', 'You cannot delete your own account.');
            }

            throw $e;
        }
    }
}
