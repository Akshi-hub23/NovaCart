# NovaCart

NovaCart is a production-style full-stack e-commerce portfolio application built to demonstrate practical full-stack software development skills, clean architecture, responsive design, secure REST APIs, and modern database management.

---

## 1. Project Overview

NovaCart aims to deliver a modern storefront experience with robust backend API services.

The customer experience includes API-driven category navigation with a compact sticky state, plus a Burgundy account dashboard for personal details, orders, saved addresses, and wishlist management. Customers can update their name; Orders and Wishlist reuse their existing APIs within Profile.

### Step 91 UI redesign

The customer storefront now follows a compact marketplace shopping structure: prominent search, category navigation, shortcut departments, promotional merchandising, horizontal product sections, brand discovery, responsive product results, and practical product details. Backend APIs, authentication, cart, orders, reviews, and admin workflows were left unchanged.

### Step 93 Product filters

The Products page now has a responsive marketplace filter experience with API-backed categories, price ranges, custom price bounds, stock availability, active filter chips, clear actions, search/sort/pagination integration, and a mobile filter drawer. Brand, rating, discount, and gender filters remain deferred because those fields are not present in the current Product model.

### Step 94 Global design system

Step 94 completed - NovaCart global design system and visual consistency updated. Shared colors, typography, spacing, container sizing, buttons, inputs, focus states, cards, shadows, and responsive foundations now follow one consistent marketplace visual system. The frontend color tokens now use a premium Burgundy palette with Terracotta CTAs, while Success green and Rating Gold remain unchanged.

### Step 95 Product image navigation

Step 95 completed - Product images now navigate to Product Details.

### Step 96 Authentication pages

Step 96 completed - Login and Register pages redesigned with the NovaCart global design system.

### Step 97 Marketplace color palette

Step 97 completed - NovaCart global color palette updated to the blue/orange marketplace design system.

### Step 97A Final Trust Blue palette

Step 97A completed - Final NovaCart Trust Blue colour system applied.

### Step 98A Classic Premium visual system

Step 98A completed - NovaCart Classic Premium visual design system applied.

### Step 99 Premium Home storefront

Step 99 completed - NovaCart Home page redesigned as a classic premium e-commerce storefront.

### Step 100B Product Details wishlist actions

Step 100B completed - Product Details wishlist actions improved with accessible heart controls and premium e-commerce styling.

### Step 101 Product review ratings

Step 101 completed - Interactive accessible 1-5 star rating implemented for product reviews.

### Step 102 Product Details quantity and stock UX

Step 102 completed - Added stock-aware quantity selector and Add to Cart UX on Product Details.

### Step 103 Product Details image gallery

Step 103 completed - Added responsive Product Details image gallery with accessible image handling.

### Step 104 Product Details purchase section

Step 104 completed - Refined Product Details purchase section with improved hierarchy, spacing, stock visibility and responsive purchase actions.

### Step 105 Products filters and toolbar

Step 105 completed - Polished Products page filters, active filter controls, sorting toolbar and responsive filter UX.

### Step 106 Cart UX

Step 106 completed - Polished Cart page layout, item presentation, order summary and responsive cart UX.

### Step 98 My Account page

Step 98 completed - User Profile redesigned as a responsive e-commerce My Account page.

**Key Highlights:**

- Modern, clean, responsive UI built with React, TypeScript, and Vite.
- RESTful Web API backend built with ASP.NET Core 10 and C#.
- Object-relational mapping using Entity Framework Core 10.
- Relational data storage using PostgreSQL 18.
- OpenAPI / Swagger integration for API testing and documentation.
- Containerized workflows with Docker and Docker Compose.
- Automated CI pipeline capability with GitHub Actions.

---

## 2. Technologies Used

### Frontend

- **Framework & Language:** React 19, TypeScript
- **Build Tool:** Vite
- **Routing:** React Router (`react-router-dom`)
- **Styling:** CSS3 (Modular & responsive layout styles)

### Backend

- **Framework & Language:** ASP.NET Core 10, C# 13
- **ORM:** Entity Framework Core 10 (EF Core)
- **Database Provider:** Npgsql PostgreSQL Provider
- **API Documentation:** Swagger / OpenAPI

### Database

- **DBMS:** PostgreSQL 18
- **Management:** pgAdmin 4

### Testing & Tooling

- **Testing Frameworks:** xUnit (Backend)
- **Version Control:** Git, GitHub
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions

---

## 3. Current Architecture

NovaCart follows a decoupled client-server architecture:

```
+------------------------------------+
|  React + TypeScript Frontend (Vite) |
+------------------------------------+
                  |
                  | HTTP / REST (JSON)
                  v
+------------------------------------+
|   ASP.NET Core 10 Web API Backend   |
|   (Controllers -> Services)         |
+------------------------------------+
                  |
                  | Entity Framework Core 10
                  v
+------------------------------------+
|      PostgreSQL 18 Database        |
+------------------------------------+
```

- **Frontend:** Consumes REST endpoints using typed API service abstractions (`productService`, `categoryService`).
- **Backend:** Applies Dependency Injection, Service-Controller pattern, DTO mapping, and centralized exception handling middleware.

---

## 4. Actual Project Structure

```
NovaCart/
├── frontend/                     # React + TypeScript Vite Frontend
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingMessage.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ImageWithFallback.tsx
│   │   │   └── ProtectedRoute.tsx # Route authentication & authorization guard
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # JWT Authentication & User state context
│   │   ├── pages/                # Application page views
│   │   │   ├── admin/            # Admin portal views (Dashboard, Products, Categories, Orders, Users)
│   │   │   │   ├── AdminCategories.tsx
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminOrders.tsx
│   │   │   │   ├── AdminProducts.tsx
│   │   │   │   └── AdminUsers.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── OrderDetails.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── OrderSuccess.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Wishlist.tsx
│   │   │   └── Register.tsx
│   │   ├── services/             # API service layer
│   │   │   ├── addressService.ts
│   │   │   ├── authService.ts
│   │   │   ├── cartService.ts
│   │   │   ├── categoryService.ts
│   │   │   ├── orderService.ts
│   │   │   ├── productService.ts
│   │   │   ├── reviewService.ts
│   │   │   └── wishlistService.ts
│   │   ├── types/                # TypeScript type definitions
│   │   │   ├── auth.ts
│   │   │   ├── cart.ts
│   │   │   ├── category.ts
│   │   │   ├── order.ts
│   │   │   ├── product.ts
│   │   │   └── review.ts
│   │   ├── App.css               # Global application styles
│   │   ├── App.tsx               # Main component & router configuration
│   │   ├── index.css             # Base CSS tokens and reset
│   │   └── main.tsx              # React entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                      # ASP.NET Core Backend
│   └── NovaCart.API/
│       ├── Controllers/          # API Controllers (ProductsController, CategoriesController)
│       ├── Data/                 # EF Core DbContext (NovaCartDbContext)
│       ├── DTOs/                 # Data Transfer Objects
│       ├── Middleware/           # Global Exception Handling Middleware
│       ├── Migrations/           # EF Core Database Migrations
│       ├── Models/               # Domain Entities (Product, Category)
│       ├── Services/             # Business Logic Services
│       ├── Program.cs            # App configuration & Dependency Injection
│       └── NovaCart.API.csproj
├── .github/
│   └── workflows/                # GitHub Actions CI workflow definitions
├── docker-compose.yml            # Docker multi-container setup
├── NovaCart_Project_Roadmap_and_Reference.md # Project Reference & Specification
└── README.md                     # Root README documentation
```

---

## 5. Features Completed

- **Core Frontend Scaffold:** Vite + React + TypeScript setup with React Router integration.
- **Storefront Pages:** Home, Products page (with search, category filter, sorting, pagination), Product Details (with reviews & add-to-cart).
- **Catalog Data:** Eight professional categories and 24 active products with INR pricing, stock levels, category metadata, and verified public development images. Four legacy products remain inactive because existing order items reference them.
- **Wishlist:** Protected wishlist page, header count, product-card and product-details heart toggles, move-to-cart, and removal actions.
- **Cart & Checkout:** Interactive Cart page, stock validation, quantities management, server-authoritative totals, Checkout form, saved Shipping Addresses, and Order Confirmation.
- **Authentication & User Management:** User Registration, Login, JWT storage, AuthContext, Protected User Routes, User Profile, Order History, and Order Details.
- **Product Reviews System:** Display review list, rating stars, average ratings, create review, update review, and delete own review.
- **Admin Portal:** Protected Admin Dashboard with statistics, Admin Product Management (CRUD), Admin Category Management (CRUD), Admin Order Status Management, and Admin User view note.
- **Reusable Frontend Components:**
  - `Button`, `Input`, `Header`, `Footer`, `ProductCard`, `ProductList`, `LoadingMessage`, `ErrorMessage`, `EmptyState`, `ProtectedRoute`.
- **ASP.NET Core REST API:**
  - Controllers and services for Product and Category CRUD operations.
  - DTO validation and strongly-typed requests/responses.
  - Centralized error handling and structured logging.
  - Swagger/OpenAPI documentation.
- **Database Layer:** PostgreSQL database integrated with EF Core 10 migrations and relational schema design.
- **Catalog administration:** Admin product and category CRUD uses the existing API, enforces the `Admin` role on backend mutations, supports product activation/deactivation, preserves category descriptions, prevents duplicate category names in the UI, and avoids deleting referenced catalog rows.
- **Order lifecycle:** Cancelling an order restores reserved stock once, while cancelled orders cannot be reopened and delivered orders cannot be cancelled.

---

## 6. Features Planned

- User authentication & authorization (JWT access tokens, user registration, login, roles).
- Shopping cart management (add/remove items, quantity updates, server-side price validation).
- Order processing & checkout flow (order history, address details, payment status).
- Product review and rating system.
- Admin management dashboard (products, categories, orders, user management).
- Comprehensive automated testing suite (xUnit integration tests, frontend unit tests).

---

## 7. Setup and Run Instructions

### Prerequisites

- Node.js (v18+) and npm
- .NET 10 SDK
- PostgreSQL 18 (or Docker Desktop)

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

### Running the Backend API

```bash
cd backend/NovaCart.API
dotnet restore
dotnet run
```

The API server will start and Swagger UI will be accessible at `http://localhost:5000/swagger` (or configured port).

### Building for Production

```bash
cd frontend
npm run build
```

---

## 8. Frontend Information

- **Framework:** React 19 written strictly in TypeScript.
- **State & Hooks:** Utilizes standard React hooks (`useState`, `useEffect`) and explicit prop interfaces.
- **Component Architecture:** Small, modular, reusable UI components located in `src/components`.
- **Services:** Network calls are isolated in `src/services` to maintain separation of concerns.

---

## 9. Backend Information

- **Framework:** ASP.NET Core 10 Web API.
- **Design Pattern:** Service-Controller pattern with constructor Dependency Injection.
- **Data Transfer:** DTOs are used for all public API endpoints to avoid leaking internal database entities.
- **Error Handling:** Centralized exception handling middleware returns standard ProblemDetails JSON responses.

---

## 10. Database Information

- **Engine:** PostgreSQL 18 relational database.
- **ORM:** Entity Framework Core 10 with `Npgsql.EntityFrameworkCore.PostgreSQL`.
- **Entities & Schema:**
  - `Category` (1-to-many relationship with `Product`).
  - `Product` (belongs to a `Category`, contains price, stock, description, and image URL).

---

## 11. API Information

### Endpoint Summary

| HTTP Method | Endpoint             | Description                    |
| :---------- | :------------------- | :----------------------------- |
| `GET`       | `/api/products`      | Retrieve all products          |
| `GET`       | `/api/products/{id}` | Retrieve product details by ID |
| `POST`      | `/api/products`      | Create a new product           |
| `PUT`       | `/api/products/{id}` | Update an existing product     |
| `DELETE`    | `/api/products/{id}` | Delete a product               |
| `GET`       | `/api/categories`    | Retrieve all categories        |

---

## 12. Testing

- **Backend:** xUnit test projects setup under `/tests` for unit testing domain services and API validation logic.
- **Frontend:** TypeScript static type checking (`tsc -b`) and build verification.

---

## 13. Docker

- **Docker Compose:** `docker-compose.yml` orchestrates backend API, frontend static app, and PostgreSQL container services.
- **Persistence:** PostgreSQL data stored in named Docker volumes to persist state across container recreations.

---

## 14. Git & GitHub

- **Commit Standards:** Adheres to conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- **Branching Strategy:** Feature branches merged via pull requests.

---

## 15. GitHub Actions

- Automated CI workflow definitions in `.github/workflows` configured to:
  - Restore, build, and test backend .NET projects.
  - Install dependencies, lint, and build the React + TypeScript frontend.

---

## 16. Security

- Server-side price and order calculations (never trust client-submitted prices).
- Parameterized EF Core queries protecting against SQL Injection.
- Sensitive credentials loaded via environment variables and appsettings (never hardcoded or committed to version control).
- Centralized exception handling prevents detailed stack traces from leaking in production environment.

---

## 17. Accessibility

- Semantic HTML5 elements (`<main>`, `<header>`, `<footer>`, `<article>`, `<section>`, `<nav>`).
- Explicit form controls with matching `id`, `htmlFor`, and `aria-label` attributes.
- Accessible focus states and keyboard navigable UI components (`Button`, `Input`, `Footer`).

---

## 18. Development Progress

- **Steps 1-65:** [Completed] Foundation, ASP.NET Core API setup, EF Core PostgreSQL integration, Product & Category APIs, React frontend setup, Storefront pages, Search/Filter/Sort/Pagination, reusable `Button` component, etc.
- **Step 66:** [Completed] Create a reusable React + TypeScript `Input` component (`src/components/Input.tsx`).
- **Step 67:** [Completed] Reusable React + TypeScript frontend component architecture setup.
- **Step 68:** [Completed] Create and integrate a reusable React + TypeScript `Footer` component (`src/components/Footer.tsx`) into the main application layout wrapper.
- **Step 69:** [Completed] Standardized Header and Footer shared navigation using React Router `Link` components (`Home`, `Products`, `Cart`) across the application layout.
- **Step 70 & 71:** [Completed] Shopping Cart frontend page, Cart items management, server-authoritative pricing & totals, and Cart UX improvements.
- **Step 72:** [Completed] Authentication UI (Login, Register, Logout, AuthContext, JWT handling).
- **Step 73:** [Completed] Protected User & Admin Routes guard component (`ProtectedRoute.tsx`).
- **Step 74 & 75:** [Completed] Checkout flow, Shipping Address selection & creation, Order Creation via API, and Order Success confirmation page.
- **Step 76, 77 & 78:** [Completed] User Profile page, Order History list, and Order Details view.
- **Step 79 & 80:** [Completed] Product Reviews UI (List, Star Ratings, Average Rating) and Create/Update/Delete review actions.
- **Step 81-85:** [Completed] Admin Portal (Dashboard, Admin Product CRUD, Admin Category CRUD, Admin Order Status Management, and Admin User management note).
- **Step 86 & 87:** [Completed] Responsive UI & Accessibility review (Form labels, keyboard focus states, semantic HTML5, contrast, and status badges).
- **Step 88 & 89:** [Completed] Frontend Build Check & Compilation (`tsc -b && vite build` succeeded cleanly with zero errors).
- **Step 90:** [Completed] Redesigned the frontend storefront with a navy and orange marketplace visual system, responsive header search, refined home/catalog/product/cart/auth/order surfaces, accessible focus states, and responsive layouts without changing backend behavior.
- **Step 91:** [Completed] Updated the frontend visual theme to the premium Burgundy palette while preserving existing layouts and functionality.

---

## 19. Roadmap

- **Phase 1-8:** Backend & DB Foundation, Categories, Users, Cart, Orders, Reviews (In progress/planned according to project roadmap steps).
- **Phase 9-11:** React UI Architecture, Storefront Features, Admin Dashboard.

---

## 20. Future Improvements

- Razorpay checkout and payment verification.
- Redis caching for product catalog requests.
- Optional local AI integration (Ollama) after main core application completion.
