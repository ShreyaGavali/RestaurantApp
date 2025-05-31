import React, { useEffect, useState } from 'react'
import './OrderPage.css'
import OrderLineCard from '../../components/OrderLineCard/OrderLineCard'
import axios from 'axios'
import { useSearch } from '../../context/SearchContext';


const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const { searchTerm } = useSearch();
  const normalizedSearch = searchTerm.toLowerCase();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/orders/`);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); //  stop loading after data is fetched or on error
      }
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
      {/* <div className="order-line">
        {filteredOrders.map((order, index) => (
          <OrderLineCard key={order._id} order={order} orderNumber={index + 1} />
        ))}
        {filteredOrders.length === 0 && (
          <p style={{ textAlign: 'center', width: '100%' }}>No matching orders found.</p>
        )}
      </div> */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" /> {/* You can customize this spinner */}
          <p>Data is fetching from server...</p>
        </div>
      ) : (
        <div className="order-line">
          {filteredOrders.map((order, index) => (
            <OrderLineCard key={order._id} order={order} orderNumber={index + 1} />
          ))}
          {filteredOrders.length === 0 && (
            <p style={{ textAlign: 'center', width: '100%' }}>No matching orders found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderPage