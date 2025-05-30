import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Analytics from './pages/AnalyticsPage/Analytics';
import ChairPage from './pages/ChairPage/ChairPage';
import OrderPage from './pages/OrderPage/OrderPage';
import MenuPage from './pages/MenuPage/MenuPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const location = useLocation();

  // Hide navbar and sidebar on /menu and /checkout pages
  const hideLayout = location.pathname.startsWith('/menu') || location.pathname.startsWith('/checkout');

  return (
    <div>
      {!hideLayout && <Navbar />}
      <div className='main-div'>
        {!hideLayout && <Sidebar />}
        <div>
          <Routes>
            <Route path='/' element={<Analytics />} />
            <Route path='/chairs' element={<ChairPage />} />
            <Route path='/orders' element={<OrderPage />} />
            <Route path='/menu' element={<MenuPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default App;
