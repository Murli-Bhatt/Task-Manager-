# Enterprise Task Manager

An enterprise-grade, role-aware Task Management & Team Analytics platform built with **Laravel 11/13**, **Inertia.js v2**, **React 19**, and **Tailwind CSS v4**.

Designed with a high-contrast FinTech aesthetic featuring **Midnight Black (`#030407`)**, **Electric Cobalt Blue (`#1568C9`)**, and **Acid Lime (`#D4FF24`)**, complete with a viewport-locked persistent sidebar and responsive real-time analytics.

---

## 🚀 Features

* **Dual-Role Authorization System (RBAC):**
  * **Admin:** Global task visibility, employee task assignment & reassignment, deletion privileges, and access to the dedicated `/employees` team workload dashboard.
  * **Employee:** Strict personal view scoping to assigned or authored tasks. Prohibited from reassigning tasks or deleting tasks created by others.
* **Persistent Fixed Sidebar:**
  * Viewport-locked layout (`html, body { overflow: hidden }`) ensuring the brand header, navigation, user profile, and **Log out** button never scroll out of view. Only content tables and forms scroll.
* **Team Progress & Workload Analytics:**
  * **Dashboard:** Electric Cobalt Blue team completion hero card (`29% done · 8 of 28 tasks`) with unassigned task alerts.
  * **Employees Analytics (`/employees`):** Segmented multi-colored progress bars (Amber for Pending, Cobalt for In Progress, Lime for Completed).
* **Interactive 2-Column Task Forms:**
  * Segmented button group selectors for **Status** (`Pending`, `In Progress`, `Completed`) and **Priority** (`Low`, `Medium`, `High`).
  * Live **Task Summary** card with real-time reactive assignee preview and deadline badge calculations (*"Tomorrow"*, *"Today"*).
* **Enterprise Security Architecture:**
  * Policy-driven model authorization via `TaskPolicy`.
  * Middleware route protection via `EnsureAdmin`.
  * Eager loading queries (`with('assignee:id,name,email')`) eliminating the N+1 query problem.
  * Session fixation defense and CSRF protection.

---

## 🛠️ Tech Stack

* **Backend:** PHP 8.3+, Laravel 11/13, MySQL (InnoDB)
* **Frontend:** Inertia.js v2, React 19, Tailwind CSS v4, Vite 8
* **Database Engine:** MySQL with foreign key cascading (`cascadeOnDelete`, `nullOnDelete`)

---

## 📦 Local Installation & Setup

### 1. Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd task-manager
```

### 2. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Generate application key
php artisan key:generate
```

Configure your database connection in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_manager
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Run Migrations & Seed Baseline Data
```bash
php artisan migrate --seed
```

### 5. Compile Frontend & Launch Dev Servers
```bash
# Terminal 1: Vite Dev Server
npm run dev

# Terminal 2: Laravel Artisan Server
php artisan serve
```

Visit the application at: **`http://localhost:8000`**

---

## 🔑 Seeded Demo Credentials

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` | Full administrative privileges, task assignment & workload metrics |
| **Employee** | `amit@example.com` | `password123` | Software Engineer (9 assigned tasks) |
| **Employee** | `priya@example.com` | `password123` | UI/UX Designer (9 assigned tasks) |
| **Employee** | `rahul@example.com` | `password123` | DevOps Engineer (6 assigned tasks) |

---

## 📄 License
Open-source software licensed under the [MIT license](LICENSE).
