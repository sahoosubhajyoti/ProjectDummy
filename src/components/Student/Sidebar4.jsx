import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../../styles/sidebar.css";

const Sidebar4 = ({ userid }) => {
  const [showTestMenu, setShowTestMenu] = useState(false);
  
  

  return (
    <div className="sidebar">
      <div className="menu">

        {/* Test Administration */}
        <div className="menu-item">
          <button onClick={() => setShowTestMenu((prev) => !prev)}>Test</button>
          {showTestMenu && (
            <div className={`submenu ${showTestMenu ? "show" : ""}`}>
              <Link to="/upcoming-test" state={{ userid }}>Upcoming Tests</Link>
              <Link to="/attempted-test" state={{ userid }}>Attempted Tests</Link>
              <Link to="/live-test" state={{ userid }}>Live Tests</Link>
              <Link to="/expire-test" state={{ userid }}>Expired Tests</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Sidebar4;
