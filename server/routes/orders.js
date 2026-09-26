import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';

const router = Router();

// GET /api/orders - list all orders for admin
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderId: regex },
        { customerName: regex },
        { phone: regex },
        { email: regex },
        { district: regex }
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});

// GET /api/orders/:id - get single order details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let order = await Order.findOne({ orderId: id });

    if (!order && mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching single order:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// POST /api/orders - customer places an order
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      district,
      area,
      address,
      notes,
      products,
      deliveryLocation,
      deliveryCharge: customDeliveryCharge
    } = req.body;

    // Validation
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    if (!district || !district.trim()) {
      return res.status(400).json({ success: false, message: 'District is required' });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({ success: false, message: 'Full delivery address is required' });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one product' });
    }

    // Calculate subtotal and quantities
    const totalQuantity = products.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
    const subtotal = products.reduce((acc, item) => acc + Number(item.price) * (Number(item.quantity) || 1), 0);

    // Delivery charge calculation: Inside Dhaka ৳80, Outside Dhaka ৳130
    // Free delivery on ৳3,000+
    const isInsideDhaka = district.trim().toLowerCase() === 'dhaka' || deliveryLocation === 'inside_dhaka';
    let deliveryCharge = isInsideDhaka ? 80 : 130;
    if (subtotal >= 3000) {
      deliveryCharge = 0;
    } else if (customDeliveryCharge !== undefined) {
      deliveryCharge = Number(customDeliveryCharge);
    }

    const total = subtotal + deliveryCharge;

    // Generate unique order ID: NM-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `NM-${dateStr}-${randomSuffix}`;

    const newOrder = new Order({
      orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      district: district.trim(),
      area: area ? area.trim() : district.trim(),
      address: address.trim(),
      notes: notes ? notes.trim() : '',
      products: products.map(item => ({
        id: item.id || item.customId,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        size: item.size || 'M',
        color: item.color || { name: 'Standard', hex: '#111111' },
        image: item.image || item.images?.[0] || '/assets/images/category_panjabi_1790217944904.jpg'
      })),
      totalQuantity,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();
    console.log(`Order placed successfully: ${orderId} by ${customerName} (৳${total})`);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully in MongoDB',
      orderId: savedOrder.orderId,
      data: savedOrder
    });
  } catch (error) {
    console.error('Error creating order in MongoDB:', error);
    return res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
  }
});

// PUT /api/orders/:id/status - update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    let order = await Order.findOne({ orderId: id });
    if (!order && mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    const updated = await order.save();

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
});

export default router;
