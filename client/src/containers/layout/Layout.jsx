import React, { useState, useEffect } from 'react';
import useStyles from './styles'
import { useTheme } from '@mui/styles';
import { List, useMediaQuery, CssBaseline, Avatar, Button } from '@mui/material'
import { ListItemButton, ListItemIcon, ListItemText, Drawer, Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import { Home, AccountBox, Class, Groups, Menu, Notifications } from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import decode from 'jwt-decode';
import { useDispatch } from 'react-redux';

const Layout = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentRoute = useLocation();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
        setUser(null);
    };

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);
            if(decodedToken.exp * 1000 < new Date().getTime()) logout();
        }
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [currentRoute]);



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
            path: '/profile/:id'
        },
        {
            text: 'Classes',
            icon: <Class color="primary" />,
            path: '/classes'
        },
        {
            text: 'Groups',
            icon: <Groups color="primary" />,
            path: '/groups'
        },
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

                    {user?.result ? (
                        <div className={classes.profile}>
                            <Avatar className={classes.avatar} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
                            <Typography className={classes.name} variant="h6">{user?.result.name}</Typography>
                            <Button className={ classes.button} variant="contained" color="secondary" onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        <Button className={ classes.button} component={Link} to="/register" variant="contained" color="primary">Sign In</Button>
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
