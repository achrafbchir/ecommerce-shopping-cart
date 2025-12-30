<?php

namespace App\Jobs;

use App\Mail\DailySalesReport;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReportJob implements ShouldQueue
{
    use Queueable;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $today = now()->startOfDay();
        $tomorrow = now()->copy()->addDay()->startOfDay();

        $sales = Sale::whereBetween('sold_at', [$today, $tomorrow])
            ->with('product')
            ->get();

        $admin = User::where('email', config('ecommerce.admin_email'))->first();

        if ($admin) {
            Mail::to($admin)->send(new DailySalesReport($sales));
        }
    }
}
