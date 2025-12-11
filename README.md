# 🛒 Mini Project Angular - E-Commerce Platform

A fully-featured **Angular 20** e-commerce application with user authentication, product management, category filtering, and admin dashboard. Built with standalone components and JSON Server as a mock backend API.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running the Application](#-running-the-application)
- [Default Credentials](#-default-credentials)
- [File Documentation](#-file-documentation)
- [API Endpoints](#-api-endpoints)
- [Routes & Guards](#-routes--guards)
- [Screenshots](#-screenshots)

---

## ✨ Features

### User Features
- 🔐 **User Authentication** - Login and registration system
- 📦 **Browse Products** - View all products with images, descriptions, and prices
- 🏷️ **Category Filtering** - Click on categories to filter products
- 👍👎 **Like/Dislike Products** - Interactive product engagement (for logged-in users)
- 📄 **Product Details** - View detailed information about each product

### Admin Features
- 📊 **Admin Dashboard** - View statistics (most active users, most liked/disliked products)
- 👥 **User Management** - View and delete users
- ➕ **Product Management** - Create, edit, and delete products
- 📁 **Category Management** - Create, edit, and delete categories
- 📈 **Interaction Tracking** - Monitor all user interactions

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 20.3.0 | Frontend framework |
| **TypeScript** | 5.9.2 | Programming language |
| **Bootstrap** | 5.x | CSS framework (via CDN) |
| **JSON Server** | 0.17.4 | Mock REST API |
| **RxJS** | 7.8.0 | Reactive programming |
| **Karma + Jasmine** | 6.4.0 / 5.9.0 | Unit testing |
| **Cypress** | 12.0.0 | E2E testing |

---

## 📁 Project Structure

```
mini-project-angular/
├── src/
│   ├── app/
│   │   ├── components/           # All UI components
│   │   │   ├── admin-dashboard.component.ts
│   │   │   ├── category-form.component.ts
│   │   │   ├── category-list.component.ts
│   │   │   ├── login.component.ts
│   │   │   ├── navbar.component.ts
│   │   │   ├── product-detail.component.ts
│   │   │   ├── product-form.component.ts
│   │   │   ├── product-list.component.ts
│   │   │   └── register.component.ts
│   │   │
│   │   ├── guards/               # Route protection
│   │   │   ├── admin.guard.ts    # Admin-only routes
│   │   │   └── auth.guard.ts     # Authenticated routes
│   │   │
│   │   ├── models/               # TypeScript interfaces
│   │   │   ├── category.ts
│   │   │   └── product.ts
│   │   │
│   │   ├── services/             # Business logic & API calls
│   │   │   ├── api.service.ts    # HTTP requests
│   │   │   └── auth.service.ts   # Authentication logic
│   │   │
│   │   ├── app.config.ts         # App configuration
│   │   ├── app.html              # Root template
│   │   ├── app.routes.ts         # Route definitions
│   │   ├── app.scss              # Root styles
│   │   └── app.ts                # Root component
│   │
│   ├── index.html                # Main HTML file
│   ├── main.ts                   # Application bootstrap
│   ├── styles.css                # Global CSS styles
│   └── styles.scss               # Global SCSS styles
│
├── db.json                       # Mock database (JSON Server)
├── package.json                  # Dependencies & scripts
├── angular.json                  # Angular CLI configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **Angular CLI** (optional, included in devDependencies)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aymen-Falleh/angular_project.git
   cd angular_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

---

## ▶️ Running the Application

You need to run **two terminals** - one for the API server and one for the Angular app.

### Terminal 1: Start the Mock API Server
```bash
npm run start:api
```
This starts JSON Server on `http://localhost:3000`

### Terminal 2: Start the Angular Development Server
```bash
npm start
```
This starts the Angular app on `http://localhost:4200`

### Open in Browser
Navigate to: **http://localhost:4200**

---

## 🔑 Default Credentials

### Admin Account
| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `password` |

### Regular User
You can register a new account, or use any user from the database.

---

## 📂 File Documentation

### 📌 Components (`src/app/components/`)

#### `navbar.component.ts`
**Purpose:** Main navigation bar displayed on all pages.
- Shows links to Products, Categories
- Displays Admin Dashboard link (admin only)
- Shows Login/Register buttons or Logout button based on auth state

#### `login.component.ts`
**Purpose:** User login page.
- Reactive form with username/password fields
- Form validation
- Error handling with user feedback
- Redirects to products page on success

#### `register.component.ts`
**Purpose:** User registration page.
- Reactive form with username, password, email, full name
- Password confirmation validation
- Checks for duplicate usernames
- Auto-login after successful registration

#### `product-list.component.ts`
**Purpose:** Displays all products with filtering capability.
- Lists all products with images, names, descriptions, prices
- Category filter via URL query parameter (`?categoryId=X`)
- Like/Dislike buttons for logged-in users
- Edit/Delete buttons for admins
- "Show All" button to clear category filter

#### `product-detail.component.ts`
**Purpose:** Shows detailed view of a single product.
- Full product information
- Large product image
- Category name display

#### `product-form.component.ts`
**Purpose:** Create and edit products (Admin only).
- Reactive form with all product fields
- Category dropdown selection
- Image upload with base64 encoding
- Works for both create and edit modes

#### `category-list.component.ts`
**Purpose:** Displays all categories.
- Clickable category cards (navigates to filtered products)
- Edit/Delete buttons for admins
- Add Category button for admins

#### `category-form.component.ts`
**Purpose:** Create and edit categories (Admin only).
- Reactive form with name and description
- Works for both create and edit modes

#### `admin-dashboard.component.ts`
**Purpose:** Admin statistics and management panel.
- **Statistics Cards:**
  - Most Active User (most interactions)
  - Most Liked Product
  - Most Disliked Product
- **User Management Table:** View and delete users
- **Recent Interactions Table:** Track all likes/dislikes

---

### 📌 Services (`src/app/services/`)

#### `api.service.ts`
**Purpose:** Handles all HTTP requests to the backend API.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getProducts()` | GET `/products` | Fetch all products |
| `getProduct(id)` | GET `/products/:id` | Fetch single product |
| `createProduct(p)` | POST `/products` | Create new product |
| `updateProduct(id, p)` | PUT `/products/:id` | Update product |
| `deleteProduct(id)` | DELETE `/products/:id` | Delete product |
| `getCategories()` | GET `/categories` | Fetch all categories |
| `getCategory(id)` | GET `/categories/:id` | Fetch single category |
| `createCategory(c)` | POST `/categories` | Create new category |
| `updateCategory(id, c)` | PUT `/categories/:id` | Update category |
| `deleteCategory(id)` | DELETE `/categories/:id` | Delete category |
| `login(u, p)` | GET `/users?username=&password=` | Authenticate user |
| `getUsers()` | GET `/users` | Fetch all users |
| `createUser(user)` | POST `/users` | Register new user |
| `deleteUser(id)` | DELETE `/users/:id` | Delete user |
| `getInteractions()` | GET `/interactions` | Fetch all interactions |
| `addInteraction(i)` | POST `/interactions` | Add like/dislike |
| `deleteInteraction(id)` | DELETE `/interactions/:id` | Remove interaction |

#### `auth.service.ts`
**Purpose:** Manages user authentication state.

| Method | Description |
|--------|-------------|
| `isAuthenticated()` | Check if user is logged in |
| `login(username, password)` | Authenticate and store user |
| `logout()` | Clear session and redirect |
| `register(user)` | Create new user account |
| `getUser()` | Get current user from localStorage |
| `isAdmin()` | Check if current user is admin |
| `getUserRole()` | Get current user's role |

**Storage:** Uses `localStorage` with key `mpa_user`

---

### 📌 Guards (`src/app/guards/`)

#### `auth.guard.ts`
**Purpose:** Protects routes that require authentication.
- Checks if user is logged in
- Redirects to `/login` if not authenticated

#### `admin.guard.ts`
**Purpose:** Protects admin-only routes.
- Checks if user is logged in AND is admin
- Redirects to `/login` if not authorized

---

### 📌 Models (`src/app/models/`)

#### `product.ts`
```typescript
export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  image?: string;      // base64 encoded
  createdAt?: string;
}
```

#### `category.ts`
```typescript
export interface Category {
  id?: number;
  name: string;
  description?: string;
}
```

---

### 📌 Configuration Files

#### `app.routes.ts`
Defines all application routes:

| Path | Component | Guard | Description |
|------|-----------|-------|-------------|
| `/` | - | - | Redirects to `/products` |
| `/login` | LoginComponent | - | Login page |
| `/register` | RegisterComponent | - | Registration page |
| `/products` | ProductListComponent | - | Product listing |
| `/products/add` | ProductFormComponent | AdminGuard | Add new product |
| `/products/edit/:id` | ProductFormComponent | AdminGuard | Edit product |
| `/products/:id` | ProductDetailComponent | - | Product details |
| `/categories` | CategoryListComponent | - | Category listing |
| `/categories/add` | CategoryFormComponent | AdminGuard | Add new category |
| `/categories/edit/:id` | CategoryFormComponent | AdminGuard | Edit category |
| `/admin` | AdminDashboardComponent | AdminGuard | Admin dashboard |

#### `app.config.ts`
Configures Angular application with:
- Router module
- HTTP client for API calls
- Zone.js change detection

#### `db.json`
Mock database containing:
- `products` - Product data with images
- `categories` - Category definitions
- `users` - User accounts (with roles)
- `interactions` - Like/dislike records

---

## 🌐 API Endpoints

The JSON Server provides a RESTful API at `http://localhost:3000`:

```
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id

GET    /categories
GET    /categories/:id
POST   /categories
PUT    /categories/:id
DELETE /categories/:id

GET    /users
POST   /users
DELETE /users/:id

GET    /interactions
POST   /interactions
DELETE /interactions/:id
```

---

## 🛡️ Routes & Guards

### Public Routes (No Authentication)
- `/login` - User login
- `/register` - User registration
- `/products` - Browse products
- `/products/:id` - View product details
- `/categories` - Browse categories

### Admin-Only Routes (Requires Admin Role)
- `/products/add` - Add new product
- `/products/edit/:id` - Edit product
- `/categories/add` - Add new category
- `/categories/edit/:id` - Edit category
- `/admin` - Admin dashboard

---

## 📸 Screenshots

### Product List with Category Filter
When clicking a category, products are filtered and a banner shows the current filter with a "Show All" button.

### Admin Dashboard
Displays statistics cards and management tables for users and interactions.

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start App | `npm start` | Run Angular dev server on port 4200 |
| Start API | `npm run start:api` | Run JSON Server on port 3000 |
| Build | `npm run build` | Build production bundle |
| Test | `npm test` | Run unit tests with Karma |
| E2E | `npm run e2e` | Run Cypress E2E tests |

---

## 👨‍💻 Author

**Aymen Falleh**

---

## 📄 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Bootstrap for the responsive design
- JSON Server for the simple mock API solution
