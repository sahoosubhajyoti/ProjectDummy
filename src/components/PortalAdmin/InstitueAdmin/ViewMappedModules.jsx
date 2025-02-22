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
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";


const ViewMappedModules = () => {
    const location = useLocation();
    const { userid } = location.state || {};
    console.log(userid);
  const [mappedModules, setMappedModules] = useState([]); // Array of mapped modules
  const [page, setPage] = useState(0); // Current page (0-indexed for React)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows per page
  const [total, setTotal] = useState(0); // Total number of records
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/view_mapped_modules?page=${page + 1}&per_page=${rowsPerPage}`
        ); // page + 1 because backend expects 1-indexed pages
        const data = await response.json();
        console.log("Response data:", data);


        // Update state with fetched data
        setMappedModules(data.mapped_modules || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching module data:", error);
      }
    };


    fetchData();
  }, [page, rowsPerPage]); // Re-run the effect when page or rowsPerPage changes


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page whenever rows per page changes
  };


  const handleUpdate = (module) => {
    navigate("/add-modify-module", { state: { instituteId: module.institute_id,
   
      moduleId: module.module_id,
      moduleName: module.module_name, } });
    console.log("sending data");
    console.log(module);
  };


  const handleDelete = (module) => {
    navigate("/delete-module", { state: { instituteId: module.institute_id,
      moduleId: module.module_id,
      userId:userid,
      moduleName: module.module_name,} });
  };


  return (
    <Paper sx={{ width: "80%", margin: "20px auto", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Institute ID</TableCell>
              <TableCell>Institute Name</TableCell>
              <TableCell>Module ID</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Deleted</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappedModules.length > 0 ? (
              mappedModules.map((module, index) => (
                <TableRow key={index}>
                  <TableCell>{module.institute_id}</TableCell>
                  <TableCell>{module.institute_name}</TableCell>
                  <TableCell>{module.module_id}</TableCell>
                  <TableCell>{module.module_name}</TableCell>
                  <TableCell>{module.module_active}</TableCell>
                  <TableCell>{module.module_deleted}</TableCell>
                  <TableCell>
                    {" "}
                    <UpdateIcon
                      sx={{ color: blue[500], cursor: "pointer" }}
                      onClick={() => handleUpdate(module)}
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <DeleteIcon
                      sx={{ color: red[500], cursor: "pointer" }}
                      onClick={() => handleDelete(module)}
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


export default ViewMappedModules;