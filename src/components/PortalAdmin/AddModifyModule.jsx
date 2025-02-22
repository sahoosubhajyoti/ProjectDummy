import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./../../styles/modify.css";

const ModifyModule = () => {
  const location = useLocation();
  const { moduleId, instituteId, moduleName: passedModuleName } = location.state || {}; // Get data from previous component

  const [moduleName, setModuleName] = useState(passedModuleName || ""); // Directly set module name

  // Submit updated module details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/update-module/${moduleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moduleId, instituteId, Module: moduleName }),
      });

      if (response.ok) {
        alert("Module successfully updated!");
      } else {
        alert("Failed to update module.");
      }
    } catch (error) {
      console.error("Error updating module:", error);
      alert("An error occurred while updating the module.");
    }
  };

  return (
    <div className="form-container">
      <h2>Modify Module</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="Module">Module Name</label>
            <input
              id="Module"
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
            />
          </div>
        </div>
        <div className="btn-class" style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit">Modify Module</button>
        </div>
      </form>
    </div>
  );
};

export default ModifyModule;
