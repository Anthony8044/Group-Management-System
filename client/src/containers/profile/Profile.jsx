import React, { useState, useEffect, useContext } from "react";
import useStyles from './styles'
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import Input from "../../components/login&register/Input";
import { UserContext } from '../UserContext';
import { ValidatorForm } from "react-material-ui-form-validator";
//// UI Imports ////
import { Button, Typography, Container, Grid, CardContent, Card, CardActions, Avatar, Divider, Box, IconButton, CardMedia, Chip, TextField, Dialog, DialogTitle, DialogContent, ListItemButton, ListItemAvatar, DialogActions, List } from '@mui/material';
import { useSnackbar } from 'notistack';
//// API Imports ////
import { useGetStudentQuery, useUpdateStudentMutation } from "../../services/student";
import { useGetTeacherQuery, useUpdateTeacherMutation } from "../../services/teacher";
import { ConnectWithoutContact, RecordVoiceOver, Bolt, AccountCircle } from "@mui/icons-material";
import ProfilePersonalityBar from "../../components/ProfilePersonalityBar";
import ControlledSelect from "../home/ControlledSelect";


const Profile = () => {
    const theme = useTheme()
    const classes = useStyles()
    const { sid, tid } = useParams();
    const userId = useContext(UserContext);
    const [studentLogin, setStudentLogin] = useState(false);
    const [teacherLogin, setTeacherLogin] = useState(false);
    const [isErr, setIsErr] = useState("");
    const [isSucc, setIsSucc] = useState(false);
    const [baseImage, setBaseImage] = useState("");
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState("");
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { data: student } = useGetStudentQuery(sid, { skip: sid ? false : true });
    const { data: teacher } = useGetTeacherQuery(tid, { skip: tid ? false : true });
    const [updateStudent, { error: sError, isSuccess: sSuccess, reset: sReset }] = useUpdateStudentMutation();
    const [updateTeacher, { error: tError, isSuccess: tSuccess, reset: tReset }] = useUpdateTeacherMutation();

    const gender = ["Male", "Female"];
    const year = ["2015/2016", "2016/2017", "2017/2018", "2018/2019", "2019/2020", "2020/2021", "2021/2022", "2022/2023"];
    const personalities = ["D-Dominate", "I-Influencing", "S-Steady", "C-Cautious"];
    const [studentData, setStudentData] = useState({
        given_name: '',
        family_name: '',
        gender: '',
        email: '',
        profile_img: '',
        study_program: '',
        study_year: '',
        student_id: '',
        strenghts: '',
        weeknesses: '',
        personality_type: ''
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
        if (sError) {
            enqueueSnackbar(sError?.data.message, { variant: "error" });
            sReset();
        }
        if (sSuccess) {
            enqueueSnackbar("Successfully Updated!", { variant: "success" });
            sReset();
        }
    }, [sError?.data, sSuccess]);

    useEffect(() => {
        if (tError) {
            enqueueSnackbar(tError?.data.message, { variant: "error" });
            tReset();
        }
        if (tSuccess) {
            enqueueSnackbar("Successfully Updated!", { variant: "success" });
            tReset();
        }
    }, [tError?.data, tSuccess]);

    useEffect(() => {
        if (student?.user_id) {
            setStudentData(student);
        } else if (teacher?.user_id) {
            setTeacherData(teacher);
        }

    }, [student?.user_id, teacher?.user_id]);

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

    const avatar = [
        "/images/1.svg",
        "/images/2.svg",
        "/images/3.svg",
        "/images/4.svg",
        "/images/5.svg",
        "/images/6.svg",
        "/images/7.svg",
        "/images/8.svg",
        "/images/9.svg",
        "/images/10.svg"
    ];

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedValue("");
    };
    const handleListItemClick = (path) => {
        setSelectedValue(path);
    };
    const handleSubmit3 = () => {
        setStudentData({ ...studentData, profile_img: selectedValue });
        setOpen(false);
        setTimeout(() => { setSelectedValue(""); }, 1000);
    };
    const handleSubmit4 = () => {
        setTeacherData({ ...teacherData, profile_img: selectedValue });
        setOpen(false);
        setTimeout(() => { setSelectedValue(""); }, 1000);
    };


    return (
        <Container maxWidth="xl" >
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Profile</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />
            {student &&
                <ValidatorForm
                    useref='form'
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={7} >
                            <Card elevation={5} style={{ height: '100%' }}>
                                <Avatar
                                    className={classes.avatar}
                                    src={studentData?.profile_img}
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
                                            <Button variant="outlined" color="primary" size="Small" onClick={handleClickOpen} >Choose Avatar</Button>
                                            <Dialog
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogTitle id="alert-dialog-title">
                                                    Choose Avatar
                                                </DialogTitle>
                                                <DialogContent>
                                                    {avatar?.map((ite) => (
                                                        <List key={ite} sx={{ bgcolor: 'background.paper', padding: '4px' }} >
                                                            <ListItemButton
                                                                sx={{ border: 1, borderColor: 'primary.main', borderRadius: 20, justifyContent: 'center' }}
                                                                onClick={() => handleListItemClick(ite)}
                                                                selected={selectedValue === ite ? true : false}
                                                                classes={{ selected: classes.selected }}
                                                            >
                                                                <Avatar src={ite} sx={{ width: 60, height: 60 }} />
                                                            </ListItemButton>
                                                        </List>
                                                    ))}
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button disabled={selectedValue ? false : true} autoFocus onClick={handleSubmit3}>
                                                        Choose
                                                    </Button>
                                                    <Button onClick={handleClose} autoFocus >Close</Button>
                                                </DialogActions>
                                            </Dialog>
                                            <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="Small" type="submit" >Update</Button>
                                        </>
                                    }
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Card elevation={5} style={{ height: '100%' }}>
                                <CardContent className={classes.infoContent}>
                                    <Typography variant="h6" align="center">Personal Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />

                                    <Grid container spacing={3}>
                                        {(userId?.user_id === student?.user_id) ? (
                                            <>
                                                <Input name="given_name" label="Given Name" value={studentData?.given_name} handleChange={handleChange} validators={['required']} errorMessages={['This field is required']} />
                                                <Input name="family_name" label="Family Name" value={studentData?.family_name} handleChange={handleChange} validators={['required']} errorMessages={['This field is required']} />
                                                <Input name="email" label="Email" value={studentData?.email} handleChange={handleChange} validators={['required', 'isEmail']} errorMessages={['This field is required', 'Email is not valid']} />
                                                <Grid item xs={12} >
                                                    <ControlledSelect name="gender" value={studentData?.gender} options={gender} handleChange={handleChange} minWidth={"100%"} general={"Gender"} validators={['required']} errorMessages={['This field is required']} />
                                                </Grid>
                                            </>
                                        ) :
                                            <>
                                                <Input name="given_name" label="Given Name" value={studentData?.given_name} handleChange={handleChange} read="true" />
                                                <Input name="family_name" label="Family Name" value={studentData?.family_name} handleChange={handleChange} read="true" />
                                                <Input name="email" label="Email" value={studentData?.email} handleChange={handleChange} read="true" />
                                                <Input name="gender" label="Gender" value={studentData?.gender} handleChange={handleChange} read="true" />
                                            </>
                                        }
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Card elevation={5} style={{ height: '100%' }}>
                                <CardContent className={classes.infoContent}>
                                    <Typography variant="h6">Student Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === student?.user_id) ? (
                                            <>
                                                <Input name="student_id" label="Student ID" value={studentData?.student_id} handleChange={handleChange} validators={['required', 'isNumber', 'minNumber:11111111']} errorMessages={['This field is required', 'Must be a number', 'Must be 8 digits long']} />
                                                <Input name="study_program" label="Study Program" value={studentData?.study_program} handleChange={handleChange} validators={['required']} errorMessages={['This field is required']} />
                                                <Grid item xs={12} >
                                                    <ControlledSelect name="study_year" value={studentData?.study_year} options={year} handleChange={handleChange} minWidth={"100%"} general={"Study Year"} validators={['required']} errorMessages={['This field is required']} />
                                                </Grid>
                                            </>
                                        ) :
                                            <>
                                                <Input name="student_id" label="Student ID" value={studentData?.student_id} handleChange={handleChange} read="true" />
                                                <Input name="study_program" label="Study Program" value={studentData?.study_program} handleChange={handleChange} read="true" />
                                                <Input name="study_year" label="Study Year" value={studentData?.study_year} handleChange={handleChange} read="true" />
                                            </>
                                        }
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Card elevation={5} style={{ height: '100%' }}>
                                <CardContent className={classes.infoContent}>
                                    <Typography variant="h6">Character Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === student?.user_id) ? (
                                            <>
                                                <Input name="strenghts" label="Strengths/Skills" value={studentData?.strenghts} handleChange={handleChange} validators={['required']} errorMessages={['This field is required']} />
                                                <Input name="weeknesses" label="Weaknesses" value={studentData?.weeknesses} handleChange={handleChange} validators={['required']} errorMessages={['This field is required']} />
                                                <Grid item xs={12} >
                                                    <ControlledSelect name="personality_type" value={studentData.personality_type} options={personalities} handleChange={handleChange} minWidth={"100%"} general={"Personality Type"} validators={['required']} errorMessages={['This field is required']} />
                                                </Grid>
                                            </>
                                        ) :
                                            <>
                                                <Input name="strenghts" label="Strengths/Skills" value={studentData?.strenghts} handleChange={handleChange} read="true" />
                                                <Input name="weeknesses" label="Weaknesses" value={studentData?.weeknesses} handleChange={handleChange} read="true" />
                                                <Input name="personality_type" label="Study Year" value={studentData?.personality_type} handleChange={handleChange} read="true" />
                                            </>
                                        }
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <ProfilePersonalityBar personalityType={studentData?.personality_type} />
                        </Grid>
                    </Grid>
                </ValidatorForm>
            }


            {
                teacher &&
                <ValidatorForm
                    useref='form'
                    onSubmit={handleSubmit2}
                    noValidate
                >
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
                                            <Button variant="outlined" color="primary" size="Small" onClick={handleClickOpen} >Choose Avatar</Button>
                                            <Dialog
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogTitle id="alert-dialog-title">
                                                    Choose Avatar
                                                </DialogTitle>
                                                <DialogContent>
                                                    {avatar?.map((ite) => (
                                                        <List key={ite} sx={{ bgcolor: 'background.paper', padding: '4px' }} >
                                                            <ListItemButton
                                                                sx={{ border: 1, borderColor: 'primary.main', borderRadius: 20, justifyContent: 'center' }}
                                                                onClick={() => handleListItemClick(ite)}
                                                                selected={selectedValue === ite ? true : false}
                                                                classes={{ selected: classes.selected }}
                                                            >
                                                                <Avatar src={ite} sx={{ width: 60, height: 60 }} />
                                                            </ListItemButton>
                                                        </List>
                                                    ))}
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button disabled={selectedValue ? false : true} autoFocus onClick={handleSubmit4}>
                                                        Choose
                                                    </Button>
                                                    <Button onClick={handleClose} autoFocus >Close</Button>
                                                </DialogActions>
                                            </Dialog>
                                            <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="Small" type="submit" >Update</Button>
                                        </>
                                    }
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Card elevation={5} style={{ height: '100%' }}>
                                <CardContent className={classes.infoContent}>
                                    <Typography variant="h6">Personal Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === teacher?.user_id) ? (
                                            <>
                                                <Input name="given_name" label="Given Name" value={teacherData?.given_name} handleChange={handleChange2} half validators={['required']} errorMessages={['This field is required']} />
                                                <Input name="family_name" label="Family Name" value={teacherData?.family_name} handleChange={handleChange2} half validators={['required']} errorMessages={['This field is required']} />
                                                <Input name="email" label="Email" value={teacherData?.email} handleChange={handleChange2} validators={['required', 'isEmail']} errorMessages={['This field is required', 'Email is not valid']} />
                                                <Grid item xs={12} >
                                                    <ControlledSelect name="gender" value={teacherData?.gender} options={gender} handleChange={handleChange2} minWidth={"100%"} general={"Gender"} validators={['required']} errorMessages={['This field is required']} />
                                                </Grid>
                                            </>
                                        ) :
                                            <>
                                                <Input name="given_name" label="Given Name" value={teacherData?.given_name} handleChange={handleChange2} read="true" half />
                                                <Input name="family_name" label="Family Name" value={teacherData?.family_name} handleChange={handleChange2} read="true" half />
                                                <Input name="email" label="Email" value={teacherData?.email} handleChange={handleChange2} read="true" />
                                                <Input name="gender" label="Gender" value={teacherData?.gender} handleChange={handleChange2} read="true" />
                                            </>
                                        }
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Card elevation={5} style={{ height: '100%' }}>
                                <CardContent className={classes.infoContent}>
                                    <Typography variant="h6">Teacher Information</Typography>
                                    <Divider style={{ margin: theme.spacing(2) }} />
                                    <Grid container spacing={3}>
                                        {(userId?.user_id === teacher?.user_id) ? (
                                            <>
                                                <Input name="department" label="Department" value={teacherData?.department} handleChange={handleChange2} half validators={['required']} errorMessages={['This field is required']} />
                                                <Input name="postition" label="Position" value={teacherData?.postition} handleChange={handleChange2} half validators={['required']} errorMessages={['This field is required']} />
                                                <Input name="teacher_id" label="Teacher ID" value={teacherData?.teacher_id} handleChange={handleChange2} validators={['required', 'isNumber', 'minNumber:11111111']} errorMessages={['This field is required', 'Must be a number', 'Must be 8 digits long']} />
                                            </>
                                        ) :
                                            <>
                                                <Input name="department" label="Department" value={teacherData?.department} handleChange={handleChange2} read="true" half />
                                                <Input name="postition" label="Position" value={teacherData?.postition} handleChange={handleChange2} read="true" half />
                                                <Input name="teacher_id" label="Teacher ID" value={teacherData?.teacher_id} handleChange={handleChange2} read="true" />
                                            </>
                                        }
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            }
        </Container >

    );
}

export default Profile;
