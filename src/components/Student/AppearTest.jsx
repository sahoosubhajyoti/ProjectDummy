import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import "./../../styles/appearTest.css";

function AppearTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { test,userid } = location.state || {};

  const [timer, setTimer] = useState(10); // Example countdown timer in seconds
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!test || !test.date || !test.time) return;

    // Combine test date and time into a Date object
    const testDateTime = new Date(`${test.date}T${test.time}`); // Assumes test.time is in HH:MM:SS format
    const currentTime = new Date();
    let timeDifference = Math.floor((testDateTime - currentTime) / 1000); // Convert to seconds

    if (timeDifference < 0) {
      timeDifference = 0; // If the test time has already passed, set timer to 0
    }
    
    setTimer(timeDifference);

    const interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [test]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };


  

  const handleStartTest = () => {
    if (timer > 0) {
      alert("Test is not started yet. Please wait for the timer to finish.");
    } else if (!isChecked) {
      alert("Please check the agreement box before starting.");
    } else {
      alert("Test Started!");
      navigate("/test-page", { state: { testId: test.test_id, userid:userid } });
    }
  };

  return (
    <div className="appear-test-container">
      {/* Main Section */}
      <div className="main-section">
        <h2>{test.name}</h2>
        <p><strong>Subject:</strong> {test.subject}</p>
        <p><strong>Date:</strong> {new Date(test.date).toLocaleDateString()}</p>
        <p><strong>Duration:</strong> {test.duration} minutes</p>
        <h3>Instructions</h3>
        <ul>
          <li>Make sure you have a stable internet connection.</li>
          <li>Do not refresh the page during the test.</li>
          <li>Answer all questions before submitting.</li>
          <li>Once started, you cannot pause the test.</li>
        </ul>

        {/* Checkbox to enable Start Test button */}
        <label>
          <input 
            type="checkbox" 
            checked={isChecked} 
            onChange={() => setIsChecked(!isChecked)} 
          />
          I agree to the terms and conditions.
        </label>

        {/* Start Test Button (Disabled unless conditions met) */}
        <button 
          className="start-btn"
          onClick={handleStartTest}
          disabled={timer > 0 || !isChecked}
        >
          Start Test
        </button>
      </div>

      {/* Sidebar Timer */}
      <div className="sidebar">
        <h3>Test Starts In</h3>
        <div className="timer">
        {formatTime(timer)} {/* Displays timer in HH:MM:SS */}
      </div>
      </div>
    </div>
  );
}

export default AppearTest;
