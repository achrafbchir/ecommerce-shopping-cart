<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Admin Email
    |--------------------------------------------------------------------------
    |
    | The email address of the admin user who will receive notifications
    | for low stock alerts and daily sales reports.
    |
    */

    'admin_email' => env('ADMIN_EMAIL', 'admin@example.com'),

    /*
    |--------------------------------------------------------------------------
    | Low Stock Threshold
    |--------------------------------------------------------------------------
    |
    | The threshold below which a product is considered to be low in stock.
    | When a product's stock quantity falls at or below this value, a
    | notification email will be sent to the admin.
    |
    */

    'low_stock_threshold' => env('LOW_STOCK_THRESHOLD', 10),
];
