# Roxiler Systems - FullStack Intern Coding Challenge

A robust, role-based web application built to handle secure store ratings, user management, and dynamic dashboards. Developed for the Roxiler Systems FullStack Intern Coding Challenge.

## 🚀 Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Authentication:** JSON Web Tokens (JWT) & bcrypt
* **Frontend:** React.js (Setup ready)

## ✨ Core Features
* **Role-Based Access Control:** Distinct environments for System Administrators, Store Owners, and Normal Users.
* **Single Login System:** Secure, encrypted authentication flow using JWT.
* **Smart Rating System:** Utilizes PostgreSQL `ON CONFLICT` (Upsert) logic to allow users to seamlessly submit or modify 1-5 star ratings.
* **Dynamic Dashboards:**
  * **Admin:** View total platform statistics, manage users, and add new stores.
  * **Owner:** Track specific store performance and view average customer ratings.
  * **User:** Search/filter available stores and submit reviews.
* **Strict Validation:** Backend enforcement for password complexity, email formatting, and character limits.

## 🛠️ Local Setup & Installation

### 1. Database Configuration
Ensure PostgreSQL is installed and running. Create a new database named `roxiler_ratings` and execute the following schema:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'normal', 'owner')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    store_id INT REFERENCES stores(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id) 
);