import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ModifySubject = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userid,
    subjectId,
    subjectName,
    courseName,
    streamName,
    classYear,
    academicLevel,
  } = location.state || {};

  const [subjectDetails, setSubjectDetails] = useState({
    subjectId,
    subjectName,
    courseName,
    streamName,
    classYear,
    academicLevel,
  });

  const handleChange = (e) => {
    setSubjectDetails({
      ...subjectDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/update-subject", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid,
          ...subjectDetails,
        }),
      });

      if (!response.ok) throw new Error("Failed to update subject");
      alert("Subject updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating subject:", error);
      alert("Failed to update subject.");
    }
  };

  return (
    <div className="form-container">
      <h2>Modify Subject</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="subjectId">Subject ID</label>
            <input id="subjectId" type="text" value={subjectDetails.subjectId} disabled />
          </div>
          <div>
            <label htmlFor="subjectName">Subject Name</label>
            <input id="subjectName" type="text" name="subjectName" value={subjectDetails.subjectName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="courseName">Course Name</label>
            <input id="courseName" type="text" name="courseName" value={subjectDetails.courseName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="streamName">Stream Name</label>
            <input id="streamName" type="text" name="streamName" value={subjectDetails.streamName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="classYear">Class/Year</label>
            <input id="classYear" type="text" name="classYear" value={subjectDetails.classYear} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="academicLevel">Academic Level</label>
            <input id="academicLevel" type="text" name="academicLevel" value={subjectDetails.academicLevel} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit">Update Subject</button>
      </form>
    </div>
  );
};

export default ModifySubject;
