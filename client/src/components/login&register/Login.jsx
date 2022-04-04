import React, { useEffect, useState } from "react";
import Input from "./Input";
import useStyles from './styles'
import { useNavigate } from "react-router-dom";
//// UI Imports ////
import { Button, Typography, Container, Grid, Card, CardContent, Divider, useTheme, Paper, CardMedia, Avatar, SvgIcon } from '@mui/material';
//// API Imports ////
import { useLoginMutation } from "../../services/auth";
import { ValidatorForm } from "react-material-ui-form-validator";
import AlertDialog from "../AlertDialog";
import { Box } from "@mui/system";


const initialState = { email: '', password: '' };


const Login = () => {
    const theme = useTheme();
    const classes = useStyles()
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const [loginUser, { data, isError, error }] = useLoginMutation();


    useEffect(() => {
        if (data && data.token) {
            localStorage.setItem('profile', JSON.stringify({ ...data }));
            navigate('/');
        }
        if (isError) {
            setErrorMsg(error.data.message);
        } else {
            setErrorMsg("");
        }
    }, [data, isError]);


    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        await loginUser(formData);
    }

    return (
        <Container maxWidth={'100vh'} spacing={20} style={{ minHeight: "100vh", background: 'linear-gradient( #edf3f7, #93c3d9)' }} >
            <AlertDialog alertTitle={'Error!'} alertMessage={errorMsg} isOpen={isError} />
            <Grid container justifyContent='center'>
                <Grid item sx={8} md={12}>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        style={{ minHeight: "100vh" }}
                    >
                        <Grid item>
                            <Box component="img" src="/images/Main_a.png" sx={{ height: { xs: 200, md: 250 } }} className={classes.mainLogo} />
                        </Grid>
                        <Grid item>
                            <Card elevation={16} style={{ height: '100%', maxWidth: '50vh', backgroundColor: '#edf3f7', borderRadius: 15 }} >
                                <CardContent className={classes.infoContent} >
                                    <ValidatorForm
                                        useref='form'
                                        onSubmit={handleSubmit}
                                        noValidate
                                    >
                                        <Typography variant="h4" align="center" style={{ fontWeight: 400 }}>Sign in</Typography>
                                        <Divider style={{ margin: theme.spacing(2) }} />
                                        <Grid container spacing={3} justifyContent={'center'}>
                                            <Input name="email" label="Email Address" handleChange={handleChange} value={formData.email} type="email" validators={['required', 'isEmail']} errorMessages={['This field is required', 'Email is not valid']} />
                                            <Input name="password" label="Password" handleChange={handleChange} value={formData.password} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} validators={['required']} errorMessages={['This field is required']} />
                                            <Grid item xs={6}>
                                                <Button type="submit" fullWidth variant="contained" color="primary" size="large" className={classes.submit}>
                                                    Sign In
                                                </Button>
                                            </Grid>
                                            {/* {errorMsg &&
                                        <Typography variant="h7" align="center">{errorMsg}</Typography>
                                    } */}
                                        </Grid>
                                        <Grid container justifyContent="flex-end" style={{ marginTop: theme.spacing(2) }}>
                                            <Grid item>
                                                <Button onClick={() => navigate('/register')}>
                                                    Don't have an account? Register
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </ValidatorForm>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </Container >
    )
}

export default Login;