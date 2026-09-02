# SmartRetailX — Modern E-Commerce Frontend

[![React](https://img.shields.io/badge/React-18.3-blue.svg)]()
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg)]()
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)]()
[![AWS ALB](https://img.shields.io/badge/AWS-ALB%20%2B%20ECS-FF9900.svg)]()

Modern, responsive, cloud-native e-commerce frontend interface for **SmartRetailX**, engineered with **React 18**, **Vite**, **React Router DOM**, **Axios**, and modern custom CSS.

The frontend directly integrates with the existing ASP.NET Core microservices backend deployed on **AWS ECS / Fargate** behind an **Application Load Balancer (ALB)**.

---

## 🌟 Key Features

1. **Home Page**:
   - Hero banner with glowing typography & direct CTA
   - Live category browser (Electronics, Audio, Accessories, Furniture)
   - Real-time featured catalog loaded directly from the Product Microservice
   - Architecture metrics banner and microservices overview
2. **Product Catalog & Search (`/products`)**:
   - Real-time catalog filtering by category & keyword search
   - Sorting by Price (Low to High, High to Low) and Product Name
   - Stock level badges (*In Stock*, *Low Stock*, *Out of Stock*)
   - Responsive product cards with high-resolution image fallbacks
3. **Product Details & Live Inventory Check (`/products/:id`)**:
   - Deep-dive product specification & high-res preview
   - Live inventory stock validation against `GET /api/v1/inventory/{id}`
   - Quantity modifier and instant cart addition feedback
4. **Interactive Shopping Cart (`/cart`)**:
   - Add, adjust quantities, or remove items
   - Automatic pricing computation (Subtotal, Estimated 8% Tax, Free Shipping over $150, Grand Total)
   - Persistent client state with `localStorage`
5. **Checkout & Order Placement (`/checkout`)**:
   - Customer shipping information form
   - Simulated payment gateway selection
   - Calls the real ASP.NET Core Order Microservice (`POST /api/v1/orders`)
6. **Order Confirmation & EventMesh Explainer (`/orders/confirmation/:id`)**:
   - Live Order ID and itemized receipt
   - Visual explainer of asynchronous `OrderCreated` event publishing to **AWS EventBridge & SQS**
7. **Order History (`/orders`)**:
   - Authenticated user order history
   - Status indicators (*Pending*, *Processing*, *Shipped*, *Delivered*)
   - Direct Order ID lookup tool
8. **Authentication & Identity (`/login`, `/register`)**:
   - User registration calling `POST /api/v1/Users`
   - Real JWT authentication via `POST /api/v1/auth/login`
   - 1-Click Demo credentials for fast viva demonstrations
   - Secure Bearer token injection on all authenticated requests
9. **User Profile (`/profile`)**:
   - View account identity, role badges (*Customer* / *Admin*), and registration dates
   - Profile updating calling `PUT /api/v1/Users/{id}`
   - Raw JWT token inspector for technical evaluation
10. **Operations & Admin Dashboard (`/admin`)**:
    - Publish new products directly to the Product Microservice (`POST /api/v1/products`)
    - Update live warehouse inventory stock (`PUT /api/v1/inventory/{productId}`)
11. **Interactive Architecture / Viva Inspector Modal**:
    - Accessible from any page via the **"⚡ Architecture / Viva Guide"** button
    - Real-time microservice mesh health check and latency probe across all 6 services
    - Step-by-step 10-point viva demonstration script
    - EventMesh flow visualization

---

## 🏛️ System Architecture

```
                                [ Internet / Web Browser ]
                                             │
                                             ▼
                        [ AWS Application Load Balancer (ALB) ]
                                             │
      ┌─────────────────┬────────────────────┼───────────────────┬─────────────────┐
      │                 │                    │                   │                 │
      ▼                 ▼                    ▼                   ▼                 ▼
   Route: /      Route: /api/v1/auth   Route: /api/v1/products  Route: /api/v1/orders Route: /api/v1/inventory
┌───────────┐   ┌────────────────┐    ┌─────────────────┐     ┌───────────────┐   ┌───────────────────┐
│ Frontend  │   │  User Service  │    │ Product Service │     │ Order Service │   │ Inventory Service │
│ (Nginx 80)│   │  (Port 5001)   │    │  (Port 5002)    │     │  (Port 5003)  │   │    (Port 5004)    │
└───────────┘   └────────────────┘    └─────────────────┘     └───────┬───────┘   └─────────▲─────────┘
                                                                      │                     │
                                                         Publishes:   │                     │ Consumes:
                                                      "OrderCreated"  ▼                     │ Stock Reduction
                                                       ┌────────────────────────────────────┴─────────┐
                                                       │      AWS EventBridge / Amazon SQS            │
                                                       └──────────────────────┬───────────────────────┘
                                                                              │ Consumes:
                                                                              ▼ Customer Alert
                                                                   ┌───────────────────────┐
                                                                   │ Notification Service  │
                                                                   │     (Port 5006)       │
                                                                   └───────────────────────┘
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 18+ or 20+
- npm (or pnpm/yarn)

### 2. Environment Configuration
Create or verify `.env` inside the `frontend/` directory:

```env
# SmartRetailX API Backend Base URL (AWS ALB or local API Gateway)
VITE_API_BASE_URL=http://SmartRetailX-ALB-123532839.ap-south-1.elb.amazonaws.com
```

### 3. Install Dependencies & Start Dev Server
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🐳 Docker Deployment

### 1. Build Multi-Stage Production Container
```bash
# Build from the frontend folder
cd frontend
docker build -t smartretailx-frontend:latest .

# OR build from workspace root
docker build -t smartretailx-frontend:latest -f docker/frontend.Dockerfile .
```

### 2. Run Container Locally
```bash
docker run -d -p 80:80 --name smartretailx-frontend smartretailx-frontend:latest
```
Access at `http://localhost`.

---

## ☁️ AWS ECS & ALB Deployment Guide

### Step 1: Create Amazon ECR Repository
```bash
# Authenticate Docker to AWS ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# Create ECR repository
aws ecr create-repository --repository-name smartretailx-frontend --region ap-south-1

# Tag and push container image
docker tag smartretailx-frontend:latest <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/smartretailx-frontend:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/smartretailx-frontend:latest
```

### Step 2: Create Target Group for Frontend
1. Open **AWS EC2 Console** -> **Target Groups** -> **Create Target Group**.
2. **Target Type**: `IP addresses` (for ECS Fargate).
3. **Target Group Name**: `SmartRetailX-Frontend-TG`.
4. **Protocol / Port**: `HTTP` on `80`.
5. **Health Check Path**: `/health` (returns `200 OK`).

### Step 3: Register ECS Task Definition & Service
Create an ECS Task Definition named `SmartRetailX-FrontendTask`:
- **Launch Type**: `FARGATE`
- **Container Name**: `frontend`
- **Image**: `<AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/smartretailx-frontend:latest`
- **Port Mappings**: `80:80` (TCP)
- **Memory**: `512 MB`, **CPU**: `256 (.25 vCPU)`

Deploy ECS Service `SmartRetailX-FrontendService` in the existing ECS Cluster attached to `SmartRetailX-Frontend-TG`.

### Step 4: Configure ALB Listener Rules
In the **AWS ALB Listener (Port 80)** rules:
Ensure the API routing rules precede the default rule:

| Rule Priority | Path Pattern | Forward To Target Group | Description |
| :---: | :--- | :--- | :--- |
| **10** | `/api/v1/auth/*` | `UserService-TG` | Auth & Me endpoints |
| **11** | `/api/v1/Users*` | `UserService-TG` | Users endpoints |
| **20** | `/api/v1/products*` | `ProductService-TG` | Catalog endpoints |
| **30** | `/api/v1/orders*` | `OrderService-TG` | Orders endpoints |
| **40** | `/api/v1/inventory*` | `InventoryService-TG`| Stock endpoints |
| **50** | `/api/v1/payments*` | `PaymentService-TG` | Payment endpoints |
| **60** | `/api/v1/notifications*` | `NotificationService-TG` | SQS Notification endpoints |
| **70** | `/swagger*` | `UserService-TG` | Technical Swagger documentation |
| **Default Action** | `/*` (Root) | `SmartRetailX-Frontend-TG` | **SmartRetailX React Frontend** |

Opening `http://SmartRetailX-ALB-123532839.ap-south-1.elb.amazonaws.com` now presents the **SmartRetailX UI**, while technical evaluators can still view Swagger at `/swagger`!

---

## 🎓 University Viva Presentation Script

1. **Architecture Introduction**: Open `http://SmartRetailX-ALB-123532839.ap-south-1.elb.amazonaws.com`. Click the **"⚡ Architecture / Viva Guide"** button in the navbar to show the evaluators the live latency and status of all 6 microservices.
2. **User Identity & JWT**: Navigate to **Login**, click **"Jane Doe (Customer)"** (or register a fresh user), and sign in. Inspect the JWT token in **Profile**.
3. **Catalog Interaction**: Open **Products**, search for *"Laptop"*, filter by *"Electronics"*, and sort by price.
4. **Live Inventory Verification**: Click on a product to show the live stock level queried in real time from the Inventory Service.
5. **Checkout & Order Creation**: Add item to cart, open **Checkout**, and click **"Place Order & Pay"**. Show the generated **Order ID** (e.g. `#1380`).
6. **EventBridge Asynchronous Flow**: Explain that the Order Service published an `OrderCreated` event to AWS EventBridge / SQS.
7. **CloudWatch & Swagger Proof**: Open AWS CloudWatch logs to show the Inventory Service deducting stock and Notification Service processing the event. Open `/swagger` to show the underlying ASP.NET Core OpenAPI endpoints.
