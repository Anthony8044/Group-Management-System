import React, { useState, useEffect, useContext } from "react";
import { Button, Card, CardContent, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import useStyles from './styles'
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import Input from "../../components/login&register/Input";
import { createCourse, getAllCourses, registerCourse } from "../../actions/course";
import { getStudents } from '../../features/Student';
import { getTeachers } from '../../features/Teacher';
import ControlledSelect from "./ControlledSelect";
import { toast } from 'react-toastify';
import { UserContext } from "../UserContext";
import { useGetStudentsQuery } from "../../services/student";
import { useGetTeachersQuery } from "../../services/teacher";
import { useCreateCourseMutation, useGetAllCoursesQuery, useRegisterCourseMutation } from "../../services/course";


const Home = () => {
    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();
    const userId = useContext(UserContext);
    const [newCourseData, setNewCourseData] = useState({ code: '', sections: '', course_title: '', instructor_id: '' });
    const [regCourseData, setRegCourseData] = useState({ course_id: '', user_id: '' });
    //const student = useSelector((state) => userId ? state.students.find((u) => u.user_id === userId?.user_id) : null);
    const [isErr, setIsErr] = useState("");
    const [isSucc, setIsSucc] = useState(false);

    const { data: student } = useGetStudentsQuery();
    const { data: teacher } = useGetTeachersQuery();
    const { data: allCourses, isError: cErr, error: cErrMsg } = useGetAllCoursesQuery();
    const [createCourse, { error: sError, isSuccess: sSuccess }] = useCreateCourseMutation();
    const [registerCourse, { error: tError, isSuccess: tSuccess }] = useRegisterCourseMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createCourse(newCourseData);
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        await registerCourse(regCourseData);
    };

    useEffect(() => {
        if (sError) {
            setIsErr(sError?.data.message);
        } else if (tError) {
            setIsErr(tError?.data.message);
        }
        if (sSuccess) {
            setIsSucc(sSuccess);
        } else if (tSuccess) {
            setIsSucc(tSuccess);
        }
    }, [sError?.data, sSuccess, tError?.data, tSuccess]);


    const renderError = () => {
        if (isErr) {
            toast.error(isErr, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                toastId: 'error1',
            });
            setIsErr("");
        } else if (isSucc) {
            toast.success("Registered Succesfully!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                toastId: 'success1',
            });
            setIsSucc(false);
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
                                            <ControlledSelect name="instructor_id" value={newCourseData.instructor_id} options={teacher} handleChange={hCNewCourse} minWidth={"100%"} teacher={true} />
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
                                            <ControlledSelect name="course_id" value={regCourseData.course_id} options={allCourses} handleChange={hCCourseCode} minWidth={"100%"} course={true} />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <ControlledSelect name="user_id" value={regCourseData.user_id} options={student} handleChange={hCCourseCode} minWidth={"100%"} student={true} />
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