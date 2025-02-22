import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const DeleteMappedUser = () => {
  const location = useLocation();
  const { email: prefilledEmail } = location.state || {}; // Retrieve email from state

  const [selectedEmail, setSelectedEmail] = useState(prefilledEmail || "");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [selectedMappedModule, setSelectedMappedModule] = useState("");
  const [mappedModules, setMappedModules] = useState([]); // Default to empty array
  const [loading, setLoading] = useState(false);

  // Fetch user details when an email is set (including the prefilled email)
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!selectedEmail) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/user-details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: selectedEmail }),
        });

        const data = await response.json();

        if (data.success) {
          setSelectedUserName(data.userName || "");
          setUserType(data.userType || "");
          setMappedModules(data.mappedModules || []); // Populate mapped modules
        } else {
          alert(data.message || "Failed to fetch user details.");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [selectedEmail]);

  // Handle Delete Request
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!selectedEmail || !selectedUserName || !userType || !selectedMappedModule) {
      alert("Please fill all the required fields.");
      return;
    }

    const deleteData = {
      email: selectedEmail,
      moduleId: selectedMappedModule, // Assuming `moduleId` is required for delete
    };

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin/delete-mapped-module", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Mapped Module deleted successfully!");
        setSelectedUserName("");
        setUserType("");
        setSelectedMappedModule("");
        setMappedModules([]);
      } else {
        alert(data.message || "Failed to delete Mapped Module.");
      }
    } catch (err) {
      console.error("Error deleting Mapped Module:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>
        <b>Delete Mapped Module</b>
      </h2>

      <form onSubmit={handleDelete} className="form-container">
        {/* Email Dropdown */}
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <select
            id="email"
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            disabled={loading || Boolean(prefilledEmail)} // Disable if email is prefilled
            required
          >
            <option value="">Select Email</option>
            <option value={prefilledEmail}>{prefilledEmail}</option>
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

        {/* Mapped Modules Dropdown */}
        <div className="form-field">
          <label htmlFor="mappedModules">Mapped Module(s)</label>
          <select
            id="mappedModules"
            value={selectedMappedModule}
            onChange={(e) => setSelectedMappedModule(e.target.value)}
            disabled={loading || mappedModules.length === 0}
            required
          >
            <option value="">Select Mapped Module</option>
            {mappedModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name} - {module.id}
              </option>
            ))}
          </select>
        </div>

        {/* Delete Button */}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteMappedUser;
