import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/User/Login';
import { MyProvider } from './utils/MyContext';
import Profile from './components/User/Profile';
import AdminLayout from './components/Admin/AdminLayout';
import ProductAdmin from './components/Admin/ProductAdmin';
import CategoriesAdmin from './components/Admin/CategoriesAdmin';
import Shop from './components/User/Shop';
import BannersAdmin from './components/Admin/BannersAdmin';
import BlobsAdmin from './components/Admin/BlobsAdmin';
import Blobs from './components/User/Blobs';
import Checkout from './components/User/Checkout';
import OrdersAdmin from './components/Admin/OrdersAdmin';
import UsersAdmin from './components/Admin/UsersAdmin';
import AnalysisAdmin from './components/Admin/AnalysisAdmin';
import AiChat from './components/User/AiChat';
import { ProtectedRoute, AdminRoute, UserRoute } from './PrivateRoute';

createRoot(document.getElementById('root')).render(
  <MyProvider>
    <StrictMode>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shop" element={<Shop />} />

          {/* User Only Routes */}
          <Route path="/blobs" element={
              <Blobs />
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/aichat" element={
              <AiChat />
          } />

          {/* Admin Only Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<OrdersAdmin />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="products" element={<ProductAdmin />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="banners" element={<BannersAdmin />} />
            <Route path="blobs" element={<BlobsAdmin />} />
            <Route path="analysis" element={<AnalysisAdmin />} />
          </Route>
        </Routes>
      </Router>
    </StrictMode>
  </MyProvider>
);