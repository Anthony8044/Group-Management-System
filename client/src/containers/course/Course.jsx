import React, { useState, useEffect, useContext } from "react";
import useStyles from './styles'
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from '../UserContext';
import Input from "../../components/login&register/Input";
import ControlledSelect from "../home/ControlledSelect";
//// UI Imports ////
import { toast } from 'react-toastify';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { AccountCircle } from "@mui/icons-material";
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, TextField, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
//// API Imports ////
import { useCreateprojectMutation, useGetAllProjectsQuery } from "../../services/project";
import { useGetAllCoursesQuery, useGetCourseFullQuery, useRegisterCourseMutation } from "../../services/course";
import { useGetStudentsQuery } from "../../services/student";
import { ValidatorForm } from "react-material-ui-form-validator";


const Course = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const classes = useStyles();
    const { courseid } = useParams();
    const userId = useContext(UserContext);
    const [newProjectData, setNewProjectData] = useState({ course_code: '', project_title: '', group_min: '', group_max: '', formation_type: 'default', project_description: '', user_id: '' });
    const [regCourseData, setRegCourseData] = useState({ course_id: '', user_id: '' });
    const [dateGroup, setDateGroup] = useState(new Date());
    const [dateProject, setDateProject] = useState(new Date());
    const [isFormInvalid, setIsFormInvalid] = useState({ project_title: false, group_min: false, group_max: false, project_description: false });
    const [isErr, setIsErr] = useState("");
    const [isSucc, setIsSucc] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { data: Course } = useGetCourseFullQuery(courseid);
    const { data: allProjects, isError: tErr, error: tErrMsg } = useGetAllProjectsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            data: data?.filter(item => item.course_code === courseid),
        }),
    });
    const [createproject, { error: sError, isSuccess: sSuccess, reset: sReset }] = useCreateprojectMutation();
    const [registerCourse, { error: tError, isSuccess: tSuccess, reset: tReset }] = useRegisterCourseMutation();
    const { data: allCourses, isError: cErr, error: cErrMsg } = useGetAllCoursesQuery();
    const { data: student } = useGetStudentsQuery();




    // const validate = values => {
    //     Object.entries(values).forEach(([key, value]) => {

    //         if (value !== '') {
    //             setIsFormInvalid(prevIsFormInvalid => ({ ...prevIsFormInvalid, [key]: false }));
    //         } else {
    //             setIsFormInvalid(prevIsFormInvalid => ({ ...prevIsFormInvalid, [key]: true }));
    //         }
    //     });
    // };

    useEffect(() => {
        if (userId?.role === "Student") {
            navigate('/');
        }
    }, [userId?.user_id]);

    // useEffect(() => {
    //     if (Object.values(isFormInvalid).every((v) => v === false) && newProjectData.project_title !== '') {
    //         const fetchData = async () => {
    //             await createproject({ ...newProjectData, group_submission_date: dateGroup, project_submission_date: dateProject });
    //         }
    //         fetchData().catch(console.error);
    //     }

    // }, [isFormInvalid]);

    useEffect(() => {
        ValidatorForm.addValidationRule('isLarger', (value) => {
            if (newProjectData.group_min > value) {
                return false;
            }
            return true;
        });
    }, [newProjectData]);

    useEffect(() => {
        if (tError) {
            enqueueSnackbar(tError?.data.message, { variant: "error" });
            tReset();
        }
        if (tSuccess) {
            enqueueSnackbar("Successfully registered student", { variant: "success" });
            tReset();
        }
    }, [tError?.data, tSuccess]);

    useEffect(() => {
        if (sError) {
            enqueueSnackbar(sError?.data.message, { variant: "error" });
            sReset();
        }
        if (sSuccess) {
            enqueueSnackbar("Successfully created project", { variant: "success" });
            sReset();
        }
    }, [sError?.data, sSuccess]);

    // useEffect(() => {
    //     if (tError) {
    //         setIsErr(sError?.data.message);
    //     }
    //     if (sSuccess) {
    //         setIsSucc(sSuccess);
    //     }
    // }, [sError?.data, sSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //validate(newProjectData);
        await createproject({ ...newProjectData, group_submission_date: dateGroup, project_submission_date: dateProject });
    };

    const formationType = [{ id: 1, type: "random" }, { id: 2, type: "default" }];
    const hCNewProject = (e) => setNewProjectData({ ...newProjectData, [e.target.name]: e.target.value, course_code: courseid, user_id: userId?.user_id, project_status: "Find Groups" });
    const handledateGroup = (newValue) => {
        setDateGroup(newValue);
    };
    const handledateProject = (newValue) => {
        setDateProject(newValue);
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        await registerCourse(regCourseData);
    };

    const hCCourseCode = (e) => setRegCourseData({ ...regCourseData, [e.target.name]: e.target.value });

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >{courseid}</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            <Grid container spacing={4}>
                <Grid item xs={12} md={10} >

                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <Typography textAlign={'center'} variant="h6">Go to Section</Typography>
                            <Divider style={{ margin: theme.spacing(2) }} />
                            <Grid container spacing={4} justifyContent="space-evenly" alignItems="center">
                                {Course && Course?.map((ite) => (
                                    <Grid item key={ite?.course_id} >
                                        <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} onClick={() => navigate(`/course/${ite.course_id.slice(0, -2)}/${ite.course_id}`)} variant="contained" color="primary" size="large" type="submit" >{ite?.course_id}</Button>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={10} >
                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <Typography textAlign={'center'} variant="h6">Register Student in Section</Typography>
                            <Divider style={{ margin: theme.spacing(2) }} />
                            <ValidatorForm
                                useref='form'
                                onSubmit={handleSubmit2}
                                noValidate
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} >
                                        <ControlledSelect name="course_id" value={regCourseData.course_id} options={Course} handleChange={hCCourseCode} minWidth={"100%"} course={true} validators={['required']} errorMessages={['This field is required']} />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <ControlledSelect name="user_id" value={regCourseData.user_id} options={student} handleChange={hCCourseCode} minWidth={"100%"} student={true} validators={['required']} errorMessages={['This field is required']} />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Register Student</Button>
                                    </Grid>
                                </Grid>

                            </ValidatorForm>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={10} >
                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <ValidatorForm
                                useref='form'
                                onSubmit={handleSubmit}
                                noValidate
                            >
                                <Typography textAlign={'center'} variant="h6">Create New Project</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <LocalizationProvider dateAdapter={DateAdapter}>

                                    <Grid container spacing={3}>
                                        <Input name="project_title" label="Title" value={newProjectData.project_title} handleChange={hCNewProject} validators={['required']} errorMessages={['This field is required']} />
                                        <Input name="project_description" label="Project Description" value={newProjectData.project_description} handleChange={hCNewProject} validators={['required']} errorMessages={['This field is required']} />
                                        <Grid item xs={6} >
                                            <DateTimePicker
                                                label="Group Submission Date"
                                                name="group_submission_date"
                                                value={dateGroup}
                                                onChange={handledateGroup}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Grid>
                                        <Grid item xs={6} >

                                            <DateTimePicker
                                                label="Project Submission Date"
                                                name="project_submission_date"
                                                value={dateProject}
                                                onChange={handledateProject}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Grid>
                                        <Input name="group_min" label="Group Min" value={newProjectData.group_min} handleChange={hCNewProject} type={"number"} validators={['required', 'isNumber', 'maxStringLength:1']} errorMessages={['This field is required', 'Must be a number', 'Numbers 1-9']} />
                                        <Input name="group_max" label="Group Max" value={newProjectData.group_max} handleChange={hCNewProject} type={"number"} validators={['required', 'isNumber', 'maxStringLength:1', 'isLarger']} errorMessages={['This field is required', 'Must be a number', 'Numbers 1-9', 'Value must be larger or equal to Group Min']} />
                                        <Grid item xs={12} >
                                            <ControlledSelect name="formation_type" value={newProjectData.formation_type} options={formationType} handleChange={hCNewProject} minWidth={"100%"} formation={true} validators={['required']} errorMessages={['This field is required']} />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Create New Project</Button>
                                        </Grid>
                                    </Grid>
                                </LocalizationProvider>
                            </ValidatorForm>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Course;