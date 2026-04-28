const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// In-Memory Database for Hackathon MVP
let products = [
  { id: 1, name: 'Fresh Tomatoes', farmer: 'Ramesh Singh', location: 'Nashik, MH', price: 20, stock: '50kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
  { id: 2, name: 'Organic Potatoes', farmer: 'Suresh Kumar', location: 'Agra, UP', price: 15, stock: '100kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
];

let orders = [
  { id: '#ORD-001', item: 'Tomatoes (10kg)', buyer: 'Rahul Sharma', status: 'Pending Pickup', amount: '₹200' }
];

let feedback = [];
let farmerFeedback = []; // Feedback for farmers from customers

// --- API Endpoints ---

// Products
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    farmer: 'Amit Patel',
    location: 'Local Farm',
    price: Number(req.body.price),
    stock: req.body.qty,
    image: 'https://images.unsplash.com/photo-1595856417537-8848d56b063d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    status: 'In Stock'
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: `#ORD-${String(orders.length + 1).padStart(3, '0')}`,
    item: req.body.item,
    buyer: req.body.buyer || 'Vikram Singh',
    status: 'Confirmed',
    amount: `₹${req.body.amount}`
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

let priceCache = {
  data: null,
  timestamp: 0
};

// Market Prices (Data.gov.in / Mock)
app.get('/api/mandi-prices', async (req, res) => {
  const { city } = req.query;
  const CACHE_DURATION = 5 * 60 * 1000;
  const now = Date.now();

  // If we have a city, we bypass general cache to get specific data
  // But for the sake of speed in hackathon, let's keep a simple cache per city if needed
  // For now, let's just fetch fresh if city is provided

  try {
    const govApiKey = process.env.DATA_GOV_API_KEY;
    if (govApiKey) {
      const resourceId = '35985678-0d79-46b4-9ed6-6f13308a1d24';
      let url = `https://api.data.gov.in/resource/${resourceId}?api-key=${govApiKey}&format=json&limit=1000`;
      
      // If city is provided, we can't easily filter by "includes" in the URL for Market name
      // but we can try to fetch a larger batch and filter locally, or use a broad filter if city is a State.
      // Most of our Navbar values are Cities.
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.records && data.records.length > 0) {
          const uniqueMap = new Map();
          
          let records = data.records;

          // If city provided, filter records first
          if (city) {
            const lowerCity = city.toLowerCase();
            records = records.filter(r => 
              (r.Market || '').toLowerCase().includes(lowerCity) || 
              (r.State || '').toLowerCase().includes(lowerCity) ||
              (r.District || '').toLowerCase().includes(lowerCity)
            );
          }

          records.forEach(r => {
            const key = `${r.Commodity}-${r.Market}`.toLowerCase();
            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, {
                commodity: r.Commodity || r.commodity,
                market: r.Market || r.market,
                state: r.State || r.state,
                min_price: r.Min_Price || r.min_price,
                max_price: r.Max_Price || r.max_price,
                modal_price: r.Modal_Price || r.modal_price,
                trend: Math.random() > 0.5 ? 'up' : 'down'
              });
            }
          });

          const finalRecords = Array.from(uniqueMap.values());
          
          if (finalRecords.length > 0) {
            return res.json({ source: 'datagov', records: finalRecords });
          }
        }
      }
    }
  } catch (error) {
    console.log("Gov API error, using mock data:", error.message);
  }

  // Fallback to Mock Data (Filtered by city if possible)
  let filteredMock = [
    { commodity: "Wheat", min_price: "2100", max_price: "2300", modal_price: "2200", market: "Lucknow", state: "Uttar Pradesh", trend: "up" },
    { commodity: "Rice", min_price: "3500", max_price: "4200", modal_price: "3850", market: "Lucknow", state: "Uttar Pradesh", trend: "up" },
    { commodity: "Potato", min_price: "1200", max_price: "1600", modal_price: "1400", market: "Indore", state: "Madhya Pradesh", trend: "down" },
    { commodity: "Soyabean", min_price: "4200", max_price: "4600", modal_price: "4450", market: "Indore", state: "Madhya Pradesh", trend: "down" },
    { commodity: "Cotton", min_price: "7000", max_price: "8000", modal_price: "7500", market: "Bhopal", state: "Madhya Pradesh", trend: "up" },
    { commodity: "Mustard", min_price: "5400", max_price: "5800", modal_price: "5600", market: "Delhi", state: "Delhi", trend: "down" },
    { commodity: "Tomato", min_price: "1800", max_price: "2500", modal_price: "2100", market: "Agra", state: "Uttar Pradesh", trend: "up" },
    { commodity: "Apple", min_price: "8000", max_price: "12000", modal_price: "10000", market: "Shimla", state: "Himachal Pradesh", trend: "up" },
    { commodity: "Mango", min_price: "3000", max_price: "5000", modal_price: "4000", market: "Varanasi", state: "Uttar Pradesh", trend: "up" },
  ];

  if (city) {
    const lowerCity = city.toLowerCase();
    const citySpecific = filteredMock.filter(m => 
      m.market.toLowerCase().includes(lowerCity) || 
      m.state.toLowerCase().includes(lowerCity)
    );
    if (citySpecific.length > 0) filteredMock = citySpecific;
  }

  res.json({ source: 'mock', records: filteredMock });
});

// Farmer Feedback
app.post('/api/farmer-feedback', (req, res) => {
  const fb = {
    id: Date.now(),
    farmerId: req.body.farmerId,
    customerName: req.body.customerName || 'Anonymous',
    rating: req.body.rating,
    comment: req.body.comment,
    date: new Date()
  };
  farmerFeedback.push(fb);
  res.status(201).json(fb);
});

app.get('/api/farmer-feedback/:farmerId', (req, res) => {
  const filtered = farmerFeedback.filter(f => f.farmerId == req.params.farmerId);
  res.json(filtered);
});

// Feedback
app.get('/api/feedback', (req, res) => {
  res.json(feedback);
});

app.post('/api/feedback', (req, res) => {
  const newFeedback = {
    id: Date.now(),
    name: req.body.name || 'Anonymous',
    message: req.body.message,
    rating: req.body.rating || 5,
    timestamp: new Date()
  };
  feedback.push(newFeedback);
  res.status(201).json(newFeedback);
});

// Start Server
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
