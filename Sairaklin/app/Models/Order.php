<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Order extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'service_type',
        'date',
        'time',
        'address',
        'cleaning_tools',
        'premium_scent',
        'special_notes',
        'worker_gender',
        'status',
        'total_price',
    ];

    protected $casts = [
        'cleaning_tools' => 'boolean',
        'premium_scent' => 'boolean',
        'date' => 'date',
        'total_price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
