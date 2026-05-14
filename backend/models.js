const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  farmer: { type: String, required: true },
  location: String,
  lat: Number,
  lng: Number,
  price: { type: Number, required: true },
  predictedPrice: Number,
  stock: String,
  image: String,
  isOrganic: { type: Boolean, default: false },
  status: { type: String, default: 'In Stock' }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  item: String,
  buyer: String,
  farmer: String,
  amount: String,
  distance: String,
  status: { type: String, default: 'Confirmed' },
  location: String,
  paymentMethod: String
}, { timestamps: true });

const deliverySchema = new mongoose.Schema({
  deliveryId: { type: String, required: true, unique: true },
  orderId: String,
  item: String,
  pickup: String,
  dropoff: String,
  distance: String,
  earnings: String,
  status: { type: String, default: 'Searching for Partner' },
  phone: String,
  partnerName: String,
  vehicleNo: String,
  partnerLat: Number,
  partnerLng: Number,
  otp: String,
  pickupImage: String
}, { timestamps: true });

const feedbackSchema = new mongoose.Schema({
  name: String,
  message: String,
  rating: Number
}, { timestamps: true });

const farmerFeedbackSchema = new mongoose.Schema({
  farmerId: String,
  customerName: String,
  rating: Number,
  comment: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  phone: String,
  aadharNumber: String,
  farmSize: String,
  primaryCrops: String,
  vehicleType: String,
  vehicleNumber: String,
}, { timestamps: true });

const cropPredictionSchema = new mongoose.Schema({
  farmerId: String,
  cropName: String,
  location: String,
  currentPrice: String,
  prediction1Month: String,
  prediction2Month: String,
  aiSuggestion: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Delivery = mongoose.model('Delivery', deliverySchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const FarmerFeedback = mongoose.model('FarmerFeedback', farmerFeedbackSchema);
const User = mongoose.model('User', userSchema);
const CropPrediction = mongoose.model('CropPrediction', cropPredictionSchema);

module.exports = { Product, Order, Delivery, Feedback, FarmerFeedback, User, CropPrediction };
