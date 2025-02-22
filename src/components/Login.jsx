import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [errors, setErrors] = useState({});
  const [captchaError, setCaptchaError] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const userTypes = [
    "INSTITUTE ADMIN",
    "EXAMINER",
    "CHIEF_EXAMINER",
    "VIEW ALL",
    "STUDENT",
  ];

  const handleCaptchaInputChange = (e) => {
    const value = e.target.value;
    setCaptchaInput(value);

    if (value !== captcha.slice(0, value.length)) {
      setErrors((prev) => ({ ...prev, captcha: "Invalid partial match" }));
    } else {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors.captcha;
        return updatedErrors;
      });
    }
  };

  function generateCaptcha() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
  }

  const handleCaptchaRefresh = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setErrors({});
    setCaptchaError("");
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters.");
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!userId) {
      setUserIdError("User ID is required.");
      setLoading(false);
      return;
    }

    if (!password) {
      setPasswordError("Password is required.");
      setLoading(false);
      return;
    }

    if (captchaInput !== captcha) {
      setCaptchaError("Captcha does not match.");
      setLoading(false);
      return;
    }

    // Prepare data for the backend
    const loginData = {
      userType,
      userId,
      password,
    };

    try {
      // Send data to the backend
      const response = await fetch("https://9e18df9f-9671-46b7-84f8-6bded8d68eb3.mock.pstmn.io//api/login", {
        method: "POST",
        headers: {
         "X-API-Key": "PMAK-6769064d4ea4830001bdc30f-c330ce1d57b18de8c39a16e6e8b09e7bd6",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Login Successful!");
         // Redirect based on userType
      switch (userType) {
        case "INSTITUTE ADMIN":
          navigate("/institute-admin-dashboard", { state: { userId } });
          break;
        case "EXAMINER":
          navigate("/examiner-dashboard", { state: { userId } });
          break;
        case "CHIEF EXAMINER":
          navigate("/chief-examiner", { state: { userId } });
          break;
        case "VIEW ALL":
          navigate("/view-all", { state: { userId } });
          break;
        case "STUDENT":
          navigate("/student-dashboard", { state: { userId } });
          break;
        default:
          navigate("/dashboard"); // Fallback route
      }
        
      } else {
        // Handle backend errors
        alert(result.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-field">
          <label>User Type</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="">Select User Type</option>
            {userTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              if (!e.target.value) {
                setUserIdError("User ID is required.");
              } else {
                setUserIdError("");
              }
            }}
            className={userIdError ? "error" : ""}
            required
          />
          {userIdError && <div className="error-message">{userIdError}</div>}
        </div>

        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              const passwordErrors = validatePassword(e.target.value);
              if (passwordErrors.length > 0) {
                setPasswordError(passwordErrors.join("\n"));
              } else {
                setPasswordError("");
              }
            }}
            className={passwordError ? "error" : ""}
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
        </div>

        <div className="form-field">
          <div>
            <label htmlFor="captchaInput" className="captcha-label">
              <i>{captcha}</i>
            </label>
          </div>

          <div className="cap-class">
            <input
              id="captchaInput"
              type="text"
              name="captchaInput"
              value={captchaInput || ""}
              onChange={handleCaptchaInputChange}
              required
              placeholder="Enter the verification code"
              className={
                errors.captcha ? "input-error" : captchaInput === captcha ? "input-success" : ""
              }
            />
            {errors.captcha && <span className="error-message">{errors.captcha}</span>}
            <button type="button" onClick={handleCaptchaRefresh}>
              Refresh
            </button>
          </div>
        </div>
        <div id="btn-for-submit">
          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Submit"}
          </button>
        </div>
      </form>
      <div className="sign-in">
        <button className="sign-btn" onClick={() => navigate("/signup")}>
          New User Signup
        </button>
        <button className="sign-btn2" onClick={() => navigate("/forgot-password")}>
          Forgot Password
        </button>
      </div>
    </div>
  );
};

export default Login;
