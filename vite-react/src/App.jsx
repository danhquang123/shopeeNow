import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import { Provider } from 'react-redux';
import { store } from './store/store';

// --- LAYOUTS ---
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';

// --- PAGES USER ---
import Home from './pages/Home';
import Products from './pages/Products';
import ShoppingCart from './pages/ShoppingCart';
import ProductDetails from './components/ProductDetails';
import About from './components/About';

// --- PAGES ADMIN ---
import AdminRoute from './components/AdminRoute';
import AdminProducts from './pages/admin/AdminProducts';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCarts from './pages/admin/AdminCarts';
import AdminUsers from './pages/admin/AdminUsers';

import Checkout from './components/checkout/Checkout';
function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <Router>
          <Routes>

            {/* --- NHÓM 1: GIAO DIỆN CHO KHÁCH HÀNG --- */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<Checkout />} />



            </Route>

            {/* --- NHÓM 2: GIAO DIỆN CHO ADMIN (Đã sửa "tụt" vào trong) --- */}
            {/* Bước 1: AdminRoute bao bọc ngoài cùng để kiểm tra quyền Admin */}
            <Route element={<AdminRoute />}>

              {/* Bước 2: AdminLayout làm khung (Sidebar, Header) */}
              <Route path="/admin" element={<AdminLayout />}>

                {/* Bước 3: Các trang con nằm bên trong, dùng đường dẫn tương đối */}
                {/* URL sẽ là: /admin/products */}
                <Route path="products" element={<AdminProducts />} />

                {/* URL sẽ là: /admin/add-product */}
                <Route path="add-product" element={<AdminAddProduct />} />

                {/* URL sẽ là: /admin/edit/:productId */}
                <Route path="edit/:productId" element={<AdminEditProduct />} />

                {/* URL sẽ là: /admin/categories */}
                <Route path="categories" element={<AdminCategories />} />

                <Route path="carts" element={<AdminCarts />} />
                <Route path="users" element={<AdminUsers />} />

              </Route>

            </Route>

            {/* Trang 404 (Nếu cần) */}
            <Route path="*" element={<div className="p-5 text-center"><h1>404 - Không tìm thấy trang</h1></div>} />

          </Routes>
        </Router>
      </CartProvider>
    </Provider>
  );
}

export default App;