import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem('userLocation') || 'Lucknow');

  const updateLocation = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('userLocation', location);
  };

  return (
    <LocationContext.Provider value={{ selectedLocation, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
