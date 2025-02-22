import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateTestAnswer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userid } = location.state || {};

  const [instituteName, setInstituteName] = useState("");
  const [mappedModules, setMappedModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch institute and mapped modules on component mount
  useEffect(() => {
    const fetchInstituteData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/iadmininstitute/${userid}`);
        const data = await response.json();

        if (data.success) {
          setInstituteName(data.instituteName);
          setMappedModules(data.mappedModules || []);
        } else {
          alert(data.message || "Failed to fetch institute data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userid) fetchInstituteData();
  }, [userid]);

  // Fetch tests based on selected module
  useEffect(() => {
    const fetchTests = async () => {
      if (!selectedModule) return; // Skip if no module is selected

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/get_tests_by_module/${selectedModule}`);
        const data = await response.json();

        if (data.success) {
          setTests(data.tests || []);
        } else {
          alert(data.message || "Failed to fetch tests.");
        }
      } catch (err) {
        console.error("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [selectedModule]);

  // Handle navigation to another component
  const handleNavigate = (e) => {
    e.preventDefault();

    const formData = {
      moduleId: selectedModule,
      testId: selectedTest,
      UserId:userid,
    };

    // Navigate to another component with state
    navigate("/answers", { state: formData });
  };

  return (
    <div className="dashboard-container">
      <h2><b>Update Test Answer</b></h2>

      <div className="institute-info">
        <h2>Institute: {instituteName || "Loading..."}</h2>
      </div>

      <form onSubmit={handleNavigate} className="form-container">
        {/* Mapped Modules */}
        <div className="form-field">
          <label htmlFor="mappedModules">Mapped Modules</label>
          <select
            id="mappedModules"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            required
          >
            <option value="" disabled>Select a module</option>
            {mappedModules.map((module) => (
              <option key={module.id} value={module.id}>
              {module.id}-{module.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tests */}
        <div className="form-field">
          <label htmlFor="tests">Test (TestID - TestName)</label>
          <select
            id="tests"
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            required
            disabled={!tests.length} // Disable if no tests available
          >
            <option value="" disabled>Select a test</option>
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.id} - {test.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" disabled={loading || !selectedTest}>
            {loading ? "Processing..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTestAnswer;
