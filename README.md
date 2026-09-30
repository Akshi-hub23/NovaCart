# NovaCart

NovaCart is a full-stack e-commerce application with a responsive storefront, customer accounts, and an administrative portal. It demonstrates a React and TypeScript client working with an ASP.NET Core REST API and PostgreSQL database.

## Project Features

- Browse, search, sort, and filter a product catalog by category, price, and availability.
- View product details, image galleries, ratings, and customer reviews.
- Register and sign in, manage a profile and saved addresses, and view orders.
- Save products to a wishlist and manage a shopping cart.
- Check out and follow order status.
- Use protected admin pages to manage products, categories, and orders.
- Use responsive layouts, keyboard focus states, and semantic page structure.

## Technology Stack

### Frontend

- React 19 and TypeScript
- Vite
- React Router
- CSS

### Backend and data

- ASP.NET Core 10 Web API with C# 13
- Entity Framework Core 10 and Npgsql
- PostgreSQL 18
- Swagger / OpenAPI

### Development tools

- GitHub Actions

## Architecture

The React frontend communicates with the ASP.NET Core API over HTTP using JSON. The API uses controllers and services, with Entity Framework Core handling PostgreSQL persistence.

```text
React + TypeScript (Vite)
          | HTTP / REST (JSON)
          v
ASP.NET Core Web API
 Controllers -> Services
          | Entity Framework Core
          v
      PostgreSQL
```

## Repository Structure

```text
NovaCart/
├── frontend/                 # React application
│   └── src/
│       ├── components/       # Shared UI components
│       ├── context/          # Authentication state
│       ├── pages/            # Storefront, account, and admin pages
│       ├── services/         # API client functions
│       └── types/            # TypeScript models
├── backend/
│   └── NovaCart.API/         # ASP.NET Core API
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Middleware/
│       ├── Models/
│       └── Services/
└── .github/workflows/        # CI workflows
```

## Run Locally

### Prerequisites

- Node.js and npm
- .NET 10 SDK
- PostgreSQL 18

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite serves the frontend at `http://localhost:5173` by default.

### Backend API

Configure the database connection string for your environment, then run:

```bash
cd backend/NovaCart.API
dotnet restore
dotnet run
```

The API address depends on the active ASP.NET Core launch settings. Swagger is available at the API's `/swagger` path when enabled.

## Build and Checks

Build the frontend, including TypeScript project checks, with:

```bash
cd frontend
npm run build
```

Run the frontend linter with `npm run lint`.

## API

The API exposes product and category endpoints, including:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | List products |
| `GET` | `/api/products/{id}` | Get product details |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/{id}` | Update a product |
| `DELETE` | `/api/products/{id}` | Delete a product |
| `GET` | `/api/categories` | List categories |

## Security and Accessibility

- Authentication and role-protected customer and admin routes.
- Server-side validation for catalog and order operations.
- Centralized API error handling.
- Semantic HTML, labeled form controls, and visible keyboard focus styles.
