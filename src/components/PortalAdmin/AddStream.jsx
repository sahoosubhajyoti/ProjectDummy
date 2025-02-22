import React, { useState, useEffect } from "react";
import "./../../styles/modify.css";

const AddStream = () => {
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [modules, setModules] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    Stream: "",
    Source: "",
    Trial_Start: "",
    Trial_End: "",
    Trial_Days: 0,
    Rate_Code: "",
    PO_No: "",
    PO_Date: "",
    PO_Valid: "",
    Billing_SPOC: "",
    Billing_Contact: "",
    Billing_Address: "",
    GST_No: "",
    PAN: "",
    Module: "",
  });

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/PortalAdmin-Stream-AddStream-getInstitute");
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
    fetchInstitutes();
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      if (!selectedInstitute) return;
      try {
        const response = await fetch(`http://localhost:5000/api/PortalAdmin-Stream-AddStream-getModule/${selectedInstitute}`);
        if (response.ok) {
          const data = await response.json();
          setModules(data || []);
        } else {
          alert("Failed to fetch modules for the selected institute.");
          setModules([]);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        alert("An error occurred while fetching modules.");
      }
    };
    fetchModules();
  }, [selectedInstitute]);

  const validateGST = (gst) => /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[A-Z]{1}\d{1}$/.test(gst);
  const validatePAN = (pan) => /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(pan);
  const validateRequired = (value) => value.trim() !== "";
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
  
      if (name === "Trial_Start" || name === "Trial_End") {
        const startDate = new Date(updatedData.Trial_Start);
        const endDate = new Date(updatedData.Trial_End);
  
        if (updatedData.Trial_Start && updatedData.Trial_End) {
          if (startDate > endDate) {
            setErrors((prev) => ({ ...prev, Trial_End: "End date cannot be earlier than start date." }));
            updatedData.Trial_Days = 0;
          } else {
            setErrors((prev) => ({ ...prev, Trial_End: "" }));
            updatedData.Trial_Days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          }
        }
      }
      return updatedData;
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
     // Check for validation errors
  const errorMessages = Object.entries(errors)
  .filter(([key, value]) => value !== "")
  .map(([key, value]) => `${key}: ${value}`);

if (errorMessages.length > 0) {
  alert(`Please correct the following errors:\n${errorMessages.join("\n")}`);
  console.error("Validation Errors:", errorMessages);
  return;
}
    console.log("Submitting Data:", { selectedInstitute, ...formData }); // Debugging
  
    try {
      const response = await fetch("http://localhost:5000/api/PortalAdmin-Stream-AddStream-getInstitute-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedInstitute, ...formData }),
      });
  
      if (response.ok) {
        alert("Stream successfully added!");
        setFormData({
          Stream: "",
          Source: "",
          Trial_Start: "",
          Trial_End: "",
          Trial_Days: 0,
          Rate_Code: "",
          PO_No: "",
          PO_Date: "",
          PO_Valid: "",
          Billing_SPOC: "",
          Billing_Contact: "",
          Billing_Address: "",
          GST_No: "",
          PAN: "",
          Module: "",
        });
        setSelectedInstitute("");
        setModules([]);
      } else {
        const errorMessage = await response.text();
        alert(`Failed to add stream: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error submitting stream data:", error);
      alert("An error occurred while submitting the data.");
    }
  };
  
  return (
    <div className="form-container">
      <h2>Add Stream</h2>
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
            <label htmlFor="Module">Module</label>
            <select
              id="Module"
              name="Module"
              value={formData.Module}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Module</option>
              {modules.map((module) => (
                <option key={module.MID} value={module.MID}>
                  {module.Module_Name} - {module.MID}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="Stream">Stream</label>
            <input
              id="Stream"
              type="text"
              name="Stream"
              value={formData.Stream}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="Source">Source</label>
            <select
              id="Source"
              name="Source"
              value={formData.Source}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Source</option>
              <option value="WALKIN">WALKIN</option>
              <option value="DIRMRK">DIRMRK</option>
              <option value="SOCMED">SOCMED</option>
              <option value="EMLENQ">EMLENQ</option>
              <option value="WEBSTE">WEBSTE</option>
              <option value="OTHER">OTHER</option>
              <option value="DUMMY">DUMMY</option>
            </select>
          </div>
          <div>
            <label htmlFor="Trial_Start">Free Trial Start Date</label>
            <input
              id="Trial_Start"
              type="date"
              name="Trial_Start"
              value={formData.Trial_Start}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="Trial_End">Free Trial End Date</label>
            <input
              id="Trial_End"
              type="date"
              name="Trial_End"
              value={formData.Trial_End}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="Trial_Days">Free Trial Days</label>
            <input id="Trial_Days" type="number" value={formData.Trial_Days} readOnly />
          </div>
          <div>
            <label htmlFor="Rate_Code">Rate Code</label>
            <input
              id="Rate_Code"
              type="text"
              name="Rate_Code"
              value={formData.Rate_Code}
              onChange={handleInputChange}
              placeholder="R1, R2, etc."
              required
            />
          </div>
          <div>
            <label htmlFor="PO_No">Purchase Order No.</label>
            <input
              id="PO_No"
              type="text"
              name="PO_No"
              value={formData.PO_No}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="PO_Date">Purchase Order Date</label>
            <input
              id="PO_Date"
              type="date"
              name="PO_Date"
              value={formData.PO_Date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="PO_Valid">PO Valid Date</label>
            <input
              id="PO_Valid"
              type="date"
              name="PO_Valid"
              value={formData.PO_Valid}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
          <label htmlFor="Billing_SPOC">Billing SPOC</label>
          <input
            id="Billing_SPOC"
            type="text"
            name="Billing_SPOC"
            value={formData.Billing_SPOC}
            onChange={handleInputChange}
            required
          />
        </div>
          <div>
            <label htmlFor="Billing_Contact">Billing Contact</label>
            <input
              id="Billing_Contact"
              type="text"
              name="Billing_Contact"
              value={formData.Billing_Contact}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="Billing_Address">Billing Address</label>
            <input
              id="Billing_Address"
              type="text"
              name="Billing_Address"
              value={formData.Billing_Address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="GST_No">Client GST</label>
            <input
              id="GST_No"
              type="text"
              name="GST_No"
              value={formData.GST_No}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="PAN">Client PAN</label>
            <input
              id="PAN"
              type="text"
              name="PAN"
              value={formData.PAN}
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

export default AddStream;
