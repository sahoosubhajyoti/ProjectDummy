
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/newuser.css";



const PortalAdminSignup = () => {
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [captchaError, setCaptchaError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

 
  const countryCodes = [
    { code: "+1", country: "United States" },
    { code: "+44", country: "United Kingdom" },
    { code: "+91", country: "India" },
    { code: "+61", country: "Australia" },
    { code: "+81", country: "Japan" },
  ];

  const passwordHintQuestions = [
    "What is your pet's name?",
    "What is your mother's name?",
    "What is the name of your first school?",
    "What is your favorite movie?",
    "What is your favorite color?",
  ];

  useEffect(() => {
    const validateAdminPassword = async () => {
      const enteredPassword = prompt("Enter Admin Password");
  
      if (!enteredPassword) {
        alert("No password entered! Redirecting...");
        navigate(-1);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5000/api/validate-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: enteredPassword }),
        });
  
        const data = await response.json();
  
        if (data.valid) {
          setAuthenticated(true);
          setCaptcha(generateCaptcha());
        } else {
          alert("Incorrect Password! Redirecting...");
          navigate(-1);
        }
      } catch (error) {
        console.error("Error validating password:", error);
        alert("Server error! Please try again later.");
        navigate(-1);
      }
    };
  
    validateAdminPassword();
  }, [navigate]);
  

  if (!authenticated) return null;
  
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
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
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
    const lengthCheck = /.{8,}/;
    const uppercaseCheck = /[A-Z]/;
    const lowercaseCheck = /[a-z]/;
    const numberCheck = /[0-9]/;
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/;

    if (!lengthCheck.test(password)) {
      return "Password must be at least 8 characters long.";
    }
    if (
      !uppercaseCheck.test(password) ||
      !lowercaseCheck.test(password) ||
      !numberCheck.test(password) ||
      !specialCharCheck.test(password)
    ) {
      return "Password must include uppercase, lowercase, a number, and a special character.";
    }

    const charCount = {};
    for (const char of password) {
      charCount[char] = (charCount[char] || 0) + 1;
      if (charCount[char] > 3) {
        return "Password cannot have more than 3 repeating characters.";
      }
    }

    let consecutiveCount = 1;
    for (let i = 1; i < password.length; i++) {
      const prevCharCode = password.charCodeAt(i - 1);
      const currCharCode = password.charCodeAt(i);
      if (Math.abs(currCharCode - prevCharCode) === 1) {
        consecutiveCount++;
        if (consecutiveCount > 4) {
          return "Password cannot have more than 4 consecutive characters.";
        }
      } else {
        consecutiveCount = 1;
      }
    }
    return ""; // No errors
  };

  const validateForm = () => {
    const newErrors = {};

    // Institute validation
    if (!formData.institute) {
      newErrors.institute = "Institute is required.";
    }

    // Modules validation (at least one module must be selected)
    if (!formData.modules || formData.modules.length === 0) {
      newErrors.modules = "At least one module must be selected.";
    }

    // User type validation
    if (!formData.userType) {
      newErrors.userType = "User Type is required.";
    }
    if (!formData.First_Name) newErrors.firstName = "First Name is required.";
    if (!formData.Last_Name) newErrors.lastName = "Last Name is required.";
    if (!formData.DOB) newErrors.dob = "Date of Birth is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    // Modules validation
    if (
      !formData.modules &&
      formData.userType !== "ADMIN" &&
      formData.userType !== "VIEWALL"
    ) {
      newErrors.modules = "At least one module must be selected.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.mobileNumber)
      newErrors.mobileNumber = "Mobile Number is required.";
    else if (!/^\d{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Mobile Number must be 10 digits.";
    if (!formData.passwordHintQuestion)
      newErrors.passwordHintQuestion = "Password Hint Question is required.";
    if (!formData.passwordHintAnswer)
      newErrors.passwordHintAnswer = "Password Hint Answer is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.userType) newErrors.userType = "User Type is required.";

    setErrors(newErrors);
    console.log(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("yes cum in");
      return;
    }
    console.log(formData);

    if (captchaInput !== captcha) {
      setCaptchaError("Incorrect Captcha");
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      return;
    } else {
      setCaptchaError("");
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Signup request failed: ${errorData.error || "Unknown error"}`);
        return;
      }

      const result = await response.json();
      alert(`Signup successful! Your UID: ${result.UID}`);
      navigate("/login");
    } catch (err) {
      console.error("Network error:", err);
      alert("A network error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
    
  };
  return (
    <div className="form-container">
      <h2>New User Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="fields-grid">
          <div>
            <label htmlFor="userType">User Type</label>
            <text
              id="userType"
              name="userType"
              value="PortalAdmin"
              disabled
            />
            
          </div>

          {[
            { label: "First Name", name: "First_Name", type: "text" },
            { label: "Last Name", name: "Last_Name", type: "text" },
            { label: "Date of Birth", name: "DOB", type: "date" },
            { label: "Email", name: "email", type: "email" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className={errors[name] ? "error" : ""}
              />
              {errors[name] && (
                <span className="error-message">{errors[name]}</span>
              )}
            </div>
          ))}

          <div>
            {/* Label for mobile number */}
            <label htmlFor="mobileNumber">Mobile Number</label>

            <div className="mobile-number-container">
              {/* Accessible label for country code */}
              <label htmlFor="countryCode" className="sr-only"></label>
              <select
                id="countryCode"
                name="countryCode"
                value={formData.countryCode || ""}
                onChange={handleChange}
                className={errors.countryCode ? "error" : ""}
                title="Select your country code"
              >
                <option value="">Select Country Code</option>
                {countryCodes.map(({ code, country }) => (
                  <option key={code} value={code}>
                    {country} ({code})
                  </option>
                ))}
              </select>

              {/* Mobile number input */}
              <input
                id="mobileNumber"
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber || ""}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                className={errors.mobileNumber ? "error" : ""}
              />
            </div>

            {/* Error message */}
            {errors.mobileNumber && (
              <span className="error-message">{errors.mobileNumber}</span>
            )}
          </div>


          <div>
            <label htmlFor="passwordHintQuestion">Password Hint Question</label>
            <select
              id="passwordHintQuestion"
              name="passwordHintQuestion"
              value={formData.passwordHintQuestion || ""}
              onChange={handleChange}
              className={errors.passwordHintQuestion ? "error" : ""}
            >
              <option value="">Select Question</option>
              {passwordHintQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
            {errors.passwordHintQuestion && (
              <span className="error-message">
                {errors.passwordHintQuestion}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="passwordHintAnswer">Password Hint Answer</label>
            <input
              type="text"
              id="passwordHintAnswer"
              name="passwordHintAnswer"
              value={formData.passwordHintAnswer || ""}
              onChange={handleChange}
              className={errors.passwordHintAnswer ? "error" : ""}
            />
            {errors.passwordHintAnswer && (
              <span className="error-message">{errors.passwordHintAnswer}</span>
            )}
          </div>

          {[
            { label: "Password", name: "password", type: "password" },
            {
              label: "Confirm Password",
              name: "confirmPassword",
              type: "password",
            },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className={errors[name] ? "error" : ""}
              />
              {errors[name] && (
                <span className="error-message">{errors[name]}</span>
              )}
            </div>
          ))}

          <div className="captcha-container">
            <div>
              <label htmlFor="captchaInput" className="captcha-label">
                <i>{captcha}</i>
              </label>
            </div>

            <div id="cap-class-2">
              <input
                id="captchaInput"
                type="text"
                name="captchaInput"
                value={captchaInput || ""}
                onChange={handleCaptchaInputChange}
                required
                placeholder="Enter the verification code"
                className={
                  errors.captcha
                    ? "input-error"
                    : captchaInput === captcha
                    ? "input-success"
                    : ""
                }
              />
              {errors.captcha && (
                <span className="error-message">{errors.captcha}</span>
              )}
              <button type="button" onClick={handleCaptchaRefresh}>
                Refresh
              </button>
            </div>
          </div>
        </div>
        <div className="btn-sub">
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default PortalAdminSignup;
