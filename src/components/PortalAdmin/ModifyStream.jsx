import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../../styles/modify.css";

const ModifyStream = () => {
  const location = useLocation();
  const {
    streamId,
    moduleId,
    moduleName,
    instituteId,
    instituteName,
    streamName,
  } = location.state || {};

  const [isStreamFetched, setIsStreamFetched] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    Stream: streamName || "",
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
  });

  // Fetch other stream details using streamId
  useEffect(() => {
    if (streamId) {
      fetchStreamData(streamId);
    }
  }, [streamId]);

  const fetchStreamData = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-Stream/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          Source: data.Source || "",
          Trial_Start: data.Trial_Start || "",
          Trial_End: data.Trial_End || "",
          Trial_Days: data.Trial_Days || 0,
          Rate_Code: data.Rate_Code || "",
          PO_No: data.PO_No || "",
          PO_Date: data.PO_Date || "",
          PO_Valid: data.PO_Valid || "",
          Billing_SPOC: data.Billing_SPOC || "",
          Billing_Contact: data.Billing_Contact || "",
          Billing_Address: data.Billing_Address || "",
          GST_No: data.GST_No || "",
          PAN: data.PAN || "",
        }));
        setIsStreamFetched(true);
      } else {
        alert("Failed to fetch stream details.");
      }
    } catch (error) {
      console.error("Error fetching stream details:", error);
    }
  };

  const validateGST = (gst) => /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[A-Z]{1}\d{1}$/.test(gst);
  const validatePAN = (pan) => /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(pan);

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

      if (name === "GST_No") {
        setErrors((prev) => ({ ...prev, GST_No: validateGST(value) ? "" : "Invalid GST Number format." }));
      }

      if (name === "PAN") {
        setErrors((prev) => ({ ...prev, PAN: validatePAN(value) ? "" : "Invalid PAN format." }));
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessages = Object.entries(errors)
      .filter(([key, value]) => value !== "")
      .map(([key, value]) => `${key}: ${value}`);

    if (errorMessages.length > 0) {
      alert(`Please correct the following errors:\n${errorMessages.join("\n")}`);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/update_Stream/${streamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instituteId, moduleId, streamId, ...formData }),
      });
      console.log(formData);
      if (response.ok) {
        alert("Stream updated successfully!");
      } else {
        alert("Failed to update Stream.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Modify Stream</h2>
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
            <label htmlFor="Module_Id">Module ID</label>
            <input id="Module_Id" type="text" value={moduleId} readOnly />
          </div>
          <div>
            <label htmlFor="">Module Name</label>
            <input type="text" value={moduleName} readOnly />
          </div>
          <div>
            <label htmlFor="StreamId">Stream ID</label>
            <input id="StreamId" type="text" value={streamId} readOnly />
          </div>
          <div>
            <label htmlFor="Stream">Stream Name</label>
            <input id="Stream" type="text" name="Stream" value={formData.Stream} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="Source">Source</label>
            <input id="Source" type="text" name="Source" value={formData.Source} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="Trial_Start">Trial Start</label>
            <input id="Trial_Start" type="date" name="Trial_Start" value={formData.Trial_Start} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="Trial_End">Trial End</label>
            <input id="Trial_End" type="date" name="Trial_End" value={formData.Trial_End} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="Trial_Days">Trial Days</label>
            <input id="Trial_Days" type="number" name="Trial_Days" value={formData.Trial_Days} readOnly />
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
        <button type="submit" disabled={!isStreamFetched}>Modify Stream</button>
      </form>
    </div>
  );
};

export default ModifyStream;
