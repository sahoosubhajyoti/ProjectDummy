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

const ViewMappedModulesInstitute = () => {
  const location = useLocation();
  const { userid } = location.state || {};
  const [mappedModules, setMappedModules] = useState([]); // Array of mapped modules
  const [page, setPage] = useState(0); // Current page (0-indexed for React)
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page
  const [total, setTotal] = useState(0); // Total number of records
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/view_mapped_modules_institute_bp?page=${
            page + 1
          }&per_page=${rowsPerPage}&user_id=${userid}`
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
  }, [page, rowsPerPage, userid]); // Re-run the effect when page or rowsPerPage changes

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page whenever rows per page changes
  };

  const handleUpdate = (module) => {
    navigate("/map-users-to-modules", { state: { instituteId: module.id } });
    console.log("sending data");
    console.log(module);
  };

  const handleDelete = (module) => {
    navigate("/delete-mapped-user", { state: { email: module.email_id } });
  };

  return (
    <Paper sx={{ width: "80%", margin: "20px auto", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Module ID</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Email ID</TableCell>
              <TableCell>Mapped ON</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Deleted</TableCell>
              <TableCell>Add</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Deleted ON</TableCell>
              <TableCell>Deleted BY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappedModules.length > 0 ? (
              mappedModules.map((module, index) => (
                <TableRow key={index}>
                  <TableCell>{module.module_id}</TableCell>
                  <TableCell>{module.module_name}</TableCell>
                  <TableCell>{module.user_id}</TableCell>
                  <TableCell>{module.user_name}</TableCell>
                  <TableCell>{module.email_id}</TableCell>
                  <TableCell>{module.mapped_on}</TableCell>
                  <TableCell>{module.active}</TableCell>
                  <TableCell>{module.deleted}</TableCell>

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
                  <TableCell>{module.deleted_by}</TableCell>
                  <TableCell>{module.deleted_on}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
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

export default ViewMappedModulesInstitute;
