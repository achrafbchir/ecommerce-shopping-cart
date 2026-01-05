<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService
    ) {}

    /**
     * Display the user dashboard.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        // Redirect admins to admin dashboard
        if ($request->user()?->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        $data = $this->dashboardService->getUserDashboardData($request->user());

        return Inertia::render('dashboard', $data);
    }
}
