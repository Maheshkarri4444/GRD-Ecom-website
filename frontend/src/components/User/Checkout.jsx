import React, { useState, useEffect } from 'react';
import { useMyContext } from '../../utils/MyContext.jsx';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Allapi from '../../common/index.js';
import QRCodeGenerator from './QRCodeGenerator';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { User } from 'lucide-react';

const Checkout = () => {
  const { user } = useMyContext();
  const [view, setView] = useState('current');
  const [selectedProducts, setSelectedProducts] = useState({});
  const [userOrders, setUserOrders] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({
    amountPaid: '',
    transactionId: ''
  });

  // Fetch cart
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(Allapi.getCart.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart.products);
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
    }
  };

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${Allapi.getOrdersByUserId.url}/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        // Sort orders by date (latest first)
        const sortedOrders = data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUserOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (user?._id) {
      fetchOrders();
      fetchCart();
    }
  }, [user]);

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      if (selectedProducts[item.productId._id]) {
        return total + (item.productId.salePrice * item.quantity);
      }
      return total;
    }, 0);
  };

  const getSelectedProductsArray = () => {
    return cart
      .filter(item => selectedProducts[item.productId._id])
      .map(item => ({
        productId: item.productId._id,
        productName: item.productId.name,
        images: item.productId.images,
        quantity: item.quantity,
        productBill: item.productId.salePrice * item.quantity
      }));
  };

  const handlePlaceOrder = async () => {
    const selectedProductsArray = getSelectedProductsArray();
    if (selectedProductsArray.length === 0) {
      alert('Please select at least one product');
      return;
    }

    try {
      const { _id, ...addressWithoutId } = user.address;
      const orderData = {
        userId: user._id,
        name: user.name,
        emailAddress: user.emailAddress,
        phoneNumber: user.phoneNumber,
        address: addressWithoutId,
        products: selectedProductsArray,
        bill: calculateTotal()
      };

      const response = await fetch(Allapi.placeOrder.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentOrder(data);
        setShowPaymentForm(true);
        fetchCart();
      } else {
        throw new Error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentDetails.amountPaid || !paymentDetails.transactionId) {
      alert('Please fill in all payment details');
      return;
    }

    try {
      const response = await fetch(`${Allapi.updateOrder.url}/${currentOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amountPaid: parseFloat(paymentDetails.amountPaid),
          transactionId: paymentDetails.transactionId,
          paymentStatus: 'done'
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Payment details submitted successfully');
        setShowPaymentForm(false);
        setCurrentOrder(null);
        setSelectedProducts({});
        setPaymentDetails({
          amountPaid: '',
          transactionId: ''
        });
        // Refresh orders with latest first sorting
        const ordersResponse = await fetch(`${Allapi.getOrdersByUserId.url}/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const ordersData = await ordersResponse.json();
        const sortedOrders = ordersData.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUserOrders(sortedOrders);
      } else {
        throw new Error(data.message || 'Failed to update payment details');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to submit payment details. Please try again.');
    }
  };

  const handlePayNow = (order) => {
    setCurrentOrder(order);
    setShowPaymentForm(true);
    setView('current');
  };

  const getStatusColor = (order) => {
    if (order.orderStatus === 'wrong order') return 'bg-red-500 text-white';
    if (order.paymentStatus === 'pending') return 'bg-red-100';
    if (order.orderStatus === 'delivered') return 'bg-green-100';
    return 'bg-orange-100';
  };

  return (
    <div className="min-h-screen p-6 bg-green-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Toggle View */}
        <div className="flex mb-6 space-x-4">
          <button
            onClick={() => setView('current')}
            className={`px-4 shadow-lg py-2 rounded-lg ${
              view === 'current' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-green-50 shadow-lg'
            }`}
          >
            Current Order
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 shadow-lg rounded-lg ${
              view === 'history' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-green-50 shadow-lg'
            }`}
          >
            Your Orders
          </button>
        </div>

        {view === 'current' ? (
          <div className="p-6 bg-white rounded-lg shadow">
            {showPaymentForm && currentOrder ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Total Bill: ₹{currentOrder.bill}
                </h2>
                
                <div className="flex items-center p-4 space-x-3 bg-red-100 rounded-lg">
                  <User className="w-6 h-6 text-red-700" />
                  <span className="text-red-800">
                    Will be delivered to your current Address. You can edit it in Profile section
                  </span>
                </div>
                {/* Contact for Discount */}
                <div className="flex items-center p-4 space-x-3 rounded-lg bg-green-50">
                  <FaWhatsapp className="w-6 h-6 text-green-600" />
                  <span className="text-green-800">
                    Contact for discount: +91 9849141105
                  </span>
                </div>

                {/* PhonePe QR Code */}
                <QRCodeGenerator amount={currentOrder.bill} />

                {/* Payment Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      value={paymentDetails.amountPaid}
                      onChange={(e) => setPaymentDetails(prev => ({
                        ...prev,
                        amountPaid: e.target.value
                      }))}
                      className="w-full px-3 py-2 bg-white border border-green-500 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter amount paid"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.transactionId}
                      onChange={(e) => setPaymentDetails(prev => ({
                        ...prev,
                        transactionId: e.target.value
                      }))}
                      className="w-full px-3 py-2 bg-white border border-green-500 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter transaction ID"
                    />
                  </div>
                  <button
                    onClick={handlePaymentSubmit}
                    className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Select Products to Order
                </h2>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.productId._id}
                      className="flex items-center p-4 border rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts[item.productId._id] || false}
                        onChange={() => handleProductSelect(item.productId._id)}
                        className="w-5 h-5 mr-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <img
                        src={item.productId.images[0]}
                        alt={item.productId.name}
                        className="object-cover w-16 h-16 mr-4 rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productId.name}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ₹{item.productId.salePrice}
                        </p>
                      </div>
                      <span className="font-semibold">
                        ₹{item.quantity * item.productId.salePrice}
                      </span>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between mb-4 text-lg font-semibold">
                      <span>Total:</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Place Order
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div
                key={order._id}
                className={`p-4 rounded-lg shadow ${getStatusColor(order)}`}
              >
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Order #{order.orderStatus === 'wrong order' ? 'Deprecated' : order._id.slice(-6)}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid gap-4 mb-4">
                  {order.products.map((product) => (
                    <div key={product._id} className="flex items-center">
                      <img
                        src={product.images[0]}
                        alt={product.productName}
                        className="object-cover w-12 h-12 mr-4 rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.productName}</h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {product.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">
                        ₹{product.productBill}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <div className="flex items-center justify-between">
                      {order.paymentStatus !== 'pending' && (<p className="font-medium">{order.paymentStatus}</p>)}
                      {order.paymentStatus === 'pending' && order.orderStatus !== 'wrong order' && (
                        <button
                          onClick={() => handlePayNow(order)}
                          className="px-4 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Status</p>
                    <p className="font-medium">{order.orderStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Bill</p>
                    <p className="font-medium">₹{order.bill}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="font-medium">₹{order.amountPaid}</p>
                  </div>
                </div>
              </div>
            ))}
            {userOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500 bg-white rounded-lg">
                No orders found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;