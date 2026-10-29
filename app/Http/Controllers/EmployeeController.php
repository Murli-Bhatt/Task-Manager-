<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = User::where('role', 'employee')
            ->with(['assignedTasks'])
            ->get()
            ->map(function ($emp) {
                $pending = $emp->assignedTasks->where('status', 'pending')->count();
                $inProgress = $emp->assignedTasks->where('status', 'in_progress')->count();
                $completed = $emp->assignedTasks->where('status', 'completed')->count();
                $total = $emp->assignedTasks->count();

                return [
                    'id' => $emp->id,
                    'name' => $emp->name,
                    'email' => $emp->email,
                    'pending_count' => $pending,
                    'in_progress_count' => $inProgress,
                    'completed_count' => $completed,
                    'total_count' => $total,
                ];
            });

        return Inertia::render('Admin/Employees', [
            'employees' => $employees,
        ]);
    }
}

