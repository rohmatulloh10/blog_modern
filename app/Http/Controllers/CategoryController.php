<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Str;
// use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::select(
            'id',
            'name',
            'slug'
        )
            ->latest()
            ->get();
        return Inertia::render(
            'categories/index',
            [
                'categories' => $categories,
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'max:100'],
        ]);

        $slug = Str::slug($request->name);

        if (Category::where('slug', $slug)->exists()) {

            return back()->withErrors([
                'name' => 'Kategori dengan nama tersebut sudah tersedia.',
            ]);
        }

        Category::create([
            'name' => $request->name,
            'slug' => $slug,
        ]);

        return redirect()->route('categories.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        Category $category
    ) {
        $request->validate([
            'name' => ['required', 'max:100'],
        ]);

        $slug = Str::slug($request->name);

        if (
            Category::where('slug', $slug)
            ->where('id', '!=', $category->id)
            ->exists()
        ) {

            return back()->withErrors([
                'name' => 'Kategori dengan nama tersebut sudah tersedia.',
            ]);
        }

        $category->update([
            'name' => $request->name,
            'slug' => $slug,
        ]);

        return redirect()->route('categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->posts()->exists()) {

            return back()->withErrors([
                'delete' => 'Kategori masih digunakan oleh artikel.',
            ]);
        }

        $category->delete();

        return redirect()->route('categories.index');
    }
}
