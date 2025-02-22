import React, { useEffect, useState, } from "react";
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
import { red } from '@mui/material/colors';
import { blue } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";



const ViewInstitute = () => {
  const [institutes, setInstitutes] = useState([]); // Array of institute data
  const [page, setPage] = useState(0); // Current page (0-indexed for React)
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page
  const [total, setTotal] = useState(0); // Total number of records
  const navigate = useNavigate();


 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://d4d25142-c6e3-4d53-9533-a195fa5117ca.mock.pstmn.io//api/view_institutes?page=${page + 1}&per_page=${rowsPerPage}`,
          {
            headers: {
              "X-API-Key": "PMAK-6769064d4ea4830001bdc30f-c330ce1d57b18de8c39a16e6e8b09e7bd6", // Replace with your API key
            },
          }
        ); // page + 1 because backend expects 1-indexed pages
        const data = await response.json();
        console.log("Response data:", data);
 
        // Update state with fetched data
        setInstitutes(data.institutes||[]);
        setTotal(data.total||0);
      } catch (error) {
        console.error("Error fetching institute data:", error);
      }
    };
 
    fetchData();
  }, [page, rowsPerPage]); // Include dependencies here
 




  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page whenever rows per page changes
  };

  const handleUpdate = (institute) => {
    navigate("/modify-institute", {  state: { instituteId: institute.id }  });
    console.log("sending data")
    console.log(institute)
    

  };

  const handleDelete = (institute) => {
    navigate("/delete-institute", {  state: { instituteId: institute.id }  });
  };


  return (
    <Paper sx={{ width: "80%", margin: "20px auto", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Institute ID</TableCell>
              <TableCell>Institute Name</TableCell>
              <TableCell>PIN</TableCell>
              <TableCell>City</TableCell>
              <TableCell>District</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Date Created</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institutes.length > 0 ? (
              institutes.map((institute) => (
                <TableRow key={institute.id}>
                  <TableCell>{institute.id}</TableCell>
                  <TableCell>{institute.name}</TableCell>
                  <TableCell>{institute.pin}</TableCell>
                  <TableCell>{institute.city}</TableCell>
                  <TableCell>{institute.district}</TableCell>
                  <TableCell>{institute.state}</TableCell>
                  <TableCell>{institute.country}</TableCell>
                  <TableCell>{institute.date_created}</TableCell>
                  <TableCell>{institute.active}</TableCell>
                  <TableCell> <UpdateIcon
                  sx={{ color: blue[500], cursor: "pointer" }}
                  onClick={() => handleUpdate(institute)}
                /></TableCell>
                  <TableCell>   <DeleteIcon
                  sx={{ color: red[500], cursor: "pointer" }}
                  onClick={() => handleDelete(institute)}
                /></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
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


export default ViewInstitute;


