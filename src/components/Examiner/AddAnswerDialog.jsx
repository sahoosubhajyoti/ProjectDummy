import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const AddAnswerDialog = ({ open, onClose, testId, questionNo, userId, onAnswerAdded }) => {
  const [question, setQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/get_question?testId=${testId}&questionNo=${questionNo}`
        );
        const data = await response.json();
        setQuestion(data.questionText || "Question not found.");
      } catch (error) {
        console.error("Error fetching question:", error);
        setQuestion("Error loading question.");
      }
    };

    fetchQuestion();
  }, [testId, questionNo]);

  const handleSubmit = () => {
    if (answerText.split(" ").length < 300) {
      alert("Answer must be at least 300 words.");
      return;
    }

    onAnswerAdded({ AnswerNo: Date.now(), AnswerField: answerText });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Answer the Question</DialogTitle>
      <DialogContent>
        <p><strong>Question:</strong> {question}</p>
        <TextField
          multiline
          fullWidth
          minRows={6}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Write your answer here (min 300 words)..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAnswerDialog;
