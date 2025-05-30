import React from 'react'
import './Analytics.css'
import AnalyticsCard from '../../components/AnalyticsCard/AnalyticsCard'
import image1 from '../../assets/image.png'
import image2 from '../../assets/rupee_image.png'
import image3 from '../../assets/image1.png'
import image4 from '../../assets/image2.png'
import OrderSummary from '../../components/OrderSummary/OrderSummary'
import RevenueChart from '../../components/RevenueChart/RevenueChart'
import Tables from '../../components/Tables/Tables'
import ChefTable from '../../components/ChefTable/ChefTable'
import axios from 'axios';
import { useState } from 'react'
import { useEffect } from 'react'
import { useSearch } from '../../context/SearchContext';

const Analytics = ({ selected }) => {
    const { searchTerm } = useSearch(); 
    const [totalChefs, setTotalChefs] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalClients, setTotalClients] = useState(0);

    useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const revenueRes = await axios.get('http://localhost:5000/api/orders/revenue');
        const chefRes = await axios.get('http://localhost:5000/api/chefs/count');
        const ordersRes = await axios.get('http://localhost:5000/api/orders/totalorders');
        const clientRes = await axios.get('http://localhost:5000/api/orders/totalclients');

        console.log(chefRes.data)
        console.log(revenueRes.data);
        console.log(ordersRes)

        setTotalRevenue(revenueRes.data.totalRevenue || 0);
        setTotalChefs(chefRes.data.totalChefs);
        setTotalOrders(ordersRes.data.totalOrders);
        setTotalClients(clientRes.data.totalClients);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalytics();
  }, []);

  const orderData = [
    { name: "Served", value: 120 },
    { name: "Dine-in", value: 80 },
    { name: "Takeaway", value: 50 },
  ];

  const normalizedSearch = searchTerm.toLowerCase();

  return (
    <div className='analytics'>
      <p className='analytics-heading'>Analytics</p>
      <div className='analytics-card'>
        <AnalyticsCard CardImage={image1} CardTitle="TOTAL CHEF" CardInfo={totalChefs} />
        <AnalyticsCard CardImage={image2} CardTitle="TOTAL REVENU" CardInfo={totalRevenue}  />
        <AnalyticsCard CardImage={image3} CardTitle="TOTAL ORDERS" CardInfo={totalOrders}  />
        <AnalyticsCard CardImage={image4} CardTitle="TOTAL CLIENTS" CardInfo={totalClients}  />
      </div>
      <div className='analytics-dashboard'>
        {/* <OrderSummary data={orderData} />
        <RevenueChart />
        <Tables /> */}
         {/* ✅ Conditional rendering based on search */}
        {(normalizedSearch === '' || normalizedSearch.includes('order') || normalizedSearch.includes('summary')) && (
          <OrderSummary data={orderData} />
        )}
        {(normalizedSearch === '' || normalizedSearch.includes('revenue') || normalizedSearch.includes('chart')) && (
          <RevenueChart />
        )}
        {(normalizedSearch === '' || normalizedSearch.includes('tables') || normalizedSearch.includes('table')) && (
          <Tables />
        )}
      </div>
      {/* <ChefTable /> */}
      {(normalizedSearch === '' || normalizedSearch.includes('chef')) && <ChefTable />}
    </div>
  )
}

export default Analytics