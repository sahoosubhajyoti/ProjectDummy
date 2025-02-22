import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../../styles/sidebar.css";

const Sidebar3 = ({ userid }) => {
  const [showTestMenu, setShowTestMenu] = useState(false);
  const [showQuestionBankMenu, setShowQuestionBankMenu] = useState(false);
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [showReviewAssesmentMenu, setShowReviewAssesmentMenu] = useState(false);
  

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

       
        {/* Question Bank */}
        <div className="menu-item">
          <button onClick={() => setShowQuestionBankMenu((prev) => !prev)}>Question Bank</button>
          {showQuestionBankMenu && (
            <div className={`submenu ${showQuestionBankMenu ? "show" : ""}`}>
              <Link to="/set-questions-manual1" state={{ userid }}>Set Question Manual</Link>
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

        {/*Review Assesment */}
        <div className="menu-item">
          <button onClick={() => setShowReviewAssesmentMenu((prev) => !prev)}>Review Assesment</button>
          {showReviewAssesmentMenu && (
            <div className={`submenu ${showReviewAssesmentMenu ? "show" : ""}`}>
              <Link to="/schedule" state={{ userid }}>Review </Link>
              <Link to="/modify-schedule" state={{ userid }}>Modify</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Sidebar3;
