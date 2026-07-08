import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { locations } from './data/locations';
import CityCard from './components/CityCard';
import FeedLayout from './components/feed/FeedLayout';
import Onboarding from './components/onboarding/Onboarding';
import LandingPage from './components/LandingPage';
import './index.css';

// Main Hub Layout Component
const HubLayout = () => {
  const { city } = useParams();
  const locationObj = city ? locations.find(l => l.id.toLowerCase() === city.toLowerCase()) : null;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-primary selection:text-white pb-20">
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <span className="text-2xl font-black tracking-tighter text-white">⅄azhi</span>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 border-l border-zinc-700 pl-4 flex items-center gap-2">
              Network
              {locationObj && <span className={`w-2 h-2 rounded-full ml-2 ${locationObj.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>}
            </span>
          </Link>
          <div className="flex items-center space-x-6 text-sm font-mono">
            <Link to="/network" className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Global</Link>
            <Link to="/madurai" className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Madurai</Link>
            <Link to="/kochi" className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Kochi</Link>
            <Link to="/bangalore" className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Bangalore</Link>
            <Link to="/hyderabad" className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Hyderabad</Link>
            <Link to="/onboarding" className="bg-white text-black px-4 py-1.5 font-bold hover:bg-zinc-200 transition-colors">
              Join
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full">
        {/* If no city is specified, show the network overview */}
        {!city && (
          <div className="max-w-7xl mx-auto px-6 mt-12 mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              Indian Hackers Portal
            </h1>
            <p className="text-zinc-400 font-mono text-sm max-w-xl leading-relaxed mb-8">
              Connect, collaborate, and build. Select a geographic node to view local gigs, network with builders, and ship products faster.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {locations.map(loc => (
                <Link to={`/network/${loc.id.toLowerCase()}`} key={loc.id}>
                  <CityCard location={loc} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* The Feed - filtered by location if city is in URL */}
        <FeedLayout activeLocation={locationObj?.name || null} />
      </main>

      <div className="fixed top-1/4 left-1/4 w-[50vw] h-[50vw] bg-white opacity-[0.015] rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  );
};

import UserProfile from './components/profile/UserProfile';
import EditProfile from './components/profile/EditProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile/edit" element={
          <>
            <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-4">
                  <span className="text-2xl font-black tracking-tighter text-white">⅄azhi</span>
                </Link>
              </div>
            </nav>
            <EditProfile />
          </>
        } />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/network/:city" element={<HubLayout />} />
        <Route path="/network" element={<HubLayout />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
