🚀 TurboVets Full-Stack Challenge — README
==========================================

A full-stack monorepo implementing authentication, RBAC access control, task management, organization hierarchy, user management, and activity logging.Built with **Nx**, **NestJS**, **Angular**, **TypeORM**, and **SQLite**.

📦 Tech Stack
-------------

### **Backend**

*   NestJS (REST API)
*   TypeORM + SQLite
*   JWT Authentication
*   Role-based Access Control (Owner / Admin / Viewer)
*   Organization + Sub-organization structure
*   Audit logging
    

### **Frontend**

*   Angular 17 (Standalone components)
*   TailwindCSS
*   Signals-based state management
*   Drag-and-drop Kanban task board
*   User Management UI
*   Activity Log Panel
    

🛠️ 1. Setup & Run Instructions
===============================
🔧 Prerequisites
----------------

*   Node.js v18+ (recommended v20+)
*   npm i -g nx
    

📥 Clone the repo
-----------------

git clone https://github.com/raheel2wali/rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3
cd rwali-0a19fc14-d0eb-42ed-850d-63023568a3e3


📦 Install dependencies
-----------------------

npm install

⚙️ Environment variables
------------------------

Create a .env file in the project root:

# JWT
JWT_SECRET=supersecretkey
JWT_EXPIRES=7d

# Database
DB_TYPE=sqlite
DB_PATH=./tmp/dev.sqlite


▶️ Run Backend (Nest API)
-------------------------

npx nx serve api

# Backend URL:

http://localhost:3000

▶️ Run Frontend (Angular)
-------------------------

npx nx serve dashboard

# Frontend URL:

http://localhost:4200

🧱 2. Architecture & Design Rationale
=====================================

### Monorepo layout:

* apps/
    * api/         → NestJS backend
    * dashboard/   → Angular app

* libs/
    * data/        → Shared DTOs, enums, interfaces
    * auth/        → Guards, decorators, RBAC utilities


### **Why this architecture?**

#### **1\. Clean Separation of Concerns**

*   API and Dashboard live separately → faster builds, organized structure.
    
*   Shared library ensures API & UI use the same types.
    

#### **2\. Modular Backend**

Backend is split into domain modules:

* auth/
* users/
* tasks/
* org/
* audit-log/

Each module contains:

*   Controller
*   Service
*   Entity    
*   Guards/Decorators (when needed)



#### **3\. Strong RBAC System**

Roles:

*   **Owner**
*   **Admin**
*   **Viewer**
    

Authorization enforced using decorators:

@Roles(Role.Owner, Role.Admin)
@UseGuards(JwtAuthGuard, RbacGuard)


#### **4\. Organization-First Structure**

Every user and task belongs to an organization.This naturally extends to multi-tenant architecture.

#### **5\. Angular Signals**

Lightweight state management without NgRx or RxJS boilerplate.

🔐 3. Access Control & User Roles
=================================

### **Authentication**

*   /auth/login returns a JWT
    
*   Stored in localStorage
    
*   Auto-attached to all API calls via AuthService
    

### **Authorization**

| Action               | Owner | Admin | Viewer |
| -------------        |:-----:|:-----:| :-----:|
| Create Tasks         |   ✔️  |  ✔️  |  ❌    |
| Update/Delete Tasks  |   ✔️  |  ✔️  |  ❌    |
| Create Users         |   ✔️  |  ✔️  |  ❌    |
| Change User Roles    |   ✔️  |  ❌  |  ❌    |
| Create Users         |   ✔️  |  ✔️  |  ❌    |


Backend enforces:

*   Org-level isolation
*   Role permissions
*   Ownership checks
    

🧪 4. Example API Requests (Workflows)
======================================

🔒 Register Owner
-----------------

POST api/auth/register
{
  "email": "owner@example.com",
  "password": "Passw0rd!",
  "role": "owner"
}

🔑 Login
--------

POST api/auth/login
{
  "email": "owner@example.com",
  "password": "Passw0rd!"
}

👥 Create User (Admin or Owner)
-------------------------------

POST api/users
Authorization: Bearer <token>

{
  "email": "admin@example.com",
  "password": "Passw0rd!",
  "role": "admin"
}

📋 Create Task
--------------

POST api/tasks
Authorization: Bearer <token>

{
  "title": "My Task",
  "description": "Details",
  "category": "Work",
  "status": "todo"
}

🔄 Move Task (Kanban drag-drop)
-------------------------------

PUT api/tasks/<id>
{
  "status": "inprogress"
}

📓 View Audit Log (Owner/Admin only)
------------------------------------

GET api/audit-log
Authorization: Bearer <token>

💻 5. Frontend Workflows
========================

🔐 Login Page
-------------

*   User logs in → token stored
*   Redirect to /tasks
    

🗂 Tasks Page
-------------

*   Create task
*   Drag between columns
*   Filter by search/category
*   Edit / delete
    

👥 Users Page (Admin/Owner only)
--------------------------------

*   Create users in org
*   Change user roles
*   View organization hierarchy
    

📡 Activity Log Panel (UI)
--------------------------

Logs actions like:

*   Create / update / delete tasks
*   User creation
*   Role changes
*   Login/logout
    
Always available in bottom-right corner.

🔮 6. What I Would Improve With More Time
=========================================

### **1\. Refresh Token System**

*   Access token (short lifespan)
*   Refresh token (long lifespan)
*   Secure cookie storage
    

### **2\. Advanced Audit Logging**

*   Before/after snapshots
*   IP, device, browser
*   Export logs to CSV
    

### **3\. Multi-tenant Enhancements**

*   Team-level grouping
*   Cross-organization policies
    

### **4\. Real-time UI (WebSockets)**

*   Live task updates across clients
    

### **5\. Pagination & Sorting**

*   Useful for users & large task lists
    

### **6\. Automated Testing**

*   Unit tests for guards, RBAC
*   E2E UI tests for workflows
    

### **7\. CI/CD pipelines**

*   GitHub Actions: lint, test, build, deploy
