import React, { useState, useEffect, useContext } from "react";
import { Button, Card, CardContent, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import useStyles from './styles'
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import Input from "../../components/login&register/Input";
import { createCourse, getAllCourses, registerCourse } from "../../actions/course";
import { getStudents } from "../../actions/student";
import ControlledSelect from "./ControlledSelect";
import { toast } from 'react-toastify';
import { UserContext } from "../UserContext";


const Home = () => {
    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [newCourseData, setNewCourseData] = useState({ code: '', sections: '', course_title: '', instructor_id: '' });
    const [regCourseData, setRegCourseData] = useState({ course_id: '', user_id: '' });
    //const student = useSelector((state) => userId ? state.students.find((u) => u.user_id === userId?.user_id) : null);

    const userId = useContext(UserContext);
    const error = useSelector((state) => state.errors);
    const student = useSelector((state) => state.students);
    const teacher = useSelector((state) => state.teachers);
    const allCourses = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(getStudents());
        dispatch(getAllCourses());
    }, []);

    useEffect(() => {
        if (error.error || error.success) {
            dispatch({ type: "ERROR_CLEAR" });
        }
    }, [error.error, error.success]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(createCourse(newCourseData));
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        dispatch(registerCourse(regCourseData));
    };


    const renderError = () => {
        if (error.error) {
            toast.error(error.error, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                toastId: 'error1',
            });
        } else if (error.success) {
            toast.success(error.success, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                toastId: 'success1',
            });
        }
    }

    const hCNewCourse = (e) => setNewCourseData({ ...newCourseData, [e.target.name]: e.target.value });

    const hCCourseCode = (e) => setRegCourseData({ ...regCourseData, [e.target.name]: e.target.value });

    return (
        <Container maxWidth="xl">
            {renderError()}
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Home</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />

            {userId?.role === "Admin" &&
                <Grid container spacing={4}>
                    <Grid item xs={8} md={8} >
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h6">Create New Course</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <form noValidate onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Input name="code" label="Course Code" value={newCourseData.course_code} handleChange={hCNewCourse} />
                                        <Input name="sections" label="Number of Sections" value={newCourseData.course_section} handleChange={hCNewCourse} />
                                        <Input name="course_title" label="Course Title" value={newCourseData.course_title} handleChange={hCNewCourse} />
                                        <Grid item xs={12} >
                                            <ControlledSelect name="instructor_id" value={newCourseData.instructor_id} options={teacher} handleChange={hCNewCourse} minWidth={"100%"} user={true} />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Create Course</Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={8} md={8} >
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h6">Register Student in Course</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <form noValidate onSubmit={handleSubmit2}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} >
                                            <ControlledSelect name="course_id" value={regCourseData.course_id} options={allCourses} handleChange={hCCourseCode} minWidth={"100%"} />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <ControlledSelect name="user_id" value={regCourseData.user_id} options={student} handleChange={hCCourseCode} minWidth={"100%"} user={true} />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Register Student</Button>
                                        </Grid>
                                    </Grid>

                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            }

        </Container >
    )
}

export default Home;