const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const { Product, Order, Delivery, Feedback, FarmerFeedback } = require('./models');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/krishicart';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB Connected Successfully to ${MONGO_URI}`);
    seedInitialData();
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

io.on('connection', (socket) => {
  console.log('User connected');

  // Delivery Boy ki app yahan apni live location bhejegi
  socket.on('driver_location_update', (data) => {
    // Consumer ki app ko location broadcast kardo taaki map update ho sake
    io.emit(`tracking_${data.deliveryId}`, { 
      lat: data.lat, 
      lng: data.lng 
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Helper for SMS Notification (Fast2SMS API)
async function sendSMS(phoneNumber, message) {
  try {
    if (!process.env.FAST2SMS_API_KEY || process.env.FAST2SMS_API_KEY === 'your_api_key_here') {
      console.log(`\n📱 [MOCK SMS] To: ${phoneNumber}`);
      console.log(`✉️  Message: ${message}`);
      console.log(`(Set FAST2SMS_API_KEY in .env to send real SMS)\n`);
      return;
    }

    const cleanNumber = phoneNumber.replace('+91', '').replace(/\s+/g, '').trim();
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        route: 'q',
        message: message,
        flash: 0,
        numbers: cleanNumber
      }
    });
    
    console.log(`\n================= SMS GATEWAY =================`);
    console.log(`✅ Asli SMS Bhej diya gaya hai: ${cleanNumber}`);
    console.log(`===============================================\n`);
  } catch (error) {
    console.error('\n❌ SMS Bhejne me error aayi (Check API Key limit):', error.message);
  }
}

// Helper for Aerial Distance (Fallback)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper for Real Road Distance (OSRM API)
async function calculateRoadDistance(lat1, lon1, lat2, lon2) {
  try {
    // OSRM expects coordinates in lon,lat order
    const url = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const response = await axios.get(url, { timeout: 3000 });
    
    if (response.data.code === 'Ok') {
      // OSRM returns distance in meters. Convert to KM.
      return response.data.routes[0].distance / 1000; 
    }
    return calculateDistance(lat1, lon1, lat2, lon2);
  } catch (error) {
    console.error("OSRM Routing Error, falling back to aerial distance:", error.message);
    return calculateDistance(lat1, lon1, lat2, lon2); 
  }
}

// Seed Initial Data (if db is empty)
async function seedInitialData() {
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('Seeding initial products into MongoDB...');
    const initialProducts = [
      { name: 'Fresh Tomatoes', farmer: 'Ramesh Singh', location: 'Nashik, MH', lat: 19.9975, lng: 73.7898, price: 20, stock: '50', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
      { name: 'Organic Potatoes', farmer: 'Suresh Kumar', location: 'Agra, UP', lat: 27.1767, lng: 78.0081, price: 15, stock: '100', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
      { name: 'Red Onions', farmer: 'Vikram Yadav', location: 'Pune, MH', lat: 18.5204, lng: 73.8567, price: 30, stock: '200', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' }
    ];
    await Product.insertMany(initialProducts);
  }
}

// --- API Endpoints ---

// Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    // mapping _id to id for frontend compatibility
    const formatted = products.map(p => ({...p.toObject(), id: p._id.toString()}));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      farmer: 'Amit Patel',
      location: req.body.location || 'Local Farm',
      lat: req.body.lat || 20.0,
      lng: req.body.lng || 73.0,
      price: Number(req.body.price),
      stock: req.body.qty,
      image: req.body.image || 'https://images.unsplash.com/photo-1595856417537-8848d56b063d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    });
    const saved = await newProduct.save();
    const formatted = {...saved.toObject(), id: saved._id.toString()};
    
    io.emit('new_product', formatted);
    res.status(201).json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Orders & Delivery Logic
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    // map orderId to id for frontend
    const formatted = orders.map(o => ({...o.toObject(), id: o.orderId}));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { productId, quantity, buyer, buyerLat, buyerLng } = req.body;
  
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let distance = 0;
    if (buyerLat && buyerLng && product.lat && product.lng) {
      distance = await calculateRoadDistance(product.lat, product.lng, buyerLat, buyerLng);
      if (distance > 50) {
        return res.status(400).json({ error: `Delivery not available. Farm is ${distance.toFixed(1)} km away via road (Max 50 km).` });
      }
    }

    let finalPrice = Number(product.price) * quantity;
    if (quantity >= 50) finalPrice *= 0.9;

    const orderCount = await Order.countDocuments();
    const orderIdStr = `#ORD-${String(orderCount + 1).padStart(3, '0')}`;

    const newOrder = new Order({
      orderId: orderIdStr,
      item: `${product.name} (${quantity}kg)`,
      buyer: buyer || 'Consumer',
      farmer: product.farmer,
      amount: `₹${finalPrice.toFixed(2)}`,
      distance: distance.toFixed(1),
      location: req.body.location || 'Local Location',
      paymentMethod: req.body.paymentMethod || 'upi'
    });
    
    await newOrder.save();

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const newDelivery = new Delivery({
      deliveryId: `#DEL-${Date.now().toString().slice(-4)}`,
      orderId: newOrder.orderId,
      item: newOrder.item,
      pickup: product.location,
      dropoff: req.body.location || 'Customer Location',
      distance: `${distance.toFixed(1)} km`,
      earnings: `₹${(distance * 5 + 20).toFixed(0)}`,
      status: 'Searching for Partner',
      otp: otp
    });
    
    await newDelivery.save();

    const formattedOrder = {...newOrder.toObject(), id: newOrder.orderId};
    const formattedDelivery = {...newDelivery.toObject(), id: newDelivery.deliveryId};

    sendSMS('+918888888888', `Krishi Cart: You have a new order ${formattedOrder.id} for ${formattedOrder.item} from ${formattedOrder.buyer}.`);
    sendSMS(formattedDelivery.phone, `Krishi Cart Delivery: New task assigned! Pickup from ${formattedDelivery.pickup}. Distance: ${formattedDelivery.distance}, Earnings: ${formattedDelivery.earnings}.`);

    io.emit('new_order', formattedOrder);
    io.emit('new_delivery', formattedDelivery);

    res.status(201).json({ order: formattedOrder, message: 'Order placed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Deliveries API
app.get('/api/deliveries', async (req, res) => {
  try {
    const deliveries = await Delivery.find().sort({ createdAt: -1 });
    const formatted = deliveries.map(d => ({...d.toObject(), id: d.deliveryId}));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

app.get('/api/deliveries/order/:orderId', async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId });
    if (delivery) {
      res.json({...delivery.toObject(), id: delivery.deliveryId});
    } else {
      res.status(404).json({ error: 'Delivery not found for this order' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch delivery details' });
  }
});

app.put('/api/deliveries/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const { partnerName, phone, vehicleNo, lat, lng } = req.body;
    
    const delivery = await Delivery.findOneAndUpdate(
      { deliveryId: id, status: 'Searching for Partner' }, 
      { status: 'Accepted', partnerName, phone, vehicleNo, partnerLat: lat, partnerLng: lng }, 
      { new: true }
    );
    
    if (delivery) {
      const formatted = {...delivery.toObject(), id: delivery.deliveryId};
      io.emit('delivery_update', formatted);
      res.json(formatted);
    } else {
      res.status(400).json({ error: 'Delivery already accepted by someone else or not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept delivery' });
  }
});

app.put('/api/deliveries/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pickupImage } = req.body;
    
    const updateData = { status: status };
    if (pickupImage) updateData.pickupImage = pickupImage;

    const delivery = await Delivery.findOneAndUpdate({ deliveryId: id }, updateData, { new: true });
    
    if (delivery) {
      const formatted = {...delivery.toObject(), id: delivery.deliveryId};
      io.emit('delivery_update', formatted);
      res.json(formatted);
    } else {
      res.status(404).json({ error: 'Delivery not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

app.put('/api/deliveries/:id/verify-otp', async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;
    
    const delivery = await Delivery.findOne({ deliveryId: id });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    
    if (delivery.otp === otp || otp === '0000') { // 0000 as master override for testing
      delivery.status = 'Delivered';
      await delivery.save();
      
      // Update the main Order status as well so Farmer dashboard updates
      if (delivery.orderId) {
        await Order.findOneAndUpdate({ orderId: delivery.orderId }, { status: 'Delivered' });
      }

      const formatted = {...delivery.toObject(), id: delivery.deliveryId};
      io.emit('delivery_update', formatted);
      res.json({ success: true, delivery: formatted });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Market Prices
app.get('/api/mandi-prices', async (req, res) => {
  const { city } = req.query;
  let filteredMock = [
    { commodity: "Wheat", min_price: "2100", max_price: "2300", modal_price: "2200", market: "Lucknow", state: "Uttar Pradesh", trend: "up" },
    { commodity: "Rice", min_price: "3500", max_price: "4200", modal_price: "3850", market: "Lucknow", state: "Uttar Pradesh", trend: "up" },
    { commodity: "Potato", min_price: "1200", max_price: "1600", modal_price: "1400", market: "Indore", state: "Madhya Pradesh", trend: "down" },
    { commodity: "Tomato", min_price: "1800", max_price: "2500", modal_price: "2100", market: "Agra", state: "Uttar Pradesh", trend: "up" }
  ];

  if (city) {
    const generated = [];
    const commodities = ["Tomato", "Onion", "Potato", "Wheat", "Rice"];
    commodities.forEach(c => {
      const basePrice = 1000 + Math.floor(Math.random() * 4000);
      generated.push({
        commodity: c,
        min_price: (basePrice - 200).toString(),
        max_price: (basePrice + 300).toString(),
        modal_price: basePrice.toString(),
        market: city.split(',')[0],
        state: "Local State",
        trend: Math.random() > 0.5 ? "up" : "down"
      });
    });
    filteredMock = generated;
  }
  res.json({ source: 'mock', records: filteredMock });
});

// Feedback & Chat endpoints
app.post('/api/farmer-feedback', async (req, res) => {
  try {
    const newFeedback = new FarmerFeedback(req.body);
    const saved = await newFeedback.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

app.get('/api/farmer-feedback/:farmerId', async (req, res) => {
  try {
    const feedback = await FarmerFeedback.find({ farmerId: req.params.farmerId });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    const saved = await newFeedback.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

app.post('/api/chat', (req, res) => {
  res.json({ reply: "I'm Krishi Cart AI. I can help with orders, delivery tracking and live mandi prices!" });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
