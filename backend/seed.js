const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://withailyrics_db_user:krishicart123@cluster0.rweobns.mongodb.net/krishicart?appName=Cluster0';

// Define Schemas
const productSchema = new mongoose.Schema({
  name: String, farmer: String, location: String,
  lat: Number, lng: Number, price: Number, stock: String,
  image: String, isOrganic: Boolean, status: String
});

const orderSchema = new mongoose.Schema({
  orderId: String, item: String, buyer: String, farmer: String,
  amount: String, distance: String, location: String,
  paymentMethod: String, status: String, lat: Number, lng: Number
});

const deliverySchema = new mongoose.Schema({
  deliveryId: String, orderId: String, item: String, pickup: String,
  dropoff: String, distance: String, earnings: String, status: String,
  partnerName: String, phone: String, vehicleNo: String, otp: String
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Delivery = mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const products = [
    { name: 'Fresh Tomatoes', farmer: 'Ramesh Singh', location: 'Nashik, MH', lat: 19.9975, lng: 73.7898, price: 20, stock: '500', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
    { name: 'Organic Potatoes', farmer: 'Suresh Kumar', location: 'Agra, UP', lat: 27.1767, lng: 78.0081, price: 15, stock: '1000', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
    { name: 'Red Onions', farmer: 'Vikram Yadav', location: 'Pune, MH', lat: 18.5204, lng: 73.8567, price: 30, stock: '800', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?ixlib=rb-4.0.3&w=500&q=60', status: 'In Stock' },
    { name: 'Green Chilli', farmer: 'Anand Patil', location: 'Surat, GJ', lat: 21.1702, lng: 72.8311, price: 40, stock: '200', image: 'https://images.unsplash.com/photo-1588012891124-ed914d728514?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', isOrganic: true, status: 'In Stock' },
    { name: 'Fresh Cabbage', farmer: 'Ramesh Singh', location: 'Nashik, MH', lat: 19.9975, lng: 73.7898, price: 12, stock: '300', image: 'https://images.unsplash.com/photo-1596481745773-45f8e652ad75?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', isOrganic: true, status: 'In Stock' }
  ];

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded Products');

  const orders = [
    { orderId: '#ORD-001', item: 'Fresh Tomatoes (20kg)', buyer: 'Rahul Sharma', farmer: 'Ramesh Singh', amount: '400', distance: '12.5', location: 'Lucknow, UP', paymentMethod: 'upi', status: 'Pending', lat: 26.8467, lng: 80.9462 },
    { orderId: '#ORD-002', item: 'Organic Potatoes (50kg)', buyer: 'Priya Gupta', farmer: 'Suresh Kumar', amount: '750', distance: '8.2', location: 'Kanpur, UP', paymentMethod: 'cod', status: 'Accepted', lat: 26.4499, lng: 80.3319 },
    { orderId: '#ORD-003', item: 'Red Onions (10kg)', buyer: 'Amit Patel', farmer: 'Vikram Yadav', amount: '300', distance: '45.0', location: 'Mumbai, MH', paymentMethod: 'upi', status: 'Delivered', lat: 19.0760, lng: 72.8777 }
  ];

  await Order.deleteMany({});
  await Order.insertMany(orders);
  console.log('Seeded Orders');

  const deliveries = [
    { deliveryId: '#DEL-1001', orderId: '#ORD-001', item: 'Fresh Tomatoes (20kg)', pickup: 'Nashik, MH', dropoff: 'Lucknow, UP', distance: '12.5 km', earnings: '82', status: 'Searching for Partner', otp: '1234' },
    { deliveryId: '#DEL-1002', orderId: '#ORD-002', item: 'Organic Potatoes (50kg)', pickup: 'Agra, UP', dropoff: 'Kanpur, UP', distance: '8.2 km', earnings: '61', status: 'Accepted', partnerName: 'Rajesh Delivery', phone: '9876543210', vehicleNo: 'UP32 AB 1234', otp: '5678' }
  ];

  await Delivery.deleteMany({});
  await Delivery.insertMany(deliveries);
  console.log('Seeded Deliveries');

  process.exit(0);
}

seed();
