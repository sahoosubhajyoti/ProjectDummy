import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./../../styles/modify.css";

const DeleteModule = () => {
  const location = useLocation();
  const { moduleId, instituteId, moduleName, userId } = location.state || {}; // Get data from previous component

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/delete-module`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moduleId, instituteId, userId }), // Send instituteId along with moduleId
        });

        if (response.ok) {
          alert("Module successfully deleted!");
        } else {
          alert("Failed to delete module.");
        }
      } catch (error) {
        console.error("Error deleting module:", error);
        alert("An error occurred while deleting the module.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Delete Module</h2>
      <form>
        <div className="form-grid">
          <div>
            <label htmlFor="Module">Module Name</label>
            <input id="Module" type="text" value={moduleName} disabled /> {/* Prefilled, not editable */}
          </div>
        </div>
        <div className="btn-class" style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="button" onClick={handleDelete} disabled={!moduleId || !instituteId}>
            Delete Module
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteModule;
