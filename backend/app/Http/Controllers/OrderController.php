<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->orders()->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_type' => 'required|string',
            'service_price' => 'required|numeric',
            'date' => 'required|date',
            'time' => 'required',
            'address' => 'required|string',
            'cleaning_tools' => 'boolean',
            'premium_scent' => 'boolean',
            'special_notes' => 'nullable|string',
            'total_price' => 'required|numeric',
        ]);

        $order = $request->user()->orders()->create($validated);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()->findOrFail($id);
        return $order;
    }
}
