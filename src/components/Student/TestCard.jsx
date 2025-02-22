import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./../../styles/testcard.css";


function TestCard({ test, type,userid }) {
  const navigate = useNavigate();

  // Destructure test object to get individual details
  const { test_id, test_name, test_date, test_subject, test_duration, location,test_time } = test;
  const dateObject = new Date(test_date)
  const formattedDate = dateObject.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formatTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
  
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
  
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Usage
  const formattedTime = formatTime(test_time); // test_time is received in hh:mm:ss
  
  // Handle start test button click
  const handleStartTest = () => {
    navigate(`/appear-test`, { state: { test,userid } }); // Navigate to AppearTest with test details
  };

  return (
    <div className="test-box">
      <h3>Test: {test_name}</h3>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Time:</strong> {formattedTime}</p>
      <p><strong>Subject:</strong> {test_subject}</p>
      <p><strong>Duration:</strong> {test_duration} minutes</p>

      {/* Show Start button only for "live" tests */}
      {type === 'live' && (
        <button className="start-btn" onClick={handleStartTest}>
          Start Test
        </button>
      )}

      {/* Show "View Result" button only for "attempted" tests */}
      {type === 'attempted' && (
        <button className="result-btn">View Result</button>
      )}

      {/* Show "Expired" label for expired tests */}
      {type === "expire" && (
        <p style={{ color: "red" }}><b>Expired</b></p>
      )}
    </div>
  );
}

export default TestCard;
