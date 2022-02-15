import React, { useState, useEffect } from "react";
import useStyles from './styles'
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, ListItemButton } from '@mui/material';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from "react-redux";
import { updateStudent } from "../../actions/student";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudent } from '../../actions/student';
import { getAllCourseUsers } from '../../actions/course';
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
            navigate('/register');
        }
    }, []);

    useEffect(() => {
        if (userId?.role === "Student") {
            dispatch(getStudent({ user_id: userId?.user_id }));
            dispatch(getAllCourseUsers());
        } else if (userId?.role === "Teacher") {
            dispatch(getStudent({ user_id: userId?.user_id }));
            dispatch(getAllCourseUsers());
        }
    }, [userId]);

    const [user] = useSelector((state) => state.student);
    const allCourseUsers = useSelector((state) => state.allCourseUsers.filter(({ course_id }) => course_id === id));


    return (
        <Container maxWidth="xl">
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Course</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            <Grid container spacing={4}>
                <Grid item xs={12} md={5} >
                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <Typography variant="h5" align="center">Student List</Typography>
                            <Divider style={{ margin: theme.spacing(2) }} />
                            <Grid container spacing={2}>
                                <Grid item >
                                    <List >
                                        {allCourseUsers.map((item) => (
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