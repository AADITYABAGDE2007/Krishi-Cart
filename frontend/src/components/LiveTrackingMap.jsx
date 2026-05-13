import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { io } from "socket.io-client";

const containerStyle = {
  width: '100%',
  height: '350px'
};

const LiveTrackingMap = ({ deliveryId, initialLat, initialLng }) => {
  const [driverPos, setDriverPos] = useState({ 
    lat: initialLat || 20.0, 
    lng: initialLng || 73.0 
  });
  const [isConnected, setIsConnected] = useState(false);
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    // Connect to Backend Socket.io
    const socket = io("http://localhost:5000");
    
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen specifically to this delivery ID's tracking updates
    socket.on(`tracking_${deliveryId}`, (data) => {
      setDriverPos({ lat: data.lat, lng: data.lng });
      if (map) {
        map.panTo({ lat: data.lat, lng: data.lng });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [deliveryId, map]);

  return (
    <div className="relative border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Live Status Indicator */}
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <span className="text-slate-700">{isConnected ? 'Live Tracking On' : 'Connecting...'}</span>
      </div>
      
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={driverPos}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          <Marker position={driverPos}>
            <InfoWindow position={driverPos}>
              <div className="text-center">
                <span className="font-bold text-slate-800">Delivery Partner</span> <br/>
                <span className="text-green-600 text-xs font-semibold">On the way</span>
              </div>
            </InfoWindow>
          </Marker>
        </GoogleMap>
      ) : (
        <div className="w-full h-[350px] flex items-center justify-center bg-slate-100">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingMap;
