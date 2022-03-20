import React, { useState, useEffect, useContext } from "react";
import useStyles from './styles'
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from '../UserContext';
//// UI Imports ////
import { useTheme } from "@emotion/react";
import { AccountCircle } from "@mui/icons-material";
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, ListItemButton } from '@mui/material';
//// API Imports ////
import { useGetCourseQuery } from "../../services/course";
import { useGetStudentsQuery } from "../../services/student";
import { useGetTeachersQuery } from "../../services/teacher";
import { useGetProjectsByCourseIdQuery } from "../../services/project";
import Input from "../../components/login&register/Input";


const Section = () => {
    const theme = useTheme()
    const navigate = useNavigate();
    const classes = useStyles();
    const { sectionid } = useParams();
    const userId = useContext(UserContext);
    const [studentIn, setStudentIn] = useState(true);
    const [teacherIn, setTeacherIn] = useState(true);

    const { data: Course, isError: tErr, error: tErrMsg } = useGetCourseQuery(sectionid);
    const { data: student } = useGetStudentsQuery(undefined, {
        skip: studentIn,
        selectFromResult: ({ data }) => ({ data: data?.filter((u) => Course?.user_id.includes(u.user_id)), }),
    });
    const { data: teacher } = useGetTeachersQuery(undefined, {
        skip: teacherIn,
        selectFromResult: ({ data }) => ({ data: data?.filter((u) => Course?.instructor_id_fk === u.user_id), }),
    });
    const { data: project } = useGetProjectsByCourseIdQuery(sectionid);

    useEffect(() => {
        if (Course?.user_id) {
            setStudentIn(false);
        }
        if (Course?.user_id) {
            setTeacherIn(false);
        }
    }, [Course?.user_id]);


    return (
        <Container maxWidth="xl">
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Section</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            <Grid container spacing={4}>
                <Grid item xs={12} md={10} >
                    {project ?
                        <>
                            {project?.map((item) => (
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
                                                    {item.groups.map((it) => (
                                                        <div key={it.group_id}>
                                                            <Typography variant="h6">Group ID</Typography>
                                                            <Typography variant="h6">{it.group_id}</Typography>
                                                            <Typography variant="h6">Student ID</Typography>
                                                            {it?.students_array.map((ite, id) => (
                                                                <div key={id}>
                                                                    <Typography variant="h6">{ite}</Typography>
                                                                </div>
                                                            ))}
                                                        </div>
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
                <Grid item xs={12} md={5} >
                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <Typography variant="h5" align="center">Teacher</Typography>
                            <List >
                                {teacher?.map((item) => (
                                    <ListItemButton
                                        key={item.user_id}
                                        onClick={() => navigate(`/profile/${item.user_id}`)}
                                        className={classes.menuItems}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <AccountCircle />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.given_name + ' ' + item.family_name}
                                            secondary={item.teacher_id}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                            <Divider style={{ margin: theme.spacing(2) }} />

                            <Typography variant="h5" align="center">Students</Typography>

                            <Divider style={{ margin: theme.spacing(2) }} />
                            <Grid container spacing={2}>
                                <Grid item >
                                    <List >
                                        {student?.map((ite) => (
                                            <ListItemButton
                                                key={ite.user_id}
                                                onClick={() => navigate(`/profile/${ite.user_id}`)}
                                                className={classes.menuItems}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <AccountCircle />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={ite.given_name + ' ' + ite.family_name}
                                                    secondary={ite.student_id}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>

                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Section;