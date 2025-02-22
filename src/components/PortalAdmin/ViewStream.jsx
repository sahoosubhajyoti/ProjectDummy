import React, { useEffect, useState } from "react";
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

const ViewStream = () => {
  const [streams, setStreams] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/view_streams?page=${page + 1}&per_page=${rowsPerPage}`
        );
        const data = await response.json();
        console.log("Response data:", data);

        setStreams(data.streams || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching stream data:", error);
      }
    };

    fetchData();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdate = (stream) => {
    navigate("/modify-stream", { 
      state: 
      {
      streamId: stream.id, 
      moduleId: stream.module_id, 
      moduleName: stream.module_name, 
      instituteId: stream.institute_id, 
      instituteName: stream.institute_name, 
      streamName: stream.name } });
  };

  const handleDelete = (stream) => {
    navigate("/delete-stream", {       state: 
      {
      streamId: stream.id, 
      moduleId: stream.module_id, 
      moduleName: stream.module_name, 
      instituteId: stream.institute_id, 
      instituteName: stream.institute_name, 
      streamName: stream.name } });
  };

  return (
    <Paper sx={{ width: "80%", margin: "20px auto", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Stream ID</TableCell>
              <TableCell>Stream Name</TableCell>
              <TableCell>Institute ID</TableCell>
              <TableCell>Institute Name</TableCell>
              <TableCell>Module ID</TableCell>
              <TableCell>Module Name</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {streams.length > 0 ? (
              streams.map((stream) => (
                <TableRow key={stream.id}>
                  <TableCell>{stream.id}</TableCell>
                  <TableCell>{stream.name}</TableCell>
                  <TableCell>{stream.institute_id}</TableCell>
                  <TableCell>{stream.institute_name}</TableCell>
                  <TableCell>{stream.module_id}</TableCell>
                  <TableCell>{stream.module_name}</TableCell>
                  <TableCell>
                    <UpdateIcon
                      sx={{ color: blue[500], cursor: "pointer" }}
                      onClick={() => handleUpdate(stream)}
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteIcon
                      sx={{ color: red[500], cursor: "pointer" }}
                      onClick={() => handleDelete(stream)}
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

export default ViewStream;
