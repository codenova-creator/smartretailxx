import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';
import ProtectedRoute from './components/ProtectedRoute';
import AwsAlbBar from './components/AwsAlbBar';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import SystemStatus from './pages/SystemStatus';
import ApiDocs from './pages/ApiDocs';

function NotFoundPage() {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="card-elevated" style={{ padding: '4rem 2rem' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            The page you are looking for does not exist or has moved.
          </p>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Live AWS ALB Address & Health Ribbon */}
            <AwsAlbBar />

            {/* Global Navbar */}
            <Navbar />

            {/* Main Application Routes */}
            <main style={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders/confirmation/:id" element={<OrderConfirmation />} />
                <Route path="/status" element={<SystemStatus />} />
                <Route path="/docs" element={<ApiDocs />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={false}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />

            {/* Toast Notifications Overlay */}
            <ToastNotification />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

