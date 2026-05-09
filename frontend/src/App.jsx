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
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { LocationProvider } from './context/LocationContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const RootRedirect = () => {
  const { user, isLoggedIn } = useAuth();
  if (isLoggedIn && user?.role?.toLowerCase() === 'farmer') {
    return <Navigate to="/farmer" replace />;
  }
  return <Navigate to="/consumer" replace />;
};

const ProtectedRoute = ({ children, allowedRoles, blockRoles }) => {
  const { user, isLoggedIn } = useAuth();
  
  if (isLoggedIn && user?.role) {
    const role = user.role.toLowerCase();
    
    // Block specific roles from this route (e.g. block 'farmer' from consumer pages)
    if (blockRoles && blockRoles.includes(role)) {
      return <Navigate to={role === 'farmer' ? '/farmer' : '/consumer'} replace />;
    }

    // Only allow specific roles to access this route
    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to={role === 'farmer' ? '/farmer' : '/consumer'} replace />;
    }
  } else if (!isLoggedIn && allowedRoles) {
    // If not logged in and route requires authentication
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route path="/farmer" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/consumer" element={
                <ProtectedRoute blockRoles={['farmer']}>
                  <ConsumerMarketplace />
                </ProtectedRoute>
              } />
              
              <Route path="/checkout" element={
                <ProtectedRoute allowedRoles={['consumer']}>
                  <Checkout />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['farmer', 'consumer']}>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <FeedbackModal />
          <Chatbot />
        </div>
      </Router>
    </LocationProvider>
  </AuthProvider>
  );
}

export default App;
