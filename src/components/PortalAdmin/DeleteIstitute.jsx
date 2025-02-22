import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../../styles/modify.css";

const DeleteInstitute = () => {
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
  const [source, setSource] = useState("");
  const [type, setType] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (passedInstituteId) {
      setInstituteId(passedInstituteId);
      handleFetch(passedInstituteId);
    }
  }, [passedInstituteId]);

  const handleFetch = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/institute/${id}`);
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
        setSource(data.Source || "");
        setType(data.INST_Type || "");
        setIsFetched(true);
      } else {
        alert("Institute ID not found.");
      }
    } catch (error) {
      console.error("Error fetching institute details:", error);
      alert("Failed to fetch institute details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this institute?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/delete-institute/${instituteId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Institute successfully deleted!");
          handleReset();
        } else {
          alert("Failed to delete institute.");
        }
      } catch (error) {
        console.error("Error deleting institute:", error);
        alert("An error occurred while deleting the institute.");
      }
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
    setSource("");
    setType("");
    setIsFetched(false);
  };

  return (
    <div className="form-container">
      <h2>Delete Institute</h2>
      {isLoading && <p>Loading...</p>}
      <form>
        <div className="form-grid">
          <div>
            <label htmlFor="INST_Name">Institute Name</label>
            <input id="INST_Name" type="text" value={instituteName} disabled />
          </div>
          <div>
            <label htmlFor="Centre">Centre Name</label>
            <input id="Centre" type="text" value={centreName} disabled />
          </div>
          <div>
            <label htmlFor="Address">Address</label>
            <input id="Address" type="text" value={address} disabled />
          </div>
          <div>
            <label htmlFor="PIN">PIN</label>
            <input id="PIN" type="text" value={pin} disabled />
          </div>
          <div>
            <label htmlFor="CITY">City</label>
            <input id="CITY" type="text" value={city} disabled />
          </div>
          <div>
            <label htmlFor="DIST">District</label>
            <input id="DIST" type="text" value={district} disabled />
          </div>
          <div>
            <label htmlFor="STATE">State</label>
            <input id="STATE" type="text" value={state} disabled />
          </div>
          <div>
            <label htmlFor="COUNTRY">Country</label>
            <input id="COUNTRY" type="text" value={country} disabled />
          </div>
          <div>
            <label>Source</label>
            <input type="text" value={source} disabled />
          </div>
          <div>
            <label htmlFor="INST_Type">Institute Type</label>
            <input id="INST_Type" type="text" value={type} disabled />
          </div>
        </div>
        <div className="btn-class" style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="button" onClick={handleDelete} disabled={!isFetched}>
            Delete Institute
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteInstitute;
