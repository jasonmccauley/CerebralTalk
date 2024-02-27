import NavBar from './components/NavBar'
import './App.css';
import React from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
      </header>
    </div>
  );
}

export default App;
