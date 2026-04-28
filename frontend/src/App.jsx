import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import FarmerDashboard from './pages/FarmerDashboard';
import ConsumerMarketplace from './pages/ConsumerMarketplace';
import Checkout from './pages/Checkout';
import Navbar from './components/Navbar';
import FeedbackModal from './components/FeedbackModal';
import Profile from './pages/Profile';
import { LocationProvider } from './context/LocationContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Navigate to="/consumer" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/farmer" element={<FarmerDashboard />} />
              <Route path="/consumer" element={<ConsumerMarketplace />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <FeedbackModal />
        </div>
      </Router>
    </LocationProvider>
  </AuthProvider>
  );
}

export default App;
