import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";

const ModifyTest = () => {
  const location = useLocation();
  const { TestId } = location.state || {};
  const { userid } = location.state || {};
  const [instituteName, setInstituteName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [streamName, setStreamName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [syllabusName, setSyllabusName] = useState("");
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState("");
  const [timeZone, setTimeZone] = useState({
    value: "Asia/Kolkata",
    label: "GMT+5:30 (Asia/Kolkata)",
  });
  const [testDuration, setTestDuration] = useState("");
  const [testStartTime, setTestStartTime] = useState("");
  const [testEndDate, setTestEndDate] = useState("");
  const [yearClass, setYearClass] = useState("");
  const [semesterTerm, setSemesterTerm] = useState("");
  const [testInstruction, setTestInstruction] = useState("");
  const [loading, setLoading] = useState(false);

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle: "original",
    timezones: allTimezones,
  });

  useEffect(() => {
    const fetchInstituteName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/get_institute_name/${userid}`);
        const data = await response.json();
        if (data.success) {
          setInstituteName(data.instituteName || "");
        }
      } catch (err) {
        console.error("Error fetching institute name:", err);
      }
    };

    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/get_test_details/${TestId}`);
        const data = await response.json();

        if (data.success) {
          setModuleName(data.moduleName || "");
          setStreamName(data.streamName || "");
          setSubjectName(data.subjectName || "");
          setSyllabusName(data.syllabusName || "");
          setTestName(data.testName || "");
          setTestDate(data.testDate || "");
          setTimeZone({ value: data.timeZoneValue, label: data.timeZoneLabel } || { value: "Asia/Kolkata", label: "GMT+5:30 (Asia/Kolkata)" });
          setTestDuration(data.testDuration || "");
          setTestStartTime(data.testStartTime || "");
          setTestEndDate(data.testEndDate || "");
          setYearClass(data.yearClass || "");
          setSemesterTerm(data.semesterTerm || "");
          setTestInstruction(data.testInstruction || "");
        } else {
          alert(data.message || "Failed to fetch test details.");
        }
      } catch (err) {
        console.error("Error fetching test details:", err);
        alert("An error occurred while fetching test details.");
      } finally {
        setLoading(false);
      }
    };

    if (TestId) {
      fetchInstituteName();
      fetchTestDetails();
    }
  }, [TestId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      testId: TestId,
      testName,
      testDate,
      timeZone: timeZone.label,
      testDuration,
      testStartTime,
      testEndDate,
      yearClass,
      semesterTerm,
      testInstruction,
    };
    console.log(formData);
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/update_test_details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert("Test updated successfully!");
      } else {
        alert(data.message || "Failed to update the test.");
      }
    } catch (err) {
      console.error("Error updating test:", err);
      alert("An error occurred while updating the test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2><b>Modify Test</b></h2>
      <div className="institute-info">
        <h2>Institute: {instituteName || "Loading..."}</h2>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-field">
          <label>Module</label>
          <input type="text" value={moduleName} readOnly />
        </div>
        <div className="form-field">
          <label>Stream</label>
          <input type="text" value={streamName} readOnly />
        </div>
        <div className="form-field">
          <label>Subject</label>
          <input type="text" value={subjectName} readOnly />
        </div>
        <div className="form-field">
          <label>Syllabus</label>
          <input type="text" value={syllabusName} readOnly />
        </div>
        <div className="form-field">
        <label htmlFor="testName">Test Name</label>
        <input
          id="testName"
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          placeholder="Enter Test Name"
          required
        />
      </div>




      {/* Test Date */}
      <div className="form-field">
        <label htmlFor="testDate">Test Date</label>
        <input
          id="testDate"
          type="date"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
          required
        />
      </div>




      {/* Time Zone */}
      <div className="form-field">
        <label htmlFor="timeZone">Time Zone</label>
        <select
          id="timeZone"
          value={timeZone.value}
          onChange={(e) => setTimeZone(parseTimezone(e.currentTarget.value))}
          required
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>




      {/* Test Duration */}
      <div className="form-field">
        <label htmlFor="testDuration">Test Duration (in minutes)</label>
        <input
          id="testDuration"
          type="number"
          value={testDuration}
          onChange={(e) => setTestDuration(e.target.value)}
          placeholder="Enter Duration"
          required
        />
      </div>




      {/* Test Start Time */}
      <div className="form-field">
        <label htmlFor="testStartTime">Test Start Time</label>
        <input
          id="testStartTime"
          type="time"
          value={testStartTime}
          step={300}
          onChange={(e) => setTestStartTime(e.target.value)}
          required
        />
      </div>




      {/* Test End Date */}
      <div className="form-field">
        <label htmlFor="testEndDate">Test End Date</label>
        <input
          id="testEndDate"
          type="date"
          value={testEndDate}
          onChange={(e) => setTestEndDate(e.target.value)}
          required
        />
      </div>




      <div className="form-field">
        <label>Test Instruction</label>
        <textarea
          value={testInstruction}
          onChange={(e) => setTestInstruction(e.target.value)}
          required
        />
      </div>

        <button type="submit" disabled={loading}>{loading ? "Processing..." : "Submit"}</button>
      </form>
    </div>
  );
};

export default ModifyTest;
