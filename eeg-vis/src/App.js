import NavBar from './components/NavBar';
import './App.css';
import React from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EegPage from './pages/EegPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <header className="App-header">
    <Router>
      <NavBar />
      <Routes>
        {/* Redirect from base URL to /home */}
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/eegdata" element={<EegPage />} />
      </Routes>
    </Router>
      </header>
    </div>
  );
}

export default App;
