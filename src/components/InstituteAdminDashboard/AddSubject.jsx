import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AddSubject = () => {
  const location = useLocation();
  const { userid } = location.state || {}; // Retrieve userid from Sidebar1

  const [instituteName, setInstituteName] = useState("");
  const [instituteId, setInstituteId] = useState(""); // Store Institute ID but don't show
  const [modules, setModules] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedModule, setSelectedmodule] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [classYear, setClassYear] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    if (userid) {
      fetchInstituteDetails();
    }
  }, [userid]);

  useEffect(() => {
    if (instituteId) {
      fetchmodules();
    }
  }, [instituteId]); // Fetch modules using Institute ID

  useEffect(() => {
    if (selectedModule) {
      fetchStreams(selectedModule);
    }
  }, [selectedModule]); // Fetch streams using selected module ID

  // Fetch Institute Name and ID
  const fetchInstituteDetails = async () => {
    try {
      const response = await fetch(`/api/institute/${userid}`);
      if (!response.ok) throw new Error("Failed to fetch institute details");
      const data = await response.json();
      console.log(data)
      // Store Institute ID internally, show only Institute Name
      setInstituteId(data.instituteId);
      setInstituteName(data.instituteName);
      
    } catch (error) {
      console.error("Error fetching institute details:", error);
    }
  };

  // Fetch modules using Institute ID
  const fetchmodules = async () => {
    try {
      const response = await fetch(`/api/modules/${instituteId}`);
      if (!response.ok) throw new Error("Failed to fetch modules");
      const data = await response.json();
      console.log(data);
      setModules(data.modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  // Fetch Streams using Institute ID & module ID
  const fetchStreams = async (mid) => {
    try {
      const response = await fetch(`/api/streams/${instituteId}/${mid}`);
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      console.log(data);
      setStreams(data.streams);
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedmoduleData = modules.find(module => module.mid === selectedModule);
    const selectedStreamData = streams.find(stream => stream.streamid === selectedStream);
  
    const userData = {
      userid,
      instituteId, // Include instituteId when submitting
      selectedModule: selectedmoduleData ? {
        mid: selectedmoduleData.mid,
        mName: selectedmoduleData.mName
      } : null,
      selectedStream: selectedStreamData ? {
        streamid: selectedStreamData.streamid,
        streamName: selectedStreamData.streamName
      } : null,
      classYear,
      academicLevel,
      subjectName,
    };
  
    console.log("Submitting Data:", userData);
  
    try {
      const response = await fetch("/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) throw new Error("Failed to submit data");
  
      const result = await response.json();
      console.log("Success:", result);
      alert("Subject added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add subject.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Add Subject</h2>
      <div className="institute-info">
        <h3>Institute Name: {instituteName || "Loading..."}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="form-container">
        {/* module Dropdown */}
        <div className="form-field">
          <label>Course:</label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedmodule(e.target.value)}
          >
            <option value="">Select module</option>
            {modules.map((module) => (
              <option key={module.mid} value={module.mid}>
                {module.mName}
              </option>
            ))}
          </select>
        </div>

        {/* Stream Dropdown */}
        <div className="form-field">
          <label>Stream:</label>
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            disabled={!selectedModule}
          >
            <option value="">Select Stream</option>
            {streams.map((stream) => (
              <option key={stream.streamid} value={stream.streamid}>
                {stream.streamName}
              </option>
            ))}
          </select>
        </div>

        {/* Class/Year */}
        <div className="form-field">
          <label>Class/Year:</label>
          <input
            type="text"
            value={classYear}
            onChange={(e) => setClassYear(e.target.value)}
            placeholder="Enter Class or Year"
          />
        </div>

        {/* Academic Level/Semester/Term */}
        <div className="form-field">
          <label>Academic Level-Semester/Term:</label>
          <input
            type="text"
            value={academicLevel}
            onChange={(e) => setAcademicLevel(e.target.value)}
            placeholder="Enter Academic Level"
          />
        </div>

        {/* Subject Name */}
        <div className="form-field">
          <label>Subject Name:</label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Enter Subject Name"
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddSubject;
