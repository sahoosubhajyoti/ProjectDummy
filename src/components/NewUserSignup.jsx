import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/newuser.css";

const NewUserSignup = () => {
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({});
  const [institutes, setInstitutes] = useState([]);
  const [centers, setCenters] = useState([]);
  const [modules, setModules] = useState([]);
  const [streams, setStreams] = useState([]);
  const [errors, setErrors] = useState({});
  const [captchaError, setCaptchaError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});

  const [userTypes, setUserTypes] = useState([]); // Ensure it's an empty array

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

  // Fetch institutes on component mount
  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/register/api/user-types"
        );
        if (!response.ok) throw new Error("Failed to fetch user types");

        const data = await response.json();
        console.log("Fetched user types:", data); // Debugging

        if (data.success && Array.isArray(data.userTypes)) {
          setUserTypes(data.userTypes); // Set array directly
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching user types:", error);
        setErrors((prev) => ({ ...prev, userTypes: error.message }));
      } finally {
        setLoading(false);
      }
    };
    fetchUserTypes();

    const fetchInstitutes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/register/api/institutes"
        );
        if (!response.ok) throw new Error("Failed to fetch institutes");
        const data = await response.json();
        setInstitutes(data.institutes);
        console.log(data);
      } catch (error) {
        console.error("Error fetching institutes:", error);
        setErrors((prev) => ({ ...prev, institutes: error.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, []);

  // Fetch modules when an institute is selected
  // Fetch modules and center when an institute is selected
  const handleInstituteChange = async (e) => {
    const selectedInstitute = e.target.value;
    setFormData({ ...formData, institute: selectedInstitute, center: "" });
    setErrors({ ...errors, institute: "", center: "" });
    setCenters([]);
    setModules([]);

    try {
      setLoading(true);

      // Fetch Modules and Centers in Parallel
      const [modulesResponse, centersResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/register/api/modules/${selectedInstitute}`),
        fetch(`http://localhost:5000/api/register/api/centers/${selectedInstitute}`),
      ]);

      if (!modulesResponse.ok) throw new Error("Failed to fetch modules");
      if (!centersResponse.ok) throw new Error("Failed to fetch centers");

      const modulesData = await modulesResponse.json();
      const centersData = await centersResponse.json();
      console.log(centersData);

      setModules(modulesData.modules);
      setCenters(centersData.centers);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        modules: error.message,
        centers: error.message,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch streams when a module is selected
  const handleModuleChange = async (e) => {
    const selectedModule = e.target.value;
    const selectedInstitute = formData.institute;
    setFormData({ ...formData, module: selectedModule, stream: "" });
    setErrors({ ...errors, module: "" });
    setStreams([]);

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/register/api/streams/${selectedModule}/${selectedInstitute}`
      );
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      setStreams([{ id: "All", name: "All" }, ...data.streams]);
      console.log(data);
    } catch (error) {
      setErrors((prev) => ({ ...prev, streams: error.message }));
    } finally {
      setLoading(false);
    }
  };

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
    if (!formData.module) {
      newErrors.modules = "At least one module must be selected.";
    }
    if (!formData.center) newErrors.center = "Center is required.";

    // User type validation
    if (!formData.userType) {
      newErrors.userType = "User Type is required.";
    }
    if (!formData.First_Name) newErrors.firstName = "First Name is required.";
    if (!formData.Last_Name) newErrors.lastName = "Last Name is required.";
    if (!formData.DOB) newErrors.dob = "Date of Birth is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    // Modules validation
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
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
    console.log(formData);
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/register/api/register-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup error:", errorData);
        alert(`Signup request failed: ${errorData.message || "Unknown error"}`);
        return;
      }

      const result = await response.json();
      alert(`Signup successful!`);
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
            <label htmlFor="institute">Institute</label>
            <select
              id="institute"
              name="institute"
              value={formData.institute || ""}
              onChange={handleInstituteChange}
            >
              <option value="">Select Institute</option>
              {institutes.map((inst) => (
                <option
                  key={inst.id}
                  value={inst.id}
                >{`${inst.id} - ${inst.name}`}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="center">Center</label>
            <select
            id="center"
            name="center"
            value={formData.center || ""}
            onChange={(e) => {
              setFormData({ ...formData, center: e.target.value });
            }}
            disabled={!formData.institute} // Ensure a valid institute is selected first
          >
            <option value="">Select Center</option>
            {centers.map((center, index) => (
              <option key={index} value={center.name}>
                {`${center.name} (${center.type})`} {/* Display name & type */}
              </option>
            ))}
          </select>          
          </div>

          <div>
            <label htmlFor="module">Course</label>
            <select
              id="module"
              name="module"
              value={formData.module || ""}
              onChange={handleModuleChange}
              disabled={!formData.institute}
            >
              <option value="">Select Course</option>
              {modules.map((mod) => (
                <option
                  key={mod.id}
                  value={mod.id}
                >{`${mod.id} - ${mod.name}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stream">Stream</label>
            <select
              id="stream"
              name="stream"
              value={formData.stream || ""}
              onChange={handleChange}
              disabled={!formData.module}
            >
              <option value="">Select Stream</option>
              {streams.map((stream) => (
                <option
                  key={stream.id}
                  value={stream.id}
                >{`${stream.id} - ${stream.name}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="userType">User Type</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType || ""}
              onChange={handleChange}
              className={errors.userType ? "error" : ""}
            >
              <option value="">Select User Type</option>
              {userTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.userType && (
              <span className="error-message">{errors.userType}</span>
            )}
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

          {/* <div>
            <label htmlFor="mobileNumber">Mobile Number</label>
            <div className="mobile-number-container">
              <select
                name="countryCode"
                value={formData.countryCode || ""}
                onChange={handleChange}
                className={errors.countryCode ? "error" : ""}
              >
                <option value="">Select Country Code</option>
                {countryCodes.map(({ code, country }) => (
                  <option key={code} value={code}>
                    {country} ({code})
                  </option>
                ))}
              </select>
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
            {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
          </div> */}

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
export default NewUserSignup;
