# Roxiler Business Review Platform 🚀

A full-stack, three-tier web application built to connect local businesses with their customers. This platform allows users to discover local stores, leave verified reviews, and empowers business owners to manage their properties and track customer satisfaction through a dedicated analytics dashboard.

## 🛠️ Tech Stack (PERN)
* **Frontend:** React.js, Tailwind CSS, Axios, React Router
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL, `pg` (node-postgres)
* **Authentication:** JSON Web Tokens (JWT), bcryptjs

## ✨ Core Features
* **Role-Based Access Control:** Distinct, secure experiences for Users, Store Owners, and System Admins.
* **User Dashboard:** Browse registered businesses, submit 1-5 star ratings, and write detailed reviews with a "Verified Visit" feature.
* **Owner Analytics Panel:** Register new business locations and view real-time feedback with a slide-out customer review panel.
* **Admin Control Center:** Manage the entire ecosystem, view system-wide metrics, and remove users or stores as needed.

---

## 🚀 How to Run the Project Locally

Follow these steps to get the application running on your local machine.

### 1. Database Setup (PostgreSQL)
1. Open pgAdmin or your PostgreSQL CLI.
2. Create a new database named `roxiler`.
3. Open the Query Tool and run your SQL commands to create the `users`, `stores`, and `ratings` tables.

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install

```

Start the backend server (runs on `http://localhost:5000`):

```bash
npm run dev

```

### 3. Frontend Setup

Open a second, separate terminal and navigate to the frontend directory:

```bash
cd frontend
npm install

```

Start the React application (usually runs on `http://localhost:5173` or `3000`):

```bash
npm run dev

```

---

## 🔐 Master Test Credentials

To test the role-based routing, you can use the following pre-configured Admin account, or create new Owner/User accounts via the Signup page.

**System Admin:**

* **Email:** admin@roxiler.com
* **Password:** Password123!

```