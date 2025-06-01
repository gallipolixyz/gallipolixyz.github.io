import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Programs } from './pages/Programs';
import { About } from './pages/About';
import { Social } from './pages/Social';
import BlogList from './components/Blogs';
import BlogDetails from './components/BlogDetails';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-custom-cyan">
      <Navigation />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/about" element={<About />} />
          <Route path="/social" element={<Social />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;