<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'service_type',
        'service_price',
        'date',
        'time',
        'address',
        'cleaning_tools',
        'premium_scent',
        'special_notes',
        'total_price',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
