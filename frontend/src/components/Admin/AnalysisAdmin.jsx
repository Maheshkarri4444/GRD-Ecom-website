import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { TrendingUp, DollarSign, Package, Users, ShoppingBag, CreditCard } from 'lucide-react';
import Allapi from '../../common/index.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalysisAdmin = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalAmountPaid: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    topCustomers: [],
    salesTrends: {},
    productCategories: {}
  });

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(Allapi.getAllOrders.url, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        // Sort orders by date (latest first)
        const sortedOrders = data.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        analyzeData(sortedOrders);
      } catch (err) {
        setError('Failed to fetch orders data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Analyze data based on timeframe
  useEffect(() => {
    if (orders.length > 0) {
      analyzeData(orders);
    }
  }, [timeframe, orders]);

  const analyzeData = (ordersData) => {
    const now = new Date();
    const filteredOrders = ordersData.filter(order => {
      const orderDate = new Date(order.createdAt);
      const diffTime = Math.abs(now - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return (
        (timeframe === 'daily' && diffDays <= 1) ||
        (timeframe === 'weekly' && diffDays <= 7) ||
        (timeframe === 'monthly' && diffDays <= 30)
      );
    });

    // Calculate total sales, amounts paid and orders
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.bill, 0);
    const totalAmountPaid = filteredOrders.reduce((sum, order) => sum + order.amountPaid, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Analyze products
    const productStats = new Map();
    filteredOrders.forEach(order => {
      const paymentRatio = order.amountPaid / order.bill;
      order.products.forEach(product => {
        const productId = product.productId._id;
        const currentStats = productStats.get(productId) || {
          name: product.productId.name,
          totalQuantity: 0,
          totalRevenue: 0,
          totalAmountPaid: 0,
          image: product.productId.images[0]
        };
        const productTotal = product.quantity * product.productId.salePrice;
        const productAmountPaid = productTotal * paymentRatio;

        currentStats.totalQuantity += product.quantity;
        currentStats.totalRevenue += productTotal;
        currentStats.totalAmountPaid += productAmountPaid;
        productStats.set(productId, currentStats);
      });
    });

    // Get top products (sorted by amount paid)
    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.totalAmountPaid - a.totalAmountPaid)
      .slice(0, 5);

    // Analyze customers
    const customerStats = new Map();
    filteredOrders.forEach(order => {
      const customerId = order.emailAddress;
      const currentStats = customerStats.get(customerId) || {
        email: order.emailAddress,
        name: order.name,
        totalSpent: 0,
        amountPaid: 0,
        orderCount: 0
      };
      currentStats.totalSpent += order.bill;
      currentStats.amountPaid += order.amountPaid;
      currentStats.orderCount += 1;
      customerStats.set(customerId, currentStats);
    });

    // Get top customers (by amount paid)
    const topCustomers = Array.from(customerStats.values())
      .sort((a, b) => b.amountPaid - a.amountPaid)
      .slice(0, 5);

    // Calculate sales trends
    const salesByDate = new Map();
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      salesByDate.set(date, (salesByDate.get(date) || 0) + order.bill);
    });

    setAnalytics({
      totalSales,
      totalAmountPaid,
      totalOrders,
      averageOrderValue,
      topProducts,
      topCustomers,
      salesTrends: Object.fromEntries(salesByDate)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-green-50">
        <div className="text-center text-green-800">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-green-50">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  // Prepare chart data
  const salesTrendsData = {
    labels: Object.keys(analytics.salesTrends),
    datasets: [{
      label: 'Sales',
      data: Object.values(analytics.salesTrends),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const topProductsData = {
    labels: analytics.topProducts.map(p => p.name),
    datasets: [{
      label: 'Quantity Sold',
      data: analytics.topProducts.map(p => p.totalQuantity),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }]
  };

  // Tooltip component
  const StatCard = ({ icon: Icon, label, value, prefix = '' }) => (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-green-100 rounded-full">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-600">{label}</p>
          <div className="relative group">
            <p className="text-xl font-bold text-green-800 truncate">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <div className="absolute left-0 z-10 p-2 text-sm text-white transform -translate-y-full bg-gray-800 rounded opacity-0 pointer-events-none top-[-8px] group-hover:opacity-100 transition-opacity duration-200">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-green-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-800">Sales Analytics</h1>
          <div className="relative inline-block">
            <select
              className="px-4 py-2 text-green-700 bg-white border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="daily">Last 24 Hours</option>
              <option value="weekly">Last 7 Days</option>
              <option value="monthly">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-5">
          <StatCard icon={DollarSign} label="Total Sales" value={analytics.totalSales} prefix="₹" />
          <StatCard icon={CreditCard} label="Amount Paid" value={analytics.totalAmountPaid} prefix="₹" />
          <StatCard icon={ShoppingBag} label="Total Orders" value={analytics.totalOrders} />
          <StatCard icon={Package} label="Avg Order Value" value={analytics.averageOrderValue.toFixed(2)} prefix="₹" />
          <StatCard icon={Users} label="Active Customers" value={analytics.topCustomers.length} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          {/* Sales Trends */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-green-800">Sales Trends</h2>
            <Line data={salesTrendsData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }} />
          </div>

          {/* Top Products */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-green-800">Top Products by Quantity</h2>
            <Bar data={topProductsData} options={{
              indexAxis: 'y',
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }} />
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Top Products Table */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-green-800">Top Selling Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-green-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Product</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Units Sold</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Total Bill</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-green-100">
                  {analytics.topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={product.image} alt={product.name} className="w-8 h-8 mr-3 rounded-full" />
                          <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{product.totalQuantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">₹{product.totalRevenue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">₹{product.totalAmountPaid.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Customers Table */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-green-800">Top Customers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-green-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Customer</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Orders</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Total Bill</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-green-100">
                  {analytics.topCustomers.map((customer, index) => (
                    <tr key={index} className="hover:bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                          <span className="text-sm text-gray-500">{customer.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{customer.orderCount}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">₹{customer.totalSpent.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">₹{customer.amountPaid.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisAdmin;