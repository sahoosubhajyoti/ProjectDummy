import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/sidebar.css";

const Sidebar = ({ userid }) => {
  const [showInstituteMenu, setShowInstituteMenu] = useState(false); // Toggle for Institute submenu
  const [showModuleMenu, setShowModuleMenu] = useState(false);
  const [showStreamMenu, setShowStreamMenu] = useState(false); // Toggle for Module submenu
  const [showCentreMenu, setShowCentreMenu] = useState(false); 

  const [showViewMenu, setShowViewMenu] = useState(false); // Toggle for View submenu

  return (
    <div className="sidebar">
     
      
      <div className="menu">
        {/* Institute Menu */}
        <div className="menu-item">
          <button onClick={() => setShowInstituteMenu((prev) => !prev)}>
            Institute
          </button>
          <div className={`submenu ${showInstituteMenu ? 'show' : ''}`}>
            <Link to="/add-institute" state={{ userid }}>Add Institute</Link>
           {/* <Link to="/modify-institute">Modify Institute</Link>*/}
           {/*<Link to="/delete-institute">Delete Institute</Link>*/}
            <Link to="/view-institue" state={{ userid }}>Modify Institue</Link>
          
         
          </div>
        </div>

        {/* Module Menu */}
        <div className="menu-item">
          <button onClick={() => setShowModuleMenu((prev) => !prev)} >
            Course
          </button>
          <div className={`submenu ${showModuleMenu ? 'show' : ''}`}>
            <Link to="/add-module" state={{ userid }}>Add Course</Link>
            {/*<Link to="/add-modify-module">Modify Course</Link>*/}
            {/*<Link to="/delete-module">Delete Course</Link>*/}
            <Link to="/view-mapped-modules" state={{ userid }}>Modify Courses</Link>
          </div>
        </div>
          {/* Branch Menu */}
          <div className="menu-item">
          <button onClick={() => setShowStreamMenu((prev) => !prev)} >
            Stream
          </button>
          <div className={`submenu ${showStreamMenu ? 'show' : ''}`}>
            <Link to="/add-stream" state={{ userid }}>Add stream</Link>
            {/*<Link to="/modify-stream">Modify stream</Link>
            <Link to="/delete-stream">Delete stream</Link>*/}
            <Link to="/view-stream" state={{ userid }}>Modify stream</Link>
          </div>
        </div>
         {/* Centre Menu */}
         <div className="menu-item">
         <button onClick={() => setShowCentreMenu((prev) => !prev)} >
           Centre
         </button>
         <div className={`submenu ${showCentreMenu ? 'show' : ''}`}>
           <Link to="/add-centre" state={{ userid }}>Add centre</Link>
           {/*<Link to="/modify-centre">Modify centre</Link>
           <Link to="/delete-centre">Delete centre</Link>*/}
           <Link to="/view-centre" state={{ userid }}>Modify centre</Link>
         </div>
       </div>
        
       
        <div className="menu-item">
        <button onClick={() => setShowViewMenu((prev) => !prev)}>
        Miscellaneous
        </button>
        <div className={`submenu ${showViewMenu ? 'show' : ''}`}>
          <Link to="/License-usage">License Usages</Link>
          <Link to="/Subscription-expiry">Subscription Expiry</Link>
          <Link to="/view-mapped-users">View Mapped Admins</Link>
          <Link to="/authorise-admin">Authorise Admins</Link>
          <Link to="/role-access-control">RBAC</Link>
          
        </div>
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
