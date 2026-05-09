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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
  { id: 3, name: 'Red Onions', farmer: 'Vikram Yadav', location: 'Pune, MH', price: 30, stock: '200kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
  { id: 4, name: 'Premium Wheat', farmer: 'Harish Patel', location: 'Bhopal, MP', price: 25, stock: '500kg', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
  { id: 5, name: 'Fresh Green Peas', farmer: 'Mohan Das', location: 'Indore, MP', price: 40, stock: '30kg', image: 'https://images.unsplash.com/photo-1550828553-b0972e2760f3?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
  { id: 6, name: 'Alphonso Mangoes', farmer: 'Ratnagiri Farms', location: 'Ratnagiri, MH', price: 350, stock: '20kg', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
  { id: 7, name: 'Organic Spinach', farmer: 'Priya Sharma', location: 'Lucknow, UP', price: 10, stock: '15kg', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
  { id: 8, name: 'Kashmiri Apples', farmer: 'Tariq Bhatt', location: 'Srinagar, JK', price: 120, stock: '40kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
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
    image: req.body.image || 'https://images.unsplash.com/photo-1595856417537-8848d56b063d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
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
    
    if (citySpecific.length > 0) {
      filteredMock = citySpecific;
    } else {
      // Dynamic mock generation for cities not in our hardcoded list
      // This makes the demo look flawless for any location selected on the map
      const commodities = ["Tomato", "Onion", "Potato", "Wheat", "Rice", "Chana", "Mustard"];
      const generated = [];
      const numToGenerate = 3 + Math.floor(Math.random() * 3); // Generate 3 to 5 items
      
      // Shuffle and pick
      const shuffled = commodities.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numToGenerate);
      
      selected.forEach(c => {
        const basePrice = 1000 + Math.floor(Math.random() * 4000);
        generated.push({
          commodity: c,
          min_price: (basePrice - 200).toString(),
          max_price: (basePrice + 300).toString(),
          modal_price: basePrice.toString(),
          market: city.split(',')[0], // Use just the city name part
          state: "Local State",
          trend: Math.random() > 0.5 ? "up" : "down"
        });
      });
      filteredMock = generated;
    }
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

// Chatbot AI Endpoint (Simulated)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const msg = message.toLowerCase();
  let reply = "I'm your Krishi Cart AI Assistant! I can help you find fresh produce, suggest crops, or guide you through the website. What do you need help with?";

  if (msg.includes('buy') || msg.includes('purchase') || msg.includes('shop')) {
    reply = "You can browse our fresh, live products on the Consumer Marketplace page. Just click on 'Marketplace' in the navigation bar to see what our farmers have listed today!";
  } else if (msg.includes('tomato') || msg.includes('potato') || msg.includes('wheat') || msg.includes('onion')) {
    reply = "We have plenty of fresh produce coming directly from the farms! You can find tomatoes, potatoes, onions, and more in our Marketplace. They are organic and 100% traceable.";
  } else if (msg.includes('price') || msg.includes('mandi') || msg.includes('rate')) {
    reply = "We provide live daily Mandi prices directly from the Government database! You can see the live ticker on the Consumer Marketplace page to make better purchasing decisions.";
  } else if (msg.includes('suggest') || msg.includes('crop') || msg.includes('grow')) {
    reply = "If you are a farmer looking for suggestions: Based on current market trends, Tomatoes and Onions are seeing a price surge. However, please ensure your local soil and climate conditions are suitable before planting.";
  } else if (msg.includes('sell') || msg.includes('farmer')) {
    reply = "Are you a farmer? Welcome! You can list your products, track your inventory, and see market trends from the Farmer Dashboard. Let's grow together!";
  } else if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey')) {
    reply = "Hello there! Welcome to Krishi Cart. How can I assist you with your farming or shopping needs today?";
  } else if (msg.includes('support') || msg.includes('help') || msg.includes('issue')) {
    reply = "I'm here to help! If you have a specific issue with an order, you can contact our support team at support@krishicart.com or call our toll-free number at 1800-123-4567.";
  }

  // Add a slight delay to simulate AI thinking
  setTimeout(() => {
    res.json({ reply });
  }, 800);
});

// Start Server
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
