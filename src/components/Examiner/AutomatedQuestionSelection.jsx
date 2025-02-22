import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";
import { red } from "@mui/material/colors";




const AutomatedQuestionSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
     // Extract details manually from location.state
  const {
    testName,
    testDate,
    stream,
    year,
    semester,
    subject,
    syllabus,
    userid,
  } = location.state || {};




  const [totalMarks, setTotalMarks] = useState(0);
  const [selectedUnits, setSelectedUnits] = useState({});




  const [syllabusData, setSyllabusData] = useState([]);
  useEffect(() => {
    const fetchTableDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/validate_qbank?userid=${userid}&stream=${stream}&subject=${subject}`);
        const data = await response.json();
        console.log(data);
        if (data.success) {
          const unitsArray = Object.values(data.units); // Convert object to array
          setSyllabusData(unitsArray);
        } else {
          setSyllabusData([]); // Set an empty array if data is not available
        }
      } catch (error) {
        console.error("Error fetching table details:", error);
      }
    };


   
    if (userid && stream && subject) {
      fetchTableDetails();
    }
  }, [userid,stream,subject]);




  const handleDownloadSyllabus = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/download-syllabus/${syllabus}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth if needed
          }
        }
      );




      if (!response.ok) throw new Error('Failed to download syllabus');




      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
     
      // Open in new window
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        alert('Please allow pop-ups for this site to view the syllabus');
      }
     
      // Clean up memory after window is closed
      newWindow?.addEventListener('beforeunload', () => {
        window.URL.revokeObjectURL(url);
      });




    } catch (error) {
      console.error('Error downloading syllabus:', error);
      alert('Failed to download syllabus. Please try again.');
    }
  };




  const handleCheckboxChange = (unit) => {
    setSelectedUnits((prev) => {
      const newSelection = { ...prev };
  
      if (newSelection[unit]) {
        delete newSelection[unit]; // Remove entry when unchecked
      } else {
        newSelection[unit] = ""; // Default value when checked
      }
  
      return { ...newSelection }; // Ensure state updates properly
    });
  };
  



  const handleMaxQuestionsChange = (unit, value) => {
    setSelectedUnits((prev) => ({
      ...prev,
      [unit]: value,
    }));
  };




  const handleSubmit = async () => {
    const submissionData = {
      totalMarks,
      selectedUnits,
     
    };
    console.log(submissionData)
    try {
      const response = await fetch(
        "http://localhost:5000/api/set_questions_for_AutomatedSetQuestion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );
 
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error(errorData.message || "Failed to submit questions");
      }
 
      alert("Questions submitted successfully!");
      navigate(-1); // Redirect after submission
    } catch (error) {
      console.error("Error submitting questions:", error);
      alert("Failed to submit questions. Please try again.");
    }
    console.log("Submitting Data:", submissionData);
    navigate("/submission-success", { state: submissionData });
  };




  return (
    <Paper sx={{ width: "90%", margin: "20px auto", padding: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
        <h2>
        <pre>
          Test Name: {testName || "N/A"} | Date: {testDate || "N/A"} |
          Stream: {stream || "N/A"} | Year: {year || "N/A"}
          Semester: {semester || "N/A"} | Subject: {subject || "N/A"}
        </pre>
          </h2>
        <h2>
        {syllabus ? (
          <a
            href="#"
            onClick={handleDownloadSyllabus}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            Download
          </a>
        ) : (
          <span>No syllabus available</span>
        )}
        </h2>
      </div>
      <TextField
        label="Total Marks"
        type="number"
        value={totalMarks}
        onChange={(e) => setTotalMarks(e.target.value)}
        sx={{ marginBottom: 2, width: "200px" }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Unit</TableCell>
              <TableCell>Chapter</TableCell>
              <TableCell>Syllabus</TableCell>
              <TableCell>Count of Questions</TableCell>
              <TableCell>Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {syllabusData.map((item) => (
              <TableRow key={item}>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.chapter}</TableCell>
                <TableCell sx={{ color: item.syllabus === syllabus ? red[500] : "inherit" }}>
                  {item.syllabus}
                </TableCell>
                <TableCell>{item.question_count}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={item.unit in selectedUnits}
                    onChange={() => handleCheckboxChange(item.unit)}
                  />
                  {item.unit in selectedUnits && (
                    <TextField
                      label="Max Questions"
                      type="number"
                      value={selectedUnits[item.unit]}
                      onChange={(e) => handleMaxQuestionsChange(item.unit, e.target.value)}
                      sx={{ width: "100px", marginLeft: 1 }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
      variant="contained"
      color="secondary"
      sx={{ marginTop: 2 }}
      onClick={handleSubmit}
    >
      Submit
    </Button>
    </Paper>
  );
};




export default AutomatedQuestionSelection;










