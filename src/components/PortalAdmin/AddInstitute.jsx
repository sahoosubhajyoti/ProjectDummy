import React, { useState } from "react";
import "./../../styles/modify.css";
import { useLocation } from "react-router-dom";
const AddInstitute = () => {
  const location = useLocation();
  const { userid } = location.state || {};
  const [instituteName, setInstituteName] = useState("");
  const [centreName, setCentreName] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
 
  const [type, setType] = useState("");

  const instituteTypes = ["P1", "P2", "P3", "P4"];

  
  const [selectedSource, setSelectedSource] = useState("");

  const source = ["WALKIN", "DIRMRK", "SOCMED", "EMLENQ", "WEBSTE","OTHER","DUMMY"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const instituteDetails = {
      instituteName,
      centreName,
      address,
      pin,
      city,
      district,
      state,
      country,
      selectedSource,
      type,
      userid,
    };
    
    try {
      // Replace the URL with your backend API endpoint
      const response = await fetch("https://your-backend-api.com/add-institute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(instituteDetails),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Institute details submitted successfully:", data);
        alert("Institute details successfully added!");
        // Optionally reset form fields
        resetForm();
      } else {
        console.error("Failed to submit institute details:", response.statusText);
        alert("Failed to add institute details.");
      }
    } catch (error) {
      console.error("Error occurred while submitting data:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setInstituteName("");
    setCentreName("");
    setAddress("");
    setPin("");
    setCity("");
    setDistrict("");
    setState("");
    setCountry("");
    setSelectedSource("");
    setType("");
  };

  return (
    <div className="form-container">
      <h2>Add Institute</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
        <div>
          <label htmlFor="instituteName">Institute Name</label>
          <input
            id="instituteName"
            type="text"
            value={instituteName}
            onChange={(e) => setInstituteName(e.target.value)}
            required
          />
          </div>
          <div>
          <label htmlFor="centreName">Centre Name</label>
          <input
            id="centreName"
            type="text"
            value={centreName}
            onChange={(e) => setCentreName(e.target.value)}
            required
          />
          </div>
          <div>
          <label htmlFor="address">Address</label>
          <input
          id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          </div>
          <div>
              <label htmlFor="pin">PIN</label>
              <input
                id="pin"
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
          </div>
          <div>
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              </div>
              <div>
                  <label htmlFor="district">District</label>
                            
                            <input
                              id="district"
                              type="text"
                              value={district}
                              onChange={(e) => setDistrict(e.target.value)}
                              required
                            />
              </div>
          <div>
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
          </div>
          <div>
              <label htmlFor="country">Country</label>
              <input 
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
          </div>
          <div>
              <label htmlFor="type">Institute Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                {instituteTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
          </div>
          <div>
              <label htmlFor="source">Source</label>
              <select
              id="source"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              {source.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          
          </div>
          </div>
          <div className="btn-sub">
          <button type="submit">Submit</button>
          </div>
       
      </form>
    </div>
  );
};

export default AddInstitute;
