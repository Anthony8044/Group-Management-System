import React, { useState, useEffect } from "react";
import { Button, Container, Grid, useTheme } from "@mui/material";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import { useDispatch, useSelector } from 'react-redux';
import { createUsers } from '../../actions/student';
import FileBase from 'react-file-base64';
import Input from "../../components/login&register/Input";



const Home = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const student = useSelector((state) => state.student);
    const auth = useSelector((state) => state.auth);

    //console.log(student);
    //console.log(auth);
    const [userData, setUserData] = useState({ course_code: '', course_section: ''});


    useEffect(() => {
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //dispatch(createUsers({ ...userData, user_id: loggedInUser?.result?.user_id }));
    };

    const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

    return (
        <Container maxWidth="xl">
            <Grid container spacing={4} style={{ marginRight: theme.spacing(4), marginTop: theme.spacing(4) }}>
                <Grid item xs={12} >
                    {/* <FeaturedInfo setCurrentId={setCurrentId} /> */}
                </Grid>
            </Grid>
            <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={4} style={{ marginRight: theme.spacing(4), marginTop: theme.spacing(4) }}>
                    <Input name="course_code" label="Course Code" value={userData.course_code} handleChange={handleChange} />
                    <Input name="course_section" label="Course Section" value={userData.course_section} handleChange={handleChange} />
                    
                    {/* <Input name="email" label="Email" value={userData.email} handleChange={handleChange} />
                    <Input name="studentID" label="Student ID" value={userData.studentID} handleChange={handleChange} half />
                    <Input name="password" label="Password" value={userData.password} handleChange={handleChange} half /> */}
                    {student ? (
                        <>
                            {/* <Grid item xs={12} >
                                <FileBase
                                    type='file'
                                    multiple={false}
                                    onDone={({ base64 }) => setUserData({ ...userData, profileImg: base64 })}
                                />
                            </Grid> */}
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
