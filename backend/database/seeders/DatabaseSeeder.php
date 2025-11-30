<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create a regular user
        User::factory()->create([
            'name' => 'Shania Rahmalia',
            'email' => 'shania@example.com',
            'username' => 'user',
            'password' => bcrypt('12345678'),
            'phone' => '08123456789',
            'bio' => 'Saya suka kebersihan dan kenyamanan. Mari jaga lingkungan kita!',
            'role' => 'user',
        ]);

        // Create an admin user
        User::factory()->create([
            'name' => 'Admin Sairaklin',
            'email' => 'admin@sairaklin.id',
            'username' => 'admin',
            'password' => bcrypt('admin123'),
            'phone' => '+62 812-3456-7890',
            'role' => 'admin',
        ]);
    }
}
