import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import QuestionFormDialog from "./QuestionFormDialog";
import EditQuestionFormDialog from "./EditQuestionFormDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const Question = () => {
  const location = useLocation();
  const {
    moduleId,
    testId,
    userId,
    moduleName,
    stream,
    year,
    semester,
    subject,
    syllabus,
    testName,
    testDate,
  } = location.state || {};

  const [isUpdated, setIsUpdated] = useState(false); // Add new state

  const [questions, setQuestions] = useState([]);
  const [totalMarks, setTotalMarks] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestionNo, setSelectedQuestionNo] = useState(null);
  const [loading, setLoading] = useState(true);

  const sumOfMarks = questions.reduce(
    (acc, q) => acc + Number(q.marks || 0),
    0
  );
  const totalMarksNum = Number(totalMarks) || 0;
  const isTotalReached = totalMarksNum > 0 && sumOfMarks >= totalMarksNum;

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/examiner_show_questions?userId=${userId}&testId=${testId}&moduleId=${moduleId}`
      );
      if (!response.ok) throw new Error("Failed to fetch questions");

      const data = await response.json();
      // Updated backend response handling
      const questionsData = data.questions || [];
      setIsUpdated(data.updated || false);

      const updatedQuestions = questionsData.map((q, index) => ({
        serialNo: index + 1,
        questionNo: q.questionNo,
        unit: q.unit,
        chapterName: q.chapterName,
        difficulty: q.difficulty,
        marks: q.marks,
        questionField: q.questionField || "",
      }));

      setQuestions(questionsData.length > 0 ? updatedQuestions : []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [moduleId, testId, userId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // ... other functions remain same until handleSubmit

  const handleInputChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, qIndex) => (qIndex === index ? { ...q, [field]: value } : q))
    );
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        serialNo: prev.length + 1,
        questionNo: "",
        unit: "",
        chapterName: "",
        difficulty: 1,
        marks: "",
        questionField: "",
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/submit_questions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            testId,
            moduleId,
            totalMarks: totalMarksNum,
            questions: questions.map((q) => ({
              // ... existing question data
            })),
          }),
        }
      );

      if (!response.ok) throw new Error("Submission failed");
      const result = await response.json();
      setIsUpdated(result.updated || false); // Update based on backend response
      alert("Questions submitted successfully!");
      await fetchQuestions(); // Refetch data to get latest status
    } catch (error) {
      console.error("Error submitting questions:", error);
      alert("Failed to submit questions. Please try again.");
    }
  };

  const handleDownloadSyllabus = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/download-syllabus/${syllabus}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth if needed
          },
        }
      );

      if (!response.ok) throw new Error("Failed to download syllabus");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Open in new window
      const newWindow = window.open(url, "_blank");
      if (!newWindow) {
        alert("Please allow pop-ups for this site to view the syllabus");
      }

      // Clean up memory after window is closed
      newWindow?.addEventListener("beforeunload", () => {
        window.URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error downloading syllabus:", error);
      alert("Failed to download syllabus. Please try again.");
    }
  };

  const handleOpenDialog = (qIndex) => {
    setCurrentQuestion(questions[qIndex]);
    setDialogOpen(true);
  };

  const handleSaveQuestion = (serialNo, questionField) => {
    setQuestions((prev) =>
      prev.map((q) => (q.serialNo === serialNo ? { ...q, questionField } : q))
    );
    setDialogOpen(false);
  };

  const handleOpenEditDialog = (qIndex) => {
    setCurrentQuestion(questions[qIndex]);
    setEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (qIndex) => {
    const question = questions[qIndex];
    setSelectedQuestionNo(question.questionNo); // Store the questionNo
    setDeleteDialogOpen(true); // Open the delete dialog
  };

  const handleDeleteSuccess = (deletedQuestionNo) => {
    setQuestions((prev) =>
      prev
        .filter((q) => q.questionNo !== deletedQuestionNo)
        .map((q, index) => ({ ...q, serialNo: index + 1 }))
    );
    setDeleteDialogOpen(false); // Close the dialog after success
  };

  return (
    <div className="dashboard-container">
      <div
        className="upper-content"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          <h2>
            Module: {moduleName}, Stream: {stream}
          </h2>
          <h2>
            Subject: {subject},
          </h2>
          </div>
          <div>
            <h2>
              Year: {year}, Semester: {semester}, Test: {testName}, TestDate:{" "}
              {testDate}
            </h2>
          </div>
          
        
        <div>
          <h2>
            Syllabus:{syllabus}
            {syllabus ? (
              <a
                href="#"
                onClick={handleDownloadSyllabus}
                style={{ cursor: "pointer", color: "blue" }}
              >
                Download
              </a>
            ) : (
              <span>No syllabus available</span>
            )}
          </h2>
        </div>
      </div>
      <div style={{ margin: "16px 0" }}>
        <TextField
          label="Total Marks"
          value={totalMarks}
          onChange={(e) => setTotalMarks(e.target.value)}
          type="number"
          inputProps={{ min: 0 }}
          style={{ marginRight: "16px" }}
          disabled={isUpdated} // Disable when updated
        />
        <span>
          Current Total: {sumOfMarks} / {totalMarksNum}
        </span>
      </div>

      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sl No</TableCell>
                <TableCell>Question No</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Chapter Name</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question, qIndex) => (
                <TableRow key={qIndex}>
                  <TableCell>{question.serialNo}</TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      value={question.questionNo}
                      onChange={(e) =>
                        handleInputChange(qIndex, "questionNo", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell style={{ width: "10%" }}>
                    <TextField
                      variant="outlined"
                      value={question.unit}
                      onChange={(e) =>
                        handleInputChange(qIndex, "unit", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell style={{ width: "75%" }}>
                    <TextField
                      variant="outlined"
                      value={question.chapterName}
                      onChange={(e) =>
                        handleInputChange(qIndex, "chapterName", e.target.value)
                      }
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={question.difficulty}
                      onChange={(e) =>
                        handleInputChange(qIndex, "difficulty", e.target.value)
                      }
                      size="small"
                    >
                      {[...Array(10).keys()].map((val) => (
                        <MenuItem key={val + 1} value={val + 1}>
                          {val + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell style={{ width: "25%" }}>
                    <TextField
                      variant="outlined"
                      type="text"
                      value={question.marks}
                      onChange={(e) =>
                        handleInputChange(qIndex, "marks", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenDialog(qIndex)}
                      disabled={!!question.questionField}
                      style={{
                        backgroundColor: question.questionField
                          ? "lightgreen"
                          : "pink",
                      }}
                      size="small"
                    >
                      Question
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={
                        !question.questionField || isTotalReached || isUpdated
                      }
                      onClick={() => handleOpenEditDialog(qIndex)}
                      size="small"
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={
                        !question.questionField || isTotalReached || isUpdated
                      }
                      onClick={() => handleOpenDeleteDialog(qIndex)}
                      size="small"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <div style={{ margin: "16px 0" }}>
        <Button
          variant="outlined"
          onClick={handleAddQuestion}
          size="small"
          disabled={isTotalReached || isUpdated}
        >
          + Add Question
        </Button>
        {isTotalReached && !isUpdated && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginLeft: "16px" }}
          >
            Finalize For Test
          </Button>
        )}
      </div>
      {currentQuestion && (
        <QuestionFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          question={currentQuestion}
          onSave={handleSaveQuestion}
          testId={testId}
          userId={userId}
          moduleName={moduleName}
          stream={stream}
          year={year}
          semester={semester}
          subject={subject}
          syllabus={syllabus}
        />
      )}

      {currentQuestion && (
        <EditQuestionFormDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          question={currentQuestion}
          testId={testId}
          userId={userId}
          onSave={(updatedQuestion) => {
            setQuestions((prev) =>
              prev.map((q) =>
                q.serialNo === updatedQuestion.serialNo ? updatedQuestion : q
              )
            );
            setEditDialogOpen(false);
          }}
        />
      )}

      {deleteDialogOpen && selectedQuestionNo && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          testId={testId}
          userId={userId}
          questionNo={selectedQuestionNo}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Question;
