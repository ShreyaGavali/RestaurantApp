import React from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./RevenueChart.css";
import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";

const RevenueChart = () => {
  const [chartType, setChartType] = useState("Daily");
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchRevenue = async () => {
      const res = await axios.get("http://localhost:5000/api/orders/revenuedailyweekly");
      if (chartType === "Daily") {
        const dailyData = Object.entries(res.data.daily).map(([date, revenue]) => ({
          day: date,
          revenue,
        }));
        setData(dailyData);
      } else {
        const weeklyData = Object.entries(res.data.weekly).map(([day, revenue]) => ({
          day,
          revenue,
        }));
        setData(weeklyData);
      }
    };

    fetchRevenue();
  }, [chartType]);
  return (
    <div className="revenue-chart">
      <div className="revenue-chart__header">
        <h2>Revenue</h2>
        <select className="revenue-chart__dropdown"  onChange={(e) => setChartType(e.target.value)}>
          <option>Daily</option>
          <option>Weekly</option>
        </select>
      </div>
      <hr></hr>
      <div className="revenue-chart__container">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="revenue" fill="#E5E5E5" radius={[10, 10, 0, 0]} barSize={30} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
