import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const ViewSubscriptionAndBillingDetails = () => {
  const location = useLocation();
  const { userid } = location.state || {}; // User ID from route or state

  const [modules, setModules] = useState([]); // Module data
  const [loading, setLoading] = useState(false);

  // Fetch module data for the user ID on load
  useEffect(() => {
    if (!userid) {
      console.error("User ID is required to fetch modules.");
      return;
    }

    const fetchModules = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/modules/${userid}`); // Replace with your backend API
        const result = await response.json();
        setModules(result.modules || []); // Assume `modules` is returned
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [userid]);

  return (
    <div>
    <h2>View Subscription Details</h2>
      {loading ? (
        <p>Loading modules...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Module Name</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Trial Start</TableCell>
                <TableCell>Trial End</TableCell>
                <TableCell>PO No</TableCell>
                <TableCell>PO Date</TableCell>
                <TableCell>PO Validity</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Deleted</TableCell>
                <TableCell>Deletion Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {modules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} style={{ textAlign: "center" }}>
                    <b>No subscriptions found.</b>
                  </TableCell>
                </TableRow>
              ) : (
                modules.map((module, index) => (
                  <TableRow key={index}>
                    <TableCell>{module.module_name}</TableCell>
                    <TableCell>{module.date_created}</TableCell>
                    <TableCell>{module.trial_start}</TableCell>
                    <TableCell>{module.trial_end}</TableCell>
                    <TableCell>{module.PO_no}</TableCell>
                    <TableCell>{module.PO_date}</TableCell>
                    <TableCell>{module.PO_validity}</TableCell>
                    <TableCell>{module.Active}</TableCell>
                    <TableCell>{module.Deleted}</TableCell>
                    <TableCell>{module.DeletionDate}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ViewSubscriptionAndBillingDetails;
