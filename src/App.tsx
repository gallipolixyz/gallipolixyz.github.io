import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Programs } from './pages/Programs';
import { About } from './pages/About';
import { Events } from './pages/Events';
import BlogList from './components/Blogs';
import BlogDetails from './components/BlogDetails';
import { EventDetails } from './components/EventDetails';
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';
import CoreTeam from './components/CoreTeam';
import ComingSoon from './pages/ComingSoon';
import { Contact } from './pages/Contact';

function App() {
  useGoogleAnalytics();

  return (
    <div className="min-h-screen bg-black text-custom-cyan">
      <Navigation />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/about" element={<About />} />
        <Route path="/career" element={<Navigate to="/programs#career" replace />} />
        <Route path="/timeline" element={<Navigate to="/about#timeline" replace />} />
        <Route path="/social" element={<Navigate to="/contact#social" replace />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/teams" element={<CoreTeam />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;