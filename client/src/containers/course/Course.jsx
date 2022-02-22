import React, { useState, useEffect } from "react";
import useStyles from './styles'
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, ListItemButton } from '@mui/material';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from "react-redux";
import { updateStudent } from "../../actions/student";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudents } from '../../actions/student';
import { getTeachers } from '../../actions/teacher';
import { getAllCourses } from '../../actions/course';
import decode from 'jwt-decode';
import { AccountCircle } from "@mui/icons-material";

const Course = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const classes = useStyles();
    const { id } = useParams();

    const [userId, setUserId] = useState(null);
    const loggedIn = JSON.parse(localStorage.getItem('profile'));
    useEffect(() => {
        if (loggedIn) {
            setUserId(decode(JSON.parse(localStorage.getItem('profile')).token));
        } else {
            navigate('/login');
        }
    }, []);

    // useEffect(() => {
    //     if (userId) {
    //         dispatch(getAllCourses());
    //         dispatch(getStudents());
    //         dispatch(getTeachers());
    //     }

    // }, [userId]);

    //const [user] = useSelector((state) => state.student);
    //const allCourseUsers = useSelector((state) => state.allCourseUsers.filter(({ course_id }) => course_id === id));
    //const courses = useSelector((state) => state.courses.filter(({ course_id }) => course_id === id));
    const [allCourses] = useSelector((state) => userId ? state.courses.filter(item => item.course_id === id) : "");
    const student = useSelector((state) => userId ? state.students.filter((u) => allCourses?.user_id.includes(u.user_id)) : null);
    const teacher = useSelector((state) => userId ? state.teachers.filter((u) => allCourses?.instructor_id_fk === u.user_id) : null);
    //const AllTeacherCourse = useSelector((state) => state.getAllTeacherCourse.filter(({ course_id }) => course_id === id));


    return (
        <Container maxWidth="xl">
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Course</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            <Grid container spacing={4}>
                <Grid item xs={12} md={5} >
                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <Typography variant="h5" align="center">Teacher</Typography>
                            <List >
                                {teacher?.map((item) => (
                                    <ListItemButton
                                        key={item.user_id}
                                        // selected={currentRoute.pathname === item.path ? true : false}
                                        onClick={() => navigate(`/profile/${item.user_id}`)}
                                        className={classes.menuItems}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <AccountCircle />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.given_name + ' ' + item.family_name}
                                            secondary={item.teacher_id}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                            <Divider style={{ margin: theme.spacing(2) }} />

                            <Typography variant="h5" align="center">Students</Typography>

                            <Divider style={{ margin: theme.spacing(2) }} />
                            <Grid container spacing={2}>
                                <Grid item >
                                    <List >
                                        {student?.map((item) => (
                                            <ListItemButton
                                                key={item.user_id}
                                                // selected={currentRoute.pathname === item.path ? true : false}
                                                onClick={() => navigate(`/profile/${item.user_id}`)}
                                                className={classes.menuItems}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <AccountCircle />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={item.given_name + ' ' + item.family_name}
                                                    secondary={item.student_id}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>

                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Course;