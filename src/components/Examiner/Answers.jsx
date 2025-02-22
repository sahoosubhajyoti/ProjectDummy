import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import AddAnswerDialog from "./AddAnswerDialog";
import EditAnswerDialog from "./EditAnswerDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const Answers = () => {
  const location = useLocation();
  const { QuestionNo, testId, userId } = location.state || {};

  const [answers, setAnswers] = useState([]); // Stores all answers for a question
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnswerNo, setSelectedAnswerNo] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState(null);

  // ✅ Fetch answers based on testId & QuestionNo
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/examiner_show_answers?testId=${testId}&questionNo=${QuestionNo}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch answers");
        }
        const data = await response.json();
        setAnswers(data || []); // Ensure array format
      } catch (error) {
        console.error("Error fetching answers:", error);
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [testId, QuestionNo]);

  // ✅ Handle opening the Answer Dialog
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // ✅ Handle when a new answer is added
  const handleAnswerAdded = (newAnswer) => {
    setAnswers((prev) => [...prev, newAnswer]);
    setDialogOpen(false);
  };

  // ✅ Handle editing an existing answer
  const handleOpenEditDialog = (answer) => {
    setCurrentAnswer(answer);
    setEditDialogOpen(true);
  };

  // ✅ Handle deleting an answer
  const handleOpenDeleteDialog = async (answer) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
  
    try {
      const response = await fetch("http://localhost:5000/api/delete_answer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId,
          questionNo: QuestionNo,
          AnswerNo: answer.AnswerNo,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete answer");
      }
  
      setAnswers((prev) => prev.filter((q) => q.AnswerNo !== answer.AnswerNo)); // Remove answer from UI
    } catch (error) {
      console.error("Error deleting answer:", error);
      alert("Failed to delete answer.");
    }
  };
  // ✅ Handle successful answer deletion
  const handleAnswerDeleted = (deletedAnswerNo) => {
    setAnswers((prev) => prev.filter((q) => q.AnswerNo !== deletedAnswerNo));
    setDeleteDialogOpen(false);
  };

  return (
    <div className="dashboard-container">
      <h2>Test ID: {testId} | Question No: {QuestionNo}</h2>

      {loading ? (
        <p>Loading answers...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Answer No</TableCell>
                <TableCell>Answer Text</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {answers.length > 0 ? (
                answers.map((answer, index) => (
                  <TableRow key={answer.AnswerNo}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{answer.AnswerField}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenEditDialog(answer)}
                        size="small"
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenDeleteDialog(answer)}
                        size="small"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No answers added
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ✅ Answer Button - Opens AddAnswerDialog */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenDialog}
          size="large"
          disabled={answers.length >= 3} // Max 3 answers per question
        >
          Answer
        </Button>
      </div>

      {/* ✅ Add Answer Dialog */}
      {dialogOpen && (
        <AddAnswerDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          testId={testId}
          questionNo={QuestionNo}
          userId={userId}
          onAnswerAdded={handleAnswerAdded}
        />
      )}

      {/* ✅ Edit Answer Dialog */}
      {currentAnswer && (
        <EditAnswerDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          answer={currentAnswer}
          testId={testId}
          questionNo={QuestionNo}
        />
      )}

      {/* ✅ Delete Confirmation Dialog */}
      {deleteDialogOpen && selectedAnswerNo && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          testId={testId}
          AnswerNo={selectedAnswerNo}
          onDeleteSuccess={handleAnswerDeleted}
        />
      )}
    </div>
  );
};

export default Answers;
