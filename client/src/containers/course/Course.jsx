import React, { useState, useEffect, useContext } from "react";
import useStyles from './styles'
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, TextField, Stack } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import { UserContext } from '../UserContext';
import Input from "../../components/login&register/Input";
import { createproject } from "../../actions/project";
import ControlledSelect from "../home/ControlledSelect";
import { toast } from 'react-toastify';
import { getAllProjects } from "../../api";


const Course = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const classes = useStyles();
    const { courseid } = useParams();
    const userId = useContext(UserContext);
    const error = useSelector((state) => state.errors);
    const [newProjectData, setNewProjectData] = useState({ course_code: '', project_title: '', group_min: '', group_max: '', formation_type: 'default', project_description: '', user_id: '' });
    const [dateGroup, setDateGroup] = useState(new Date());
    const [dateProject, setDateProject] = useState(new Date());
    const [isFormInvalid, setIsFormInvalid] = useState({ project_title: false, group_min: false, group_max: false, project_description: false });
    const allProjects = useSelector((state) => userId ? state.projects.filter(item => item.course_code === courseid) : "");

    useEffect(() => {
        if (error.error || error.success) {
            dispatch({ type: "ERROR_CLEAR" });
        }
    }, [error.error, error.success]);

    const validate = values => {
        Object.entries(values).forEach(([key, value]) => {

            if (value !== '') {
                setIsFormInvalid(prevIsFormInvalid => ({ ...prevIsFormInvalid, [key]: false }));
            } else {
                setIsFormInvalid(prevIsFormInvalid => ({ ...prevIsFormInvalid, [key]: true }));
            }
        });
    };
    useEffect(() => {
        if (Object.values(isFormInvalid).every((v) => v === false) && newProjectData.project_title !== '') {
            dispatch(createproject({ ...newProjectData, group_submission_date: dateGroup, project_submission_date: dateProject }));
        }

    }, [isFormInvalid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        validate(newProjectData);
    };

    const formationType = [{ id: 1, type: "random" }, { id: 2, type: "default" }];
    const hCNewProject = (e) => setNewProjectData({ ...newProjectData, [e.target.name]: e.target.value, course_code: courseid, user_id: userId?.user_id });
    const handledateGroup = (newValue) => {
        setDateGroup(newValue);
    };
    const handledateProject = (newValue) => {
        setDateProject(newValue);
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

    return (
        <Container maxWidth="xl">
            {renderError()}
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Course</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            <Grid container spacing={4}>
                <Grid item xs={12} md={10} >
                    {allProjects ?
                        <>
                            {allProjects?.map((item) => (
                                <div key={item.project_id}>
                                    <Card elevation={5} style={{ height: '100%' }}>
                                        <CardContent className={classes.infoContent}>
                                            <form autoComplete="off" noValidate>
                                                <Typography variant="h6">{item.project_title}</Typography>
                                                <Divider style={{ margin: theme.spacing(2) }} />
                                                <Grid container spacing={3}>
                                                    <Input name="project_title" label="project_title" value={item.project_title} read="true" />
                                                    <Input name="project_description" label="project_description" value={item.project_description} read="true" />
                                                    <Input name="project_submission_date" label="project_submission_date" value={item.project_submission_date} read="true" half />
                                                    <Input name="group_submission_date" label="group_submission_date" value={item.group_submission_date} read="true" half />
                                                    <Input name="formation_type" label="formation_type" value={item.formation_type} read="true" half />
                                                    <Grid item xs={12} >
                                                        <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Update</Button>
                                                    </Grid>
                                                    {item.section_id.map((ite) => (
                                                        <ListItemButton key={ite} onClick={() => navigate(`/classes/${courseid}/${ite}`)} >
                                                            <ListItemText align="center" primary={ite} />
                                                        </ListItemButton>
                                                    ))}
                                                </Grid>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </>
                        :
                        <></>
                    }
                </Grid>
                <Grid item xs={12} md={10} >
                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                <Typography variant="h6">Create New Project</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <LocalizationProvider dateAdapter={DateAdapter}>

                                    <Grid container spacing={3}>
                                        <Input name="project_title" label="Title" value={newProjectData.project_title} handleChange={hCNewProject} isFormInvalid={isFormInvalid.project_title} errorMessage={"*Required"} />
                                        <Input name="project_description" label="Project Description" value={newProjectData.project_description} handleChange={hCNewProject} isFormInvalid={isFormInvalid.project_description} errorMessage={"*Required"} />
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
                                        <Input name="group_min" label="Group Min" value={newProjectData.group_min} handleChange={hCNewProject} type={"number"} isFormInvalid={isFormInvalid.group_min} errorMessage={"*Required"} />
                                        <Input name="group_max" label="Group Max" value={newProjectData.group_max} handleChange={hCNewProject} type={"number"} isFormInvalid={isFormInvalid.group_max} errorMessage={"*Required"} />
                                        <Grid item xs={12} >
                                            <ControlledSelect name="formation_type" value={newProjectData.formation_type} options={formationType} handleChange={hCNewProject} minWidth={"100%"} formation={true} />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Create New Project</Button>
                                        </Grid>
                                    </Grid>
                                </LocalizationProvider>

                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Course;