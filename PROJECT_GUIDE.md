# Angular Mini-Project: Complete Guide

This guide explains how the "Mini Project Angular" application works from scratch. It is designed for someone with no prior Angular knowledge.

## 1. Project Overview
This is an **E-commerce Application** with an **Admin Dashboard**.
-   **Users** can browse products, view details, like/dislike items, and register/login.
-   **Admins** can view statistics (most active users, popular products) and manage users (delete accounts).

## 2. Architecture
The application consists of two main parts:
1.  **Frontend (Angular)**: The user interface running in the browser (port 4200).
2.  **Backend (JSON Server)**: A fake REST API that stores data in `db.json` (port 3000).

### How they talk
The Angular app sends HTTP requests (GET, POST, DELETE) to the JSON Server to read and save data.

## 3. Angular Basics (The "Building Blocks")
Angular apps are built using **Components** and **Services**.

### Components (`.component.ts` + `.html`)
Think of a component as a "page" or a "part of a page".
-   **Logic (`.ts`)**: Handles data and user actions (e.g., "what happens when I click this button?").
-   **Template (`.html`)**: Defines how it looks (HTML with special Angular tags).
-   **Selector**: A custom HTML tag (e.g., `<app-product-list>`) used to place the component.

### Services (`.service.ts`)
Services handle data and logic shared across components. They are "injected" into components.
-   **`ApiService`**: Handles all communication with the backend (fetching products, users, etc.).
-   **`AuthService`**: Handles login, logout, and checking if a user is an admin.

### Routing (`app.routes.ts`)
Angular is a "Single Page Application" (SPA). It doesn't reload the page when you click a link. Instead, the **Router** swaps the component displayed in the `<router-outlet>` tag based on the URL.

## 4. Key Features & Implementation

### A. Authentication (Login/Register)
-   **Login**: The user enters credentials. `AuthService` checks them against the backend. If valid, the user object is saved to `localStorage` (browser memory) to keep them logged in.
-   **Register**: New user data is sent to the backend via `ApiService`.
-   **Guards (`auth.guard.ts`)**: These are security checkpoints. They check if a user is allowed to visit a route (e.g., only admins can visit `/admin`).

### B. Products
-   **List**: `ProductListComponent` fetches all products from `ApiService` and displays them using a loop (`*ngFor`).
-   **Details**: Clicking a product navigates to `/products/:id`. The `ProductDetailComponent` reads the `id` from the URL and fetches that specific product.
-   **Interactions**: When you "Like" a product, `ApiService` sends a POST request to save that interaction in `db.json`.

### C. Admin Dashboard
-   **Stats**: The dashboard calculates "Most Active User" or "Most Liked Product" by processing the raw interaction data from the backend.
-   **User Management**: It lists all users. Clicking "Delete" calls `ApiService.deleteUser(id)`, which sends a DELETE request to the backend.

## 5. Design (State of the Art)
The application uses a modern **Glassmorphism** design.
-   **Variables**: Colors and effects are defined in `styles.css` as CSS variables (e.g., `--glass-bg`).
-   **Background**: A deep, animated gradient background gives a premium feel.
-   **Glass Effect**: Cards use `backdrop-filter: blur()` to look like frosted glass floating over the background.

## 6. Detailed File Structure
Here is a breakdown of the key files and directories:

-   `src/`
    -   `index.html`: The single HTML page that hosts the app.
    -   `main.ts`: The entry point that bootstraps the Angular application.
    -   `styles.css`: Global CSS file containing theme variables and glassmorphism styles.
    -   `app/`
        -   `app.component.ts`: The root component. It defines the main layout (Navbar + Router Outlet).
        -   `app.routes.ts`: Configuration for the router. Maps URLs to components.
        -   `app.config.ts`: Application-wide configuration (providers, HTTP client setup).
        -   `auth.guard.ts`: A function that protects routes. It checks `AuthService.isAdmin()` before allowing access to `/admin`.
        -   `components/`:
            -   `login.component.ts`: Handles user login form and calls `AuthService.login()`.
            -   `register.component.ts`: Handles registration form and calls `AuthService.register()`.
            -   `product-list.component.ts`: Fetches and displays the list of products.
            -   `product-detail.component.ts`: Shows details for a single product and handles "Like/Dislike".
            -   `admin-dashboard.component.ts`: The complex admin view with stats and user management.
        -   `services/`:
            -   `api.service.ts`: The bridge to the backend. Contains methods like `getProducts()`, `createUser()`, `deleteUser()`.
            -   `auth.service.ts`: Manages user session (login state, role, localStorage).
        -   `models/`:
            -   `product.ts`, `category.ts`: TypeScript interfaces defining the shape of data objects.

## 7. Code Highlights (How it works under the hood)

### A. The Magic of `AuthService`
The `AuthService` uses the browser's `localStorage` to remember you.
```typescript
// auth.service.ts
login(username, password) {
  // 1. Ask backend if user exists
  return this.api.login(username, password).then(user => {
    if (user) {
      // 2. Save user to browser storage
      localStorage.setItem('mpa_user', JSON.stringify(user));
      return true;
    }
    return false;
  });
}
```
When you refresh the page, the app checks `localStorage` to see if you are still logged in.

### B. Calculating Admin Stats
The dashboard doesn't just show raw data; it processes it.
```typescript
// admin-dashboard.component.ts
calculateStats() {
  // 1. Count how many times each user interacted
  const userCounts = {};
  this.interactions.forEach(i => {
    userCounts[i.userId] = (userCounts[i.userId] || 0) + 1;
  });
  
  // 2. Find the highest number
  // 3. Display all users who match that highest number (handling ties!)
}
```
This logic ensures that if two users are equally active, both are shown as "Most Active".

### C. Glassmorphism CSS
The "cool" look comes from a few lines of CSS in `styles.css`:
```css
.card {
  background: rgba(255, 255, 255, 0.05); /* Mostly transparent */
  backdrop-filter: blur(8px);            /* Blurs what's behind it */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); /* Glow */
}
```
This makes the UI elements look like frosted glass floating in 3D space.

## 8. How to Run
1.  **Start Backend**: `npm run start:api` (Runs JSON Server on port 3000).
2.  **Start Frontend**: `npm start` (Runs Angular on port 4200).
3.  **Open**: Go to `http://localhost:4200`.

## 8. Recommended VS Code Extensions
To have the best development experience, install these extensions:
-   **Angular Language Service**: Provides code completion, navigation, and error checking for Angular templates.
-   **ESLint**: Finds and fixes problems in your JavaScript/TypeScript code.
-   **Prettier - Code formatter**: Keeps your code style consistent.
-   **Material Icon Theme**: Makes your file explorer look great with proper icons.
-   **Auto Rename Tag**: Automatically renames the paired HTML tag.
