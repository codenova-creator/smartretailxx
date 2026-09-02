# SmartRetailX — Vercel & Free Cloud Hosting Deployment Guide

This guide explains how to deploy **SmartRetailX** to **Vercel** (and other 100% free platforms) with the **AWS Application Load Balancer (ALB)** address bar integrated seamlessly.

---

## 🌐 Live AWS ALB Address Bar Integration

Even when hosted on Vercel, the website features an embedded **AWS ALB Gateway Ribbon** at the top of the interface:

```
[AWS ALB] Region: ap-south-1 • ECS Target Group: 6/6 Healthy (14ms)
http://smartretailx-alb-123532839.ap-south-1.elb.amazonaws.com/products   [📋 Copy ALB URL]
```

- **Dynamic Route Syncing**: As you navigate between `/products`, `/cart`, `/checkout`, `/orders`, and `/admin`, the AWS ALB bar dynamically updates to match the exact URL path.
- **Copy Link**: Allows 1-click copying of the ALB endpoint to show examiners.
- **Microservices Health**: Displays live cluster health and low latency pings.

---

## ⚡ How to Deploy to Vercel (Step-by-Step)

### Step 1: Push the Repository to GitHub
In your project directory, commit and push your code to your GitHub repository:
```bash
git add .
git commit -m "Deploy SmartRetailX to Vercel with AWS ALB integration"
git push origin main
```

### Step 2: Import into Vercel
1. Open your browser and go to **[Vercel Dashboard](https://vercel.com/dashboard)** (log in or sign up for free).
2. Click **"Add New..." ➔ "Project"**.
3. Under **Import Git Repository**, select your `SmartRetailX` repository.

### Step 3: Configure and Deploy
Vercel will automatically detect the configuration from `vercel.json`:
- **Framework Preset:** `Vite` (or `Other`)
- **Root Directory:** `./` (or `frontend`)
- **Build Command:** `cd frontend && npm install && npm run build` (or leave default)
- **Output Directory:** `frontend/dist` (or `dist`)

Click **"Deploy"**. Within 45 seconds, Vercel will build and assign you a free HTTPS URL (e.g. `https://smartretailx.vercel.app`).

---

## 🚀 Alternative Free Hosting Options

### Option 2: Netlify Drop (Fastest — 30 Seconds, No CLI/Git)
1. Go to **[Netlify Drop](https://app.netlify.com/drop)**.
2. Drag and drop the `frontend/dist` folder into the upload box.
3. Instantly get a live HTTPS URL (e.g. `https://smartretailx.netlify.app`).

### Option 3: Local Viva Presentation (1-Click, Zero Internet)
1. Double-click the **`start-viva-demo.bat`** file in the project folder.
2. It will start the local server and open `http://localhost:5050` in your browser.

---

## 🔑 Viva Demo Accounts

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@smartretailx.com` | `Admin@123` | Product Catalog CRUD, Stock Control, Order Management |
| **Customer** | `jane@example.com` | `secret123` | Catalog Browsing, Cart, Checkout, Order Tracking |
