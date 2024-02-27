import { Link } from 'react-router-dom';

function NavBar() {
    const navStyle = {
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#333', // Example background color
        color: 'white', // Example text color
        zIndex: 1000, // Ensure it sits above other content
        padding: '10px 0', // Add some padding
      };
  return (
    <nav style={navStyle}>
      <Link to="/">Home</Link> | <Link to="/about">About</Link>
    </nav>
  );
}

export default NavBar;