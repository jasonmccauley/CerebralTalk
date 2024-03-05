import { Link } from 'react-router-dom';

function NavBar() {
    
  return (
    <nav className="navbar">
      <Link to="home/" className="link">Home</Link> | <Link to="/about" className="link">About</Link> | <Link to="/eegdata" className="link">EEG</Link>
    </nav>
  );
}

export default NavBar;