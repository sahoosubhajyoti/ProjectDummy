import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./../../styles/modify.css";

const DeleteCentre = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const navigate = useNavigate();

  const {  instituteId, instituteName, centreName } = location.state || {};

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
      const response = await fetch(`http://localhost:5000/api/get-centre-for-delete/${id}`);
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
      } else {
        alert("Failed to fetch centre details.");
      }
    } catch (error) {
      console.error("Error fetching centre details:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this centre?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/delete-centre/${instituteId}/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Centre deleted successfully!");
        navigate("/view-centre");
      } else {
        alert("Failed to delete centre.");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("An error occurred while deleting data.");
    }
  };

  return (
    <div className="form-container">
      <h2>Delete Centre</h2>
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
          <input id="Address" type="text" value={formData.Address} readOnly />
        </div>
        <div>
          <label htmlFor="PIN">PIN</label>
          <input id="PIN" type="text" value={formData.PIN} readOnly />
        </div>
        <div>
          <label htmlFor="City">City</label>
          <input id="City" type="text" value={formData.City} readOnly />
        </div>
        <div>
          <label htmlFor="District">District</label>
          <input id="District" type="text" value={formData.District} readOnly />
        </div>
        <div>
          <label htmlFor="State">State</label>
          <input id="State" type="text" value={formData.State} readOnly />
        </div>
        <div>
          <label htmlFor="Country">Country</label>
          <input id="Country" type="text" value={formData.Country} readOnly />
        </div>
      </div>
      <button onClick={handleDelete} className="delete-button">Delete Centre</button>
    </div>
  );
};

export default DeleteCentre;
