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
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import MenuIcon from "@mui/icons-material/Menu";

const ManualEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { testDate, TestId, Subject, syllabus, testName, userid, year, semester } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [selectedChapters, setSelectedChapters] = useState(new Set());
  const [selectedUnits, setSelectedUnits] = useState(new Set());
  const [sorted, setSorted] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [selectedChapter, setSelectedChapter] = useState("All");

  const [chapterAnchorEl, setChapterAnchorEl] = useState(null);
  const [unitAnchorEl, setUnitAnchorEl] = useState(null);
  const [updatedMarks, setUpdatedMarks] = useState({});


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/get_questions_for_manualSetQuestion?Subject=${encodeURIComponent(Subject)}&syllabus=${encodeURIComponent(syllabus)}`
        );
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [TestId]);

  // Get unique units and chapters
  const units = [...new Set(questions.map((q) => q.unit))].sort((a, b) =>
    a.localeCompare(b)
  );
  const unitsList = ["All", ...units];

  const chapters =
    selectedUnit === "All"
      ? [...new Set(questions.map((q) => q.chapter))]
      : [...new Set(questions.filter((q) => q.unit === selectedUnit).map((q) => q.chapter))];
  const chaptersList = ["All", ...chapters.sort((a, b) => a.localeCompare(b))];

  // Filter questions based on selections
  const filteredQuestions = questions.filter((q) => {
    const unitMatch = selectedUnit === "All" || q.unit === selectedUnit;
    const chapterMatch = selectedChapter === "All" || q.chapter === selectedChapter;
    return unitMatch && chapterMatch;
  });



  const handleUpdatedMarksChange = (id, value) => {
    setUpdatedMarks((prev) => ({ ...prev, [id]: value }));
    calculateTotalMarks(selectedQuestions, { ...updatedMarks, [id]: value });
  };

  const calculateTotalMarks = (questions, updatedMarksState = updatedMarks) => {
    const total = questions.reduce(
      (sum, q) => sum + (parseFloat(updatedMarksState[q.id]) || 0),
      0
    );
    setTotalMarks(total);
  };

    


  const handleCheckboxChange = (question) => {
    const isSelected = selectedQuestions.some((q) => q.id === question.id);
    const newSelectedQuestions = isSelected
      ? selectedQuestions.filter((q) => q.id !== question.id)
      : [...selectedQuestions, question];

    setSelectedQuestions(newSelectedQuestions);
    setUpdatedMarks((prev) => ({ ...prev, [question.id]: question.marks }));
    calculateTotalMarks(newSelectedQuestions);

    // Fix: Ensure this part is inside the function
    const newChapters = new Set(newSelectedQuestions.map((q) => q.chapter));
    const newUnits = new Set(newSelectedQuestions.map((q) => q.unit));
    setSelectedChapters(newChapters);
    setSelectedUnits(newUnits);
};


  const handleSortByName = () => {
    const sortedQuestions = [...filteredQuestions].sort((a, b) =>
      a.text.localeCompare(b.text)
    );
    setQuestions([...sortedQuestions]);
    setSorted(!sorted);
  };

  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
    setSelectedChapter("All");
  };

  const handleChapterChange = (event) => {
    setSelectedChapter(event.target.value);
  };


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


  const handleSubmit = async () => {
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question before submitting.");
      return;
    }

    const payload = {
      TestId: TestId,
      userid: userid,
      
      questions: selectedQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        unit: q.unit,
        chapter: q.chapter,
       marks: updatedMarks[q.id],
        difficulty: q.difficulty,
      })),
    };

    try {
      const response = await fetch("http://localhost:5000/api/submit_selected_questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit questions");

      alert("Questions submitted successfully!");
      navigate("/"); // Redirect after submission
    } catch (error) {
      console.error("Error submitting questions:", error);
      alert("Failed to submit questions. Please try again.");
    }
  };


  return ( 
    <Paper sx={{ width: "90%", margin: "20px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5">Manual Question Selection for Test: {testName}</Typography>

        {/* Selected Chapters & Units menus */}
        <div style={{ display: "flex", gap: "10px" }}>
          <IconButton onClick={(e) => setChapterAnchorEl(e.currentTarget)}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={chapterAnchorEl}
            open={Boolean(chapterAnchorEl)}
            onClose={() => setChapterAnchorEl(null)}
          >
            <Typography sx={{ padding: "8px 16px" }} variant="h6">
              Selected Chapters
            </Typography>
            {[...selectedChapters].map((chapter) => (
              <MenuItem key={chapter}>{chapter}</MenuItem>
            ))}
          </Menu>

          <IconButton onClick={(e) => setUnitAnchorEl(e.currentTarget)}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={unitAnchorEl}
            open={Boolean(unitAnchorEl)}
            onClose={() => setUnitAnchorEl(null)}
          >
            <Typography sx={{ padding: "8px 16px" }} variant="h6">
              Selected Units
            </Typography>
            {[...selectedUnits].map((unit) => (
              <MenuItem key={unit}>{unit}</MenuItem>
            ))}
          </Menu>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="subtitle1" gutterBottom>
        Subject: {Subject}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
        Year: {year}, Semester: {semester}, Test: {testName}, TestDate:{" "}
          {testDate}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Syllabus:{syllabus} 
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
      </Typography>
      </div>

      {/* Unit and Chapter Filters */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel>Unit</InputLabel>
          <Select value={selectedUnit} onChange={handleUnitChange} label="Unit">
            {unitsList.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel>Chapter</InputLabel>
          <Select
            value={selectedChapter}
            onChange={handleChapterChange}
            label="Chapter"
          >
            {chaptersList.map((chapter) => (
              <MenuItem key={chapter} value={chapter}>
                {chapter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Total Marks: {totalMarks}
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Unit</TableCell>
              <TableCell>Chapter</TableCell>
              <TableCell>
                Question
                <IconButton onClick={handleSortByName}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Revised Marks</TableCell>
              <TableCell>Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestions.map((question) => (
              <TableRow key={question.id}>
                <TableCell>{question.unit}</TableCell>
                <TableCell>{question.chapter}</TableCell>
                <TableCell>{question.text}</TableCell>
                <TableCell>{question.difficulty}</TableCell>
                <TableCell>{question.marks}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={updatedMarks[question.id] || question.marks}
                    onChange={(e) => handleUpdatedMarksChange(question.id, e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={selectedQuestions.some((q) => q.id === question.id)}
                    onChange={() => handleCheckboxChange(question)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button variant="contained" color="primary" disabled={selectedQuestions.length === 0}
        onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Paper>
  );
};


export default ManualEntry;