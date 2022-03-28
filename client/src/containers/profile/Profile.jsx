import React, { useState, useEffect, useContext } from "react";
import useStyles from './styles'
import FileBase from 'react-file-base64';
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import Input from "../../components/login&register/Input";
import { UserContext } from '../UserContext';
//// UI Imports ////
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider, Box, IconButton, CardMedia, Chip } from '@mui/material';
import dom from "../../assets/dom.jpg"
import pic1 from "../../assets/pic1.jpg"
//// API Imports ////
import { useGetStudentQuery, useUpdateStudentMutation } from "../../services/student";
import { useGetTeacherQuery, useUpdateTeacherMutation } from "../../services/teacher";
import { toast } from 'react-toastify';
import { ConnectWithoutContact, RecordVoiceOver, Bolt } from "@mui/icons-material";


const Profile = () => {
    const theme = useTheme()
    const classes = useStyles()
    const { id } = useParams();
    const userId = useContext(UserContext);
    const [studentLogin, setStudentLogin] = useState(false);
    const [teacherLogin, setTeacherLogin] = useState(false);
    const [isErr, setIsErr] = useState("");
    const [isSucc, setIsSucc] = useState(false);

    const { data: student } = useGetStudentQuery(id, { skip: studentLogin });
    const { data: teacher } = useGetTeacherQuery(id, { skip: teacherLogin });
    const [updateStudent, { error: sError, isSuccess: sSuccess }] = useUpdateStudentMutation();
    const [updateTeacher, { error: tError, isSuccess: tSuccess }] = useUpdateTeacherMutation();


    const [studentData, setStudentData] = useState({
        given_name: '',
        family_name: '',
        gender: '',
        email: '',
        profile_img: '',
        study_program: '',
        study_year: '',
        student_id: '',
        stregnths: 'Public Speaking, Fast Learner, Leadership, Java, Hardworking ',
        weaknesses: 'Impatient, Work balance',
        personality_type: 'Dominant'
    });
    const [teacherData, setTeacherData] = useState({
        given_name: '',
        family_name: '',
        gender: '',
        email: '',
        profile_img: '',
        department: '',
        postition: '',
        teacher_id: ''
    });

    useEffect(() => {
        if (student?.user_id) {
            setStudentData(student);
        } else if (teacher?.user_id) {
            setTeacherData(teacher);
        }

    }, [student?.user_id, teacher?.user_id]);

    // useEffect(() => {
    //     if (userId?.role === "Student") {
    //         setStudentLogin(false);
    //     } else if (userId?.role === "Teacher") {
    //         setTeacherLogin(false);
    //     }
    // }, [userId?.role]);

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

    const handleChange = (e) => setStudentData({ ...studentData, [e.target.name]: e.target.value });
    const handleChange2 = (e) => setTeacherData({ ...teacherData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await updateStudent(studentData);
    }
    const handleSubmit2 = async (e) => {
        e.preventDefault();

        await updateTeacher(teacherData);

    }


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
            toast.success("Succesfully Updated!", {
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



    return (
        <Container maxWidth="xl" >
            {renderError()}
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Profile</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            {student &&
                <Grid container spacing={6}>
                    <Grid item xs={12} md={7} >
                        <Card elevation={5} style={{ height: '100%' }}>
                            <Avatar
                                className={classes.avatar}
                                src={''}
                            />
                            <CardContent className={classes.profileTitle}>
                                <Typography gutterBottom variant="h5" component="div">
                                    {studentData?.given_name} {studentData?.family_name}
                                </Typography>
                                <Typography gutterBottom variant="h6" component="div">
                                    {studentData?.student_id}
                                </Typography>
                            </CardContent>
                            <CardActions style={{ justifyContent: 'center' }}>
                                {(userId?.user_id === student?.user_id) &&
                                    <>
                                        <Button variant="outlined" color="primary" size="Small" >Upload Image</Button>
                                        <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="Small" type="submit" >Update</Button>
                                    </>
                                }

                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                    <Typography variant="h6" align="center">Personal Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />

                                    <Grid container spacing={3}>
                                        {(userId?.user_id === student?.user_id) ? (
                                            <>
                                                <Input name="given_name" label="Given Name" value={studentData?.given_name} handleChange={handleChange} />
                                                <Input name="family_name" label="Family Name" value={studentData?.family_name} handleChange={handleChange} />
                                                <Input name="email" label="Email" value={studentData?.email} handleChange={handleChange} />
                                                <Input name="gender" label="Gender" value={studentData?.gender} handleChange={handleChange} />
                                            </>
                                        ) :
                                            <>
                                                <Input name="given_name" label="Given Name" value={studentData?.given_name} handleChange={handleChange} read="true" half />
                                                <Input name="family_name" label="Family Name" value={studentData?.family_name} handleChange={handleChange} read="true" half />
                                                <Input name="email" label="Email" value={studentData?.email} handleChange={handleChange} read="true" />
                                                <Input name="student_id" label="Student ID" value={studentData?.student_id} handleChange={handleChange} read="true" half />
                                                <Input name="gender" label="Gender" value={studentData?.gender} handleChange={handleChange} read="true" half />
                                            </>
                                        }
                                    </Grid>

                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                    <Typography variant="h6">Student Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === student?.user_id) ? (
                                            <>
                                                <Input name="student_id" label="Student ID" value={studentData?.student_id} handleChange={handleChange} />
                                                <Input name="study_program" label="Study Program" value={studentData?.study_program} handleChange={handleChange} />
                                                <Input name="study_year" label="Study Year" value={studentData?.study_year} handleChange={handleChange} />
                                            </>
                                        ) :
                                            <>
                                                <Input name="study_program" label="Study Program" value={studentData?.study_program} handleChange={handleChange} read="true" half />
                                                <Input name="study_year" label="Study Year" value={studentData?.study_year} handleChange={handleChange} read="true" half />
                                                <Input name="email" label="Email" value={studentData?.email} handleChange={handleChange} read="true" />
                                                <Input name="student_id" label="Student ID" value={studentData?.student_id} handleChange={handleChange} read="true" />
                                            </>
                                        }
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                    <Typography variant="h6">Character Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === student?.user_id) ? (
                                            <>
                                                <Input name="stregnths" label="Strengths/Skills" value={studentData?.stregnths} handleChange={handleChange} />
                                                <Input name="weaknesses" label="Weaknesses" value={studentData?.weaknesses} handleChange={handleChange} />
                                                <Input name="personality_type" label="Personality Type" value={studentData?.personality_type} handleChange={handleChange} />
                                            </>
                                        ) :
                                            <>
                                                <Input name="stregnths" label="Strengths/Skills" value={studentData?.stregnths} handleChange={handleChange} />
                                                <Input name="weaknesses" label="Weaknesses" value={studentData?.weaknesses} handleChange={handleChange} />
                                                <Input name="personality_type" label="Study Year" value={studentData?.personality_type} handleChange={handleChange} />
                                            </>
                                        }
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card sx={{ display: 'flex', height: '250px', alignItems: 'felx-start', backgroundColor: '#e4f0f7' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography component="div" variant="h5">
                                        Dominant
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" component="div">
                                        The D Personality Style tends to be direct and decisive, sometimes described as dominant. They would prefer to lead than follow and tend towards leadership and management positions. They tend to have high self-confidence and are risk-takers and problem-solvers, enabling others to look to them for decisions and direction. They tend to be self-starters.
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '40px' }}>
                                    <Chip icon={<RecordVoiceOver />} label="Loud" />
                                    <Chip icon={<Bolt />} label="Energetic" />
                                    <Chip icon={<ConnectWithoutContact />} label="Social" />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 400, display: 'flex' }}
                                    image={dom}
                                    alt="Live from space album cover"
                                />
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            }


            {
                teacher &&
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4} >
                        <Card elevation={5} style={{ height: '100%' }}>
                            <Avatar
                                className={classes.avatar}
                                src={teacherData?.profile_img}
                            />
                            <CardContent className={classes.profileTitle}>
                                <Typography gutterBottom variant="h5" component="div">
                                    {teacherData?.given_name} {teacherData?.family_name}
                                </Typography>
                                <Typography gutterBottom variant="h6" component="div">
                                    {teacherData?.teacher_id}
                                </Typography>
                            </CardContent>
                            <CardActions style={{ justifyContent: 'center' }}>
                                {(userId?.user_id === teacher?.user_id) &&
                                    <>
                                        <Button variant="outlined" color="primary" size="Small" >Upload Image</Button>
                                        <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="Small" type="submit" >Update</Button>
                                    </>
                                }

                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <form autoComplete="off" noValidate onSubmit={handleSubmit2}>
                                    <Typography variant="h6">Personal Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === teacher?.user_id) ? (
                                            <>
                                                <Input name="given_name" label="Given Name" value={teacherData?.given_name} handleChange={handleChange2} half />
                                                <Input name="family_name" label="Family Name" value={teacherData?.family_name} handleChange={handleChange2} half />
                                                <Input name="email" label="Email" value={teacherData?.email} handleChange={handleChange2} />
                                                <Input name="teacher_id" label="Teacher ID" value={teacherData?.teacher_id} handleChange={handleChange2} half />
                                                <Input name="gender" label="Gender" value={teacherData?.gender} handleChange={handleChange2} half />
                                            </>
                                        ) :
                                            <>
                                                <Input name="given_name" label="Given Name" value={teacherData?.given_name} handleChange={handleChange2} read="true" half />
                                                <Input name="family_name" label="Family Name" value={teacherData?.family_name} handleChange={handleChange2} read="true" half />
                                                <Input name="email" label="Email" value={teacherData?.email} handleChange={handleChange2} read="true" />
                                                <Input name="teacher_id" label="Teacher ID" value={teacherData?.teacher_id} handleChange={handleChange2} read="true" half />
                                                <Input name="gender" label="Gender" value={teacherData?.gender} handleChange={handleChange2} read="true" half />
                                            </>
                                        }
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <form autoComplete="off" noValidate onSubmit={handleSubmit2}>
                                    <Typography variant="h6">Teacher Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === teacher?.user_id) ? (
                                            <>
                                                <Input name="department" label="Department" value={teacherData?.department} handleChange={handleChange2} half />
                                                <Input name="postition" label="Position" value={teacherData?.postition} handleChange={handleChange2} half />
                                                <Input name="teacher_id" label="Teacher ID" value={teacherData?.teacher_id} handleChange={handleChange2} />
                                            </>
                                        ) :
                                            <>
                                                <Input name="department" label="Department" value={teacherData?.department} handleChange={handleChange2} read="true" half />
                                                <Input name="postition" label="Position" value={teacherData?.postition} handleChange={handleChange2} read="true" half />
                                                <Input name="teacher_id" label="Teacher ID" value={teacherData?.teacher_id} handleChange={handleChange2} read="true" />
                                            </>
                                        }
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            }
        </Container >
    );
}

export default Profile;
