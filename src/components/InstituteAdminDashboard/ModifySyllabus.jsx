import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ModifySyllabus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userid,
    subjectName,
    courseName,
    streamName,
    syllabusId,
    syllabusName,
   
  } = location.state || {};

  const [syllabusDetails, setSyllabusDetails] = useState({
    syllabusName,
    document,
  });

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/syllabus-document/${syllabusId}`);
        const docData = await response.text(); // Assuming the document is text-based; adjust as needed for other formats
        setSyllabusDetails((prevDetails) => ({
          ...prevDetails,
          document: docData,
        }));
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    if (!document) fetchDocument();
  }, [syllabusId, document]);

  const handleChange = (e) => {
    setSyllabusDetails({
      ...syllabusDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/update-syllabus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid,
          syllabusId,
          ...syllabusDetails,
        }),
      });

      if (!response.ok) throw new Error("Failed to update syllabus");
      alert("Syllabus updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating syllabus:", error);
      alert("Failed to update syllabus.");
    }
  };

  return (
    <div className="form-container">
      <h2>Modify Syllabus</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="courseName">Course Name</label>
            <input id="courseName" type="text" value={courseName} disabled />
          </div>
          <div>
            <label htmlFor="streamName">Stream Name</label>
            <input id="streamName" type="text" value={streamName} disabled />
          </div>
          <div>
            <label htmlFor="subjectName">Subject Name</label>
            <input id="subjectName" type="text" value={subjectName} disabled />
          </div>
          <div>
            <label htmlFor="syllabusId">Syllabus ID</label>
            <input id="syllabusId" type="text" value={syllabusId} disabled />
          </div>
          <div>
            <label htmlFor="syllabusName">Syllabus Name</label>
            <input
              id="syllabusName"
              type="text"
              name="syllabusName"
              value={syllabusDetails.syllabusName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="document">Document</label>
            <textarea
              id="document"
              name="document"
              value={syllabusDetails.document}
              onChange={handleChange}
              rows="10"
              required
            />
          </div>
        </div>
        <button type="submit">Update Syllabus</button>
      </form>
    </div>
  );
};

export default ModifySyllabus;
