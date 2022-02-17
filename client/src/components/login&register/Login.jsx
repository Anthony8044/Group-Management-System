import React, { useState } from "react";
import { Button, Typography, Container, Grid, Card, CardContent, Divider, useTheme } from '@mui/material';
import { useDispatch } from "react-redux";
import Input from "./Input";
import useStyles from './styles'
import { signin } from '../../actions/auth';
import { useNavigate } from "react-router-dom";

const initialState = { email: '', password: '' };


const Login = () => {
    const theme = useTheme();
    const classes = useStyles()
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(signin(formData, navigate))
    }
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
                                <Typography variant="h6" align="center">Sign in</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <Grid container spacing={3} justifyContent={'center'}>
                                    <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                                    <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                                    <Grid item xs={6}>
                                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                            Sign In
                                        </Button>
                                    </Grid>
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