import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AddSyllabus = () => {
  const location = useLocation();
  const { userid } = location.state || {};

  const [instituteName, setInstituteName] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [modules, setModules] = useState([]);
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [syllabusName, setSyllabusName] = useState("");
  const [syllabusFile, setSyllabusFile] = useState(null);

  useEffect(() => {
    if (userid) {
      fetchInstituteDetails();
    }
  }, [userid]);

  useEffect(() => {
    if (instituteId) {
      fetchModules();
    }
  }, [instituteId]);

  useEffect(() => {
    if (selectedModule) {
      fetchStreams(selectedModule);
      // Reset streams and subjects when a new module is selected
      setStreams([]);
      setSelectedStream("");
      setSubjects([]);
      setSelectedSubject("");
    }
  }, [selectedModule]);

  useEffect(() => {
    if (selectedStream) {
      fetchSubjects(selectedStream, selectedModule);
      // Reset subjects when a new stream is selected
      setSubjects([]);
      setSelectedSubject("");
    }
  }, [selectedStream]);

  const fetchInstituteDetails = async () => {
    try {
      const response = await fetch(`/api/institute/${userid}`);
      if (!response.ok) throw new Error("Failed to fetch institute details");
      const data = await response.json();
      setInstituteId(data.instituteId);
      setInstituteName(data.instituteName);
    } catch (error) {
      console.error("Error fetching institute details:", error);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch(`/api/modules/${instituteId}`);
      if (!response.ok) throw new Error("Failed to fetch modules");
      const data = await response.json();
      setModules(data.modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const fetchStreams = async (mid) => {
    try {
      const response = await fetch(`/api/streams/${instituteId}/${mid}`);
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      setStreams([{ streamid: "all", streamName: "All" }, ...data.streams]);
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };

  const fetchSubjects = async (streamid, mid) => {
    try {
      const response = await fetch(
        `/api/subjects/${instituteId}/${streamid}/${mid}`
      );
      if (!response.ok) throw new Error("Failed to fetch subjects");
      const data = await response.json();
      setSubjects([{ subjectid: "all", subjectName: "All" }, ...data.subjects]);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
      } else if (file.size > 1 * 1024 * 1024) {
        alert("File size must be less than 1MB.");
      } else {
        setSyllabusFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!syllabusFile) {
      alert("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("userid", userid);
    formData.append("instituteId", instituteId);
    formData.append("selectedModule", selectedModule);
    formData.append("selectedStream", selectedStream);
    formData.append("selectedSubject", selectedSubject);
    formData.append("syllabusName", syllabusName);
    formData.append("syllabusFile", syllabusFile);

    try {
      const response = await fetch("/api/add-user", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit data");

      const result = await response.json();
      alert("Subject added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add subject.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Add Syllabus</h2>
      <div className="institute-info">
        <h3>Institute Name: {instituteName || "Loading..."}</h3>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        {/* Module Dropdown */}
        <div className="form-field">
          <label>Course:</label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
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
            onChange={(e) => {
              setSelectedStream(e.target.value);
              if (e.target.value === "all") setSelectedSubject("all");
            }}
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

        {/* Subject Dropdown */}
        <div className="form-field">
          <label>Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedStream || selectedStream === "all"}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.subjectid} value={subject.subjectid}>
                {subject.subjectid}-{subject.subjectName}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Name */}
        <div className="form-field">
          <label>Syllabus Name:</label>
          <input
            type="text"
            value={syllabusName}
            onChange={(e) => setSyllabusName(e.target.value)}
            placeholder="Enter Syllabus Name"
          />
        </div>

        {/* File Upload */}
        <div className="form-field">
          <label>Syllabus PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddSyllabus;
