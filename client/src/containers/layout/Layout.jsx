import React, { useState, useEffect } from 'react';
import useStyles from './styles'
import { useTheme } from '@mui/styles';
import { List, useMediaQuery, CssBaseline, Avatar, Button } from '@mui/material'
import { ListItemButton, ListItemIcon, ListItemText, Drawer, Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import { Home, AccountBox, Class, Groups, Menu, Notifications } from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import decode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { getStudent } from '../../actions/student';
import { getAllStudentCourse } from '../../actions/course';
import { getAllTeacherCourse } from '../../actions/course';
import { getTeacher } from '../../actions/teacher';

const Layout = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentRoute = useLocation();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [userId, setUserId] = useState(null);
    const [student] = useSelector((state) => state.student);
    const [teacher] = useSelector((state) => state.teacher);
    const AllStudentCourse = useSelector((state) => state.getAllStudentCourse.filter(({ user_id }) => user_id === userId?.user_id));
    const AllTeacherCourse = useSelector((state) => state.getAllTeacherCourse.filter(({ user_id }) => user_id === userId?.user_id));
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
            dispatch(getAllStudentCourse());
        } else if (userId?.role === "Teacher") {
            dispatch(getTeacher({ user_id: userId?.user_id }));
            dispatch(getAllTeacherCourse());
        }
    }, [userId]);



    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/register');
        window.location.reload();
        //setUser(null);
    };


    const [open, setOpen] = React.useState(false);

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

                    {/* <Typography variant="h7" noWrap className={classes.name}>
                        Anthony Stoltzfus
                    </Typography>
                    <Link to={"/register"}>
                        <Avatar className={classes.avatar} src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                    </Link> */}

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
                        <Button className={classes.button} component={Link} to="/register" variant="contained" color="primary">Sign In</Button>
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

                        {AllStudentCourse.map((item) => (
                            <ListItemButton
                                key={item.course_id}
                                // selected={currentRoute.pathname === item.path ? true : false}
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

                        {AllTeacherCourse.map((item) => (
                            <ListItemButton
                                key={item.course_id}
                                // selected={currentRoute.pathname === item.path ? true : false}
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
                {children}
            </div>

        </div >
    )
};

export default Layout;
