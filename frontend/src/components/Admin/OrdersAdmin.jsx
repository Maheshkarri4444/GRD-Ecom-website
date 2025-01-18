import React, { useState, useEffect } from 'react';
import Allapi from '../../common/index.js';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(Allapi.getAllOrders.url, {
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
        setFilteredOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...orders];
    
    if (paymentFilter !== 'all') {
      result = result.filter(order => order.paymentStatus === paymentFilter);
    }
    
    if (orderStatusFilter !== 'all') {
      result = result.filter(order => order.orderStatus === orderStatusFilter);
    }
    
    setFilteredOrders(result);
  }, [paymentFilter, orderStatusFilter, orders]);

  const handlePaymentStatusUpdate = async (orderId, newStatus) => {
    try {
      const updateData = {
        paymentStatus: newStatus
      };
      
      // If marking as fake, also update order status
      if (newStatus === 'nopayment') {
        updateData.orderStatus = 'wrong order';
      }

      const response = await fetch(`${Allapi.updateOrder.url}/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, ...updateData }
            : order
        ));
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${Allapi.updateOrder.url}/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderStatus: newStatus
        })
      });

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (order) => {
    if (order.orderStatus === 'wrong order') return 'bg-red-500 text-white';
    if (order.paymentStatus === 'pending') return 'bg-red-100';
    if (order.orderStatus === 'delivered') return 'bg-green-100';
    return 'bg-orange-100';
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Orders Management</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-2 gap-4 p-4 mb-6 bg-white rounded-lg shadow">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Payment Status Filter
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Payment Statuses</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
              <option value="verified">Verified</option>
              <option value="nopayment">No Payment</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Order Status Filter
            </label>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Order Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="not yet delivered">Not Yet Delivered</option>
              <option value="wrong order">Wrong Order</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className={`p-4 rounded-lg shadow ${getStatusColor(order)}`}
            >
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customer: {order.name} 
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {order.phoneNumber} 
                  </p>
                  <p className="text-sm text-gray-600">
                    email: {order.emailAddress}
                  </p>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Products */}
              <div className="grid gap-4 mb-4">
                {order.products.map((product) => (
                  <div key={product.productId._id} className="flex items-center">
                    <img
                      src={product.productId.images[0]}
                      alt={product.productId.name}
                      className="object-cover w-12 h-12 mr-4 rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.productId.name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                    <span className="font-semibold">
                      ₹{product.productId.salePrice * product.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg">
                {/* Payment Status */}
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{order.paymentStatus}</p>
                    {order.paymentStatus === 'done' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePaymentStatusUpdate(order._id, 'verified')}
                          className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                        >
                          Verified
                        </button>
                        <button
                          onClick={() => handlePaymentStatusUpdate(order._id, 'nopayment')}
                          className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Fake
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Status */}
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{order.orderStatus}</p>
                    {order.orderStatus === 'not yet delivered' && (
                      <div className="flex space-x-2">
                        {order.paymentStatus === 'verified' && (
                          <button
                            onClick={() => handleOrderStatusUpdate(order._id, 'delivered')}
                            className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                          >
                            Delivered
                          </button>
                        )}
                        {order.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handleOrderStatusUpdate(order._id, 'wrong order')}
                            className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                          >
                            Wrong Order
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bill Details */}
                <div>
                  <p className="text-sm text-gray-600">Total Bill</p>
                  <p className="font-medium">₹{order.bill}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-medium">₹{order.amountPaid}</p>
                </div>

                {/* Transaction Details */}
                {order.transactionId && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="font-medium">{order.transactionId}</p>
                  </div>
                )}

                {/* Delivery Address */}
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-medium">
                    {order.address.doorNo}, {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersAdmin;