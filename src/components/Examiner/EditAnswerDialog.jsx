import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const EditAnswerDialog = ({ open, onClose, answer, testId, questionNo, onSave }) => {
  const [updatedAnswer, setUpdatedAnswer] = useState(answer.AnswerField || "");

  const handleSave = async () => {
    if (!updatedAnswer.trim()) {
      alert("Answer cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/update_answer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId,
          questionNo,
          AnswerNo: answer.AnswerNo,
          AnswerField: updatedAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update answer");
      }

      const data = await response.json();
      onSave(data); // Update the parent state with new answer
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Error updating answer:", error);
      alert("Failed to update answer.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Answer</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          fullWidth
          minRows={6}
          value={updatedAnswer}
          onChange={(e) => setUpdatedAnswer(e.target.value)}
          placeholder="Update your answer here..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAnswerDialog;
