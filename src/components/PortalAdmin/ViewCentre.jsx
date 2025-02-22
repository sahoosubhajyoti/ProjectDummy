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

const ViewCentre = () => {
  const location = useLocation();
  const { userid } = location.state || {};
  console.log("User ID:", userid);

  const [centres, setCentres] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/view_centres?page=${page + 1}&per_page=${rowsPerPage}`
        );
        const data = await response.json();
        console.log("Response data:", data);

        setCentres(data.centres || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching centre data:", error);
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

  const handleUpdate = (centre) => {
    navigate("/modify-centre", {
      state: {
        instituteId: centre.institute_id,
        instituteName: centre.institute_name,
        centreName: centre.centre_name,
      },
    });
    console.log("Sending data for update:", centre);
  };

  const handleDelete = (centre) => {
    navigate("/delete-centre", {
      state: {
        instituteId: centre.institute_id,
        instituteName: centre.institute_name,
        centreName: centre.centre_name,
        userId: userid,
      },
    });
    console.log("Sending data for delete:", centre);
  };

  return (
    <Paper sx={{ width: "80%", margin: "20px auto", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Institute ID</TableCell>
              <TableCell>Institute Name</TableCell>
              <TableCell>Centre Name</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {centres.length > 0 ? (
              centres.map((centre, index) => (
                <TableRow key={index}>
                  <TableCell>{centre.institute_id}</TableCell>
                  <TableCell>{centre.institute_name}</TableCell>
                  <TableCell>{centre.centre_name}</TableCell>
                  <TableCell>
                    <UpdateIcon
                      sx={{ color: blue[500], cursor: "pointer" }}
                      onClick={() => handleUpdate(centre)}
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteIcon
                      sx={{ color: red[500], cursor: "pointer" }}
                      onClick={() => handleDelete(centre)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
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

export default ViewCentre;
