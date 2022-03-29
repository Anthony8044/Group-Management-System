import React, { useEffect, useState } from "react";
import Input from "./Input";
import useStyles from './styles'
import { useNavigate } from "react-router-dom";
//// UI Imports ////
import { Button, Typography, Container, Grid, Card, CardContent, Divider, useTheme, ToggleButtonGroup, ToggleButton, Snackbar, Alert } from '@mui/material';
import { ValidatorForm } from "react-material-ui-form-validator";
//// API Imports ////
import { useRegisterStudentMutation, useRegisterTeacherMutation } from "../../services/auth";
import ControlledSelect from "../../containers/home/ControlledSelect";
import AlertDialog from "../AlertDialog";

const studentInitial = { given_name: '', family_name: '', gender: '', email: '', password: '', student_id: '', study_program: '', study_year: '', stregnths: '', weaknesses: '', personality_type: '' };
const teacherInitial = { given_name: '', family_name: '', gender: '', email: '', password: '', teacher_id: '', department: '', postition: '' };
const passwordInitial = { repeat_password: '' };


const Register = () => {
    const theme = useTheme();
    const classes = useStyles()
    const navigate = useNavigate();
    const [studentFormData, setStudentFormData] = useState({ given_name: '', family_name: '', gender: '', email: '', password: '', student_id: '', study_program: '', study_year: '', stregnths: '', weaknesses: '', personality_type: '' });
    const [rePassword, setRePassword] = useState({ repeat_password: '' });
    const [teacherFormData, setTeacherFormData] = useState({ given_name: '', family_name: '', gender: '', email: '', password: '', teacher_id: '', department: '', postition: '' });
    const [isSignup, setIsSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [alignment, setAlignment] = useState('student');
    const gender = ["Male", "Female"];
    const year = ["2015/2016", "2016/2017", "2017/2018", "2018/2019", "2019/2020", "2020/2021", "2021/2022", "2022/2023"];
    const personalities = ["D-Dominate", "I-Influencing", "S-Steady", "C-Cautious"];

    const [registerStudent, { data: studentData, isError: sIsError, error: sError, isSuccess: sisSuccess }] = useRegisterStudentMutation();
    const [registerTeacher, { data: teacherData, isError: tIsError, error: tError, isSuccess: tisSuccess }] = useRegisterTeacherMutation();

    const switchMode = () => {
        setStudentFormData(studentInitial);
        setTeacherFormData(teacherInitial);
        setRePassword(passwordInitial);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== studentFormData.password) {
                return false;
            }
            return true;
        });
        ValidatorForm.addValidationRule('isPasswordMatch2', (value) => {
            if (value !== teacherFormData.password) {
                return false;
            }
            return true;
        });
    }, [studentFormData, teacherFormData]);

    useEffect(() => {
        if (sisSuccess || tisSuccess) {
            setOpenSuccess(true);
            setTimeout(() => { navigate('/login') }, 3000);
        }
        if (sIsError) {
            setErrorMsg(sError.data.message);
        } else if (sisSuccess) {
            setErrorMsg("");
        }
        if (tIsError) {
            setErrorMsg(tError.data.message);
        } else if (tisSuccess) {
            setErrorMsg("");
        }
    }, [studentData, teacherData, sIsError, tIsError, sisSuccess, tisSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (alignment === 'student') {
            registerStudent(studentFormData);
        } else if (alignment === 'teacher') {
            registerTeacher(teacherFormData);
        }
    }
    const handleChangeStudent = (e) => setStudentFormData({ ...studentFormData, [e.target.name]: e.target.value });
    const handlePassword = (e) => setRePassword({ ...rePassword, [e.target.name]: e.target.value });
    const handleChangeTeacher = (e) => setTeacherFormData({ ...teacherFormData, [e.target.name]: e.target.value });
    const handleChange2 = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
            setRePassword(passwordInitial);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSuccess(false);
    };

    return (
        <Container maxWidth={'100vh'} spacing={20} style={{ minHeight: "100vh", background: 'linear-gradient( #edf3f7, #93c3d9)' }} >
            <AlertDialog alertTitle={'Error!'} alertMessage={errorMsg} isOpen={sIsError || tIsError} />
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openSuccess} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Succesfully Registered!
                </Alert>
            </Snackbar>
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
                            <ValidatorForm
                                useref='form'
                                onSubmit={handleSubmit}
                                noValidate
                            >
                                <Typography variant="h4" align="center" style={{ fontWeight: 400 }}>{alignment === 'student' ? 'Register Student' : 'Register Teacher'}</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <Grid container spacing={3} justifyContent={'center'}>
                                    {alignment === 'student' && (
                                        <>
                                            <Input name="given_name" label="First Name" value={studentFormData.given_name} handleChange={handleChangeStudent} autoFocus half validators={['required']} errorMessages={['This field is required']} />
                                            <Input name="family_name" label="Last Name" value={studentFormData.family_name} handleChange={handleChangeStudent} half validators={['required']} errorMessages={['This field is required']} />
                                            <Input name="email" label="Email Address" value={studentFormData.email} handleChange={handleChangeStudent} type="email" validators={['required', 'isEmail']} errorMessages={['This field is required', 'Email is not valid']} />
                                            <Grid item xs={6} >
                                                <ControlledSelect name="gender" value={studentFormData.gender} options={gender} handleChange={handleChangeStudent} minWidth={"100%"} general={"Gender"} validators={['required']} errorMessages={['This field is required']} />
                                            </Grid>
                                            <Input name="student_id" label="Student ID" value={studentFormData.student_id} handleChange={handleChangeStudent} half validators={['required', 'isNumber', 'minNumber:11111111']} errorMessages={['This field is required', 'Must be a number', 'Must be 8 digits long']} />
                                            <Input name="study_program" label="Study Program" value={studentFormData.study_program} handleChange={handleChangeStudent} half validators={['required']} errorMessages={['This field is required']} />
                                            <Grid item xs={6} >
                                                <ControlledSelect name="study_year" value={studentFormData.study_year} options={year} handleChange={handleChangeStudent} minWidth={"100%"} general={"Study Year"} validators={['required']} errorMessages={['This field is required']} />
                                            </Grid>
                                            <Input name="stregnths" label="Strengths/Skills" value={studentFormData.stregnths} handleChange={handleChangeStudent} validators={['required']} errorMessages={['This field is required']} />
                                            <Input name="weaknesses" label="Weaknesses" value={studentFormData.weaknesses} handleChange={handleChangeStudent} validators={['required']} errorMessages={['This field is required']} />
                                            <Grid item xs={12} >
                                                <Card variant="outlined" style={{ backgroundColor: '#e4f0f7', borderRadius: 6, padding: '4px' }}>
                                                    <Grid container spacing={1} justifyContent={'center'}>
                                                        <Grid item xs={12} >
                                                            <ControlledSelect name="personality_type" value={studentFormData.personality_type} options={personalities} handleChange={handleChangeStudent} minWidth={"100%"} general={"Personality Type"} validators={['required']} errorMessages={['This field is required']} />
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
                                            <Input name="password" value={studentFormData.password} label="Password" handleChange={handleChangeStudent} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} validators={['required']} errorMessages={['This field is required']} />
                                            <Input name="repeat_password" value={rePassword.repeat_password} label="Repeat Password" handleChange={handlePassword} type={'password'} validators={['isPasswordMatch', 'required']} errorMessages={['Password mismatch', 'This field is required']} />
                                        </>
                                    )}
                                    {alignment === 'teacher' && (
                                        <>
                                            <Input name="given_name" label="First Name" value={teacherFormData.given_name} handleChange={handleChangeTeacher} autoFocus half validators={['required']} errorMessages={['This field is required']} />
                                            <Input name="family_name" label="Last Name" value={teacherFormData.family_name} handleChange={handleChangeTeacher} half validators={['required']} errorMessages={['This field is required']} />
                                            <Input name="email" label="Email Address" value={teacherFormData.email} handleChange={handleChangeTeacher} type="email" validators={['required', 'isEmail']} errorMessages={['This field is required', 'Email is not valid']} />
                                            <Grid item xs={6} >
                                                <ControlledSelect name="gender" value={teacherFormData?.gender} options={gender} handleChange={handleChangeTeacher} minWidth={"100%"} general={"Gender"} validators={['required']} errorMessages={['This field is required']} />
                                            </Grid>
                                            <Input name="teacher_id" label="Teacher ID" value={teacherFormData.teacher_id} handleChange={handleChangeTeacher} half validators={['required', 'isNumber', 'minNumber:11111111']} errorMessages={['This field is required', 'Must be a number', 'Must be 8 digits long']} />
                                            <Input name="department" label="Department" value={teacherFormData.department} handleChange={handleChangeTeacher} half validators={['required']} errorMessages={['This field is required']} />
                                            <Input name="postition" label="Position" value={teacherFormData.postition} handleChange={handleChangeTeacher} half validators={['required']} errorMessages={['This field is required']} />
                                            <Input name="password" label="Password" value={teacherFormData.password} handleChange={handleChangeTeacher} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} validators={['required']} errorMessages={['This field is required']} />
                                            <Input name="repeat_password" value={rePassword.repeat_password} label="Repeat Password" handleChange={handlePassword} type={'password'} validators={['isPasswordMatch2', 'required']} errorMessages={['Password mismatch', 'This field is required']} />
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
                            </ValidatorForm>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container >
    )
}

export default Register;