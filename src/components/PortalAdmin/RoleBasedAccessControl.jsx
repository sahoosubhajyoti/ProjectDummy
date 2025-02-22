import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const RoleBasedAccessControl = () => {
  const [data, setData] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/roles'); // Replace with your backend API
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle permission changes
  const handlePermissionChange = async (rowIndex, right, value) => {
    const updatedData = [...data];
    updatedData[rowIndex].rights[right] = value;
    setData(updatedData);

    try {
      await fetch('http://localhost:5000/api/roles/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData[rowIndex]),
      });
      console.log('Permission updated successfully');
    } catch (error) {
      console.error('Error updating permission:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Role</TableCell>
            <TableCell>Hierarchy</TableCell>
            <TableCell>Privilege</TableCell>
            <TableCell>View</TableCell>
            <TableCell>Add</TableCell>
            <TableCell>Modify</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.role}</TableCell>
              <TableCell>{row.hierarchy}</TableCell>
              <TableCell>{row.privilege}</TableCell>

              {/* View */}
              <TableCell>
                {row.role === 'PORTAL ADMIN' ? (
                  <span style={{ color: row.rights.view === 'Allow' ? 'green' : 'red' }}>
                    {row.rights.view}
                  </span>
                ) : (
                  <>
                    <Button
                      onClick={() => handlePermissionChange(index, 'view', 'Allow')}
                      style={{
                        backgroundColor: row.rights.view === 'Allow' ? 'green' : 'transparent',
                        color: row.rights.view === 'Allow' ? 'white' : 'black',
                      }}
                    >
                      Allow
                    </Button>
                    <Button
                      onClick={() => handlePermissionChange(index, 'view', 'Deny')}
                      style={{
                        backgroundColor: row.rights.view === 'Deny' ? 'red' : 'transparent',
                        color: row.rights.view === 'Deny' ? 'white' : 'black',
                      }}
                    >
                      Deny
                    </Button>
                  </>
                )}
              </TableCell>

              {/* Add */}
              <TableCell>
                {row.role === 'PORTAL ADMIN' ? (
                  <span style={{ color: row.rights.add === 'Allow' ? 'green' : 'red' }}>
                    {row.rights.add}
                  </span>
                ) : (
                  <>
                    <Button
                      onClick={() => handlePermissionChange(index, 'add', 'Allow')}
                      style={{
                        backgroundColor: row.rights.add === 'Allow' ? 'green' : 'transparent',
                        color: row.rights.add === 'Allow' ? 'white' : 'black',
                      }}
                    >
                      Allow
                    </Button>
                    <Button
                      onClick={() => handlePermissionChange(index, 'add', 'Deny')}
                      style={{
                        backgroundColor: row.rights.add === 'Deny' ? 'red' : 'transparent',
                        color: row.rights.add === 'Deny' ? 'white' : 'black',
                      }}
                    >
                      Deny
                    </Button>
                  </>
                )}
              </TableCell>

              {/* Modify */}
              <TableCell>
                {row.role === 'PORTAL ADMIN' ? (
                  <span style={{ color: row.rights.modify === 'Allow' ? 'green' : 'red' }}>
                    {row.rights.modify}
                  </span>
                ) : (
                  <>
                    <Button
                      onClick={() => handlePermissionChange(index, 'modify', 'Allow')}
                      style={{
                        backgroundColor: row.rights.modify === 'Allow' ? 'green' : 'transparent',
                        color: row.rights.modify === 'Allow' ? 'white' : 'black',
                      }}
                    >
                      Allow
                    </Button>
                    <Button
                      onClick={() => handlePermissionChange(index, 'modify', 'Deny')}
                      style={{
                        backgroundColor: row.rights.modify === 'Deny' ? 'red' : 'transparent',
                        color: row.rights.modify === 'Deny' ? 'white' : 'black',
                      }}
                    >
                      Deny
                    </Button>
                  </>
                )}
              </TableCell>

              {/* Delete */}
              <TableCell>
                {row.role === 'PORTAL ADMIN' ? (
                  <span style={{ color: row.rights.delete === 'Allow' ? 'green' : 'red' }}>
                    {row.rights.delete}
                  </span>
                ) : (
                  <>
                    <Button
                      onClick={() => handlePermissionChange(index, 'delete', 'Allow')}
                      style={{
                        backgroundColor: row.rights.delete === 'Allow' ? 'green' : 'transparent',
                        color: row.rights.delete === 'Allow' ? 'white' : 'black',
                      }}
                    >
                      Allow
                    </Button>
                    <Button
                      onClick={() => handlePermissionChange(index, 'delete', 'Deny')}
                      style={{
                        backgroundColor: row.rights.delete === 'Deny' ? 'red' : 'transparent',
                        color: row.rights.delete === 'Deny' ? 'white' : 'black',
                      }}
                    >
                      Deny
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoleBasedAccessControl;
