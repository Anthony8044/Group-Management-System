import React, { useState, useEffect } from "react";
import useStyles from './styles'
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider } from '@mui/material';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from "react-redux";
import { updateStudent } from "../../actions/student";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudent } from '../../actions/student';
import decode from 'jwt-decode';
import Input from "../../components/login&register/Input";


const Profile = () => {
    const theme = useTheme()
    const dispatch = useDispatch();
    const classes = useStyles()
    const navigate = useNavigate();
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
        } else if (userId?.role === "Teacher") {
            dispatch(getStudent({ user_id: userId?.user_id }));
        }
    }, [userId]);
    const [user] = useSelector((state) => state.student);

    const [userData, setUserData] = useState({
        given_name: '',
        family_name: '',
        gender: '',
        role: '',
        email: '',
        profile_img: '',
        study_program: '',
        study_year: '',
        student_id: ''
    });
    //const user = useSelector((state) => id ? state.student.find((u) => u._id === id) : null);

    useEffect(() => {
        if (user) setUserData(user);
    }, [user])

    // useEffect(() => {
    //     setUserId(decode(JSON.parse(localStorage.getItem('profile')).token).user_id);
    // }, []);

    // const clear = () => {
    //     setCurrentId(0);
    //     //setUserData({ password: '', email: '', firstname: '', lastname: '', studentID: '', profileImg: '' });
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(updateStudent(id, userData));
        window.location.reload();
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
                            src={userData.profile_img}
                        />
                        <CardContent className={classes.profileTitle}>
                            <Typography gutterBottom variant="h5" component="div">
                                {userData.given_name} {userData.family_name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <FileBase
                                type='file'
                                multiple={false}
                                onDone={({ base64 }) => setUserData({ ...userData, profile_img: base64 })}
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
                                    {(user?.user_id === id) ? (
                                        <>
                                            <Input name="given_name" label="Given Name" value={userData.given_name} handleChange={handleChange} half />
                                            <Input name="family_name" label="Family Name" value={userData.family_name} handleChange={handleChange} half />
                                            <Input name="email" label="Email" value={userData.email} handleChange={handleChange} />
                                            <Input name="student_id" label="Student ID" value={userData.student_id} handleChange={handleChange} half />
                                            <Input name="gender" label="Gender" value={userData.gender} handleChange={handleChange} half />
                                            <Grid item xs={12} >
                                                <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Update</Button>
                                            </Grid>
                                        </>
                                    ) :
                                        <>
                                            <Input name="given_name" label="Given Name" value={userData.given_name} handleChange={handleChange} read="true" half />
                                            <Input name="family_name" label="Family Name" value={userData.family_name} handleChange={handleChange} read="true" half />
                                            <Input name="email" label="Email" value={userData.email} handleChange={handleChange} read="true" />
                                            <Input name="student_id" label="Student ID" value={userData.student_id} handleChange={handleChange} read="true" half />
                                            <Input name="gender" label="Gender" value={userData.gender} handleChange={handleChange} read="true" half />
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
                                    {(user?.user_id === id) ? (
                                        <>
                                            <Input name="study_program" label="Study Program" value={userData.study_program} handleChange={handleChange} half />
                                            <Input name="study_year" label="Study Year" value={userData.study_year} handleChange={handleChange} half />
                                            <Input name="email" label="Email" value={userData.email} handleChange={handleChange} />
                                            <Input name="student_id" label="Student ID" value={userData.student_id} handleChange={handleChange} />
                                        </>
                                    ) :
                                        <>
                                            <Input name="study_program" label="Study Program" value={userData.study_program} handleChange={handleChange} read="true" half />
                                            <Input name="study_year" label="Study Year" value={userData.study_year} handleChange={handleChange} read="true" half />
                                            <Input name="email" label="Email" value={userData.email} handleChange={handleChange} read="true" />
                                            <Input name="student_id" label="Student ID" value={userData.student_id} handleChange={handleChange} read="true" />
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
