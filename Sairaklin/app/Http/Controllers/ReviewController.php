<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string',
        ]);

        $order = Order::findOrFail($validated['order_id']);

        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->review()->exists()) {
             return response()->json(['message' => 'Order already reviewed'], 400);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'order_id' => $validated['order_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['review'],
        ]);

        return response()->json($review, 201);
    }
    public function stats()
    {
        $ratingCount = Review::count();
        $ratingAvg = Review::avg('rating') ?? 0;
        
        // Get recent 5 star reviews
        $recentReviews = Review::with('user:id,name')
            ->where('rating', 5)
            ->whereNotNull('comment')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'average_rating' => round($ratingAvg, 1),
            'total_reviews' => $ratingCount,
            'recent_reviews' => $recentReviews
        ]);
    }
}
