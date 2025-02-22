import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

const DeleteConfirmationDialog = ({ open, onClose, testId, questionNo, onDeleteSuccess }) => {
  const [questionDetails, setQuestionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      // Fetch question details when the dialog opens
      const fetchQuestionDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `http://localhost:5000/api/question-details?testId=${testId}&qnum=${questionNo}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch question details");
          }
          const data = await response.json();
          setQuestionDetails(data);
        } catch (err) {
          setError("Error fetching question details.");
        } finally {
          setLoading(false);
        }
      };

      fetchQuestionDetails();
    }
  }, [open, testId, questionNo]);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/questions?testId=${testId}&qnum=${questionNo}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      alert("Question deleted successfully!");
      onDeleteSuccess(questionNo); // Notify parent to update the table
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question. Please try again.");
    } finally {
      setLoading(false);
      onClose(); // Close the dialog
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : questionDetails ? (
          <div>
            <TextField
              label="Question No"
              value={questionDetails.questionNo}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Unit"
              value={questionDetails.unit}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Chapter Name"
              value={questionDetails.chapterName}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Difficulty"
              value={questionDetails.difficulty}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Marks"
              value={questionDetails.marks}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Question"
              value={questionDetails.questionField}
              InputProps={{ readOnly: true }}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
          </div>
        ) : (
          <p>No data found for this question.</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="primary"
          disabled={loading || error}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
