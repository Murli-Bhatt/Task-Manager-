<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $isAdmin = $user->isAdmin();

        if ($isAdmin) {
            $tasks = Task::with('assignee:id,name,email')
                ->orderBy('created_at', 'desc')
                ->get();

            $employees = User::where('role', 'employee')
                ->select('id', 'name')
                ->get();
        } else {
            $tasks = Task::where('assigned_to', $user->id)
                ->orWhere('created_by', $user->id)
                ->with('assignee:id,name,email')
                ->orderBy('created_at', 'desc')
                ->get();

            $employees = [];
        }

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'employees' => $employees,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $employees = $user->isAdmin()
            ? User::where('role', 'employee')->select('id', 'name')->get()
            : [];

        return Inertia::render('Tasks/Create', [
            'employees' => $employees,
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function store(StoreTaskRequest $request)
    {
        $user = Auth::user();
        $data = $request->validated();
        $data['created_by'] = $user->id;

        if (!$user->isAdmin()) {
            // Employee can only assign to themselves
            $data['assigned_to'] = $user->id;
        }

        Task::create($data);

        return redirect()->route('tasks.index');
    }

    public function show(Task $task)
    {
        if (Gate::denies('view', $task)) {
            abort(403, 'Unauthorized access to task.');
        }

        return redirect()->route('tasks.index');
    }

    public function edit(Task $task)
    {
        if (Gate::denies('update', $task)) {
            abort(403, 'Unauthorized access to edit this task.');
        }

        $user = Auth::user();
        $employees = $user->isAdmin()
            ? User::where('role', 'employee')->select('id', 'name')->get()
            : [];

        return Inertia::render('Tasks/Edit', [
            'task' => $task->load(['assignee:id,name', 'creator:id,name']),
            'employees' => $employees,
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        if (Gate::denies('update', $task)) {
            abort(403, 'Unauthorized access to update this task.');
        }

        $user = Auth::user();
        $data = $request->validated();

        if (!$user->isAdmin()) {
            // Employees cannot reassign tasks
            unset($data['assigned_to']);
        }

        $task->update($data);

        return redirect()->route('tasks.index');
    }

    public function destroy(Task $task)
    {
        if (Gate::denies('delete', $task)) {
            abort(403, 'Unauthorized access to delete this task.');
        }

        $task->delete();

        return redirect()->route('tasks.index');
    }
}
