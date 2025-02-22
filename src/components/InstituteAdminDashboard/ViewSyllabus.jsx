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
  IconButton,
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { red, blue, green } from "@mui/material/colors";

const ViewSyllabus = () => {
  const location = useLocation();
  const { userid } = location.state || {};
  console.log("User ID:", userid);

  const [syllabusData, setSyllabusData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/view_user_syllabuses?userid=${userid}&page=${page + 1}&per_page=${rowsPerPage}`
        );
        const data = await response.json();
        console.log("Fetched data:", data);

        setSyllabusData(data.syllabuses || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching syllabuses data:", error);
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

  const handleViewDocument = async (syllabus) => {
    try {
      const response = await fetch(`/api/syllabus-document/${syllabus.syllabus_id}`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to fetch document');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
      console.log("Viewing document for syllabus:", syllabus.syllabus_id);
    } catch (error) {
      console.error("Error viewing document:", error);
      alert("Failed to view document.");
    }
  };

  const handleModify = (syllabus) => {
    navigate("/modify-syllabus", {
      state: {
        userid,
        syllabusId: syllabus.syllabus_id,
        courseId: syllabus.course_id,
        courseName: syllabus.course_name,
        streamId: syllabus.stream_id,
        streamName: syllabus.stream_name,
        syllabusName: syllabus.syllabus_name,
        subjectName: syllabus.subject_name,
        subjectId: syllabus.subject_id,
      },
    });
    console.log("Sending data for modification:", syllabus);
  };

  const handleDelete = async (syllabus) => {
    if (window.confirm("Are you sure you want to delete this syllabus?")) {
      try {
        const response = await fetch("/api/delete-user-syllabus", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid,
            syllabusId: syllabus.syllabus_id,
            deletedBy: userid,
          }),
        });

        if (!response.ok) throw new Error("Failed to delete syllabus");
        alert("Syllabus deleted successfully!");
        setSyllabusData(syllabusData.filter((s) => s.syllabus_id !== syllabus.syllabus_id));
      } catch (error) {
        console.error("Error deleting syllabus:", error);
        alert("Failed to delete syllabus.");
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
              <TableCell>Course ID</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>SubjectID</TableCell>
              <TableCell>Stream</TableCell>
              <TableCell>Stream ID</TableCell>
              <TableCell>Syllabus</TableCell>
              <TableCell>Syllabus ID</TableCell>
              <TableCell>View</TableCell>
              <TableCell>Modify</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {syllabusData.length > 0 ? (
              syllabusData.map((syllabus, index) => (
                <TableRow key={index}>
                  <TableCell>{syllabus.course_name}</TableCell>
                  <TableCell>{syllabus.course_id}</TableCell>
                  <TableCell>{syllabus.stream_name}</TableCell>
                  <TableCell>{syllabus.stream_id}</TableCell>
                  <TableCell>{syllabus.subject_name}</TableCell>
                  <TableCell>{syllabus.subject_id}</TableCell>
                  <TableCell>{syllabus.syllabus_name}</TableCell>
                  <TableCell>{syllabus.syllabus_id}</TableCell>
                  <TableCell>
                    <IconButton
                      sx={{ color: green[500] }}
                      onClick={() => handleViewDocument(syllabus)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      sx={{ color: blue[500] }}
                      onClick={() => handleModify(syllabus)}
                    >
                      <UpdateIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      sx={{ color: red[500] }}
                      onClick={() => handleDelete(syllabus)}
                    >
                      <DeleteIcon />
                    </IconButton>
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

export default ViewSyllabus;


