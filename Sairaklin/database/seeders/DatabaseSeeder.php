<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Admin User
        User::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'email' => 'admin@sairaklin.id',
            'password' => Hash::make('admin123'), // Default password
            'role' => 'admin',
            'bio' => 'Administrator Account',
            'phone' => '081234567890'
        ]);

        // Regular User
        User::create([
            'name' => 'User Sairaklin',
            'username' => 'user',
            'email' => 'user@sairaklin.id',
            'password' => Hash::make('user123'), // Default password
            'role' => 'user',
            'bio' => 'Regular User Account',
            'phone' => '089876543210'
        ]);
    }
}
