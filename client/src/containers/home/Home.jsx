import React, { useState, useEffect, useContext } from "react";
import useStyles from './styles'
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import Input from "../../components/login&register/Input";
import ControlledSelect from "./ControlledSelect";
import { UserContext } from "../UserContext";
//// UI Imports ////
import { TableBody, Paper, Table, Avatar, Button, Card, CardContent, CardMedia, Chip, Container, Divider, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme, CardActionArea } from "@mui/material";
import dom from "../../assets/dom.jpg"
import D from "../../assets/D.jpg"
import I from "../../assets/I.jpg"
import S from "../../assets/S.jpg"
import C from "../../assets/C.jpg"
//// API Imports ////
import { useGetStudentsQuery, useGetStudentQuery } from "../../services/student";
import { useGetTeacherQuery, useGetTeachersQuery } from "../../services/teacher";
import { useCreateCourseMutation, useGetAllCoursesQuery, useRegisterCourseMutation } from "../../services/course";
import { AccountCircle, Add, Bolt, ConnectWithoutContact, Delete, Minimize, RecordVoiceOver, Star } from "@mui/icons-material";
import { Box } from "@mui/system";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useGetStudentInviteQuery } from "../../services/project";
import Invitations from "../../components/Invitations";
import CoursesTable from "../../components/CoursesTable";
import CoursesTableTeacher from "../../components/CoursesTableTeacher";
import SentInvitations from "../../components/SentInvitations";
import { useSnackbar } from 'notistack';


const Home = () => {
    const theme = useTheme();
    const classes = useStyles();
    const userId = useContext(UserContext);
    const [newCourseData, setNewCourseData] = useState({ code: '', sections: '', course_title: '', instructor_id: '' });
    const [regCourseData, setRegCourseData] = useState({ course_id: '', user_id: '' });
    const [isErr, setIsErr] = useState("");
    const [isSucc, setIsSucc] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { data: student } = useGetStudentsQuery();
    const { data: teacher } = useGetTeachersQuery();
    const { data: allCourses, isError: cErr, error: cErrMsg } = useGetAllCoursesQuery();
    const [createCourse, { error: sError, isSuccess: sSuccess, reset: sReset }] = useCreateCourseMutation();
    const { data: sData } = useGetStudentQuery(userId?.user_id, {
        skip: userId?.role === "Student" ? false : true
    });
    const { data: tData } = useGetTeacherQuery(userId?.user_id, {
        skip: userId?.role === "Teacher" ? false : true
    });

    useEffect(() => {
        if (sError) {
            enqueueSnackbar(sError?.data.message, { variant: "error" });
            sReset();
        }
        if (sSuccess) {
            enqueueSnackbar("Successfully created course", { variant: "success" });
            sReset();
        }
    }, [sError?.data, sSuccess]);

    const hCNewCourse = (e) => setNewCourseData({ ...newCourseData, [e.target.name]: e.target.value, instructor_id: userId?.user_id, });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createCourse(newCourseData);
    };


    const hCCourseCode = (e) => setRegCourseData({ ...regCourseData, [e.target.name]: e.target.value });

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Home</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />

            {userId?.role === "Student" &&
                <Grid container spacing={4} >
                    <Grid item xs={12} md={7} >

                        <Card elevation={5} style={{ height: '120px' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h4">Welcome back, {sData?.given_name + " " + sData?.family_name}!</Typography>
                            </CardContent>
                        </Card>
                        <CoursesTable />
                    </Grid>
                    <Grid item xs={12} md={5} >
                        <Invitations userId={userId?.user_id} />
                        <SentInvitations userId={userId?.user_id} />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card elevation={5} sx={{ height: '410px', backgroundColor: '#fffff', padding: '12px' }}>
                            <Typography variant="h5" textAlign={'center'}>D.I.S.C Personality Types</Typography>
                            <Divider style={{ margin: theme.spacing(1) }} />
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '335px', backgroundColor: '#57ffe3' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={D}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h6" component="div">
                                                    DOMINANT
                                                </Typography>
                                                <Typography textAlign={'center'} variant="subtitle1" color="text.secondary">
                                                    Team members are great bottom-line organizers, place high value on time, can handle multiple tasks at once.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '335px', backgroundColor: '#f7baba' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={I}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h6" component="div">
                                                    INFLUENTIAL
                                                </Typography>
                                                <Typography textAlign={'center'} variant="subtitle1" color="text.secondary">
                                                    Team members are great communicators and motivate others to thrive, have a positive sense of humor and negotiate well.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '335px', backgroundColor: '#e6ffde' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={S}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h6" component="div">
                                                    STEADY
                                                </Typography>
                                                <Typography textAlign={'center'} variant="subtitle1" color="text.secondary">
                                                    Team members are reliable and dependable, maintain harmony, loyal, patient and trustworthy.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '335px', backgroundColor: '#d6edff' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={C}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h6" component="div">
                                                    COMPLIANT
                                                </Typography>
                                                <Typography textAlign={'center'} variant="subtitle1" color="text.secondary">
                                                    Team members are great with facts and information, incredible analyzers and developers, and focused on maintaining quality.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid >
            }

            {userId?.role === "Teacher" &&
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7} >

                        <Card elevation={5} style={{ height: '120px' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h4">Welcome back, {tData?.given_name + " " + tData?.family_name}!</Typography>
                            </CardContent>
                        </Card>
                        <CoursesTableTeacher />

                    </Grid>
                    <Grid item xs={12} md={5} >
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h6">Create New Course</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <ValidatorForm
                                    useref='form'
                                    onSubmit={handleSubmit}
                                    noValidate
                                >
                                    <Grid container spacing={6}>
                                        <Input name="code" label="Course Code" value={newCourseData.code} handleChange={hCNewCourse} validators={['required', 'matchRegexp:^[A-Z]{1,4}[0-9]{4}$']} errorMessages={['This field is required', 'Match 1-4 letters + 4 digits eg: COMP1001']} />
                                        <Input name="sections" label="Number of Sections" value={newCourseData.sections} handleChange={hCNewCourse} type={"number"} validators={['required', 'isNumber', 'matchRegexp:^[1-9]{1}$']} errorMessages={['This field is required', 'Must be a number', 'Numbers 1-9']} />
                                        <Input name="course_title" label="Course Title" value={newCourseData.course_title} handleChange={hCNewCourse} validators={['required']} errorMessages={['This field is required']} />
                                        <Grid item xs={12} >
                                            <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Create Course</Button>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card elevation={5} sx={{ height: '420px', backgroundColor: '#fffff', padding: '12px' }}>
                            <Typography variant="h4" textAlign={'center'}>D.I.S.C Personality Types</Typography>
                            <Divider style={{ margin: theme.spacing(1) }} />
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '335px', backgroundColor: '#57ffe3' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={D}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    DOMINANT
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary">
                                                    Team members are great bottom-line organizers, place high value on time, can handle multiple tasks at once.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '335px', backgroundColor: '#f7baba' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={I}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    INFLUENTIAL
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary">
                                                    Team members are great communicators and motivate others to thrive, have a positive sense of humor and negotiate well.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '335px', backgroundColor: '#e6ffde' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={S}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    STEADY
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary">
                                                    Team members are reliable and dependable, maintain harmony, loyal, patient and trustworthy.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '335px', backgroundColor: '#d6edff' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={C}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    COMPLIANT
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary">
                                                    Team members are great with facts and information, incredible analyzers and developers, and focused on maintaining quality.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid >
            }

        </Container >
    )
}

export default Home;