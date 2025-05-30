import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import "./OrderSummary.css";

const OrderSummary = () => {
  const [orderData, setOrderData] = useState([
    { name: "Take Away", value: 0, color: "#333333" },
    { name: "Served", value: 0, color: "#888888" },
    { name: "Dine In", value: 0, color: "#BBBBBB" },
  ]);

  const [total, setTotal] = useState(0);

  const [filter, setFilter] = useState("daily");

  // useEffect(() => {
  //   const fetchOrderStats = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5000/api/orders/orderstatus");
  //       const { takeAway, served, dineIn } = res.data;

  //       const updatedData = [
  //         { name: "Take Away", value: takeAway, color: "#333333" },
  //         { name: "Served", value: served, color: "#888888" },
  //         { name: "Dine In", value: dineIn, color: "#BBBBBB" },
  //       ];

  //       setOrderData(updatedData);
  //       setTotal(takeAway + served + dineIn);
  //     } catch (error) {
  //       console.error("Error fetching order stats:", error);
  //     }
  //   };

  //   fetchOrderStats();
  // }, []);

  useEffect(() => {
  const fetchOrderStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/orderstatus?filter=${filter}`);
      const { takeAway, served, dineIn } = res.data;

      const updatedData = [
        { name: "Take Away", value: takeAway, color: "#333333" },
        { name: "Served", value: served, color: "#888888" },
        { name: "Dine In", value: dineIn, color: "#BBBBBB" },
      ];

      setOrderData(updatedData);
      setTotal(takeAway + served + dineIn);
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };

  fetchOrderStats();
}, [filter]);

  return (
    <div className="order-summary">
      <div className="order-summary__header">
        <h2>Order Summary</h2>
        <select className="order-summary__dropdown"  onChange={(e) => setFilter(e.target.value.toLowerCase())}>
          <option>Daily</option>
          <option>Weekly</option>
        </select>
      </div>
      <hr />
      <div className="order-summary__stats">
        {orderData.map((item, i) => (
          <div key={i} className="order-summary__stat-box">
            <h3>{item.value.toString().padStart(2, "0")}</h3>
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      <div className="order-summary__content">
        <div className="order-summary__chart">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={orderData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                {orderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="order-summary__progress">
          {orderData.map((item, index) => {
            const percent = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
            return (
              <div key={index} className="order-summary__progress-item">
                <div className="order-summary__progress-label">
                  <span>{item.name}</span>
                  <span>{percent}%</span>
                </div>
                <div className="order-summary__progress-bar">
                  <div
                    className="order-summary__progress-fill"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

