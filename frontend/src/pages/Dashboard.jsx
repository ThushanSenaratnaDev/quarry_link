import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Pie, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const [salesData, setSalesData] = useState({
    weeklyTotal: 0,
    productSales: [],
    customerOrders: [],
    demandPredictions: [],
    stockLevels: [],
    dailySales: []
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }).reverse();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, clientsRes] = await Promise.all([
          axios.get('http://localhost:5001/Orders'),
          axios.get('http://localhost:5001/Clients')
        ]);

        const orders = ordersRes.data.Orders;
        const clients = clientsRes.data.Clients;

        const dailySales = last7Days.map(day => {
          const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate.toLocaleDateString('en-US', { weekday: 'short' }) === day;
          });
          return dayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        });

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyTotal = orders
          .filter(order => new Date(order.orderDate) >= oneWeekAgo)
          .reduce((sum, order) => sum + order.totalPrice, 0);

        // ✅ FIXED: Aggregate by each product in order.products
        const productSales = orders.reduce((acc, order) => {
          if (Array.isArray(order.products)) {
            order.products.forEach((product) => {
              const productType = product.productType || 'Unknown';
              const productTotal = product.unitPrice * product.quantity;
              acc[productType] = (acc[productType] || 0) + productTotal;
            });
          }
          return acc;
        }, {});

        const customerOrders = clients.map(client => {
          const clientOrders = orders.filter(order => order.clientId === client._id);
          return {
            name: client.name,
            totalOrders: clientOrders.length,
            totalSpent: clientOrders.reduce((sum, order) => sum + order.totalPrice, 0)
          };
        });

        const demandPredictions = Object.entries(productSales).map(([type, sales]) => ({
          type,
          predictedDemand: Math.round(sales * 1.1)
        }));

        const stockLevels = Object.entries(productSales).map(([type, sales]) => ({
          type,
          currentStock: Math.round(sales * 0.8),
          demand: sales
        }));

        setSalesData({
          weeklyTotal,
          productSales: Object.entries(productSales).map(([type, amount]) => ({ type, amount })),
          customerOrders,
          demandPredictions,
          stockLevels,
          dailySales
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const lineChartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Daily Sales',
        data: salesData.dailySales || Array(7).fill(0),
        borderColor: '#e6890f',
        backgroundColor: 'rgba(230, 137, 15, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const pieChartData = {
    labels: salesData.productSales.map(product => product.type),
    datasets: [
      {
        data: salesData.productSales.map(product => product.amount),
        backgroundColor: [
          '#e6890f',
          '#28a745',
          '#dc3545',
          '#17a2b8',
          '#6610f2',
          '#fd7e14'
        ]
      }
    ]
  };

  const barChartData = {
    labels: salesData.customerOrders.map(customer => customer.name),
    datasets: [
      {
        label: 'Total Spent',
        data: salesData.customerOrders.map(customer => customer.totalSpent),
        backgroundColor: '#e6890f'
      }
    ]
  };

  const radarChartData = {
    labels: salesData.demandPredictions.map(prediction => prediction.type),
    datasets: [
      {
        label: 'Current Demand',
        data: salesData.stockLevels.map(item => item.demand),
        backgroundColor: 'rgba(230, 137, 15, 0.2)',
        borderColor: '#e6890f',
        borderWidth: 2
      },
      {
        label: 'Predicted Demand',
        data: salesData.demandPredictions.map(prediction => prediction.predictedDemand),
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        borderColor: '#28a745',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Smart Sales & Order Analytics Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Weekly Sales Trend</h2>
          <div className="chart-container">
            <Line data={lineChartData} options={chartOptions} />
          </div>
          <p className="sales-amount">Total: Rs. {salesData.weeklyTotal.toLocaleString()}</p>
        </div>

        <div className="dashboard-card">
          <h2>Sales by Product Type</h2>
          <div className="chart-container">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Customer Order History</h2>
          <div className="chart-container">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Demand Analysis</h2>
          <div className="chart-container">
            <Radar data={radarChartData} options={chartOptions} />
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Stock vs Demand Analysis</h2>
          <div className="stock-list">
            {salesData.stockLevels.map((item, index) => (
              <div key={index} className="stock-item">
                <span className="stock-type">{item.type}</span>
                <div className="stock-bars">
                  <div className="stock-bar">
                    <span>Stock: {item.currentStock}</span>
                    <div className="bar-container">
                      <div
                        className="bar-fill stock"
                        style={{ width: `${(item.currentStock / item.demand) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="stock-bar">
                    <span>Demand: {item.demand}</span>
                    <div className="bar-container">
                      <div
                        className="bar-fill demand"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
