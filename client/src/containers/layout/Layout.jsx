import React, { useState, useEffect, useRef, useContext } from 'react';
import useStyles from './styles'
import { useTheme } from '@mui/styles';
import { List, useMediaQuery, CssBaseline, Avatar, Button } from '@mui/material'
import { ListItemButton, ListItemIcon, ListItemText, Drawer, Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import { Home, AccountBox, Class, Groups, Menu, Notifications, Satellite } from "@mui/icons-material";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import decode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { getStudents } from '../../features/Student';
import { getAllCourses } from '../../actions/course';
import { getAllProjects } from '../../actions/project';
import { getTeachers } from '../../features/Teacher';
import { UserContext } from '../UserContext';
import { useGetStudentQuery } from "../../services/student";
import { useGetTeacherQuery } from "../../services/teacher";
import { useGetAllCoursesQuery } from '../../services/course';




const Layout = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentRoute = useLocation();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [studentLogin, setStudentLogin] = useState(true);
    const [teacherLogin, setTeacherLogin] = useState(true);

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

    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (userId?.role === "Student") {
            setStudentLogin(false);
        } else if (userId?.role === "Teacher") {
            setTeacherLogin(false);
        }
    }, [userId?.user_id]);

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
        window.location.reload();
        //setUser(null);
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
                            <Avatar className={classes.avatar} alt={student.given_name} src={student.profile_img} onClick={() => navigate(`/profile/${student.user_id}`)}>{student.given_name.slice(0, 1)}</Avatar>
                            <Typography className={classes.name} variant="h6">{student.given_name} {student.family_name}</Typography>
                            <Button className={classes.button} variant="contained" color="secondary" onClick={logout}>Logout</Button>
                        </div>
                    }
                    {teacher &&
                        <div className={classes.profile}>
                            <Avatar className={classes.avatar} alt={teacher.given_name} src={teacher.profile_img} onClick={() => navigate(`/profile/${teacher.user_id}`)}>{teacher.given_name.slice(0, 1)}</Avatar>
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

                    <Notifications />
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
                        <ListItemButton
                            selected={currentRoute.pathname === '/' ? true : false}
                            onClick={() => navigate('/')}
                            className={classes.menuItems}
                        >
                            <ListItemIcon><Home color="primary" /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton  >
                        <ListItemButton
                            selected={currentRoute.pathname === `/profile/${student?.user_id}` ? true : false}
                            onClick={() => navigate(`/profile/${student?.user_id}`)}
                            className={classes.menuItems}
                        >
                            <ListItemIcon><AccountBox color="primary" /></ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton  >
                        <ListItemButton
                            className={classes.menuItems}
                        >
                            <ListItemIcon><Class color="primary" /></ListItemIcon>
                            <ListItemText primary="Classes" />
                        </ListItemButton  >

                        {allCourses.map((item) => (
                            <ListItemButton
                                key={item.course_id}
                                selected={currentRoute.pathname === `/classes/${item.course_id}` ? true : false}
                                onClick={() => navigate(`/classes/${item.course_id}`)}
                                className={classes.menuItems}
                            >
                                <ListItemText align="center" primary={item.course_id} />
                            </ListItemButton  >
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
                            selected={currentRoute.pathname === `/profile/${teacher?.user_id}` ? true : false}
                            onClick={() => navigate(`/profile/${teacher?.user_id}`)}
                            className={classes.menuItems}
                        >
                            <ListItemIcon><AccountBox color="primary" /></ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton  >
                        <ListItemButton
                            className={classes.menuItems}
                        >
                            <ListItemIcon><Class color="primary" /></ListItemIcon>
                            <ListItemText primary="Classes" />
                        </ListItemButton  >

                        {teacherCourses?.map((item) => (
                            <ListItemButton
                                key={item.course_id}
                                selected={currentRoute.pathname === `/classes/${item.course_id.slice(0, -2)}` ? true : false}
                                onClick={() => navigate(`/classes/${item.course_id.slice(0, -2)}`)}
                                className={classes.menuItems}
                            >
                                <ListItemText align="center" primary={item.course_id.slice(0, -2)} />
                            </ListItemButton  >
                        ))}

                    </List>
                }

                {userId?.role === "Admin" &&
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
                            className={classes.menuItems}
                        >
                            <ListItemIcon><AccountBox color="primary" /></ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton  >
                        <ListItemButton
                            className={classes.menuItems}
                        >
                            <ListItemIcon><Class color="primary" /></ListItemIcon>
                            <ListItemText primary="Classes" />
                        </ListItemButton  >
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
