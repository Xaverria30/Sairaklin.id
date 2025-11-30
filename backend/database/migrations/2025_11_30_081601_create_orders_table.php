<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('service_type');
            $table->decimal('service_price', 10, 2);
            $table->date('date');
            $table->time('time');
            $table->text('address');
            $table->boolean('cleaning_tools')->default(false);
            $table->boolean('premium_scent')->default(false);
            $table->text('special_notes')->nullable();
            $table->decimal('total_price', 10, 2);
            $table->string('status')->default('Menunggu');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
