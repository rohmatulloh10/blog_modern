<?php

namespace App\Models;

use App\Models\Category;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class Post extends Model
{
    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) =>
            Carbon::parse($value)->translatedFormat('d F Y')
        );
    }
    protected function updatedAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) =>
            Carbon::parse($value)->translatedFormat('d F Y')
        );
    }
    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'thumbnail',
        'content',
    ];

    public function category()
    {
        return $this->belongsTo(
            Category::class
        );
    }
}
