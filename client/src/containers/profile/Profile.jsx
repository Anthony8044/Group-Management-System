import React, { useState, useEffect } from "react";
import useStyles from './styles'
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider } from '@mui/material';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from "react-redux";
import { updateUser, getUsers } from "../../actions/users";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import Input from "../../components/login&register/Input";


const Profile = () => {
    const theme = useTheme()
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUsers());
    }, []);
    const classes = useStyles()
    const { id } = useParams();
    const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const [userData, setUserData] = useState({
        password: '',
        email: '',
        firstname: '',
        lastname: '',
        studentID: '',
        profileImg: '',
        name: ''
    });
    const user = useSelector((state) => id ? state.users.find((u) => u._id === id) : null);

    useEffect(() => {
        if (user) setUserData(user);
    }, [user])

    useEffect(() => {
        setLoggedInUser(JSON.parse(localStorage.getItem('profile')));
    }, []);

    // const clear = () => {
    //     setCurrentId(0);
    //     //setUserData({ password: '', email: '', firstname: '', lastname: '', studentID: '', profileImg: '' });
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(updateUser(id, userData))
            .then(() => dispatch(getUsers()));
    }

    const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });



    return (
        <Container maxWidth="xl">
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Profile</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            <Grid container spacing={4}>
                <Grid item xs={12} md={4} >
                    <Card elevation={5} style={{ height: '100%' }}>
                        <Avatar
                            className={classes.avatar}
                            src={userData.profileImg}
                        />
                        <CardContent className={classes.profileTitle}>
                            <Typography gutterBottom variant="h5" component="div">
                                {userData.firstname} {userData.lastname}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Created by: {userData.name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <FileBase
                                type='file'
                                multiple={false}
                                onDone={({ base64 }) => setUserData({ ...userData, profileImg: base64 })}
                            />
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                <Typography variant="h6">Information</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <Grid container spacing={3}>
                                    {(loggedInUser?.result?._id === user?.creator) ? (
                                        <>
                                            <Input name="firstname" label="First Name" value={userData.firstname} handleChange={handleChange} half />
                                            <Input name="lastname" label="Last Name" value={userData.lastname} handleChange={handleChange} half />
                                            <Input name="email" label="Email" value={userData.email} handleChange={handleChange} />
                                            <Input name="studentID" label="Student ID" value={userData.studentID} handleChange={handleChange} half />
                                            <Input name="password" label="Password" value={userData.password} handleChange={handleChange} half />
                                            <Grid item xs={12} >
                                                <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Update</Button>
                                            </Grid>
                                        </>
                                    ) :
                                        <>
                                            <Input name="firstname" label="First Name" value={userData.firstname} handleChange={handleChange} read="true" half />
                                            <Input name="lastname" label="Last Name" value={userData.lastname} handleChange={handleChange} read="true" half />
                                            <Input name="email" label="Email" value={userData.email} handleChange={handleChange} read="true" />
                                            <Input name="studentID" label="Student ID" value={userData.studentID} handleChange={handleChange} read="true" half />
                                            <Input name="password" label="Password" value={userData.password} handleChange={handleChange} read="true" half />
                                        </>
                                    }
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                <Typography variant="h6">Other Information</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <Grid container spacing={3}>
                                    {(loggedInUser?.result?._id === user?.creator) ? (
                                        <>
                                            <Input name="firstname" label="First Name" value={userData.firstname} handleChange={handleChange} half />
                                            <Input name="lastname" label="Last Name" value={userData.lastname} handleChange={handleChange} half />
                                            <Input name="email" label="Email" value={userData.email} handleChange={handleChange} />
                                            <Input name="studentID" label="Student ID" value={userData.studentID} handleChange={handleChange} half />
                                            <Input name="password" label="Password" value={userData.password} handleChange={handleChange} half />
                                        </>
                                    ) :
                                        <>
                                            <Input name="firstname" label="First Name" value={userData.firstname} handleChange={handleChange} read="true" half />
                                            <Input name="lastname" label="Last Name" value={userData.lastname} handleChange={handleChange} read="true" half />
                                            <Input name="email" label="Email" value={userData.email} handleChange={handleChange} read="true" />
                                            <Input name="studentID" label="Student ID" value={userData.studentID} handleChange={handleChange} read="true" half />
                                            <Input name="password" label="Password" value={userData.password} handleChange={handleChange} read="true" half />
                                        </>
                                    }
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Profile;
