import React from 'react';

const SplashPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 animate-fadeIn">
      <h2 className="text-2xl text-gray-800 font-bold">Welcome to </h2>
      <h1
        className="text-3xl bg-gradient-to-r from-gray-900 via-pink-500 to-cyan-500 text-transparent bg-clip-text font-extrabold"
      >
        AI-Powered Notion Clone
      </h1>
      <p className="text-lg text-gray-500">Loading...</p>
    </div>
  );
};

export default SplashPage;
