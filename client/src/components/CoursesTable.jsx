import * as React from 'react';
import { Alert, useTheme, Card, CardContent, Divider, Paper, Snackbar, Table, TableCell, TableContainer, TableHead, TableRow, Typography, TableBody } from '@mui/material';
import { useGetStudentTableQuery, useGetTeacherTableQuery } from '../services/project';
import { UserContext } from "../containers/UserContext";

export default function CoursesTable() {
    const theme = useTheme();
    const userId = React.useContext(UserContext);

    const { data: StableData } = useGetStudentTableQuery(userId?.user_id, {
        skip: userId?.role === "Student" ? false : true
    });

    return (
        <Card elevation={5} style={{ marginTop: '30px', height: '572px' }}>
            <CardContent style={{ margin: theme.spacing(2) }}>
                <Typography variant="h5" textAlign={'center'}>Your Courses</Typography>
                <Divider style={{ margin: theme.spacing(2) }} />
                <TableContainer component={Paper} sx={{ maxHeight: '350px' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Course Name</TableCell>
                                <TableCell align="center">Course Code</TableCell>
                                <TableCell align="center">Students</TableCell>
                                <TableCell align="center">Projects</TableCell>
                                <TableCell align="center">Joined</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {StableData?.map((row) => (
                                <TableRow
                                    key={row.course_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row?.course_title}
                                    </TableCell>
                                    <TableCell align="center">{row?.course_id}</TableCell>
                                    <TableCell align="center">{row?.course_count ? row?.course_count : 0}</TableCell>
                                    <TableCell align="center">{row?.project_count ? row?.project_count : 0}</TableCell>
                                    <TableCell align="center">{row?.students_joined ? row?.students_joined + "/" + (row?.course_count * row?.project_count) : 0}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}