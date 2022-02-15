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
import { getAllCourseUsers } from '../../actions/course';

const Layout = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentRoute = useLocation();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
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
    const allCourseUsers = useSelector((state) => state.allCourseUsers.filter(({ user_id }) => user_id === user?.user_id));


    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/register');
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

    const menuItems = [
        {
            text: 'Home',
            icon: <Home color="primary" />,
            path: '/'
        },
        {
            text: 'Profile',
            icon: <AccountBox color="primary" />,
            path: `/profile/${user?.user_id}`
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

                    {user ? (
                        <div className={classes.profile}>
                            <Avatar className={classes.avatar} alt={user.given_name} src={user.profile_img} onClick={() => navigate(`/profile/${user.user_id}`)}>{user.given_name.slice(0, 1)}</Avatar>
                            <Typography className={classes.name} variant="h6">{user.given_name} {user.family_name}</Typography>
                            <Button className={classes.button} variant="contained" color="secondary" onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        <Button className={classes.button} component={Link} to="/register" variant="contained" color="primary">Sign In</Button>
                    )}

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

                <List>
                    {menuItems.map((item) => (
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

                    {allCourseUsers.map((item) => (
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

            </Drawer>

            <div className={classes.page}>
                <div className={classes.toolbar} />
                {children}
            </div>

        </div>
    )
};

export default Layout;
