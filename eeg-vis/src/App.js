import NavBar from './components/NavBar'
import './App.css';
import React from 'react';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
      </header>
    </div>
  );
}

export default App;
