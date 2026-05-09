import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from "socket.io-client";
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Default Icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically fly the map to the driver's new position
const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (map && position) {
      map.flyTo(position, map.getZoom(), { animate: true, duration: 1.5 });
    }
  }, [map, position]);
  return null;
};

const LiveTrackingMap = ({ deliveryId, initialLat, initialLng }) => {
  const [driverPos, setDriverPos] = useState({ 
    lat: initialLat || 20.0, 
    lng: initialLng || 73.0 
  });
  const [isConnected, setIsConnected] = useState(false);

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
    });

    return () => {
      socket.disconnect();
    };
  }, [deliveryId]);

  return (
    <div className="relative border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Live Status Indicator */}
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <span className="text-slate-700">{isConnected ? 'Live Tracking On' : 'Connecting...'}</span>
      </div>
      
      <MapContainer 
        center={driverPos} 
        zoom={15} 
        style={{ height: '350px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={driverPos}>
          <Popup>
            <div className="text-center">
              <span className="font-bold text-slate-800">Delivery Partner</span> <br/>
              <span className="text-green-600 text-xs font-semibold">On the way</span>
            </div>
          </Popup>
        </Marker>
        <MapUpdater position={driverPos} />
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;
