# NovaCart — Complete Project Roadmap & Reference

## 1. Project Overview

NovaCart is a production-style e-commerce portfolio application built to demonstrate practical full-stack development skills.

Primary goals:
- Professional modern UI/UX
- Mobile-first responsive design
- Clean and maintainable architecture
- Secure REST API
- Relational PostgreSQL database
- Meaningful automated tests
- Dockerized development environment
- GitHub Actions CI
- Portfolio-ready documentation

The project should be professional without unnecessary over-engineering.

## 2. Technology Stack

Frontend:
- React
- TypeScript
- Vite
- React Router
- CSS / a suitable lightweight styling approach
- API service layer

Backend:
- ASP.NET Core 10
- C#
- Entity Framework Core 10
- Npgsql PostgreSQL provider
- REST APIs
- Swagger/OpenAPI

Database:
- PostgreSQL 18
- pgAdmin 4

Testing:
- .NET unit tests
- Integration/API tests where useful
- Frontend tests where appropriate

DevOps:
- Docker
- Docker Compose
- Docker Desktop
- GitHub Actions

Version control:
- Git
- GitHub
- GitHub Desktop

Development tools:
- Visual Studio for .NET/backend
- VS Code for frontend/configuration
- Cursor for focused refactoring/debugging
- Antigravity for larger frontend scaffolding/UI work
- ChatGPT for learning, architecture, debugging, review and planning

Optional future:
- Ollama/local AI only after the main project is complete.

## 3. Target Architecture

High-level flow:

React + TypeScript
        |
        | HTTP/JSON
        v
ASP.NET Core 10 REST API
        |
        v
Services / business logic
        |
        v
Entity Framework Core
        |
        v
PostgreSQL

Swagger/OpenAPI is used to understand and test the backend API.

The architecture should use Dependency Injection, DTOs, services, validation, async/await, proper HTTP status codes, logging and secure configuration.

Do not introduce Repository Pattern or other patterns unless there is a clear practical reason.

## 4. Suggested Repository Structure

NovaCart/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── ...
├── backend/
│   └── NovaCart.API/
│       ├── Controllers/
│       ├── Data/
│       ├── Models/
│       ├── DTOs/
│       ├── Services/
│       ├── Migrations/
│       ├── Middleware/
│       └── ...
├── tests/
├── docker/
├── .github/
│   └── workflows/
├── .gitignore
├── docker-compose.yml
└── README.md

Do not create every folder at the beginning. Introduce folders when the relevant feature is started.

## 5. Development Roadmap

### Phase 1 — Foundation

1. Project planning and architecture
2. Verify Node, npm, .NET SDK, Git and Docker
3. Create Git repository and initial commit
4. Create React + TypeScript frontend with Vite
5. Create ASP.NET Core 10 Web API
6. Configure Swagger/OpenAPI
7. Install/configure PostgreSQL and pgAdmin
8. Create NovaCartDb database
9. Configure EF Core and Npgsql
10. Create NovaCartDbContext
11. Create Product model
12. Create first EF Core migration
13. Apply migration and verify Products table in pgAdmin

### Phase 2 — Backend Fundamentals

14. Learn REST API fundamentals
15. Understand controllers
16. Create Product DTOs
17. Understand services
18. Add Product service
19. Understand Dependency Injection
20. Create Product CRUD API
21. Test endpoints through Swagger
22. Add input validation
23. Add proper HTTP status codes
24. Add centralized error handling
25. Add logging

Product API should eventually support:
- GET /api/products
- GET /api/products/{id}
- POST /api/products
- PUT /api/products/{id}
- DELETE /api/products/{id}

Use DTOs rather than exposing database entities directly where appropriate.

### Phase 3 — Database Design

Core entities:
- Product
- Category
- User
- Cart
- CartItem
- Order
- OrderItem
- Address
- Review

Expected relationships:
- Category 1-to-many Product
- User 1-to-many Order
- User 1-to-1 or 1-to-many Cart depending on design
- Cart 1-to-many CartItem
- Product 1-to-many CartItem
- Order 1-to-many OrderItem
- Product 1-to-many OrderItem
- User 1-to-many Review
- Product 1-to-many Review
- User 1-to-many Address

Database practices:
- Primary keys
- Foreign keys
- Appropriate nullability
- Unique constraints where needed
- Check constraints where useful
- Appropriate decimal/date/string types
- Indexes for useful search/filter paths
- Normalization
- Avoid duplicated data

### Phase 4 — Categories

Implement:
- Category model
- Category relationship with Product
- Category DTOs
- Category service
- Category controller
- CRUD where appropriate
- Validation
- Swagger testing
- Automated tests

### Phase 5 — Users and Authentication

Teach first:
- Authentication vs authorization
- Password hashing
- JWT
- Claims
- Roles
- Protected endpoints

Implement:
- Registration
- Login
- Secure password storage
- JWT access token
- User roles
- Authorization policies/attributes
- Protected endpoints

Never store plaintext passwords.
Never commit secrets.
Use configuration/environment variables for sensitive values.

### Phase 6 — Cart

Implement:
- Create/retrieve current user's cart
- Add product
- Update quantity
- Remove item
- Clear cart
- Validate stock
- Calculate totals safely on the server

Important rule:
Never trust totals or prices sent by the frontend. The backend must calculate authoritative order/cart values.

### Phase 7 — Orders and Checkout

Implement:
- Checkout request
- Create order
- Create order items
- Store price snapshot in OrderItem
- Address information
- Order status
- Order history
- User's order details
- Admin order management

Example statuses:
- Pending
- Confirmed
- Processing
- Shipped
- Delivered
- Cancelled

Use database transactions for operations that must succeed or fail together.

A real payment gateway can be treated as a future extension unless explicitly required.

### Phase 8 — Reviews

Implement:
- Create review
- Update review
- Delete review
- Product reviews
- Rating validation
- Optional one-review-per-user-per-product rule
- Average rating calculation

### Phase 9 — React Architecture

Teach:
- Components
- Props
- State
- Hooks
- useEffect
- Forms
- TypeScript interfaces/types
- Routing
- API calls
- Loading/error states
- Reusable components

Suggested frontend structure:
- Layout
- Header
- Navigation
- Footer
- ProductCard
- ProductGrid
- SearchBar
- Filters
- Pagination
- CartSummary
- CheckoutForm
- OrderCard
- ReviewList
- LoadingState
- EmptyState
- ErrorState

Do not duplicate UI unnecessarily.

### Phase 10 — Main Storefront

Build:
- Home page
- Product listing
- Product details
- Category browsing
- Search
- Filtering
- Sorting
- Pagination
- Cart
- Checkout
- Login/register
- User profile
- Order history
- Reviews

The frontend communicates with the backend through a dedicated API service layer.

### Phase 11 — Admin

Implement:
- Admin dashboard
- Product management
- Category management
- Order management
- User management
- Basic dashboard statistics

Protect admin routes on both frontend and backend. Frontend route protection is for UX; backend authorization is the actual security boundary.

## 6. UI/UX Requirements

Brand:
- Name: NovaCart
- Style: Clean & Modern

Requirements:
- Responsive on mobile, tablet, laptop and desktop
- Good typography
- Consistent spacing
- Accessible contrast
- Clear navigation
- Clear CTAs
- Professional product cards
- Good forms
- Loading states
- Empty states
- Error states
- Helpful validation messages
- Keyboard accessibility
- Responsive images
- Appropriate hover/focus states

Avoid:
- Excessive gradients
- Excessive animation
- Visual clutter
- Repeated sections
- Huge decorative elements
- Unnecessary libraries

Use animations sparingly and only when they improve UX.

## 7. API Design Standards

Use REST conventions.

GET:
- Retrieve resources

POST:
- Create resources

PUT/PATCH:
- Update resources

DELETE:
- Delete resources where appropriate

Use meaningful status codes:
- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error

API responses should be predictable and understandable.

Swagger/OpenAPI should document the API and allow development-time testing.

## 8. Validation and Error Handling

Validate:
- Required fields
- String lengths
- Numeric ranges
- Price values
- Quantity values
- IDs
- Email formats
- Password requirements
- Ratings
- Business rules

Do not expose internal exceptions or stack traces to clients in production.

Use centralized exception handling/problem details where appropriate.

Log useful diagnostic information without logging passwords, tokens or sensitive personal information.

## 9. Testing Strategy

Testing should focus on meaningful behavior.

Teach:
- Why tests matter
- Unit tests
- Integration tests
- Arrange / Act / Assert
- Mocking
- Test databases

Unit-test:
- Business rules
- Validation
- Service logic
- Calculations

Integration-test:
- Important API endpoints
- Database interactions
- Authentication/authorization behavior where useful

Test examples:
- Product creation succeeds with valid data
- Invalid product data is rejected
- Product not found returns 404
- Cart quantity cannot exceed stock
- Unauthorized users cannot access admin endpoints
- Order total is calculated from server-side prices

Do not create tests merely to increase test count.

## 10. Docker Strategy

Do not introduce Docker until the application works normally.

Teach:
- Image
- Container
- Dockerfile
- Docker Compose
- Volumes
- Networks
- Environment variables

Eventually use Compose for:
- frontend
- backend
- PostgreSQL

Development secrets must not be hard-coded into images or committed to Git.

PostgreSQL data should use a volume so it survives container recreation.

## 11. Git and GitHub Workflow

Use meaningful commits:
- feat: add product api
- fix: correct product validation
- test: add product service tests
- docs: update setup instructions
- chore: update dependencies

Recommended workflow:
1. Create feature branch
2. Make focused changes
3. Test
4. Commit
5. Push
6. Review
7. Merge through pull request where appropriate

Never commit:
- passwords
- JWT secrets
- API keys
- local environment secrets
- unnecessary build output

Use .gitignore correctly.

## 12. GitHub Actions CI

Create CI after the application and tests are working.

Pipeline should eventually:
1. Checkout repository
2. Setup .NET
3. Restore backend dependencies
4. Build backend
5. Run backend tests
6. Setup Node
7. Install frontend dependencies
8. Build frontend
9. Run frontend tests where configured

Teach:
- Workflow
- Job
- Step
- Runner
- YAML
- Artifacts
- Environment variables

Deployment can be considered after CI is reliable.

## 13. Security Checklist

Apply security throughout development:
- Password hashing
- JWT security
- Secret management
- Environment variables
- CORS configuration
- Input validation
- SQL injection prevention through EF Core/parameterization
- Authorization
- HTTPS
- Dependency vulnerability monitoring
- Secure error handling
- Avoid sensitive logging
- Validate uploaded files if uploads are added
- Rate limiting/throttling where appropriate

Never disable security checks merely to make development easier without understanding the risk.

## 14. Performance Checklist

Review later:
- Pagination
- Efficient EF Core queries
- Avoid unnecessary database calls
- AsNoTracking for read-only queries where appropriate
- Useful indexes
- Avoid N+1 query patterns
- Image optimization
- Lazy loading only if there is a real reason
- Frontend code splitting where useful
- Avoid unnecessary React re-renders

Do not optimize prematurely.

## 15. Accessibility Checklist

Review:
- Semantic HTML
- Labels for form fields
- Keyboard navigation
- Visible focus states
- Alt text
- Accessible buttons
- Color contrast
- Error messages
- Responsive text
- Proper heading hierarchy
- ARIA only when needed

## 16. Production Readiness Review

Before calling NovaCart complete, review:

Architecture
- Clear separation of responsibilities
- No unnecessary complexity

Backend
- DTOs
- Services
- Validation
- Error handling
- Logging
- Security

Database
- Relationships
- Constraints
- Indexes
- Migrations

Frontend
- Responsive
- Accessible
- Loading/error/empty states
- Reusable components

Testing
- Meaningful unit tests
- Integration tests
- All important tests passing

DevOps
- Docker
- Docker Compose
- GitHub Actions CI

Security
- No committed secrets
- Authentication/authorization
- Dependency vulnerabilities reviewed

Documentation
- README
- Setup instructions
- Environment configuration
- Architecture overview
- API usage
- Testing instructions
- Docker instructions

## 17. Learning Workflow

Always use:

LEARN
→ UNDERSTAND
→ IMPLEMENT
→ TEST
→ REVIEW

AI should assist learning, not replace it.

Use ChatGPT for:
- Concepts
- Architecture
- Debugging
- Reviewing
- Planning

Use Visual Studio for:
- ASP.NET Core
- C#
- EF Core
- Backend tests

Use VS Code for:
- React
- TypeScript
- Docker
- GitHub Actions

Use Cursor for:
- Small refactoring
- Focused code improvements
- Explaining existing code

Use Antigravity for:
- Larger frontend scaffolding
- UI generation
- Multi-file frontend changes

Use pgAdmin for:
- Database inspection
- SQL
- Relationships
- Data verification

Use Docker Desktop for:
- Images
- Containers
- Compose

Use GitHub Desktop for:
- Branches
- Commits
- Push/pull
- Pull requests

## 18. Progress Tracking

The Project Instructions control how ChatGPT teaches.

This document is the project reference/specification.

The latest explicit user statement is the source of truth for completed work.

If the user says "Step X completed", treat that step as completed.

If progress is unclear, do not guess. Ask which step was last completed.

Do not repeat completed steps unless requested.

## 19. Current Project State

Known current stack:
- React + TypeScript
- ASP.NET Core 10
- Entity Framework Core
- PostgreSQL
- pgAdmin 4
- Docker
- GitHub Actions
- Automated testing
- Swagger/OpenAPI
- Git/GitHub

Ollama is intentionally postponed until after the main application is complete.

The project should be built incrementally, with one verified step at a time.
