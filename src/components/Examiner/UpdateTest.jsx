import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import { red, blue } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";

const UpdateTest = () => {
  const location = useLocation();
  const { userid } = location.state || {};
  const [Test, setTest] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/view_examiner_mapped_tests/${userid}?page=${page + 1}&per_page=${rowsPerPage}`
        );
        const data = await response.json();
        console.log("Response data:", data);

        setTest(data.tests || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };

    fetchData();
  }, [page, rowsPerPage, userid]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdate = (test) => {
    navigate("/modify-test", { state: { TestId: test.test_id, userid: userid } });
  };

  const handleDelete = async (test) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete_test/${test.test_id}/${userid}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setTest((prevTests) => prevTests.filter((t) => t.test_id !== test.test_id));
        alert("Test deleted successfully!");
      } else {
        alert(data.message || "Failed to delete the test.");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("An error occurred while deleting the test.");
    }
  };

  return (
    <Paper sx={{ width: "90%", margin: "20px auto", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Stream</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Syllabus</TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Test ID</TableCell>
              <TableCell>Test Date</TableCell>
              <TableCell>Modify</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Test.length > 0 ? (
              Test.map((test, index) => (
                <TableRow key={index}>
                  <TableCell>{test.module_name}</TableCell>
                  <TableCell>{test.stream}</TableCell>
                  <TableCell>{test.year}</TableCell>
                  <TableCell>{test.semester}</TableCell>
                  <TableCell>{test.subject}</TableCell>
                  <TableCell>{test.syllabus}</TableCell>
                  <TableCell>{test.test_name}</TableCell>
                  <TableCell>{test.test_id}</TableCell>
                  <TableCell>{test.test_date}</TableCell>
                  <TableCell>
                    <UpdateIcon
                      sx={{ color: blue[500], cursor: "pointer" }}
                      onClick={() => handleUpdate(test)}
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteIcon
                      sx={{ color: red[500], cursor: "pointer" }}
                      onClick={() => handleDelete(test)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default UpdateTest;
