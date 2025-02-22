import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../../styles/sidebar.css";

const Sidebar2 = ({ userid }) => {
  const [showTestMenu, setShowTestMenu] = useState(false);
  const [showUpdateQAMenu, setShowUpdateQAMenu] = useState(false);
  const [showQuestionBankMenu, setShowQuestionBankMenu] = useState(false);
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  

  return (
    <div className="sidebar">
      <div className="menu">

        {/* Test Administration */}
        <div className="menu-item">
          <button onClick={() => setShowTestMenu((prev) => !prev)}>Test</button>
          {showTestMenu && (
            <div className={`submenu ${showTestMenu ? "show" : ""}`}>
              <Link to="/add-test" state={{ userid }}>Add Test</Link>
              <Link to="/update-test" state={{ userid }}>Modify Test</Link>
            </div>
          )}
        </div>

        {/* Update Question & Answer */}
        <div className="menu-item">
          <button onClick={() => setShowUpdateQAMenu((prev) => !prev)}>Update Q&A</button>
          {showUpdateQAMenu && (
            <div className={`submenu ${showUpdateQAMenu ? "show" : ""}`}>
              <Link to="/update-q&a" state={{ userid }}>Subjective</Link>
              <Link to="/update-q&a-objective" state={{ userid }}>Objective</Link>
            </div>
          )}
        </div>

        {/* Question Bank */}
        <div className="menu-item">
          <button onClick={() => setShowQuestionBankMenu((prev) => !prev)}>Question Bank</button>
          {showQuestionBankMenu && (
            <div className={`submenu ${showQuestionBankMenu ? "show" : ""}`}>
              <Link to="/update-q" state={{ userid }}>Update Question</Link>
              <Link to="/set-questions-manual" state={{ userid }}>Set Question Manual</Link>
              <Link to="/set-questions-automated" state={{ userid }}>Set Question Automated</Link>
            </div>
          )}
        </div>

        {/* Schedule Test */}
        <div className="menu-item">
          <button onClick={() => setShowScheduleMenu((prev) => !prev)}>Schedule Test</button>
          {showScheduleMenu && (
            <div className={`submenu ${showScheduleMenu ? "show" : ""}`}>
              <Link to="/schedule" state={{ userid }}>Schedule</Link>
              <Link to="/modify-schedule" state={{ userid }}>Modify</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Sidebar2;
