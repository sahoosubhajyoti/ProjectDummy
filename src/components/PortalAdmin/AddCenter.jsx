import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../../styles/modify.css";


const AddCentre = () => {
  const location = useLocation();
  const { userid } = location.state || {};

  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState("");

  const [centreName, setCentreName] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get-institutes");
      if (response.ok) {
        const data = await response.json();
        setInstitutes(data || []); 
      } else {
        alert("Failed to fetch institutes.");
      }
    } catch (error) {
      console.error("Error fetching institutes:", error);
      alert("An error occurred while fetching institutes.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Find the selected institute object from the list
    const selectedInstituteData = institutes.find(inst => inst.IID === selectedInstitute);
  
    const centreDetails = {
      selectedInstituteID: selectedInstitute, // Sending Institute ID
      selectedInstituteName: selectedInstituteData ? selectedInstituteData.INST_Name : "", // Sending Institute Name
      centreName,
      address,
      pin,
      city,
      district,
      state,
      country,
      selectedSource,
      userid,
    };
  
    console.log(centreDetails);
  
    try {
      const response = await fetch("http://localhost:5000/api/add-centre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(centreDetails),
      });
  
      if (response.ok) {
        alert("Centre details successfully added!");
        resetForm();
      } else {
        alert("Failed to add Centre details.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  const resetForm = () => {
    setSelectedInstitute("");
    setCentreName("");
    setAddress("");
    setPin("");
    setCity("");
    setDistrict("");
    setState("");
    setCountry("");
    setSelectedSource("");
  };

  return (
    <div className="form-container">
      <h2>Add Centre</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="institute">Institute</label>
            <select
              id="institute"
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
        </div>
        <div className="btn-sub">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddCentre;
