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
  Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import { blue } from "@mui/material/colors";

const UpdateAnswer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { testId } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/get_questions?testId=${testId}&page=${page + 1}&per_page=${rowsPerPage}`
        );
        const data = await response.json();
        setQuestions(data.questions || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [testId, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddAnswer = (questionNo) => {
    navigate("/answers", { state: { testId, questionNo } });
  };

  return (
    <Paper sx={{ width: "60%", margin: "20px auto", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question No</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <TableRow key={index}>
                  <TableCell>{question.questionNo}</TableCell>
                  <TableCell>
                    <AddIcon
                      sx={{ color: blue[500], cursor: "pointer" }}
                      onClick={() => handleAddAnswer(question.questionNo)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No questions available
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

export default UpdateAnswer;
