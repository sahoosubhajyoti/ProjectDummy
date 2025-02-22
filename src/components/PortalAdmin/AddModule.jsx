import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../../styles/modify.css";

const AddModule = () => {
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [formData, setFormData] = useState({
    Module: "",
  });

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get-institutes");
        if (response.ok) {
          const data = await response.json();
          setInstitutes(data || []); // Expected response: [{ IID: "1", INST_Name: "Institute XYZ" }]
        } else {
          alert("Failed to fetch institutes.");
        }
      } catch (error) {
        console.error("Error fetching institutes:", error);
        alert("An error occurred while fetching institutes.");
      }
    };
    fetchInstitutes();
  }, []);

  const handleInputChange = (e) => {
    const { name: inputName, value: inputValue } = e.target;
    setFormData({ ...formData, [inputName]: inputValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", { selectedInstitute, ...formData });

    try {
      const response = await fetch("http://localhost:5000/api/add-module", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedInstitute, ...formData }),
      });

      if (response.ok) {
        setTimeout(() => {
          setSelectedInstitute("");
          setFormData({ Module: "" });
        }, 5000);
        alert("Module successfully added!");
      } else {
        alert("Failed to add module.");
      }
    } catch (error) {
      console.error("Error submitting module data:", error);
      alert("An error occurred while submitting the data.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="Institute">Institute</label>
            <select
              id="Institute"
              value={selectedInstitute}
              onChange={(e) => setSelectedInstitute(e.target.value)}
              required
            >
              <option value="">Select Institute</option>
              {institutes.map((institute) => (
                <option key={institute.IID} value={institute.IID}>
                  {institute.INST_Name} - {institute.IID}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="Module">Course</label>
            <input
              id="Module"
              type="text"
              name="Module"
              value={formData.Module}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="btn-sub">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddModule;
