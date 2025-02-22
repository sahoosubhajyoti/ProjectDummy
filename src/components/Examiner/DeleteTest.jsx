import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const DeleteTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { TestId, userid } = location.state || {}; // Extract TestId and userid from location.state


  const [testDetails, setTestDetails] = useState({
    instituteName: "",
    mappedModules: [],
    selectedModule: "",
    testName: "",
    testDate: "",
    timeZone: { value: "Asia/Kolkata", label: "GMT+5:30 (Asia/Kolkata)" },
    testDuration: "",
    testStartTime: "",
    testEndDate: "",
  });
  const [loading, setLoading] = useState(false);


  // Fetch test details on component mount
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/Examiner_get_test_details/${TestId}`
        );
        const data = await response.json();


        if (data.success) {
          setTestDetails({
            instituteName: data.instituteName || "",
            mappedModules: data.mappedModules || [],
            selectedModule: data.moduleId || "",
            testName: data.testName || "",
            testDate: data.testDate || "",
            timeZone: { value: data.timeZoneValue, label: data.timeZoneLabel },
            testDuration: data.testDuration || "",
            testStartTime: data.testStartTime || "",
            testEndDate: data.testEndDate || "",
          });
        } else {
          alert(data.message || "Failed to fetch test details.");
        }
      } catch (err) {
        console.error("Error fetching test details:", err);
        alert("An error occurred while fetching test details.");
      } finally {
        setLoading(false);
      }
    };


    if (TestId) fetchTestDetails();
  }, [TestId]);


  // Handle delete action
  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/Examiner_get_test_details/${TestId}?user_id=${userid}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );


      const data = await response.json();


      if (data.success) {
        alert("Test deleted successfully!");
        navigate("/dashboard"); // Redirect to a relevant page after deletion
      } else {
        alert(data.message || "Failed to delete the test.");
      }
    } catch (err) {
      console.error("Error deleting test:", err);
      alert("An error occurred while deleting the test.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="dashboard-container">
      <h2>
        <b>Delete Test</b>
        <div className="institute-info">
          <h2>Institute: {testDetails.instituteName || "Loading..."}</h2>
        </div>
      </h2>


      {loading ? (
        <p>Loading...</p>
      ) : (
        <form className="form-container">
          {/* Institute Name */}
          {/* Mapped Module */}
          <div className="form-field">
            <label>Mapped Module</label>
            <input
              type="text"
              value={
                testDetails.mappedModules.find(
                  (module) => module.id === testDetails.selectedModule
                )?.name || "Not Available"
              }
              readOnly
            />
          </div>


          {/* Test Name */}
          <div className="form-field">
            <label>Test Name</label>
            <input type="text" value={testDetails.testName} readOnly />
          </div>


          {/* Test Date */}
          <div className="form-field">
            <label>Test Date</label>
            <input type="date" value={testDetails.testDate} readOnly />
          </div>


          {/* Time Zone */}
          <div className="form-field">
            <label>Time Zone</label>
            <input type="text" value={testDetails.timeZone.label} readOnly />
          </div>


          {/* Test Duration */}
          <div className="form-field">
            <label>Test Duration (minutes)</label>
            <input type="number" value={testDetails.testDuration} readOnly />
          </div>


          {/* Test Start Time */}
          <div className="form-field">
            <label>Test Start Time</label>
            <input type="time" value={testDetails.testStartTime} readOnly />
          </div>


          {/* Test End Date */}
          <div className="form-field">
            <label>Test End Date</label>
            <input type="date" value={testDetails.testEndDate} readOnly />
          </div>


          {/* Action Buttons */}
          <div
            className="form-actions"
            style={{ "justify-content": "space-between" }}
          >
            <button type="button" onClick={handleDelete} disabled={loading}>
              {loading ? "Processing..." : "Delete Test"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};


export default DeleteTest;


