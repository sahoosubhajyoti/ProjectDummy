import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";




const AddTest1 = () => {
  const location = useLocation();
  const { userid } = location.state || {};




  const [instituteName, setInstituteName] = useState("");
  const [moduleInfo, setModuleInfo] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSyllabus, setSelectedSyllabus] = useState("");
  const [selectedModule, setSelectedModule] = useState(""); // New state to store selected module
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




  // Fetch institute and mapped modules on component mount
  useEffect(() => {
    const fetchInstituteData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/examinermodules/${userid}`
        );
        const data = await response.json();
        




        if (data.success) {
          setInstituteName(data.instituteName);
          setModuleInfo(
            `${data.mappedModules[0].id} - ${data.mappedModules[0].name}`
          );
          const module = data.mappedModules[0];
          setModuleInfo(`${module.id} - ${module.name}`);
          setSelectedModule(module.id);
          setModuleName(module.name);
          fetchStreams(data.mappedModules[0].id);
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




  const fetchStreams = async (moduleId) => {
    try {
      //setLoading(true);
      const response = await fetch(`http://localhost:5000/api/streams-fetch-for-addtest/${userid}/${moduleId}`);
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      setStreams(data.streams);
      console.log(moduleId);
      console.log(data.streams);
    } catch (error) {
      console.error("Error fetching streams:", error);
    } finally {
      setLoading(false);
    }
  };




  const handleStreamChange = async (e) => {
    console.log("handleStreamChange called!");


    const selectedStreamId = e.target.value;
    console.log(selectedStreamId,"",selectedModule, "module");
    setSelectedStream(selectedStreamId);
    setSelectedSubject("");
    setSelectedSyllabus("");
    setSubjects([]);
    setSyllabi([]);


    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/subjects-fetch-for-addtest/${selectedStreamId}/${selectedModule}`
      );
      if (!response.ok) throw new Error("Failed to fetch subjects");
      const data = await response.json();
      setSubjects(data.subjects);
      console.log(data);
      console.log(selectedModule);
      console.log(selectedStreamId);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };




  const handleSubjectChange = async (e) => {
    const selectedSubjectId = e.target.value;
    setSelectedSubject(selectedSubjectId);
    setSelectedSyllabus("");
    setSyllabi([]);
    // console.log(selectedSubjectId,selectedModule,selectedStream);
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/syllabus-for-examiner/${selectedSubjectId}/${selectedModule}/${selectedStream}`
      );
      if (!response.ok) throw new Error("Failed to fetch syllabi");
      const data = await response.json();
      setSyllabi(data.syllabi);
      // console.log(selectedSubjectId,setSelectedModule,setSelectedStream);
    } catch (error) {
      console.error("Error fetching syllabi:", error);
    } finally {
      setLoading(false);
    }
  };




  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();




    const formData = {
      testName,
      testDate,
      timeZone: timeZone.label,
      testDuration,
      testStartTime,
      testEndDate,
     moduleId: selectedModule,
      moduleName: moduleName,
      streamId: selectedStream,
      streamName: streams.find(s => s.id === selectedStream)?.name || "",
      subjectId: selectedSubject,
      subjectName: subjects.find(s => s.id === selectedSubject)?.name || "",
      syllabusId: selectedSyllabus,
      syllabusName: syllabi.find(s => s.id === selectedSyllabus)?.name || "",
      userId: userid,// Include selected module in payload
    };




    setLoading(true);
    fetch("http://localhost:5000/api/examiner-addtest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Test added successfully!");
          // Reset form fields
          setTestName("");
          setTestDate("");
          setTimeZone({
            value: "Asia/Kolkata",
            label: "GMT+5:30 (Asia/Kolkata)",
          });
          setTestDuration("");
          setTestStartTime("");
          setTestEndDate("");
          //setSelectedModule(mappedModules.length > 0 ? mappedModules[0].id : ""); // Reset selected module
        } else {
          alert(data.message || "Failed to add the test.");
        }
      })
      .catch((err) => {
        console.error("Error adding test:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };




  return (
    <div className="dashboard-container">
      <h2>
        <b>Add Test</b>
      </h2>




      <div className="institute-info">
        <h2>Institute: {instituteName}</h2>
      </div>




      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-field">
          <label>Module</label>
          <input type="text" value={moduleInfo} readOnly />
        </div>
        <div className="form-field">
          <label>Stream</label>
          <select value={selectedStream} onChange={handleStreamChange} required>
            <option value="">Select Stream</option>
            {streams.map((stream) => (
              <option
                key={stream.id}
                value={stream.id}
              >{`${stream.id} - ${stream.name}`}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Subject</label>
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option
                key={subject.id}
                value={subject.id}
              >{`${subject.id} - ${subject.name}`}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Syllabus</label>
          <select
            value={selectedSyllabus}
            onChange={(e) => setSelectedSyllabus(e.target.value)}
            required
          >
            <option value="">Select Syllabus</option>
            {syllabi.map((syllabus) => (
              <option
                key={syllabus.id}
                value={syllabus.id}
              >{`${syllabus.id} - ${syllabus.name}`}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Year/Class</label>
          <input
            type="text"
            value={yearClass}
            onChange={(e) => setYearClass(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Semester/Term</label>
          <input
            type="text"
            value={semesterTerm}
            onChange={(e) => setSemesterTerm(e.target.value)}
            required
          />
        </div>
       
        {/* Test Name */}
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




export default AddTest1;  

