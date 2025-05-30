import React, { useEffect, useState } from 'react';
import axios from 'axios'; // import axios for API call
import './OrderLineCard.css';
import knifImage from '../../assets/knif.png';
import timeImg from '../../assets/time.png';
import doneImg from '../../assets/order-done.png';

const OrderLineCard = ({ order, orderNumber }) => {
  const [status, setStatus] = useState(order.status);
  console.log(order.status);
  const [remainingTime, setRemainingTime] = useState(20); // default 20 mins countdown
  const [hasUpdatedStatus, setHasUpdatedStatus] = useState(false); // to avoid multiple updates

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const orderTime = new Date(order.timestamp);
      const diffInMin = Math.floor((now - orderTime) / 60000);
      const timeLeft = 20 - diffInMin;

      setRemainingTime(timeLeft > 0 ? timeLeft : 0);

      if (timeLeft <= 2 && status === 'Processing' && !hasUpdatedStatus) {
        // Determine new status based on orderType
        const newStatus = order.orderType === 'Dine In' ? 'Served' : 'Not Picked Up';

        console.log(order._id);

        // Call backend API to update status
        axios.put(`http://localhost:5000/api/orders/status/${order._id}`, { status: newStatus })
          .then(response => {
            setStatus(newStatus);
            setHasUpdatedStatus(true);
          })
          .catch(error => {
            console.error('Failed to update order status:', error);
          });
      }
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, [order.timestamp, status, order.orderType, order._id, hasUpdatedStatus]);

  const getBackgroundColor = () => {
    if (status === 'Served') {
      return '#b9f8c9'; // green for served dine-in
    }
    if (status === 'Not Picked Up') {
      return '#c2d4d9'; // blue for takeaway not picked up
    }
    return '#ffe3bc'; // default background color for ongoing
  };

  return (
    <div className='order-line-card' style={{ backgroundColor: getBackgroundColor() }}>
      <div className="order-info">
        <div className="order-number">
          <div className="order-id">
            <img src={knifImage} alt="" />
            <p>#{orderNumber}</p>
          </div>
          <p className='table-number'>
            {order.orderType === 'Dine In' && order.tableId?.name
              ? `Table ${order.tableId.name}`
              : ''}
          </p>
          <p className='time'>{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className='item-number'>{order.itemCount} Item</p>
        </div>
        <div className="order-type" style={{
          backgroundColor: ['Served', 'Not Picked Up'].includes(status)
            ? (order.orderType === 'Dine In' ? '#b9f8c9' : '#c2d4d9')
            : '#f0ad4e',
          color: '#fff'
        }}>
          <p>{order.orderType}</p>
          {['Served', 'Not Picked Up'].includes(status) ? (
            <p>{status}</p>
          ) : (
            <p>Ongoing {remainingTime} min</p>
          )}
        </div>
      </div>

      <div className="order-item">
        {order.items && order.items.length > 0 && (
          <>
            <p>{order.items[0].quantity}x {order.items[0].name}</p>
            <div className="order-menue">
              {order.items.slice(1).map((item, index) => (
                <p key={index}>{item.quantity}x {item.name}</p>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="order-status">
        <div className="order-status-btn" style={{
          backgroundColor: ['Served', 'Not Picked Up'].includes(status)
            ? (order.orderType === 'Dine In' ? '#34c759' : '#9baeb3')
            : '#f0ad4e',
          color: '#fff'
        }}>
          <p>{['Served', 'Not Picked Up'].includes(status) ? status : 'Processing'}</p>
          <img src={['Served', 'Not Picked Up'].includes(status) ? doneImg : timeImg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default OrderLineCard;

