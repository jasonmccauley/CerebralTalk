import { Link } from 'react-router-dom';

function NavBar() {
    
  return (
    <nav className="navbar">
      <Link to="/" className="link">Home</Link> | <Link to="/about" className="link">About</Link>
    </nav>
  );
}

export default NavBar;