<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Post;
use App\Models\Category;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('category')
            ->select(
                'id',
                'category_id',
                'title',
                'slug',
                'content',
                'thumbnail',
                'created_at',
                'updated_at'
            )
            ->latest()
            ->get()
            ->map(function ($post) {
                $isNotUpdated = $post->getRawOriginal('updated_at') === $post->getRawOriginal('created_at');
                return [
                    'id' => $post->id,
                    'category_id' => $post->category_id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'content' => $post->content,
                    'thumbnail' => $post->thumbnail,
                    'category' => $post->category,
                    'created_at' => $post->created_at,
                    'updated_at' => $isNotUpdated ? '-' : $post->updated_at,
                ];
            });

        $categories = Category::select(
            'id',
            'name'
        )->get();

        return Inertia::render(
            'posts/index',
            [
                'posts' => $posts,
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
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'max:255'],
            'content' => ['required'],
        ]);

        $slug = Str::slug($request->title);

        if (
            Post::where('slug', $slug)
            ->exists()
        ) {

            return back()->withErrors([
                'title' => 'Artikel dengan judul tersebut sudah tersedia.',
            ]);
        }

        Post::create([
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'created_at' => now(),
            'updated_at' => '',
            'thumbnail' => '',
        ]);

        return redirect()->route('posts.index');
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
        Post $post
    ) {
        $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'max:255'],
            'content' => ['required'],
        ]);

        $slug = Str::slug($request->title);

        if (
            Post::where('slug', $slug)
            ->where('id', '!=', $post->id)
            ->exists()
        ) {

            return back()->withErrors([
                'title' => 'Artikel dengan judul tersebut sudah tersedia.',
            ]);
        }

        $post->update([
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'updated_at' => now(),
        ]);

        return redirect()->route('posts.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('posts.index');
    }
}
