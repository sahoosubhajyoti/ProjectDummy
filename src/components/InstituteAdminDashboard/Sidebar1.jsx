import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../../styles/sidebar.css";

const Sidebar1 = ({ userid }) => {
  const [showInstituteMenu, setShowInstituteMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [showSyllabusMenu, setShowSyllabusMenu] = useState(false);

  return (
    <div className="sidebar">
      <div className="menu">
        {/* Mapping Menu */}
        <div className="menu-item">
              <button onClick={() => setShowSubjectMenu((prev) => !prev)}>
                Subject
              </button>
              <div className={`submenu ${showSubjectMenu ? "show" : ""}`}>
                <Link
                  to={{
                    pathname: "/add-subject",
                  }}
                  state={{ userid }}
                >
                  Add
                </Link>
                <Link
                  to={{
                    pathname: "/view-subject",
                  }}
                  state={{ userid }}
                >
                  Modify
                </Link>
              </div>
            </div>
            <div className="menu-item">
              <button onClick={() => setShowSyllabusMenu((prev) => !prev)}>
                Syllabus
              </button>
              <div className={`submenu ${showSyllabusMenu ? "show" : ""}`}>
                <Link
                  to={{
                    pathname: "/add-syllabus",
                  }}
                  state={{ userid }}
                >
                  Add
                </Link>
                <Link
                  to={{
                    pathname: "/view-syllabus",
                  }}
                  state={{ userid }}
                >
                  Modify
                </Link>
              </div>
            </div>
        <div className="menu-item">
          <button onClick={() => setShowInstituteMenu((prev) => !prev)}>
            Map Users
          </button>
          <div className={`submenu ${showInstituteMenu ? "show" : ""}`}>
            <Link
              to={{
                pathname: "/map-users-to-modules",
              }}
              state={{ userid }}
            >
              Add
            </Link>
            <Link
              to={{
                pathname: "/view-modulesdetails",
              }}
              state={{ userid }}
            >
              Modify
            </Link>
          </div>
        </div>

        {/* View Menu */}
        <div className="menu-item">
          <button onClick={() => setShowViewMenu((prev) => !prev)}>
            Miscellaneous
          </button>
          <div className={`submenu ${showViewMenu ? "show" : ""}`}>
            <Link
              to={{
                pathname: "/view-subscription",
              }}
              state={{ userid }}
            >
              Subscription
            </Link>
            <Link
            to={{
              pathname: "/view-subscription",
            }}
            state={{ userid }}
          >
            Authorise Users
          </Link>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar1;
