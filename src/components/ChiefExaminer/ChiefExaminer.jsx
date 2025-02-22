import React, {useState,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';

import Sidebar3 from './Sidebar3';

const ChiefExaminer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  const [instituteName, setInstituteName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!userId) {
      setError("User ID is missing. Please log in again.");
      //navigate("/login"); // Redirect to login page if no userId
      return;
    }


    setLoading(true);
    fetch(`http://localhost:5000/api/examinerinstitute/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInstituteName(data.instituteName);
          // Fetch modules or other related data if needed
        } else {
          setError(data.message || "Failed to fetch institute details.");
        }
      })
      .catch((err) => {
        console.error("Error fetching institute details:", err);
        setError("An error occurred while fetching institute details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, navigate]);


  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar3 userid={userId}/>
      <div
        className="content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        {loading ? (
          <p>Loading institute details...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div>
            <h2>Welcome, {instituteName} Examiner</h2>
            <p>Your dashboard is ready!</p>
          </div>
        )}
      </div>
    </div>
  );
}


export default ChiefExaminer;
