import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem } from "@mui/material";

const EditQuestionFormDialog = ({ open, onClose, question, testId, onSave, usetId }) => {
  const [editedQuestion, setEditedQuestion] = useState({ ...question });
  const [previousQuestionNo, setPreviousQuestionNo] = useState(question.questionNo);

  useEffect(() => {
    if (open && question.questionNo) {
      // Fetch details from the backend
      fetch(`http://localhost:5000/api/questions/${testId}/${question.questionNo}`)
        .then((response) => response.json())
        .then((data) => setEditedQuestion(data))
        .catch((error) => console.error("Error fetching question:", error));
    }
  }, [open, question, testId]);

  const handleInputChange = (field, value) => {
    setEditedQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Prepare the payload
    const payload = {
      ...editedQuestion,
      previousQuestionNo,
    };

    // Send update request to the backend
    fetch(`http://localhost:5000/api/questions/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update question");
        return response.json();
      })
      .then(() => {
        alert("Question updated successfully!");
        onSave(editedQuestion);
      })
      .catch((error) => {
        console.error("Error updating question:", error);
        alert("Failed to update question.");
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Question</DialogTitle>
      <DialogContent>
        <TextField
          label="Question No"
          value={editedQuestion.questionNo}
          onChange={(e) => handleInputChange("questionNo", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unit"
          value={editedQuestion.unit}
          onChange={(e) => handleInputChange("unit", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Chapter Name"
          value={editedQuestion.chapterName}
          onChange={(e) => handleInputChange("chapterName", e.target.value)}
          fullWidth
          margin="normal"
        />
        <Select
          label="Difficulty Level"
          value={editedQuestion.difficulty}
          onChange={(e) => handleInputChange("difficulty", e.target.value)}
          fullWidth
          margin="normal"
        >
          {[...Array(10).keys()].map((val) => (
            <MenuItem key={val + 1} value={val + 1}>
              {val + 1}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Marks"
          value={editedQuestion.marks}
          onChange={(e) => handleInputChange("marks", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Question"
          value={editedQuestion.questionField}
          onChange={(e) => handleInputChange("questionField", e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditQuestionFormDialog;
