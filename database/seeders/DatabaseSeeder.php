<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1 Admin
        $admin = User::create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // 3 Employees
        $amit = User::create([
            'name' => 'Amit Sharma',
            'email' => 'amit@example.com',
            'password' => Hash::make('password123'),
            'role' => 'employee',
        ]);

        $priya = User::create([
            'name' => 'Priya Verma',
            'email' => 'priya@example.com',
            'password' => Hash::make('password123'),
            'role' => 'employee',
        ]);

        $rahul = User::create([
            'name' => 'Rahul Singh',
            'email' => 'rahul@example.com',
            'password' => Hash::make('password123'),
            'role' => 'employee',
        ]);

        // Tasks for Amit Sharma (Pending: 3, In progress: 4, Completed: 2 = 9)
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $amit->id,
            'title' => 'Prepare client proposal',
            'description' => 'Draft the detailed scope and budget estimates for prospective client',
            'status' => 'in_progress',
            'priority' => 'high',
            'due_date' => '2026-11-02',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $amit->id,
            'title' => 'Design database schema',
            'description' => 'Entity relationship diagrams for core tables',
            'status' => 'completed',
            'priority' => 'medium',
            'due_date' => '2026-10-25',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $amit->id,
            'title' => 'Setup CI/CD pipeline',
            'description' => 'Automate testing and deployments on GitHub Actions',
            'status' => 'pending',
            'priority' => 'high',
            'due_date' => '2026-11-06',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $amit->id,
            'title' => 'Review client feedback',
            'description' => 'Go over comments on user journey wireframes',
            'status' => 'pending',
            'priority' => 'medium',
            'due_date' => '2026-11-08',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $amit->id,
            'title' => 'Optimize SQL queries',
            'description' => 'Improve indexing on heavy transaction tables',
            'status' => 'pending',
            'priority' => 'low',
            'due_date' => '2026-11-12',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $amit->id,
            'title' => 'Integrate Payment Gateway',
            'description' => 'Stripe checkout and webhook listener setup',
            'status' => 'in_progress',
            'priority' => 'high',
            'due_date' => '2026-11-04',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $amit->id,
            'title' => 'Refactor auth controller',
            'description' => 'Clean up session handling and cookie security',
            'status' => 'in_progress',
            'priority' => 'medium',
            'due_date' => '2026-11-03',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $amit->id,
            'title' => 'Write API documentation',
            'description' => 'Swagger/OpenAPI documentation for public endpoints',
            'status' => 'in_progress',
            'priority' => 'low',
            'due_date' => '2026-11-10',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $amit->id,
            'title' => 'Implement password reset flow',
            'description' => 'Token email dispatch and password reset page',
            'status' => 'completed',
            'priority' => 'high',
            'due_date' => '2026-10-26',
        ]);

        // Tasks for Priya Verma (Pending: 2, In progress: 3, Completed: 4 = 9)
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $priya->id,
            'title' => 'Fix login redirect bug',
            'description' => 'Resolve session redirection after authenticating',
            'status' => 'pending',
            'priority' => 'high',
            'due_date' => '2026-10-30',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $priya->id,
            'title' => 'Design dashboard navigation UI',
            'description' => 'Create responsive sidebar and topbar navigation',
            'status' => 'pending',
            'priority' => 'medium',
            'due_date' => '2026-11-07',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $priya->id,
            'title' => 'Frontend state management',
            'description' => 'Sync filter state with Inertia visit parameters',
            'status' => 'in_progress',
            'priority' => 'high',
            'due_date' => '2026-11-01',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $priya->id,
            'title' => 'Build user profile modal',
            'description' => 'Allow users to update name and notification settings',
            'status' => 'in_progress',
            'priority' => 'medium',
            'due_date' => '2026-11-05',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $priya->id,
            'title' => 'Mobile responsive audit',
            'description' => 'Fix viewport scaling on phone screens',
            'status' => 'in_progress',
            'priority' => 'low',
            'due_date' => '2026-11-09',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $priya->id,
            'title' => 'Setup Tailwind v4 theme',
            'description' => 'Configure custom color palettes and fonts',
            'status' => 'completed',
            'priority' => 'medium',
            'due_date' => '2026-10-24',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $priya->id,
            'title' => 'Task priority badge components',
            'description' => 'Color-coded pill badges for priorities',
            'status' => 'completed',
            'priority' => 'low',
            'due_date' => '2026-10-22',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $priya->id,
            'title' => 'Toast notification system',
            'description' => 'Flash message banners on save and delete',
            'status' => 'completed',
            'priority' => 'high',
            'due_date' => '2026-10-20',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $priya->id,
            'title' => 'Accessibility review',
            'description' => 'Ensure keyboard navigation and ARIA attributes',
            'status' => 'completed',
            'priority' => 'medium',
            'due_date' => '2026-10-23',
        ]);

        // Tasks for Rahul Singh (Pending: 3, In progress: 2, Completed: 1 = 6)
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $rahul->id,
            'title' => 'Configure Redis caching',
            'description' => 'Cache repeated dashboard queries to reduce DB hits',
            'status' => 'pending',
            'priority' => 'high',
            'due_date' => '2026-11-04',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $rahul->id,
            'title' => 'Automated backup script',
            'description' => 'Daily mysqldump with automated S3 sync',
            'status' => 'pending',
            'priority' => 'medium',
            'due_date' => '2026-11-11',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $rahul->id,
            'title' => 'Audit server packages',
            'description' => 'Update PHP extensions and npm security advisories',
            'status' => 'pending',
            'priority' => 'low',
            'due_date' => '2026-11-15',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $rahul->id,
            'title' => 'Setup Sentry error tracking',
            'description' => 'Report frontend and backend exceptions',
            'status' => 'in_progress',
            'priority' => 'high',
            'due_date' => '2026-11-02',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $rahul->id,
            'title' => 'Load testing benchmark',
            'description' => 'Simulate 500 concurrent users using k6',
            'status' => 'in_progress',
            'priority' => 'medium',
            'due_date' => '2026-11-07',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => $rahul->id,
            'title' => 'Install SSL certificates',
            'description' => 'Setup Let\'s Encrypt auto-renewal',
            'status' => 'completed',
            'priority' => 'high',
            'due_date' => '2026-10-18',
        ]);

        // Unassigned Tasks (3 tasks)
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => null,
            'title' => 'Update project README',
            'description' => 'Document installation and deployment steps',
            'status' => 'pending',
            'priority' => 'medium',
            'due_date' => '2026-11-05',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => null,
            'title' => 'Clean up unused assets',
            'description' => 'Remove old font files and unused images from public directory',
            'status' => 'pending',
            'priority' => 'low',
            'due_date' => '2026-11-14',
        ]);
        Task::create([
            'created_by' => $admin->id,
            'assigned_to' => null,
            'title' => 'Explore dark mode theme',
            'description' => 'Evaluate contrast ratios and styling approach for dark mode',
            'status' => 'in_progress',
            'priority' => 'low',
            'due_date' => '2026-11-20',
        ]);
    }
}
