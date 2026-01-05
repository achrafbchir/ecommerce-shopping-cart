<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService
    ) {}

    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        $data = $this->dashboardService->getAdminDashboardStatistics();

        return Inertia::render('Admin/Dashboard', $data);
    }
}
