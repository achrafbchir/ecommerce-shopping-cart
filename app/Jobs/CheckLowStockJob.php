<?php

namespace App\Jobs;

use App\Mail\LowStockNotification;
use App\Models\Product;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class CheckLowStockJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Product $product,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $admin = User::where('email', config('ecommerce.admin_email'))->first();

        if ($admin) {
            Mail::to($admin)->send(new LowStockNotification($this->product));
        }
    }
}
