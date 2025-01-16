const Order = require('../models/Order');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').populate('products.productId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Get orders by userId
exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('userId')
      .populate('products.productId');
    if (!orders) return res.status(404).json({ message: 'No orders found for this user' });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { userId, name, emailAddress, phoneNumber, address, products, bill } = req.body;
    console.log("place order: ",req.body)

    const newOrder = new Order({
      userId,
      name,
      emailAddress,
      phoneNumber,
      address,
      products,
      bill,
      amountPaid: 0,
      transactionId: null,
      paymentStatus: 'pending',
      orderStatus: 'not yet delivered'
    });
    console.log("new order ",newOrder);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Update an existing order
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amountPaid, transactionId, paymentStatus, orderStatus } = req.body;

    const updateFields = {};
    if (amountPaid !== undefined) updateFields.amountPaid = amountPaid;
    if (transactionId !== undefined) updateFields.transactionId = transactionId;
    if (paymentStatus !== undefined) updateFields.paymentStatus = paymentStatus;
    if (orderStatus !== undefined) updateFields.orderStatus = orderStatus;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateFields,
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
