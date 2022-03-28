import React, { useState } from "react";
import Input from "./Input";
import useStyles from './styles'
import { useNavigate } from "react-router-dom";
//// UI Imports ////
import { Button, Typography, Container, Grid, Card, CardContent, Divider, useTheme, ToggleButtonGroup, ToggleButton } from '@mui/material';
//// API Imports ////
import { useRegisterStudentMutation, useRegisterTeacherMutation } from "../../services/auth";
import ControlledSelect from "../../containers/home/ControlledSelect";

const studentInitial = { given_name: '', family_name: '', gender: '', email: '', password: '', student_id: '', study_program: '', study_year: '', stregnths: '', weaknesses: '', personality_type: '' };
const teacherInitial = { given_name: '', family_name: '', gender: '', email: '', password: '', teacher_id: '', department: '', postition: '' };


const Register = () => {
    const theme = useTheme();
    const classes = useStyles()
    const navigate = useNavigate();
    const [studentFormData, setStudentFormData] = useState({ given_name: '', family_name: '', gender: '', email: '', password: '', student_id: '', study_program: '', study_year: '', stregnths: '', weaknesses: '', personality_type: '' });
    const [teacherFormData, setTeacherFormData] = useState(teacherInitial);
    const [isSignup, setIsSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const [alignment, setAlignment] = useState('student');
    const gender = ["Male", "Female"];
    const year = ["2015/2016", "2016/2017", "2017/2018", "2018/2019", "2019/2020", "2020/2021", "2021/2022", "2022/2023"];
    const personalities = ["D-Dominate", "I-Influencing", "S-Steady", "C-Cautious"];

    const [registerStudent, { data: studentData, isError: sIsError, error: sError }] = useRegisterStudentMutation();
    const [registerTeacher, { data: teacherData, isError: tIsError, error: tError }] = useRegisterTeacherMutation();

    const switchMode = () => {
        setStudentFormData(studentInitial);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (alignment === 'student') {
            registerStudent(studentFormData);
            navigate('/login');
        } else if (alignment === 'teacher') {
            registerTeacher(teacherFormData);
            navigate('/login');
        }
    }
    const handleChangeStudent = (e) => setStudentFormData({ ...studentFormData, [e.target.name]: e.target.value });
    const handleChangeTeacher = (e) => setTeacherFormData({ ...teacherFormData, [e.target.name]: e.target.value });
    const handleChange2 = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
        }
    };

    return (
        <Container maxWidth={'100vh'} spacing={20} style={{ minHeight: "100vh", background: 'linear-gradient( #edf3f7, #93c3d9)' }} >
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent='center'
                style={{ minHeight: "100vh" }}
            >
                <Grid item >
                    <Typography variant="h2" color={'#001531'} style={{ marginBottom: '50px', fontWeight: 800 }} >
                        Group Management System
                    </Typography>
                </Grid>
                <Grid item>
                    <Card elevation={16} style={{ height: '100%', maxWidth: '50vh', backgroundColor: '#edf3f7', borderRadius: 15 }}>
                        <CardContent className={classes.infoContent}>
                            <form noValidate onSubmit={handleSubmit}>
                                <Typography variant="h4" align="center" style={{ fontWeight: 400 }}>{alignment === 'student' ? 'Register Student' : 'Register Teacher'}</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <Grid container spacing={3} justifyContent={'center'}>
                                    {alignment === 'student' && (
                                        <>
                                            <Input name="given_name" label="First Name" handleChange={handleChangeStudent} autoFocus half />
                                            <Input name="family_name" label="Last Name" handleChange={handleChangeStudent} half />
                                            <Input name="email" label="Email Address" handleChange={handleChangeStudent} type="email" />
                                            <Grid item xs={6} >
                                                <ControlledSelect name="gender" value={studentFormData.gender} options={gender} handleChange={handleChangeStudent} minWidth={"100%"} general={"Gender"} />
                                            </Grid>
                                            <Input name="student_id" label="Student ID" handleChange={handleChangeStudent} half />
                                            <Input name="study_program" label="Study Program" handleChange={handleChangeStudent} half />
                                            <Grid item xs={6} >
                                                <ControlledSelect name="study_year" value={studentFormData.study_year} options={year} handleChange={handleChangeStudent} minWidth={"100%"} general={"Study Year"} />
                                            </Grid>
                                            <Input name="stregnths" label="Strengths/Skills" handleChange={handleChangeStudent} />
                                            <Input name="weaknesses" label="Weaknesses" handleChange={handleChangeStudent} />
                                            <Grid item xs={12} >
                                                <Card elevation={2} variant="outlined" style={{ backgroundColor: '#e4f0f7', borderRadius: 6, padding: '4px' }}>
                                                    <Grid container spacing={1} justifyContent={'center'}>
                                                        <Grid item xs={12} >
                                                            <ControlledSelect name="personality_type" value={studentFormData.personality_type} options={personalities} handleChange={handleChangeStudent} minWidth={"100%"} general={"Personality Type"} />
                                                        </Grid>
                                                        <Grid item xs={12} >
                                                            <Typography variant="body1" style={{ fontWeight: 500 }}>
                                                                Personanality types are used in this system to help group you with students of different personality types. There are four main personality types that represent the DISC personality test: Dominate, Influencing, Steady and Cautious. If you do not know your personality type plase take a short 12 question test below to find out.
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <Button fullWidth variant="outlined" color="primary" className={classes.submit} onClick={() => window.open("https://www.onlinepersonalitytests.org/disc/", "_blank")} >
                                                                Take Test
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                            <Input name="password" label="Password" handleChange={handleChangeStudent} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                                            <Input name="password" label="Repeat Password" handleChange={handleChangeStudent} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                                        </>
                                    )}
                                    {alignment === 'teacher' && (
                                        <>
                                            <Input name="given_name" label="First Name" handleChange={handleChangeTeacher} autoFocus half />
                                            <Input name="family_name" label="Last Name" handleChange={handleChangeTeacher} half />
                                            <Input name="email" label="Email Address" handleChange={handleChangeTeacher} type="email" />
                                            <Grid item xs={6} >
                                                <ControlledSelect name="gender" value={teacherFormData.gender} options={gender} handleChange={handleChangeTeacher} minWidth={"100%"} general={"Gender"} />
                                            </Grid>
                                            <Input name="teacher_id" label="Teacher ID" handleChange={handleChangeTeacher} half />
                                            <Input name="department" label="Department" handleChange={handleChangeTeacher} half />
                                            <Input name="postition" label="Position" handleChange={handleChangeTeacher} half />
                                            <Input name="password" label="Password" handleChange={handleChangeTeacher} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                                            <Input name="password" label="Repeat Password" handleChange={handleChangeStudent} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                                        </>
                                    )}
                                    <Grid item xs={12}>
                                        <ToggleButtonGroup
                                            color="primary"
                                            value={alignment}
                                            exclusive
                                            onChange={handleChange2}
                                            fullWidth
                                        >
                                            <ToggleButton value="student">Student</ToggleButton>
                                            <ToggleButton value="teacher">Teacher</ToggleButton>
                                        </ToggleButtonGroup>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button type="submit" fullWidth variant="contained" color="primary" size="large" className={classes.submit}>
                                            Sign Up
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="flex-end" style={{ marginTop: theme.spacing(2) }}>
                                    <Grid item>
                                        <Button onClick={() => navigate('/login')}>
                                            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container >
    )
}

export default Register;