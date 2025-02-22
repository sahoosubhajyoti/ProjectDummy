import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, blue } from "@mui/material/colors";

const ViewSubject = () => {
  const location = useLocation();
  const { userid } = location.state || {};
  console.log("User ID:", userid);

  const [subjectsData, setSubjectsData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/view_user_subjects?userid=${userid}&page=${page + 1}&per_page=${rowsPerPage}`
        );
        const data = await response.json();
        console.log("Fetched data:", data);

        setSubjectsData(data.subjects || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching subjects data:", error);
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

  const handleModify = (subject) => {
    navigate("/modify-subject", {
      state: {
        userid,
        subjectId: subject.subject_id,
        courseId: subject.course_id,
        courseName: subject.course_name,
        streamId: subject.stream_id,
        streamName: subject.stream_name,
        classYear: subject.class_year,
        academicLevel: subject.academic_level,
        subjectName: subject.subject_name,
      },
    });
    console.log("Sending data for modification:", subject);
  };

  const handleDelete = async (subject) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const response = await fetch("/api/delete-user-subject", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid,
            subjectId: subject.subject_id,
            deletedBy: userid, // Include userid for logging
          }),
        });

        if (!response.ok) throw new Error("Failed to delete subject");
        alert("Subject deleted successfully!");
        setSubjectsData(subjectsData.filter((s) => s.subject_id !== subject.subject_id)); // Remove deleted subject from table
      } catch (error) {
        console.error("Error deleting subject:", error);
        alert("Failed to delete subject.");
      }
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
              <TableCell>Class/Year</TableCell>
              <TableCell>Academic Level</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Subject ID</TableCell>
              <TableCell>Modify</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjectsData.length > 0 ? (
              subjectsData.map((subject, index) => (
                <TableRow key={index}>
                  <TableCell>{subject.course_name}</TableCell>
                  <TableCell>{subject.stream_name}</TableCell>
                  <TableCell>{subject.class_year}</TableCell>
                  <TableCell>{subject.academic_level}</TableCell>
                  <TableCell>{subject.subject_name}</TableCell>
                  <TableCell>{subject.subject_id}</TableCell>
                  <TableCell>
                    <UpdateIcon
                      sx={{ color: blue[500], cursor: "pointer" }}
                      onClick={() => handleModify(subject)}
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteIcon
                      sx={{ color: red[500], cursor: "pointer" }}
                      onClick={() => handleDelete(subject)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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

export default ViewSubject;
