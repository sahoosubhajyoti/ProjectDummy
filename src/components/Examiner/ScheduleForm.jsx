import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Paper, Typography, Grid } from "@mui/material";

const ScheduleForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract details manually from location.state
  const {
    TestId = "",
    testName = "",
    stream = "",
    year = "",
    semester = "",
    subject = "",
    syllabus = "",
    userid = "",
  } = location.state || {};

  const [testDate, setTestDate] = useState("");
  const [testTime, setTestTime] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [activationBeforeSchedule, setActivationBeforeSchedule] = useState("");

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/get_test_details?test_id=${TestId}`);
        const data = await response.json();
        if (response.ok) {
          setTestDate(data.test_date || "");
          setTestTime(data.test_time || "");
          setTestDuration(data.test_duration || "");
          setActivationBeforeSchedule(data.activation_before_schedule || "");
        } else {
          alert(data.message || "Failed to fetch test details.");
        }
      } catch (error) {
        console.error("Error fetching test details:", error);
        alert("Error fetching test details.");
      }
    };

    if (TestId) {
      fetchTestDetails();
    }
  }, [TestId]);

  const handleScheduleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/schedule_test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test_id: TestId,
          test_date: testDate,
          test_time: testTime,
          test_duration: testDuration,
          activation_before_schedule: activationBeforeSchedule,
          userid,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Test scheduled successfully!");
        navigate("/schedule-test"); // Redirect back
      } else {
        alert(data.message || "Failed to schedule test.");
      }
    } catch (error) {
      console.error("Error scheduling test:", error);
      alert("Error scheduling test.");
    }
  };

  return (
    <Paper sx={{ width: "60%", margin: "20px auto", padding: "20px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Schedule Test
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1"><strong>Test ID:</strong> {TestId}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1"><strong>Test Name:</strong> {testName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1"><strong>Stream:</strong> {stream}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1"><strong>Year:</strong> {year}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1"><strong>Semester:</strong> {semester}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1"><strong>Subject:</strong> {subject}</Typography>
        </Grid>
       

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Test Date"
            variant="outlined"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="time"
            label="Test Time"
            variant="outlined"
            value={testTime}
            onChange={(e) => setTestTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Test Duration (minutes)"
            variant="outlined"
            value={testDuration}
            onChange={(e) => setTestDuration(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Activation Before Schedule (minutes)"
            variant="outlined"
            value={activationBeforeSchedule}
            onChange={(e) => setActivationBeforeSchedule(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={handleScheduleSubmit}>
            Submit Schedule
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ScheduleForm;
