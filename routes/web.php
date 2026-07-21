<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource(
        'categories',
        CategoryController::class
    );
    Route::resource(
        'posts',
        PostController::class
    )->middleware(['auth', 'verified']);
});
require __DIR__ . '/settings.php';
