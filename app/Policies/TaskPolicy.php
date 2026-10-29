<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function view(User $user, Task $task): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $task->assigned_to === $user->id || $task->created_by === $user->id;
    }

    public function update(User $user, Task $task): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $task->assigned_to === $user->id || $task->created_by === $user->id;
    }

    public function delete(User $user, Task $task): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $task->created_by === $user->id;
    }

    public function assign(User $user): bool
    {
        return $user->isAdmin();
    }
}
