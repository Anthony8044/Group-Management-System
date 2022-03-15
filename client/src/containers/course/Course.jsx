import React, { useState, useEffect, useContext } from "react";
import useStyles from './styles'
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, ListItemButton } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import { UserContext } from '../UserContext';
import Input from "../../components/login&register/Input";
import { createproject } from "../../actions/project";
import ControlledSelect from "../home/ControlledSelect";
import { toast } from 'react-toastify';


const Course = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const classes = useStyles();
    const { courseid } = useParams();
    const error = useSelector((state) => state.errors);
    const [newProjectData, setNewProjectData] = useState({ course_code: '', project_title: '', group_submission_date: '', project_submission_date: '', group_min: '', group_max: '', formation_type: 'default', project_description: '', user_id: '' });

    const userId = useContext(UserContext);

    const allProjects = useSelector((state) => userId ? state.projects.filter(item => item.course_code === courseid) : "");

    useEffect(() => {
        if (error.error || error.success) {
            dispatch({ type: "ERROR_CLEAR" });
        }
    }, [error.error, error.success]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(createproject(newProjectData));
    };

    const formationType = [{ id: 1, type: "random" }, { id: 2, type: "default" }];
    const hCNewProject = (e) => setNewProjectData({ ...newProjectData, [e.target.name]: e.target.value, course_code: courseid, user_id: userId?.user_id });

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
                                <Grid container spacing={3}>
                                    <Input name="project_title" label="Title" value={newProjectData.project_title} handleChange={hCNewProject} />
                                    <Input name="project_description" label="Project Description" value={newProjectData.project_description} handleChange={hCNewProject} />
                                    <Input name="group_submission_date" label="Group Submission Date" value={newProjectData.group_submission_date} handleChange={hCNewProject} />
                                    <Input name="project_submission_date" label="Project Submission Date" value={newProjectData.project_submission_date} handleChange={hCNewProject} />
                                    <Input name="group_min" label="Group Min" value={newProjectData.group_min} handleChange={hCNewProject} />
                                    <Input name="group_max" label="Group Max" value={newProjectData.group_max} handleChange={hCNewProject} />
                                    <Grid item xs={12} >
                                        <ControlledSelect name="formation_type" value={newProjectData.formation_type} options={formationType} handleChange={hCNewProject} minWidth={"100%"} formation={true} />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Create New Project</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Course;