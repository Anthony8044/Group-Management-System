import React, { useState } from "react";
import { Button, Typography, Container, Grid, Card, CardContent, Divider, useTheme, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useDispatch } from "react-redux";
import Input from "./Input";
import useStyles from './styles'
import { signin, registerStudent, registerTeacher } from '../../actions/auth';
import { useNavigate } from "react-router-dom";

const studentInitial = { given_name: '', family_name: '', gender: '', email: '', password: '', student_id: '', study_program: '', study_year: '' };
const teacherInitial = { given_name: '', family_name: '', gender: '', email: '', password: '', teacher_id: '', department: '', postition: '' };


const Register = () => {
    const theme = useTheme();
    const classes = useStyles()
    const [studentFormData, setStudentFormData] = useState(studentInitial);
    const [teacherFormData, setTeacherFormData] = useState(teacherInitial);
    const [isSignup, setIsSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const [alignment, setAlignment] = useState('student');

    const switchMode = () => {
        setStudentFormData(studentInitial);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const dispatch = useDispatch();
    const history = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (alignment === 'student') {
            dispatch(registerStudent(studentFormData, history))
        } else if (alignment === 'teacher') {
            dispatch(registerTeacher(teacherFormData, history))
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
        <Container maxWidth="sm">
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
                style={{ minHeight: "100vh" }}
                spacing={5}
            >
                <Grid item >
                    <Card elevation={5} style={{ height: '100%' }}>
                        <CardContent className={classes.infoContent}>
                            <form noValidate onSubmit={handleSubmit}>
                                <Typography variant="h6" align="center">{alignment === 'student' ? 'Register Student' : 'Register Teacher'}</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <Grid container spacing={3} justifyContent={'center'}>
                                    {alignment === 'student' && (
                                        <>
                                            <Input name="given_name" label="First Name" handleChange={handleChangeStudent} autoFocus half />
                                            <Input name="family_name" label="Last Name" handleChange={handleChangeStudent} half />
                                            <Input name="email" label="Email Address" handleChange={handleChangeStudent} type="email" />
                                            <Input name="gender" label="Gender" handleChange={handleChangeStudent} />
                                            <Input name="student_id" label="Student ID" handleChange={handleChangeStudent} />
                                            <Input name="study_program" label="Study Program" handleChange={handleChangeStudent} half />
                                            <Input name="study_year" label="Study Year" handleChange={handleChangeStudent} half />
                                            <Input name="password" label="Password" handleChange={handleChangeStudent} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                                        </>
                                    )}
                                    {alignment === 'teacher' && (
                                        <>
                                            <Input name="given_name" label="First Name" handleChange={handleChangeTeacher} autoFocus half />
                                            <Input name="family_name" label="Last Name" handleChange={handleChangeTeacher} half />
                                            <Input name="email" label="Email Address" handleChange={handleChangeTeacher} type="email" />
                                            <Input name="gender" label="Gender" handleChange={handleChangeTeacher} />
                                            <Input name="teacher_id" label="Teacher ID" handleChange={handleChangeTeacher} />
                                            <Input name="department" label="Department" handleChange={handleChangeTeacher} half />
                                            <Input name="postition" label="Position" handleChange={handleChangeTeacher} half />
                                            <Input name="password" label="Password" handleChange={handleChangeTeacher} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
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
                                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                            Sign Up
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="flex-end" style={{ marginTop: theme.spacing(2) }}>
                                    <Grid item>
                                        <Button onClick={() => history('/login')}>
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