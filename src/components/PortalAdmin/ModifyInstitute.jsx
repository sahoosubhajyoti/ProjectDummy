import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../../styles/modify.css";

const ModifyInstitute = () => {
  const location = useLocation();
  const { instituteId: passedInstituteId } = location.state || {}; // Safely access instituteId

  const [instituteId, setInstituteId] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [centreName, setCentreName] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [type, setType] = useState("");
  const [isFetched, setIsFetched] = useState(false);

  const source = [
    "WALKIN", "DIRMRK", "SOCMED", "EMLENQ", "WEBSTE", "OTHER", "DUMMY"
  ];
  const instituteTypes = ["P1", "P2", "P3", "P4"];

  useEffect(() => {
    if (passedInstituteId) {
      setInstituteId(passedInstituteId); // Populate Institute ID if passed
      handleFetch(passedInstituteId);
    }
  }, [passedInstituteId]);

  const handleFetch = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/modify-institute/${id}`
      );

      if (response.ok) {
        const data = await response.json();
        setInstituteName(data.INST_Name || "");
        setCentreName(data.Centre || "");
        setAddress(data.Address || "");
        setPin(data.PIN || "");
        setCity(data.City || "");
        setDistrict(data.DIST || "");
        setState(data.STATE || "");
        setCountry(data.COUNTRY || "");
        setSelectedSource(data.Source || "");
        setType(data.INST_Type || "");
        setIsFetched(true);
      } else {
        alert("Institute ID not found.");
      }
    } catch (error) {
      console.error("Error fetching institute details:", error);
      alert("Failed to fetch institute details.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      INST_Name: instituteName,
      CentreName: centreName,
      Address: address,
      PIN: pin,
      City: city,
      DIST: district,
      STATE: state,
      COUNTRY: country,
      Source: selectedSource,
      INST_Type: type,
    };

    try {
      console.log("Updated Data:", updatedData);
      const response = await fetch(
        `http://localhost:5000/api/update_institute/${instituteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        alert("Institute details successfully updated!");
      } else {
        alert("Failed to update institute details.");
      }
    } catch (error) {
      console.error("Error updating institute details:", error);
      alert("An error occurred while updating institute details.");
    }
  };

  const handleReset = () => {
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
    setIsFetched(false);
  };

  return (
    <div className="form-container">
      <h2>Modify Institute</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="INST_Name">Institute Name</label>
            <input
              id="INST_Name"
              type="text"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              required
              disabled={!isFetched}
            />
          </div>
          <div>
            <label htmlFor="Centre">Centre Name</label>
            <input
              id="Centre"
              type="text"
              value={centreName}
              onChange={(e) => setCentreName(e.target.value)}
              required
              disabled={!isFetched}
            />
          </div>
          <div>
            <label htmlFor="Address">Address</label>
            <input
              id="Address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={!isFetched}
            />
          </div>
          <div>
            <label htmlFor="PIN">PIN</label>
            <input
              id="PIN"
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              disabled={!isFetched}
            />
          </div>
          <div>
            <label htmlFor="City">City</label>
            <input
              id="City"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={!isFetched}
            />
          </div>
          <div>
            <label htmlFor="DIST">District</label>
            <input
              id="DIST"
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
              disabled={!isFetched}
            />
          </div>
          <div>
            <label htmlFor="STATE">State</label>
            <input
              id="STATE"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              disabled={!isFetched}
            />
          </div>
          <div>
            <label htmlFor="COUNTRY">Country</label>
            <input
              id="COUNTRY"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              disabled={!isFetched}
            />
          </div>
          <div>
            <label htmlFor="INST_Type">Institute Type</label>
            <select
              id="INST_Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              disabled={!isFetched}
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
              disabled={!isFetched}
            >
              <option value="">Select Source</option>
              {source.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className="btn-class"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <button type="submit" disabled={!isFetched}>
            Modify Institute
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifyInstitute;
