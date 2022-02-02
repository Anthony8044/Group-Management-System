import React, { useState } from "react";
import { Button, Typography, Container, Grid, Card, CardContent, Divider, useTheme } from '@mui/material';
import { useDispatch } from "react-redux";
import Input from "./Input";
import useStyles from './styles'
import { signin, signup } from '../../actions/auth';
import { useNavigate } from "react-router-dom";

const initialState = { firstName: '', lastName: '', studentID: '', email: '', password: '', confirmPassword: '', profileImg: '' };


const RegisterStudent = () => {
    const theme = useTheme();
    const classes = useStyles()
    const [formData, setFormData] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const switchMode = () => {
        setFormData(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const dispatch = useDispatch();
    const history = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(isSignup){
            dispatch(signup(formData, history))
        } else {
            dispatch(signin(formData, history))            
        }
    }
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

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
                            <Typography variant="h6">{isSignup ? 'Register' : 'Sign in'}</Typography>
                            <Divider style={{ margin: theme.spacing(2) }} />
                            <Grid container spacing={3} justifyContent={'center'}>
                                {isSignup && (
                                    <>
                                        <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                        <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                    </>
                                )}
                                <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                                <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                                {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                                <Grid item xs={6}>
                                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                        {isSignup ? 'Sign Up' : 'Sign In'}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="flex-end" style={{ marginTop: theme.spacing(2) }}>
                                <Grid item>
                                    <Button onClick={switchMode}>
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

export default RegisterStudent;