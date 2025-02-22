import React from "react";
import { Link, useNavigate,useLocation } from "react-router-dom"; // Move this import to the top
import "./../styles/navbar.css";
import Logo from "../images/logo.jpg"; // Move this import to the top

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Function to handle the back button
  const handleBack = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  return (
    <nav className="navbar">
      <img src={Logo} alt="App-logo" className="navbar-logo" />
      <div className="nav-links">
        {/*<Link to="/" className="nav-link">Home</Link>*/}
       {/* <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        <Link to="/portaladmin" className="nav-link">Portal Admin</Link>
        <Link to="/institue-admin-dashboard" className="nav-link">Institute Admin</Link>*/}
      </div>
      {(!isLandingPage &&
      <div className="for-btn">
        <button className="back-button" onClick={handleBack}>Back</button>
      </div>)}
    </nav>
  );
};

export default Navbar;
