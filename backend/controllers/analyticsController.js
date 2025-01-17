const Order = require('../models/Order');
const Product = require('../models/Products');

// Get order analytics
exports.getOrderAnalytics = async (req, res) => {
  try {
    const { timeframe } = req.query;

    // Filter based on timeframe (e.g., daily, weekly, monthly)
    const filter = {};
    if (timeframe === 'daily') {
      filter.createdAt = { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) };
    } else if (timeframe === 'weekly') {
      filter.createdAt = { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) };
    } else if (timeframe === 'monthly') {
      filter.createdAt = { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) };
    }

    const orders = await Order.find(filter);
    const totalOrders = orders.length;

    const dailyOrderData = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({ totalOrders, dailyOrderData });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { timeframe } = req.query;

    const filter = {};
    if (timeframe === 'daily') {
      filter.createdAt = { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) };
    } else if (timeframe === 'weekly') {
      filter.createdAt = { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) };
    } else if (timeframe === 'monthly') {
      filter.createdAt = { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) };
    }

    const orders = await Order.find(filter);
    const revenueByCategory = {};

    for (const order of orders) {
      for (const product of order.products) {
        const productDetails = await Product.findById(product.productId);
        const category = productDetails.category || 'Others';
        revenueByCategory[category] = (revenueByCategory[category] || 0) + productDetails.price * product.quantity;
      }
    }

    res.status(200).json({ revenueByCategory });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Get top products
exports.getTopProducts = async (req, res) => {
  try {
    const orders = await Order.find();
    const productSales = {};

    for (const order of orders) {
      for (const product of order.products) {
        const productId = product.productId.toString();
        productSales[productId] = (productSales[productId] || 0) + product.quantity;
      }
    }

    const topProducts = await Product.find({ _id: { $in: Object.keys(productSales) } })
      .select('name price')
      .lean();

    const topProductData = topProducts.map((product) => ({
      name: product.name,
      unitsSold: productSales[product._id.toString()],
      revenue: productSales[product._id.toString()] * product.price,
    })).sort((a, b) => b.unitsSold - a.unitsSold);

    res.status(200).json(topProductData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
