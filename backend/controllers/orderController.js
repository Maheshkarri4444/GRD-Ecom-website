const Order = require('../models/Order');
const nodemailer = require('nodemailer');
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

    const detailedProducts = products.map(product => ({
      productId: product.productId,
      productName: product.productName,
      images: product.images || [],
      quantity: product.quantity,
      productBill: product.productBill
    }));

    const newOrder = new Order({
      userId,
      name,
      emailAddress,
      phoneNumber,
      address,
      products: detailedProducts,
      bill,
      amountPaid: 0,
      transactionId: null,
      paymentStatus: 'pending',
      orderStatus: 'not yet delivered'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


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
    )
    .populate({
      path: 'userId',
      select: 'name emailAddress phoneNumber address',
    })
    .populate({
      path: 'products.productId',
      select: 'name salePrice',
    });

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gooranthadveepamnaturals@gmail.com',
        pass: 'ujbe dksu lcnb toqx',
      },
    });

    if (paymentStatus === 'done') {
      const mailOptions = {
        from: 'gooranthadveepamnaturals@gmail.com',
        to: 'tkarunakareddy@gmail.com',
        subject: `Order Payment Status: ${paymentStatus}`,
        html: `
          <h2>Order Payment Details</h2>
          <p><strong>Order ID:</strong> ${updatedOrder._id}</p>
          <p><strong>User:</strong> ${updatedOrder.userId.name}</p>
          <p><strong>Email:</strong> ${updatedOrder.userId.emailAddress}</p>
          <p><strong>Phone Number:</strong> ${updatedOrder.userId.phoneNumber}</p>
          <p><strong>Total Bill:</strong> ${updatedOrder.bill}</p>
          <p><strong>Amount Paid:</strong> ${updatedOrder.amountPaid}</p>
          <p><strong>Transaction ID:</strong> ${updatedOrder.transactionId}</p>
          <p><strong>Payment Status:</strong> ${updatedOrder.paymentStatus}</p>
          <p><strong>Order Status:</strong> ${updatedOrder.orderStatus}</p>
          <h3>Products in the order:</h3>
          <ul>
            ${updatedOrder.products.map(product => {
              return `<li>${product.productName} - ${product.productBill} (Quantity: ${product.quantity})</li>`;
            }).join('')}
          </ul>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("Error sending email: ", err);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    if (paymentStatus === 'verified') {
      const userMailOptions = {
        from: 'gooranthadveepamnaturals@gmail.com',
        to: updatedOrder.userId.emailAddress, // User's email
        subject: 'Payment Verified',
        html: `
          <h2>Your Payment Has Been Verified</h2>
          <p>Dear ${updatedOrder.userId.name},</p>
          <p>We are happy to inform you that your payment has been successfully verified.</p>
          <p>Thank you for shopping with us!</p>
        `,
      };

      // Send email to the user
      transporter.sendMail(userMailOptions, (err, info) => {
        if (err) {
          console.log("Error sending email: ", err);
        } else {
          console.log('Email sent to user: ' + info.response);
        }
      });
    }

    // If orderStatus is 'delivered', send an email to the user
    if (orderStatus === 'delivered') {
      const deliveryMailOptions = {
        from: 'gooranthadveepamnaturals@gmail.com',
        to: updatedOrder.userId.emailAddress, // User's email
        subject: 'Product Delivered',
        html: `
          <h2>Your Product Has Been Delivered</h2>
          <p>Dear ${updatedOrder.userId.name},</p>
          <p>We are pleased to inform you that your product has been successfully delivered.</p>
          <p>Thank you for shopping with us!</p>
        `,
      };

      // Send email to the user
      transporter.sendMail(deliveryMailOptions, (err, info) => {
        if (err) {
          console.log("Error sending email: ", err);
        } else {
          console.log('Email sent to user about delivery: ' + info.response);
        }
      });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};