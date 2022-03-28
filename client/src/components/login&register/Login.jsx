import React, { useEffect, useState } from "react";
import Input from "./Input";
import useStyles from './styles'
import { useNavigate } from "react-router-dom";
//// UI Imports ////
import { Button, Typography, Container, Grid, Card, CardContent, Divider, useTheme, Paper } from '@mui/material';
//// API Imports ////
import { useLoginMutation } from "../../services/auth";


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
        }
        if (isError) {
            setErrorMsg(error.data.message);
        } else {
            setErrorMsg("");
        }
    }, [data, isError]);


    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await loginUser(formData);
        navigate('/');
    }

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
                    <Card elevation={16} style={{ height: '100%', maxWidth: '50vh', backgroundColor: '#edf3f7', borderRadius: 15 }} >
                        <CardContent className={classes.infoContent} >
                            <form noValidate onSubmit={handleSubmit}>
                                <Typography variant="h4" align="center" style={{ fontWeight: 400 }}>Sign in</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <Grid container spacing={3} justifyContent={'center'}>
                                    <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                                    <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                                    <Grid item xs={6}>
                                        <Button type="submit" fullWidth variant="contained" color="primary" size="large" className={classes.submit}>
                                            Sign In
                                        </Button>
                                    </Grid>
                                    {errorMsg &&
                                        <Typography variant="h7" align="center">{errorMsg}</Typography>
                                    }
                                </Grid>
                                <Grid container justifyContent="flex-end" style={{ marginTop: theme.spacing(2) }}>
                                    <Grid item>
                                        <Button onClick={() => navigate('/register')}>
                                            Don't have an account? Register
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

export default Login;