import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const UpdateQuestionBank = () => {
  const location = useLocation();
  const { userid } = location.state || {};

  // State variables
  const [modules, setModules] = useState([]);
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSyllabus, setSelectedSyllabus] = useState("");
  const [year, setYear] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState("");
  const [unit, setUnit] = useState("");
  const [chapter, setChapter] = useState("");
  const [fullMark, setFullMark] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch modules on mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/examinermodules/${userid}`
        );
        const data = await response.json();
        if (data.success) setModules(data.mappedModules);
      } catch (err) {
        console.error("Error fetching modules:", err);
      }
    };
    if (userid) fetchModules();
  }, [userid]);

  // Fetch streams when module changes
  const fetchStreams = async (moduleId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/streams-fetch-for-addtest/${userid}/${moduleId}`
      );
      const data = await response.json();
      setStreams(data.streams || []);
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };

  // Fetch subjects when stream changes
  const fetchSubjects = async (moduleId, streamId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/subjects-fetch-for-addtest/${streamId}/${moduleId}`
      );
      const data = await response.json();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Fetch syllabi when subject changes
  const fetchSyllabi = async (subjectId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/syllabus-for-examiner/${subjectId}/${selectedModule}/${selectedStream}`
      );
      const data = await response.json();
      setSyllabi(data.syllabi || []);
    } catch (error) {
      console.error("Error fetching syllabi:", error);
    }
  };

  // Handlers
  const handleModuleChange = (e) => {
    const moduleId = e.target.value;
    setSelectedModule(moduleId);
    setSelectedStream("");
    setSelectedSubject("");
    setSelectedSyllabus("");
    fetchStreams(moduleId);
  };

  const handleStreamChange = (e) => {
    const streamId = e.target.value;
    setSelectedStream(streamId);
    setSelectedSubject("");
    setSelectedSyllabus("");
    fetchSubjects(selectedModule, streamId);
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setSelectedSyllabus("");
    fetchSyllabi(subjectId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      moduleId: selectedModule,
      streamId: selectedStream,
      subjectId: selectedSubject,
      syllabusId: selectedSyllabus,
      year,
      academicLevel,
      testName,
      testDate,
      unit,
      chapter,
      fullMark,
      difficulty,
      question,
      userId: userid,
    };

    try {
      const response = await fetch("http://localhost:5000/api/add-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Question added successfully!");
        handleAddAnother();
      } else {
        alert(data.message || "Failed to add question");
      }
    } catch (err) {
      console.error("Error submitting question:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    // Reset all fields except module and stream
    setSelectedSubject("");
    setSelectedSyllabus("");
    setYear("");
    setAcademicLevel("");
    setTestName("");
    setTestDate("");
    setUnit("");
    setChapter("");
    setFullMark("");
    setDifficulty("");
    setQuestion("");
  };

  return (
    <div className="dashboard-container">
      <h2>
        <b>Update Question Bank</b>
      </h2>

      <form onSubmit={handleSubmit} className="form-container">
        {/* Module Selection */}
        <div className="form-field">
          <label>Module</label>
          <select value={selectedModule} onChange={handleModuleChange} required>
            <option value="">Select Module</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stream Selection */}
        <div className="form-field">
          <label>Stream</label>
          <select value={selectedStream} onChange={handleStreamChange} required>
            <option value="">Select Stream</option>
            {streams.map((stream) => (
              <option key={stream.id} value={stream.id}>
                {stream.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        <div className="form-field">
          <label>Subject</label>
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Syllabus Selection */}
        <div className="form-field">
          <label>Syllabus</label>
          <select
            value={selectedSyllabus}
            onChange={(e) => setSelectedSyllabus(e.target.value)}
            required
          >
            <option value="">Select Syllabus</option>
            {syllabi.map((syllabus) => (
              <option key={syllabus.id} value={syllabus.id}>
                {syllabus.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year and Academic Level */}
        <div className="form-row">
          <div className="form-field">
            <label>Year/CLass</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Semester/Term</label>
            <select
              value={academicLevel}
              onChange={(e) => setAcademicLevel(e.target.value)}
              required
            >
              <option value="">Select Level</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
        </div>

        {/* Test Information */}
        <div className="form-row">
          <div className="form-field">
            <label>Test Name</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Test Date</label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Question Details */}
        <div className="form-row">
          <div className="form-field">
            <label>Unit</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Chapter</label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Full Marks</label>
            <input
              type="number"
              value={fullMark}
              onChange={(e) => setFullMark(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Difficulty (1-10)</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="">Select Difficulty</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Question Input */}
        <div className="form-field">
          <label>Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        {/* Form Actions */}
        <div className="btn" style={{ justifyContent: "space-between", display:"flex" }}>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Question"}
            </button>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={handleAddAnother}
              className="add-another-btn"
            >
              Add Another Question
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateQuestionBank;
