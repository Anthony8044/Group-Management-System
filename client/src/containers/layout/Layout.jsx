import React, { useState, useEffect, useRef, useContext } from 'react';
import useStyles from './styles'
import { useTheme } from '@mui/styles';
import { List, useMediaQuery, CssBaseline, Avatar, Button } from '@mui/material'
import { ListItemButton, ListItemIcon, ListItemText, Drawer, Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import { Home, AccountBox, Class, Groups, Menu, Notifications, Satellite } from "@mui/icons-material";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import decode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { getStudents } from '../../actions/student';
import { getAllCourses } from '../../actions/course';
import { getTeachers } from '../../actions/teacher';
import { UserContext } from '../UserContext';


const Layout = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentRoute = useLocation();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const userId = useContext(UserContext);
    const student = useSelector((state) => userId ? state.students.find((u) => u.user_id === userId?.user_id) : null);
    const teacher = useSelector((state) => userId ? state.teachers.find((u) => u.user_id === userId?.user_id) : null);
    const allCourses = useSelector((state) => state.courses.filter(item => item.user_id
        .some(user_id => user_id === userId?.user_id)
    ));
    const [open, setOpen] = useState(false);


    useEffect(() => {
        dispatch(getStudents());
        dispatch(getTeachers());
        dispatch(getAllCourses());
    }, [student?.user_id, teacher?.user_id]);

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

    const studentMenuItems = [
        {
            text: 'Home',
            icon: <Home color="primary" />,
            path: '/'
        },
        {
            text: 'Profile',
            icon: <AccountBox color="primary" />,
            path: `/profile/${student?.user_id}`
        },
        {
            text: 'Classes',
            icon: <Class color="primary" />,
            path: ''
        }
    ];

    const teacherMenuItems = [
        {
            text: 'Home',
            icon: <Home color="primary" />,
            path: '/'
        },
        {
            text: 'Profile',
            icon: <AccountBox color="primary" />,
            path: `/profile/${teacher?.user_id}`
        },
        {
            text: 'Classes',
            icon: <Class color="primary" />,
            path: ''
        }
    ];

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
                    {!student && !teacher &&
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
                        {studentMenuItems.map((item) => (
                            <ListItemButton
                                key={item.text}
                                selected={currentRoute.pathname === item.path ? true : false}
                                onClick={() => navigate(item.path)}
                                className={classes.menuItems}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton  >
                        ))}

                        {allCourses.map((item) => (
                            <ListItemButton
                                key={item.course_id}
                                onClick={() => navigate(`/classes/${item.course_id}`)}
                                className={classes.menuItems}
                            >
                                <ListItemText align="center" primary={item.course_id} />
                            </ListItemButton  >
                        ))}

                        <ListItemButton
                            selected={currentRoute.pathname === "/groups" ? true : false}
                            onClick={() => navigate("/groups")}
                            className={classes.menuItems}
                        >
                            <ListItemIcon><Groups color="primary" /></ListItemIcon>
                            <ListItemText primary="Groups" />
                        </ListItemButton  >
                    </List>
                }
                {teacher &&
                    <List>
                        {teacherMenuItems.map((item) => (
                            <ListItemButton
                                key={item.text}
                                selected={currentRoute.pathname === item.path ? true : false}
                                onClick={() => navigate(item.path)}
                                className={classes.menuItems}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton  >
                        ))}

                        {allCourses.map((item) => (
                            <ListItemButton
                                key={item.course_id}
                                onClick={() => navigate(`/classes/${item.course_id}`)}
                                className={classes.menuItems}
                            >
                                <ListItemText align="center" primary={item.course_id} />
                            </ListItemButton  >
                        ))}

                        <ListItemButton
                            selected={currentRoute.pathname === "/groups" ? true : false}
                            onClick={() => navigate("/groups")}
                            className={classes.menuItems}
                        >
                            <ListItemIcon><Groups color="primary" /></ListItemIcon>
                            <ListItemText primary="Groups" />
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
