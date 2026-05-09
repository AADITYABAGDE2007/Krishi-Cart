import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { X, Navigation, MapPin, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocation } from '../context/LocationContext';

// Fix for leaflet marker icon missing in some React setups
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

// Component to handle map centering when search happens and fix rendering bugs
const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      // Small timeout to allow modal animation to finish before recalculating size
      setTimeout(() => {
        map.invalidateSize();
        map.flyTo(position, 13);
      }, 250);
    }
  }, [map, position]);
  return null;
};

const LocationMapModal = ({ isOpen, onClose }) => {
  const { updateLocation } = useLocation();
  const [position, setPosition] = useState({ lat: 26.8467, lng: 80.9462 }); // Default Lucknow
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUseLiveLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition({ lat, lng });
          
          try {
            // Reverse Geocoding using Nominatim (OpenStreetMap)
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Current Location';
            updateLocation(city);
            onClose();
          } catch (error) {
            console.error("Error fetching city name", error);
            updateLocation("Current Location");
            onClose();
          }
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setLoading(false);
          alert("Could not access your location. Please check browser permissions.");
        }
      );
    } else {
      setLoading(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleConfirmLocation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=10`);
      const data = await res.json();
      const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Selected Location';
      updateLocation(city);
      onClose();
    } catch (error) {
      console.error("Error fetching city name", error);
      updateLocation("Selected Location");
      onClose();
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition({ lat, lng: lon });
      } else {
        alert("Location not found. Please try another search.");
      }
    } catch (error) {
      console.error("Search error", error);
      alert("Error searching for location.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Search */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col gap-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Select Location</h3>
                <p className="text-xs text-slate-500 hidden sm:block">Choose where you want to see market prices</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Search for a city or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button 
              type="submit" 
              disabled={isSearching}
              className="absolute right-2 bg-primary text-white p-1.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Map Container */}
        <div className="relative flex-1 h-[400px] w-full bg-slate-200">
          {isOpen && (
            <MapContainer 
              center={position} 
              zoom={13} 
              style={{ height: '400px', width: '100%', zIndex: 0 }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <Marker position={position} />
              <MapClickHandler setPosition={setPosition} />
              <MapUpdater position={position} />
            </MapContainer>
          )}
          
          <div className="absolute bottom-4 left-4 right-4 z-[400] flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleUseLiveLocation}
              disabled={loading}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl shadow-lg border border-slate-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Navigation className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : 'text-blue-500'}`} />
              {loading ? 'Locating...' : 'Use Live Location'}
            </button>
            <button 
              onClick={handleConfirmLocation}
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? 'Confirming...' : 'Confirm Pin'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMapModal;
