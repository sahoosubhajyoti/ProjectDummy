import React from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {

  const navigate = useNavigate();
  const passwordHintQuestions = [
    "What is your pet's name?",
    "What is your mother's name?",
    "What is the name of your first school?",
    "What is your favorite movie?",
    "What is your favorite color?",
  ];
  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Password reset link sent!");
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <label>User ID</label>
        <input type="text" required />
        <label htmlFor="passwordHintQuestion">Password Hint Question</label>
        <select
          id="passwordHintQuestion"
          name="passwordHintQuestion"
         
          
        >
          <option value="">Select Question</option>
          {passwordHintQuestions.map((question, index) => (
            <option key={index} value={question}>
              {question}
            </option>
          ))}
        </select>
        <label>Password Hint Answer</label>
        <input type="text" required />
        <div className="btn" style={{"display":"flex","justifyContent":"space-between"}}>
        <button type="submit">Submit</button>
        <button type="button"  onClick={() => navigate("/") }>Back to Login</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
