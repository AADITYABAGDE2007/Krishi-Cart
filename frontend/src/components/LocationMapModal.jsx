import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { X, Navigation, MapPin, Search } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const LocationMapModal = ({ isOpen, onClose }) => {
  const { updateLocation } = useLocation();
  const [position, setPosition] = useState({ lat: 26.8467, lng: 80.9462 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

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
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
            const data = await res.json();
            
            let city = 'Current Location';
            if (data.status === 'OK' && data.results.length > 0) {
              const addressComponents = data.results[0].address_components;
              const cityComponent = addressComponents.find(c => c.types.includes('locality') || c.types.includes('administrative_area_level_2'));
              if (cityComponent) city = cityComponent.long_name;
            }
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
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=${apiKey}`);
      const data = await res.json();
      
      let city = 'Selected Location';
      if (data.status === 'OK' && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const cityComponent = addressComponents.find(c => c.types.includes('locality') || c.types.includes('administrative_area_level_2'));
        if (cityComponent) city = cityComponent.long_name;
      }
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
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${apiKey}`);
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const lat = data.results[0].geometry.location.lat;
        const lon = data.results[0].geometry.location.lng;
        setPosition({ lat, lng: lon });
        if (map) {
          map.panTo({ lat, lng: lon });
        }
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

  const onMapClick = (e) => {
    setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
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
          {isOpen && isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={position}
              zoom={14}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={onMapClick}
              options={{ disableDefaultUI: true, zoomControl: true }}
            >
              <Marker position={position} />
            </GoogleMap>
          ) : (
             <div className="w-full h-full flex items-center justify-center">
               <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
             </div>
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
