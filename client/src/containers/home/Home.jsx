import React, { useState, useEffect } from "react";
import { Button, Container, Grid, useTheme } from "@mui/material";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import { useDispatch } from 'react-redux';
import { createUsers, getUsers } from '../../actions/users';
import FileBase from 'react-file-base64';
import Input from "../../components/login&register/Input";



const Home = () => {
    const theme = useTheme();
    const [currentId, setCurrentId] = useState(0);
    const dispatch = useDispatch();
    const [loggedInUser, setLoggedInUser] = useState(JSON.parse(localStorage.getItem('profile')));


    const [userData, setUserData] = useState({ firstname: '', lastname: '', email: '', studentID: '', password: '', profileImg: '' });

    useEffect(() => {
        dispatch(getUsers());
    }, [currentId, dispatch]);

    useEffect(() => {
        setLoggedInUser(JSON.parse(localStorage.getItem('profile')));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(createUsers({ ...userData, name: loggedInUser?.result?.name }));
    };

    const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

    return (
        <Container maxWidth="xl">
            <Grid container spacing={4} style={{ marginRight: theme.spacing(4), marginTop: theme.spacing(4) }}>
                <Grid item xs={12} >
                    <FeaturedInfo setCurrentId={setCurrentId} />
                </Grid>
            </Grid>
            <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={4} style={{ marginRight: theme.spacing(4), marginTop: theme.spacing(4) }}>
                    <Input name="firstname" label="First Name" value={userData.firstname} handleChange={handleChange} half />
                    <Input name="lastname" label="Last Name" value={userData.lastname} handleChange={handleChange} half />
                    <Input name="email" label="Email" value={userData.email} handleChange={handleChange} />
                    <Input name="studentID" label="Student ID" value={userData.studentID} handleChange={handleChange} half />
                    <Input name="password" label="Password" value={userData.password} handleChange={handleChange} half />
                    {(loggedInUser?.result?._id) ? (
                        <>
                            <Grid item xs={12} >
                                <FileBase
                                    type='file'
                                    multiple={false}
                                    onDone={({ base64 }) => setUserData({ ...userData, profileImg: base64 })}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Create</Button>
                            </Grid>
                        </>
                    ) :
                        <>
                        </>
                    }
                </Grid>
            </form>

        </Container>
    )
}

export default Home;
