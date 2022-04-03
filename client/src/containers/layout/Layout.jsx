import React, { useState, useEffect, useRef, useContext } from 'react';
import useStyles from './styles'
import { useTheme } from '@mui/styles';
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { UserContext } from '../UserContext';
//// UI Imports ////
import { List, useMediaQuery, CssBaseline, Avatar, Button, ListItem, Divider } from '@mui/material'
import { ListItemButton, ListItemIcon, ListItemText, Drawer, Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import { Home, AccountBox, Class, Groups, Menu, Notifications, Satellite, KeyboardArrowDown } from "@mui/icons-material";
//// API Imports ////
import { useGetStudentQuery } from "../../services/student";
import { useGetTeacherQuery } from "../../services/teacher";
import { useGetAllCoursesQuery } from '../../services/course';


const Layout = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const currentRoute = useLocation();
    const isMdUp = useMediaQuery(theme.breakpoints.up("lg"));
    const [studentLogin, setStudentLogin] = useState(true);
    const [teacherLogin, setTeacherLogin] = useState(true);
    const [open, setOpen] = useState(false);
    const userId = useContext(UserContext);

    const { data: student, isError: sIsError, error: sError } = useGetStudentQuery(userId?.user_id, { skip: studentLogin });
    const { data: teacher, isError: tIsError, error: tError } = useGetTeacherQuery(userId?.user_id, { skip: teacherLogin });
    const { data: allCourses, isError: cErr, error: cErrMsg } = useGetAllCoursesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            data: data?.filter(item => item.user_id.some(user_id => user_id === userId?.user_id)),
        }),
    });
    const { data: teacherCourses, isError: tErr, error: tErrMsg } = useGetAllCoursesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            data: data?.filter(item => item.instructor_id_fk === userId?.user_id && item.course_id.endsWith("-1")),
        }),
    });

    useEffect(() => {
        if (userId?.role === "Student") {
            setStudentLogin(false);
        } else if (userId?.role === "Teacher") {
            setTeacherLogin(false);
        }
    }, [userId?.user_id]);

    const logout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    const toggleDrawer = event => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setOpen(!open);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar} elevation={9} >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleDrawer}
                        className={classes.menuButton}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h4" noWrap className={classes.title}>
                        Group Management System
                    </Typography>

                    {student &&
                        <div className={classes.profile}>
                            <Avatar className={classes.avatar} alt={student.given_name} src={student.profile_img} onClick={() => navigate(`/profile/student/${student.user_id}`)}>{student.given_name.slice(0, 1)}</Avatar>
                            <Typography className={classes.name} variant="h6">{student.given_name} {student.family_name}</Typography>
                            <Button className={classes.button} variant="contained" color="secondary" onClick={logout}>Logout</Button>
                        </div>
                    }
                    {teacher &&
                        <div className={classes.profile}>
                            <Avatar className={classes.avatar} alt={teacher.given_name} src={teacher.profile_img} onClick={() => navigate(`/profile/teacher/${teacher.user_id}`)}>{teacher.given_name.slice(0, 1)}</Avatar>
                            <Typography className={classes.name} variant="h6">{teacher.given_name} {teacher.family_name}</Typography>
                            <Button className={classes.button} variant="contained" color="secondary" onClick={logout}>Logout</Button>
                        </div>
                    }
                    {userId?.role === "Admin" &&
                        <div className={classes.profile}>
                            <Avatar className={classes.avatar} alt={userId?.given_name} src={userId?.profile_img} ></Avatar>
                            <Typography className={classes.name} variant="h6">{userId?.given_name} {userId?.family_name}</Typography>
                            <Button className={classes.button} variant="contained" color="secondary" onClick={logout}>Logout</Button>
                        </div>
                    }
                    {!userId &&
                        <Button className={classes.button} component={Link} to="/login" variant="contained" color="primary">Sign In</Button>
                    }
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant={isMdUp ? "permanent" : "temporary"}
                anchor='left'
                classes={{ paper: classes.drawerPaper }}
                open={open}
                onClose={toggleDrawer}
                PaperProps={{ elevation: 6 }}
            >
                <div className={classes.toolbar} />
                <div>
                    <Typography variant="h4" style={{ textAlign: "center", margin: theme.spacing(2) }}>
                        Dashboard
                    </Typography>
                </div>

                {student &&
                    <List>
                        <Divider />
                        <ListItemButton
                            selected={currentRoute.pathname === '/' ? true : false}
                            onClick={() => navigate('/')}
                            className={classes.menuItems}
                        >
                            <ListItemIcon><Home color="primary" /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton  >
                        <Divider />
                        <ListItemButton
                            selected={currentRoute.pathname === `/profile/student/${student?.user_id}` ? true : false}
                            onClick={() => navigate(`/profile/student/${student?.user_id}`)}
                            className={classes.menuItems}
                        >
                            <ListItemIcon><AccountBox color="primary" /></ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton  >
                        <Divider />
                        <ListItem
                            className={classes.menuItems}
                            secondaryAction={
                                <IconButton edge="end" aria-label="comments">
                                    <KeyboardArrowDown />
                                </IconButton>
                            }
                        >
                            <ListItemIcon><Class color="primary" /></ListItemIcon>
                            <ListItemText primary="Courses" />
                        </ListItem  >
                        <Divider />

                        {allCourses?.map((item) => (
                            <div key={item.course_id}>
                                <ListItemButton
                                    selected={currentRoute.pathname === `/course/${item.course_id.slice(0, -2)}/${item.course_id}` ? true : false}
                                    onClick={() => navigate(`/course/${item.course_id.slice(0, -2)}/${item.course_id}`)}
                                    className={classes.menuItems}
                                >
                                    <ListItemText align="center" primary={item.course_id} />
                                </ListItemButton  >
                                <Divider />
                            </div>
                        ))}


                    </List>
                }
                {teacher &&
                    <List>
                        <ListItemButton
                            selected={currentRoute.pathname === '/' ? true : false}
                            onClick={() => navigate('/')}
                            className={classes.menuItems}
                        >
                            <ListItemIcon><Home color="primary" /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton  >
                        <ListItemButton
                            selected={currentRoute.pathname === `/profile/teacher/${teacher?.user_id}` ? true : false}
                            onClick={() => navigate(`/profile/teacher/${teacher?.user_id}`)}
                            className={classes.menuItems}
                        >
                            <ListItemIcon><AccountBox color="primary" /></ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton  >
                        <ListItem
                            className={classes.menuItems}
                            secondaryAction={
                                <IconButton edge="end" aria-label="comments">
                                    <KeyboardArrowDown />
                                </IconButton>
                            }
                        >
                            <ListItemIcon><Class color="primary" /></ListItemIcon>
                            <ListItemText primary="Courses" />
                        </ListItem  >

                        {teacherCourses?.map((item) => (
                            <div key={item.course_id}>
                                <ListItemButton
                                    selected={currentRoute.pathname === `/course/${item.course_id.slice(0, -2)}` ? true : false}
                                    onClick={() => navigate(`/course/${item.course_id.slice(0, -2)}`)}
                                    className={classes.menuItems}
                                >
                                    <ListItemText align="center" primary={item.course_id.slice(0, -2)} />
                                </ListItemButton  >
                                <Divider />
                            </div>
                        ))}

                    </List>
                }

            </Drawer>

            <div className={classes.page}>
                <div className={classes.toolbar} />
                <Outlet />
            </div>

        </div >
    )
};

export default Layout;
