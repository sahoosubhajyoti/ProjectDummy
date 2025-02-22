import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography
} from "@mui/material";

const QuestionFormDialog = ({
  open,
  onClose,
  question,
  onSave,
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
}) => {
  const [questionField, setQuestionField] = useState("");

  // Reset questionField to blank when the dialog opens
  useEffect(() => {
    if (open) {
      setQuestionField(question.questionField || ""); // Reset field or use existing value for edit
    }
  }, [open, question]);

  const handleSave = async () => {
    // Prepare the data to be sent to the backend
    const dataToSend = {
      userId,
      testId,
      moduleName,
      stream,
      year,
      semester,
      subject,
      syllabus,
      testName,
      testDate, // Include testId
      serialNo: question.serialNo,
      questionNo: question.questionNo,
      chapterName: question.chapterName,
      difficulty: question.difficulty,
      marks: question.marks,
      questionField,
    };

    // Log the data for debugging purposes
    console.log("Data to send to server:", dataToSend);

    try {
      const response = await fetch("http://localhost:5000/api/add_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to save question");
      }

      // Notify parent component
      onSave(question.serialNo, questionField);
      alert("Question added successfully!");

      // Automatically close the dialog
      onClose();
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter Question Details</DialogTitle>
      <DialogContent>
        <div>
          <TextField
            label="Question No"
            value={question.questionNo}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Unit"
            value={question.unit}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Chapter Name"
            value={question.chapterName}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Difficulty"
            value={question.difficulty}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Marks"
            value={question.marks}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />
          <pre><TextField
            label="Question"
            value={questionField}
            onChange={(e) => setQuestionField(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          /></pre>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionFormDialog;
