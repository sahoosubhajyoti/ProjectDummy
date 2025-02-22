import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../../styles/modify.css";

const ModifyCentre = () => {
  const location = useLocation();
  const {
    instituteId,
    instituteName,
    centreName,
  } = location.state || {};

  const [isCentreFetched, setIsCentreFetched] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    Address: "",
    PIN: "",
    City: "",
    District: "",
    State: "",
    Country: "",
  });

  useEffect(() => {
    if (instituteId) {
      fetchCentreData(instituteId);
    }
  }, [instituteId]);

  const fetchCentreData = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-centre/${id}/${centreName}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          Address: data.Address || "",
          PIN: data.PIN || "",
          City: data.City || "",
          District: data.District || "",
          State: data.State || "",
          Country: data.Country || "",
        });
        setIsCentreFetched(true);
      } else {
        alert("Failed to fetch centre details.");
      }
    } catch (error) {
      console.error("Error fetching centre details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/update-centre/${instituteId}/${centreName}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instituteId, instituteId, ...formData }),
        }
      );

      if (response.ok) {
        alert("Centre updated successfully!");
      } else {
        alert("Failed to update Centre.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Modify Centre</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="INST_Id">Institute ID</label>
            <input id="INST_Id" type="text" value={instituteId} readOnly />
          </div>
          <div>
            <label htmlFor="INST_Name">Institute Name</label>
            <input id="INST_Name" type="text" value={instituteName} readOnly />
          </div>
          <div>
            <label htmlFor="Centre_Name">Centre Name</label>
            <input id="Centre_Name" type="text" value={centreName} readOnly />
          </div>
          <div>
            <label htmlFor="Address">Address</label>
            <input id="Address" type="text" name="Address" value={formData.Address} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="PIN">PIN</label>
            <input id="PIN" type="text" name="PIN" value={formData.PIN} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="City">City</label>
            <input id="City" type="text" name="City" value={formData.City} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="District">District</label>
            <input id="District" type="text" name="District" value={formData.District} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="State">State</label>
            <input id="State" type="text" name="State" value={formData.State} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="Country">Country</label>
            <input id="Country" type="text" name="Country" value={formData.Country} onChange={handleInputChange} required />
          </div>
        </div>
        <button type="submit" disabled={!isCentreFetched}>Modify Centre</button>
      </form>
    </div>
  );
};

export default ModifyCentre;
