import React, { useState, useEffect, useContext } from "react";
import useStyles from './styles'
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from '../UserContext';
//// UI Imports ////
import DateAdapter from '@mui/lab/AdapterDateFns';
import { useTheme } from "@emotion/react";
import { AccountCircle, ExpandMore } from "@mui/icons-material";
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Accordion, AccordionSummary, AccordionDetails, Switch, TextField, Breadcrumbs } from '@mui/material';
//// API Imports ////
import { useGetCourseQuery } from "../../services/course";
import { useGetSectionStudentsQuery, useGetStudentsQuery } from "../../services/student";
import { useGetTeachersQuery } from "../../services/teacher";
import { useGetProjectGroupsQuery, useGetProjectsByCourseIdQuery, useGetStudentGroupsQuery, useGetStudentinProjectMutation } from "../../services/project";
import Input from "../../components/login&register/Input";
import GroupData from "./GroupData";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import { ValidatorForm } from "react-material-ui-form-validator";
import ExportGroups from "../../components/ExportGroups";

const Section = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const classes = useStyles();
    const { sectionid } = useParams();
    const userId = useContext(UserContext);
    const [studentIn, setStudentIn] = useState(true);
    const [teacherIn, setTeacherIn] = useState(true);
    const [userIn, setUserIn] = useState(true);


    const { data: Course, isError: tErr, error: tErrMsg } = useGetCourseQuery(sectionid);
    const { data: student } = useGetSectionStudentsQuery(sectionid, {
        skip: studentIn,
        selectFromResult: ({ data }) => ({ data: data?.filter((u) => Course?.user_id.includes(u.user_id)), }),
    });
    const { data: teacher } = useGetTeachersQuery(undefined, {
        skip: teacherIn,
        selectFromResult: ({ data }) => ({ data: data?.filter((u) => Course?.instructor_id_fk === u.user_id), }),
    });
    const { data: project } = useGetProjectsByCourseIdQuery(sectionid);
    const { data: isIn } = useGetStudentGroupsQuery({ "id": userId?.user_id }, {
        skip: userIn,
    });

    useEffect(() => {
        if (Course?.user_id) {
            setStudentIn(false);
        }
        if (Course?.user_id) {
            setTeacherIn(false);
        }
        if (userId?.user_id && userId?.role === 'Student') {
            setUserIn(false);
        }
    }, [Course?.user_id, userId?.user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    }


    return (
        <Container maxWidth="xl" >
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >{Course?.course_id + " ~ " + Course?.course_title}</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7} md={8} >
                    {project && project.length != 0 ?
                        <>
                            {project && project?.map((item) => (
                                <div key={item.project_id}>
                                    <Card elevation={5} style={{ marginBottom: theme.spacing(3) }} >
                                        <CardContent className={classes.infoContent}>
                                            <ValidatorForm
                                                useref='form'
                                                onSubmit={handleSubmit}
                                                noValidate
                                            >
                                                <Typography variant="h6">{item.project_title}</Typography>
                                                <Divider style={{ margin: theme.spacing(2) }} />
                                                <LocalizationProvider dateAdapter={DateAdapter}>
                                                    <Grid container spacing={3}>
                                                        <Input name="project_description" label="Project Description" value={item.project_description} read="true" />
                                                        <Grid item xs={6} >
                                                            <DateTimePicker
                                                                label="Project Submission Date"
                                                                name="group_submission_date"
                                                                value={item.group_submission_date}
                                                                onChange={() => { }}
                                                                renderInput={(params) => <TextField {...params} />}
                                                                readOnly
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} >
                                                            <DateTimePicker
                                                                label="Project Submission Date"
                                                                name="project_submission_date"
                                                                value={item.project_submission_date}
                                                                onChange={() => { }}
                                                                renderInput={(params) => <TextField {...params} />}
                                                                readOnly
                                                            />
                                                        </Grid>
                                                        {userId && userId?.role === 'Student' &&
                                                            <Grid item xs={12} sm={12} >
                                                                {isIn && isIn?.find((u) => u.project_id === item.project_id && u.group_id != null) ?
                                                                    <Typography> </Typography>
                                                                    :
                                                                    <Typography> You have not joined a group yet! </Typography>
                                                                }
                                                            </Grid>
                                                        }
                                                        {userId && userId?.role === 'Teacher' &&
                                                            <Grid item xs={12} sm={12} >
                                                                <ExportGroups project_id={item.project_id} sectionid={sectionid} projectname={item.project_title} />
                                                            </Grid>
                                                        }
                                                        <Grid item xs={12} sm={12} >
                                                            {item.groups?.map((it, index) => (
                                                                <Accordion key={it.group_num} elevation={2} >
                                                                    <AccordionSummary
                                                                        expandIcon={<ExpandMore />}
                                                                        id={it.group_id}
                                                                    >
                                                                        <Typography>Group {it.group_num} | {it.group_status} </Typography>
                                                                        {isIn && isIn?.find((u) => u.group_id === it.group_id) ?
                                                                            <Typography> | Your Group </Typography>
                                                                            :
                                                                            <Typography> </Typography>
                                                                        }
                                                                    </AccordionSummary>
                                                                    <AccordionDetails>
                                                                        <GroupData group_id={it.group_id} value={it.students_array} section={sectionid} project_id={item.project_id} joined={isIn?.find((u) => u.project_id === item.project_id)} />
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            ))}
                                                        </Grid>
                                                    </Grid>
                                                </LocalizationProvider>
                                            </ValidatorForm>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </>
                        :
                        <>
                            <Card elevation={5} style={{ marginBottom: theme.spacing(3) }} >
                                <CardContent className={classes.infoContent}>
                                    <Typography variant="h6">No projects added yet. Please wait for the teacher to add projects to this course.</Typography>
                                </CardContent>
                            </Card>
                        </>
                    }
                </Grid>
                <Grid item xs={12} sm={5} md={4} >
                    <Card elevation={5}>
                        <CardContent className={classes.infoContent}>
                            <Typography variant="h5" align="center">Teacher</Typography>
                            <Divider style={{ margin: theme.spacing(2) }} sx={{ bgcolor: "primary.main" }} />
                            {teacher?.map((item) => (
                                <List key={item.user_id} dense sx={{ bgcolor: 'background.paper', padding: '4px' }} >
                                    <ListItemButton
                                        sx={{ border: 1, borderColor: 'primary.main', borderRadius: 1 }}
                                        onClick={() => navigate(`/profile/teacher/${item.user_id}`)}
                                        className={classes.menuItems}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={item?.profile_img}>
                                                <AccountCircle />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.given_name + ' ' + item.family_name}
                                            secondary={item.teacher_id}
                                        />
                                    </ListItemButton>
                                </List>
                            ))}

                            <Typography variant="h5" align="center">Students</Typography>

                            <Divider style={{ margin: theme.spacing(2) }} sx={{ bgcolor: "primary.main" }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    {student ?
                                        <>
                                            {student?.map((ite) => (
                                                <List key={ite.user_id} dense sx={{ bgcolor: 'background.paper', padding: '4px' }} >
                                                    <ListItemButton
                                                        sx={{ border: 1, borderColor: 'primary.main', borderRadius: 1 }}
                                                        onClick={() => navigate(`/profile/student/${ite.user_id}`)}
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar src={ite?.profile_img}>
                                                                <AccountCircle />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={ite.given_name + ' ' + ite.family_name}
                                                            secondary={ite.student_id}

                                                        />
                                                    </ListItemButton>
                                                </List>
                                            ))}
                                        </>
                                        :
                                        <Typography variant="h6" align="center">No Students in course</Typography>
                                    }

                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container >
    );
}

export default Section;