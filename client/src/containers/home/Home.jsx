import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Container, Divider, Grid, Typography, useTheme } from "@mui/material";
import useStyles from './styles'
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import Input from "../../components/login&register/Input";
import { createCourse } from "../../actions/course";



const Home = () => {
    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({ code: '', sections: '', course_title: '' });


    useEffect(() => {
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(createCourse(userData));
    };

    const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Home</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            <Grid container spacing={4}>
                <Grid item xs={8} md={8} >
                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <Typography variant="h6">Create New Course</Typography>
                            <Divider style={{ margin: theme.spacing(2) }} />
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Input name="code" label="Course Code" value={userData.course_code} handleChange={handleChange} />
                                    <Input name="sections" label="Number of Sections" value={userData.course_section} handleChange={handleChange} />
                                    <Input name="course_title" label="Course Title" value={userData.course_section} handleChange={handleChange} />
                                    <Grid item xs={12} >
                                        <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Create Course</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Container >
    )
}

export default Home;
