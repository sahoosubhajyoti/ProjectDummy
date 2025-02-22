import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./../../styles/testPage.css";

function TestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { testId,userid } = location.state || {}; // Get test ID from navigation
  const API_BASE = 'https://56494fcd-4ee7-48ce-9972-f457071b0d3f.mock.pstmn.io';

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState({});
  const [timer, setTimer] = useState(3600); // 1-hour test (3600 sec)
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch questions from the backend
    fetch(`${API_BASE}/api/test/${testId}/questions`)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.questions);
        console.log(data);
        const initialVisited = {};
        data.forEach((_, index) => (initialVisited[index] = "green")); // Default all as green
        setVisited(initialVisited);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, [testId]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Save progress every 10 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        saveAnswers();
      }
    }, 10000);

    return () => clearInterval(saveInterval);
  }, [answers]);

  // Warn the user before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "You have unsaved changes!";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleAnswerChange = (event) => {
    setAnswers({ ...answers, [currentQuestionIndex]: event.target.value });

    // Mark question as answered (Blue)
    setVisited((prev) => ({
      ...prev,
      [currentQuestionIndex]: "blue",
    }));
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    setVisited((prev) => ({
      ...prev,
      [index]: prev[index] === "blue" ? "blue" : "red",
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      handleQuestionClick(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionClick(currentQuestionIndex - 1);
    }
  };

  // Save answers to backend
  const saveAnswers = () => {
    fetch(`http://localhost:5000/api/test/${testId}/save-progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Progress saved:", data))
      .catch((error) => console.error("Error saving progress:", error));
  };

  // Submit the test
  const handleSubmit = () => {
    setIsSubmitting(true);
    fetch(`http://localhost:5000/api/test/${testId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Test submitted successfully!");
        navigate("/dashboard");
      })
      .catch((error) => console.error("Error submitting test:", error))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="test-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Time Left</h3>
        <div className="timer">
          {new Date(timer * 1000).toISOString().substr(11, 8)}
        </div>
        <h3>Questions</h3>
        <div className="question-list">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(index)}
              className={`question-btn ${visited[index]}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Section */}
      <div className="main-section">
        {questions.length > 0 ? (
          <>
            <h2>Question {currentQuestionIndex + 1}</h2>
            <p>{questions[currentQuestionIndex].text}</p>
            <textarea
              value={answers[currentQuestionIndex] || ""}
              onChange={handleAnswerChange}
              placeholder="Type your answer here..."
            />
            <div className="navigation-buttons">
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                Next
              </button>
            </div>
            <button className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </button>
          </>
        ) : (
          <p>Loading questions...</p>
        )}
      </div>
    </div>
  );
}

export default TestPage;
