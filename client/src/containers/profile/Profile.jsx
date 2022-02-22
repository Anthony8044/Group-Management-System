import React, { useState, useEffect } from "react";
import useStyles from './styles'
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider } from '@mui/material';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from "react-redux";
import { updateStudent } from "../../actions/student";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudents } from '../../actions/student';
import { getTeachers } from '../../actions/teacher';
import decode from 'jwt-decode';
import Input from "../../components/login&register/Input";
import { updateTeacher } from "../../api";


const Profile = () => {
    const theme = useTheme()
    const dispatch = useDispatch();
    const classes = useStyles()
    const navigate = useNavigate();
    const { id } = useParams();
    const [userId, setUserId] = useState(null);
    const student = useSelector((state) => id ? state.students.find((u) => u.user_id === id) : null);
    const teacher = useSelector((state) => id ? state.teachers.find((u) => u.user_id === id) : null);
    //const [teacher] = useSelector((state) => state.teacher);
    const loggedIn = JSON.parse(localStorage.getItem('profile'));
    useEffect(() => {
        if (loggedIn) {
            setUserId(decode(JSON.parse(localStorage.getItem('profile')).token));
        } else {
            navigate('/login');
        }
    }, []);

    // useEffect(() => {
    //     dispatch(getStudents());
    //     dispatch(getTeachers());
    // }, []);


    const [studentData, setStudentData] = useState({
        given_name: '',
        family_name: '',
        gender: '',
        role: '',
        email: '',
        profile_img: '',
        study_program: '',
        study_year: '',
        student_id: ''
    });
    const [teacherData, setTeacherData] = useState({
        given_name: '',
        family_name: '',
        gender: '',
        role: '',
        email: '',
        profile_img: '',
        department: '',
        postition: '',
        teacher_id: ''
    });
    //const user = useSelector((state) => id ? state.student.find((u) => u._id === id) : null);
    //console.log(student);

    useEffect(() => {
        if (student?.user_id) {
            setStudentData(student);
        }
        if (teacher?.user_id) {
            setTeacherData(teacher);
        }

    }, [student?.user_id, teacher?.user_id])

    // useEffect(() => {
    //     setUserId(decode(JSON.parse(localStorage.getItem('profile')).token).user_id);
    // }, []);

    // const clear = () => {
    //     setCurrentId(0);
    //     //setUserData({ password: '', email: '', firstname: '', lastname: '', studentID: '', profileImg: '' });
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(updateStudent(id, studentData));
        //window.location.reload();
    }
    const handleSubmit2 = (e) => {
        e.preventDefault();

        dispatch(updateTeacher(id, teacherData));
        //window.location.reload();
    }

    const handleChange = (e) => setStudentData({ ...studentData, [e.target.name]: e.target.value });
    const handleChange2 = (e) => setTeacherData({ ...teacherData, [e.target.name]: e.target.value });



    return (
        <Container maxWidth="xl">
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Profile</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            {student &&
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4} >
                        <Card elevation={5} style={{ height: '100%' }}>
                            <Avatar
                                className={classes.avatar}
                                src={studentData.profile_img}
                            />
                            <CardContent className={classes.profileTitle}>
                                <Typography gutterBottom variant="h5" component="div">
                                    {studentData.given_name} {studentData.family_name}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <FileBase
                                    type='file'
                                    multiple={false}
                                    onDone={({ base64 }) => setStudentData({ ...studentData, profile_img: base64 })}
                                />
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                    <Typography variant="h6">Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === student?.user_id) ? (
                                            <>
                                                <Input name="given_name" label="Given Name" value={studentData.given_name} handleChange={handleChange} half />
                                                <Input name="family_name" label="Family Name" value={studentData.family_name} handleChange={handleChange} half />
                                                <Input name="email" label="Email" value={studentData.email} handleChange={handleChange} />
                                                <Input name="student_id" label="Student ID" value={studentData.student_id} handleChange={handleChange} half />
                                                <Input name="gender" label="Gender" value={studentData.gender} handleChange={handleChange} half />
                                                <Grid item xs={12} >
                                                    <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Update</Button>
                                                </Grid>
                                            </>
                                        ) :
                                            <>
                                                <Input name="given_name" label="Given Name" value={studentData.given_name} handleChange={handleChange} read="true" half />
                                                <Input name="family_name" label="Family Name" value={studentData.family_name} handleChange={handleChange} read="true" half />
                                                <Input name="email" label="Email" value={studentData.email} handleChange={handleChange} read="true" />
                                                <Input name="student_id" label="Student ID" value={studentData.student_id} handleChange={handleChange} read="true" half />
                                                <Input name="gender" label="Gender" value={studentData.gender} handleChange={handleChange} read="true" half />
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
                                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                    <Typography variant="h6">Other Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === student?.user_id) ? (
                                            <>
                                                <Input name="study_program" label="Study Program" value={studentData.study_program} handleChange={handleChange} half />
                                                <Input name="study_year" label="Study Year" value={studentData.study_year} handleChange={handleChange} half />
                                                <Input name="email" label="Email" value={studentData.email} handleChange={handleChange} />
                                                <Input name="student_id" label="Student ID" value={studentData.student_id} handleChange={handleChange} />
                                            </>
                                        ) :
                                            <>
                                                <Input name="study_program" label="Study Program" value={studentData.study_program} handleChange={handleChange} read="true" half />
                                                <Input name="study_year" label="Study Year" value={studentData.study_year} handleChange={handleChange} read="true" half />
                                                <Input name="email" label="Email" value={studentData.email} handleChange={handleChange} read="true" />
                                                <Input name="student_id" label="Student ID" value={studentData.student_id} handleChange={handleChange} read="true" />
                                            </>
                                        }
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            }


            {teacher &&
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4} >
                        <Card elevation={5} style={{ height: '100%' }}>
                            <Avatar
                                className={classes.avatar}
                                src={teacherData.profile_img}
                            />
                            <CardContent className={classes.profileTitle}>
                                <Typography gutterBottom variant="h5" component="div">
                                    {teacherData.given_name} {teacherData.family_name}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <FileBase
                                    type='file'
                                    multiple={false}
                                    onDone={({ base64 }) => setTeacherData({ ...teacherData, profile_img: base64 })}
                                />
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <form autoComplete="off" noValidate onSubmit={handleSubmit2}>
                                    <Typography variant="h6">Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === teacher?.user_id) ? (
                                            <>
                                                <Input name="given_name" label="Given Name" value={teacherData.given_name} handleChange={handleChange2} half />
                                                <Input name="family_name" label="Family Name" value={teacherData.family_name} handleChange={handleChange2} half />
                                                <Input name="email" label="Email" value={teacherData.email} handleChange={handleChange2} />
                                                <Input name="teacher_id" label="Teacher ID" value={teacherData.teacher_id} handleChange={handleChange2} half />
                                                <Input name="gender" label="Gender" value={teacherData.gender} handleChange={handleChange2} half />
                                                <Grid item xs={12} >
                                                    <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Update</Button>
                                                </Grid>
                                            </>
                                        ) :
                                            <>
                                                <Input name="given_name" label="Given Name" value={teacherData.given_name} handleChange={handleChange2} read="true" half />
                                                <Input name="family_name" label="Family Name" value={teacherData.family_name} handleChange={handleChange2} read="true" half />
                                                <Input name="email" label="Email" value={teacherData.email} handleChange={handleChange2} read="true" />
                                                <Input name="teacher_id" label="Teacher ID" value={teacherData.teacher_id} handleChange={handleChange2} read="true" half />
                                                <Input name="gender" label="Gender" value={teacherData.gender} handleChange={handleChange2} read="true" half />
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
                                    <Typography variant="h6">Other Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === teacher?.user_id) ? (
                                            <>
                                                <Input name="department" label="Department" value={teacherData.department} handleChange={handleChange2} half />
                                                <Input name="postition" label="Position" value={teacherData.postition} handleChange={handleChange2} half />
                                                <Input name="email" label="Email" value={teacherData.email} handleChange={handleChange2} />
                                                <Input name="teacher_id" label="Teacher ID" value={teacherData.teacher_id} handleChange={handleChange2} />
                                            </>
                                        ) :
                                            <>
                                                <Input name="department" label="Department" value={teacherData.department} handleChange={handleChange2} read="true" half />
                                                <Input name="postition" label="Position" value={teacherData.postition} handleChange={handleChange2} read="true" half />
                                                <Input name="email" label="Email" value={teacherData.email} handleChange={handleChange2} read="true" />
                                                <Input name="teacher_id" label="Teacher ID" value={teacherData.teacher_id} handleChange={handleChange2} read="true" />
                                            </>
                                        }
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            }
        </Container>
    );
}

export default Profile;
