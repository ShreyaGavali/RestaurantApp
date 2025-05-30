import React, { useEffect, useState } from 'react'
import './OrderPage.css'
import OrderLineCard from '../../components/OrderLineCard/OrderLineCard'
import axios from 'axios'
import { useSearch } from '../../context/SearchContext';


const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const { searchTerm } = useSearch();
const normalizedSearch = searchTerm.toLowerCase();
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get('http://localhost:5000/api/orders/');
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
  return (
    order.status.toLowerCase().includes(normalizedSearch) ||
    order.orderType.toLowerCase().includes(normalizedSearch) 
  );
});

  return (
    <div className='order-page'>
        <p className="order-heading">Order Line</p>
        <div className="order-line">
            {filteredOrders.map((order, index) => (
          <OrderLineCard key={order._id} order={order} orderNumber={index + 1} />
        ))}
        {filteredOrders.length === 0 && (
  <p style={{ textAlign: 'center', width: '100%' }}>No matching orders found.</p>
)}
        </div>
    </div>
  )
}

export default OrderPage