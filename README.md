# Neighborly — Project Technical Documentation

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Table of Contents
1. [Demo / Preview](#demo--preview)
2. [Features](#features)
3. [Architecture & Tech Stack](#1-architecture--tech-stack-overview)
4. [User Flows](#2-user-flow-descriptions)
5. [Core Implementation Approaches](#3-core-feature-implementation-approaches)
6. [API Documentation](#4-api-documentation-mock-layer)
7. [Sequence Diagrams](#5-detailed-sequence-diagrams-textual)
8. [API Error Handling](#6-api-error-handling)
9. [Mock Service Examples](#7-sample-mock-service-implementations-typescript)
10. [Component & File Structure](#component--file-structure)
11. [Authentication & Protected Routes](#5-authentication--protected-routes)
12. [State Management & Mock Data](#6-state-management--mock-data)
13. [Extensibility & Group Integration](#7-extensibility--group-integration)
14. [Development Tips](#8-development-tips)
15. [Contributing](#contributing)
16. [License](#license)
17. [Contact](#contact)

---

## Demo / Preview
> _Add your live demo link here if available._

---

## Features
- User authentication and role-based authorization (Consumers & Sellers)
- Market discovery and product browsing with filters, search, and pagination
- Product detail pages with 5-star review system
- Cart and checkout system, simulated payment
- Seller dashboard for managing listings and promotions
- Local currency and eco-friendly product support
- **Unique Feature:** Community Bulletin Board — users can post and view local announcements and sustainability tips, fostering community engagement
- Responsive design for all devices
- Mock data and services for rapid prototyping
- Extensible, modular architecture for group collaboration

---

## 1. Architecture & Tech Stack Overview

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **State Management:** React Context API or Zustand (for scalable state)
- **Data:** Mock data (JSON, local state, or mock API)
- **Authentication:** Simulated (can be extended to use NextAuth.js or custom API)
- **Routing:** App Router with protected routes for role-based access
- **Testing:** (Optional) Jest/React Testing Library for unit/component tests

### 1.1 System Architecture Diagram

```
+------------------+      +-------------------+      +-----------------+
|   Frontend (FE)  | <--> |  State Mgmt/Mock  | <--> |   Mock Data     |
| Next.js, React   |      |  Context/Zustand  |      |  (JSON/TS)      |
+------------------+      +-------------------+      +-----------------+
        |                        |                          |
        |  (future)              |                          |
        v                        v                          v
   Real API/Backend  <---  API Integration Layer   <---  Database/API
```

### 1.2 Main User Flow Diagrams

#### Consumer Flow

```
[Start]
   |
   v
[Register/Login]
   |
   v
[Landing/Market Discovery]
   |
   v
[Search/Filter Products]
   |
   v
[View Product Details]
   |
   v
[Add to Cart] --> [Cart] --> [Checkout] --> [Payment] --> [Leave Review]
```

#### Seller Flow

```
[Start]
   |
   v
[Register/Login]
   |
   v
[Seller Dashboard]
   |
   |---> [Create/Edit Listings]
   |---> [Create Promotions]
   |---> [View Orders]
   |---> [View Reviews]
```

### 1.3 Component Structure Diagram

```
<App>
 ├── <AuthProvider>
 ├── <CartProvider>
 ├── <Layout>
 │    ├── <Header/Sidebar>
 │    └── <MainContent>
 │         ├── <MarketList/Discovery>
 │         ├── <ProductDetails>
 │         ├── <Cart>
 │         ├── <Checkout>
 │         ├── <Dashboard (Seller/Consumer)>
 │         └── <Community/UniqueFeature>
 └── <Footer>
```

## 2. User Flow Descriptions

### Consumer Flow

1. Register/Login →
2. Browse landing page/markets →
3. Search/filter products →
4. View product details →
5. Add to cart →
6. Checkout →
7. Simulate payment →
8. Leave product review

### Seller Flow

1. Register/Login →
2. Access seller dashboard →
3. Create/edit product listings →
4. Create promotions/vouchers →
5. View orders and reviews

## 3. Core Feature Implementation Approaches

### Authentication & Authorization

- Use React Context to store user info and role
- Simulate login with hardcoded/mock users
- Protect routes using higher-order components or route guards
- Example: `/dashboard/seller` accessible only to sellers

### Market Discovery & Product Details

- Landing page fetches and displays markets/products from mock data
- Search bar uses debounce (e.g., lodash.debounce)
- Filters by category/location implemented with dropdowns or chips
- Pagination handled via state (show X items per page)
- Product details page shows description, reviews, and add-to-cart button

### Cart & Checkout

- Cart state stored in context or Zustand
- Cart page lists selected items, quantities, and total price
- Checkout page simulates payment (fake API call or confirmation dialog)
- After checkout, prompt user to leave a 5-star review

### Seller Features

- Seller dashboard for managing products and promotions
- Product creation/editing forms with validation
- Promotions: ability to create discount vouchers (applied at checkout)

### Unique Feature (Example: Community Bulletin Board)

- A page where users can post and view community announcements or sustainability tips
- Encourages engagement and knowledge sharing

---

## 4. API Documentation (Mock Layer)

### 4.1 Data Models (TypeScript Interfaces)

```ts
// User
interface User {
  id: string;
  name: string;
  email: string;
  role: "consumer" | "seller";
  password: string; // hashed or plain for mock
}

// Product
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string; // e.g., 'IDR'
  quantity: number;
  type: "standard" | "premium";
  sellerId: string;
  marketId: string;
  reviews: Review[];
  imageUrl?: string;
}

// Market
interface Market {
  id: string;
  name: string;
  location: string;
  categories: string[];
  upcoming: boolean;
}

// Review
interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
}

// Cart Item
interface CartItem {
  productId: string;
  quantity: number;
}

// Promotion
interface Promotion {
  id: string;
  sellerId: string;
  code: string;
  discountPercent: number;
  validUntil: string;
}
```

### 4.2 Example API Endpoints (Mocked)

> Replace with real endpoints when backend is ready. Simulate with local functions or mock service.

#### Authentication

- `POST /api/login` — Login user
  - Request: `{ email, password }`
  - Response: `{ token, user }`
- `POST /api/register` — Register new user
  - Request: `{ name, email, password, role }`
  - Response: `{ user }`

#### Market & Product Discovery

- `GET /api/markets` — List all markets
- `GET /api/products?marketId=...&search=...&category=...&page=...` — List/filter products
- `GET /api/products/:id` — Get product details

#### Cart & Checkout

- `GET /api/cart` — Get current user's cart
- `POST /api/cart` — Add/update item in cart
- `POST /api/checkout` — Simulate checkout
  - Request: `{ cartItems, paymentInfo }`
  - Response: `{ orderId, status }`

#### Reviews

- `POST /api/reviews` — Add review after purchase
  - Request: `{ productId, rating, comment }`

#### Seller Features

- `POST /api/products` — Seller creates product
- `PUT /api/products/:id` — Seller edits product
- `POST /api/promotions` — Seller creates promotion

### 4.3 Example Payloads

````json
// Register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "consumer"
}

// Product
{
  "id": "prod1",
  "name": "Organic Rice",
  "description": "Locally grown organic rice.",
  "price": 50000,
  "currency": "IDR",
  "quantity": 100,
  "type": "premium",
  "sellerId": "seller1",
  "marketId": "market1",
  "reviews": []
}
243: ```

---

## 5. Detailed Sequence Diagrams (Textual)

### 5.1 Login Sequence
````

[User] --(submit credentials)--> [Login Form]
[Login Form] --(call)--> [Mock Auth Service]
[Mock Auth Service] --(validate)--> [Mock User Data]
[Mock User Data] --(success/failure)--> [Mock Auth Service]
[Mock Auth Service] --(token/user or error)--> [Login Form]
[Login Form] --(update context, redirect)--> [App]

```

### 5.2 Add to Cart Sequence
```

[User] --(click 'Add to Cart')--> [ProductDetails]
[ProductDetails] --(dispatch)--> [Cart Context/Store]
[Cart Context/Store] --(update state)--> [Cart]
[Cart] --(display updated items)--> [User]

```

### 5.3 Checkout Sequence
```

[User] --(proceed to checkout)--> [Cart]
[Cart] --(submit order)--> [Mock Checkout Service]
[Mock Checkout Service] --(validate, simulate payment)--> [Order State]
[Order State] --(success/failure)--> [Mock Checkout Service]
[Mock Checkout Service] --(confirmation or error)--> [Cart/Checkout Page]
[Cart/Checkout Page] --(show result, prompt review)--> [User]

````

---

## 6. API Error Handling

### 6.1 Error Response Structure
All API responses (even in mocks) should follow a consistent error structure:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect."
  }
}
````

### 6.2 Common Error Codes

| Code                | HTTP | Description                |
| ------------------- | ---- | -------------------------- |
| INVALID_CREDENTIALS | 401  | Login failed               |
| UNAUTHORIZED        | 403  | No permission for resource |
| NOT_FOUND           | 404  | Resource not found         |
| VALIDATION_ERROR    | 400  | Invalid input data         |
| OUT_OF_STOCK        | 409  | Product not available      |
| SERVER_ERROR        | 500  | Unexpected server error    |

### 6.3 Example Error Payloads

```json
// Validation error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required."
  }
}

// Out of stock
{
  "success": false,
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "This product is no longer available."
  }
}
```

---

## 7. Sample Mock Service Implementations (TypeScript)

### 7.1 Mock Auth Service

```ts
// /services/mockAuth.ts
import { User } from "../data/types";
import users from "../data/users.json";

export function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  return new Promise((resolve, reject) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      return reject({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email or password is incorrect.",
        },
      });
    }
    resolve({ user, token: "mock-token" });
  });
}
```

### 7.2 Mock Product Service

```ts
// /services/mockProducts.ts
import { Product } from "../data/types";
import products from "../data/products.json";

export function getProducts(): Promise<Product[]> {
  return Promise.resolve(products);
}

export function getProductById(id: string): Promise<Product | null> {
  const product = products.find((p) => p.id === id) || null;
  return Promise.resolve(product);
}
```

### 7.3 Mock Cart Service

```ts
// /services/mockCart.ts
import { CartItem } from "../data/types";
let cart: CartItem[] = [];

export function addToCart(item: CartItem): Promise<{ success: boolean }> {
  const existing = cart.find((ci) => ci.productId === item.productId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  return Promise.resolve({ success: true });
}

export function getCart(): Promise<CartItem[]> {
  return Promise.resolve(cart);
}
```

---

```
/neighborly
│
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/
│   ├── register/
│   ├── market/
│   │   ├── [marketId]/
│   ├── product/
│   │   ├── [productId]/
│   ├── cart/
│   ├── checkout/
│   ├── dashboard/
│   │   ├── seller/
│   │   └── consumer/
│   ├── community/
│
├── components/
│   ├── AuthForm.tsx
│   ├── ProductCard.tsx
│   ├── MarketList.tsx
│   ├── CartItem.tsx
│   ├── ReviewStars.tsx
│   ├── PromotionBanner.tsx
│   └── ...
│
├── context/
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── ...
│
├── data/
│   ├── products.json
│   ├── markets.json
│   ├── users.json
│   └── ...
│
├── utils/
│   ├── debounce.ts
│   └── ...
│
├── docs/
│   └── PROJECT_DOC.md   # <--- This file
└── ...
```

## 5. Authentication & Protected Routes

- Use a context provider to store authentication state and user role
- Create a `ProtectedRoute` component (HOC or wrapper) to check user role before rendering children
- Example usage:
  ```tsx
  <ProtectedRoute role="seller">
    <SellerDashboard />
  </ProtectedRoute>
  ```

## 6. State Management & Mock Data

- Use React Context or Zustand for global state (auth, cart, etc.)
- Load mock data from `/data/*.json` or define in JS/TS files
- Simulate API calls with `setTimeout` or Promises
- All data changes (e.g., add to cart, create listing) update local state

## 7. Extensibility & Group Integration

- Keep components modular and reusable
- Use TypeScript interfaces/types for all data models (e.g., User, Product, Market)
- Document all major functions and components
- Separate business logic from UI components where possible
- Use meaningful commit messages and pull requests for collaboration

## 8. Development Tips

- Use Tailwind CSS utility classes for rapid, consistent styling
- Ensure all pages are responsive (test on mobile/tablet/desktop)
- Use confirmation dialogs for destructive actions (e.g., delete product)
- Handle empty states and errors gracefully
- Add meta tags for SEO in Next.js `head` components

---

This documentation is intended to help all contributors understand, extend, and maintain the Neighborly project efficiently. For questions or suggestions, please update this file or contact the project lead.
