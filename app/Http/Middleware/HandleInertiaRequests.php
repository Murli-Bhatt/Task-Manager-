<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleInertiaRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        Inertia::setRootView('app');

        Inertia::share([
            'auth' => [
                'user' => $request->user(),
            ],
            'errors' => function () use ($request) {
                $errors = $request->session()->get('errors');
                if (!$errors) {
                    return (object) [];
                }
                return collect($errors->getBag('default')->getMessages())->map(function ($error) {
                    return $error[0] ?? '';
                })->all();
            },
        ]);

        return $next($request);
    }
}
