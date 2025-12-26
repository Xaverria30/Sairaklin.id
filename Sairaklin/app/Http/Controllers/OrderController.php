<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role === 'admin') {
            return Order::with(['user', 'review'])->orderBy('created_at', 'desc')->get();
        }
        return $request->user()->orders()->with('review')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:orders',
            'serviceType' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'address' => 'required|string',
            'cleaningTools' => 'boolean',
            'premiumScent' => 'boolean',
            'specialNotes' => 'nullable|string',
            'workerGender' => 'nullable|string',
        ]);

        // Map frontend keys to DB columns
        $order = Order::create([
            'id' => $validated['id'],
            'user_id' => Auth::id(),
            'service_type' => $validated['serviceType'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'address' => $validated['address'],
            'cleaning_tools' => $validated['cleaningTools'] ?? false,
            'premium_scent' => $validated['premiumScent'] ?? false,
            'special_notes' => $validated['specialNotes'] ?? null,
            'worker_gender' => $validated['workerGender'] ?? null,
            'status' => 'Menunggu',
        ]);

        return response()->json($order, 201);
    }
    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()->where('id', $id)->firstOrFail();
        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->update($request->only('status'));
        return response()->json($order);
    }

    public function destroy(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->delete();
        return response()->json(['message' => 'Order deleted']);
    }
}
