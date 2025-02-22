import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./../../styles/modify.css";

const DeleteStream = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    streamId,
    moduleId,
    moduleName,
    instituteId,
    instituteName,
    streamName,
  } = location.state || {};

  const [formData, setFormData] = useState({
    Source: "",
    Trial_Start: "",
    Trial_End: "",
    Trial_Days: 0,
    Rate_Code: "",
    PO_No: "",
    PO_Date: "",
    PO_Valid: "",
    Billing_SPOC:"",
    Billing_Contact: "",
    Billing_Address: "",
    GST_No: "",
    PAN: "",
  });

  // Fetch other stream details from the backend using streamId
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
        setFormData({
          Source: data.Source || "",
          Trial_Start: data.Trial_Start || "",
          Trial_End: data.Trial_End || "",
          Trial_Days: data.Trial_Days || 0,
          Rate_Code: data.Rate_Code || "",
          PO_No: data.PO_No || "",
          PO_Date: data.PO_Date || "",
          PO_Valid: data.PO_Valid || "",
          Billing_SPOC:data.Billing_SPOC || "",
          Billing_Contact: data.Billing_Contact || "",
          Billing_Address: data.Billing_Address || "",
          GST_No: data.GST_No || "",
          PAN: data.PAN || "",
        });
      } else {
        alert("Failed to fetch stream details.");
      }
    } catch (error) {
      console.error("Error fetching stream details:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this stream?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/delete_Stream/${streamId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Stream deleted successfully!");
        navigate("/view-streams"); // Redirect to view page after deletion
      } else {
        alert("Failed to delete stream.");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("An error occurred while deleting data.");
    }
  };

  return (
    <div className="form-container">
      <h2>Delete Stream</h2>
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
          <label htmlFor="Module_Name">Module Name</label>
          <input id="Module_Name" type="text" value={moduleName} readOnly />
        </div>
        <div>
          <label htmlFor="StreamId">Stream ID</label>
          <input id="StreamId" type="text" value={streamId} readOnly />
        </div>
        <div>
          <label htmlFor="Stream">Stream Name</label>
          <input id="Stream" type="text" value={streamName} readOnly />
        </div>
        <div>
          <label htmlFor="Source">Source</label>
          <input id="Source" type="text" value={formData.Source} readOnly />
        </div>
        <div>
          <label htmlFor="Trial_Start">Trial Start</label>
          <input id="Trial_Start" type="date" value={formData.Trial_Start} readOnly />
        </div>
        <div>
          <label htmlFor="Trial_End">Trial End</label>
          <input id="Trial_End" type="date" value={formData.Trial_End} readOnly />
        </div>
        <div>
          <label htmlFor="Trial_Days">Trial Days</label>
          <input id="Trial_Days" type="number" value={formData.Trial_Days} readOnly />
        </div>
        <div>
          <label htmlFor="Rate_Code">Rate Code</label>
          <input id="Rate_Code" type="text" value={formData.Rate_Code} readOnly />
        </div>
        <div>
          <label htmlFor="PO_No">Purchase Order No.</label>
          <input id="PO_No" type="text" value={formData.PO_No} readOnly />
        </div>
        <div>
          <label htmlFor="PO_Date">Purchase Order Date</label>
          <input id="PO_Date" type="date" value={formData.PO_Date} readOnly />
        </div>
        <div>
          <label htmlFor="PO_Valid">PO Valid Date</label>
          <input id="PO_Valid" type="date" value={formData.PO_Valid} readOnly />
        </div>
        <div>
          <label htmlFor="Billing_Contact">Billing Contact</label>
          <input id="Billing_Contact" type="text" value={formData.Billing_Contact} readOnly />
        </div>
        <div>
          <label htmlFor="Billing_Address">Billing Address</label>
          <input id="Billing_Address" type="text" value={formData.Billing_Address} readOnly />
        </div>
        <div>
        <label htmlFor="Billing_SPOC">Billing SPOC</label>
        <input
          id="Billing_SPOC"
          type="text"
          name="Billing_SPOC"
          value={formData.Billing_SPOC}
          
          required
        />
      </div>
        <div>
          <label htmlFor="GST_No">Client GST</label>
          <input id="GST_No" type="text" value={formData.GST_No} readOnly />
        </div>
        <div>
          <label htmlFor="PAN">Client PAN</label>
          <input id="PAN" type="text" value={formData.PAN} readOnly />
        </div>
      </div>
      <button onClick={handleDelete} className="delete-button">Delete Stream</button>
    </div>
  );
};

export default DeleteStream;
