import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MapUserToModule = () => {
  const location = useLocation();
  const { userid } = location.state || {};

  const [instituteName, setInstituteName] = useState("");
  
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [moduleToBeMappedName, setModuleToBeMappedName] = useState("");
  const [mappedModules, setMappedModules] = useState([]); // Default to empty array
  const [modules, setModules] = useState([]); // Default to empty array
  
  const [emails, setEmails] = useState([]); // List of emails for user IDs
  const [loading, setLoading] = useState(true);

  // Fetch institute and user IDs on component mount
  useEffect(() => {
    const fetchInstituteData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/iadmininstitute/${userid}`);
        const data = await response.json();

        if (data.success) {
          setInstituteName(data.instituteName || "");
          setEmails(data.emails || []); // Safeguard
          // Safeguard
        } else {
          alert(data.message || "Failed to fetch institute data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userid) fetchInstituteData();
  }, [userid]);

  // Fetch emails when a user ID is selected
 

  // Fetch user details when an email is selected
  const handleEmailChange = async (e) => {
    const email = e.target.value;
    setSelectedEmail(email);
  
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/user-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userid }), // Send both email and userid
      });
  
      const data = await response.json();
  
      if (data.success) {
        setSelectedUserName(data.userName || "");
        setUserType(data.userType || "");
        setMappedModules(data.mappedModules || []);
        setModules(data.modules || []); // Safeguard
      } else {
        alert(data.message || "Failed to fetch user details.");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      setLoading(false);
    }
  };
  

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmail || !selectedUserName || !userType || !moduleToBeMappedName) {
      alert("Please fill all the required fields.");
      return;
    }

    const formData = {
      email: selectedEmail,
      moduleName: moduleToBeMappedName,
    };

    setLoading(true);
    fetch("http://localhost:5000/api/admin/module-to-be-mapped", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Module to Be Mapped updated successfully!");
          setSelectedEmail("");
        setSelectedUserName("");
        setUserType("");
        setModuleToBeMappedName("");
        setMappedModules([]);
        setModules([]);
        } else {
          alert(data.message || "Failed to update Module to Be Mapped.");
        }
      })
      .catch((err) => {
        console.error("Error updating Module to Be Mapped:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="dashboard-container">
     <h2><b>Map New Module to User</b></h2>

      <div className="institute-info">
        <h2>Institute: {instituteName}</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        {/* User ID */}
        

        {/* Email */}
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <select
            id="email"
            value={selectedEmail}
            onChange={handleEmailChange}
            disabled={loading || emails.length === 0}
            required
          >
            <option value="">Select Email</option>
            {emails.map((email, index) => (
              <option key={index} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>

        {/* User Name */}
        <div className="form-field">
          <label htmlFor="userName">User Name</label>
          <input
            id="userName"
            type="text"
            value={selectedUserName}
            disabled
            placeholder="User name will be auto-populated"
          />
        </div>

        {/* User Type */}
        <div className="form-field">
          <label htmlFor="userType">User Type</label>
          <input
            id="userType"
            type="text"
            value={userType}
            disabled
            placeholder="User type will be auto-populated"
          />
        </div>

        {/* Mapped Modules */}
        <div className="form-field">
          <label htmlFor="mappedModules">Mapped Module(s)</label>
          <input
            id="mappedModules"
            type="text"
            value={
              mappedModules && mappedModules.length > 0
                ? mappedModules.map((module) => `${module.name} - ${module.id}`).join(", ")
                : "No mapped modules available"
            }
            readOnly
            placeholder="Mapped modules will be displayed here"
          />
        </div>

        {/* Modules to Be Mapped */}
        <div className="form-field">
          <label htmlFor="moduleToBeMappedName">Module to Be Mapped</label>
          <select
            id="moduleToBeMappedName"
            value={moduleToBeMappedName}
            onChange={(e) => setModuleToBeMappedName(e.target.value)}
            disabled={loading || modules.length === 0}
            required
          >
            <option value="">Select Module to Be Mapped</option>
            {modules.map((module) => (
              <option key={module.id} value={`${module.name}-${module.id}`}>
                {`${module.name} - ${module.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MapUserToModule;
