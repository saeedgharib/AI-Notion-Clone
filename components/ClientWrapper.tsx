'use client'; // Required for client components

import { useState, useEffect } from 'react';
import SplashPage from './Splash';


const ClientWrapper = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000); // Show for 1 second
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return showSplash && <SplashPage /> ;
};

export default ClientWrapper;
