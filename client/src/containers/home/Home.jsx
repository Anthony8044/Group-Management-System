import React, { useState, useEffect, useContext } from "react";
import useStyles from './styles'
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import FileBase from 'react-file-base64';
import Input from "../../components/login&register/Input";
import ControlledSelect from "./ControlledSelect";
import { UserContext } from "../UserContext";
//// UI Imports ////
import { toast } from 'react-toastify';
import { TableBody, Paper, Table, Avatar, Button, Card, CardContent, CardMedia, Chip, Container, Divider, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme, CardActionArea } from "@mui/material";
import dom from "../../assets/dom.jpg"
import D from "../../assets/D.jpg"
import I from "../../assets/I.jpg"
import S from "../../assets/S.jpg"
import C from "../../assets/C.jpg"
//// API Imports ////
import { useGetStudentsQuery } from "../../services/student";
import { useGetTeachersQuery } from "../../services/teacher";
import { useCreateCourseMutation, useGetAllCoursesQuery, useRegisterCourseMutation } from "../../services/course";
import { AccountCircle, Add, Bolt, ConnectWithoutContact, Delete, Minimize, RecordVoiceOver, Star } from "@mui/icons-material";
import { Box } from "@mui/system";
import { ValidatorForm } from "react-material-ui-form-validator";


const Home = () => {
    const theme = useTheme();
    const classes = useStyles();
    const userId = useContext(UserContext);
    const [newCourseData, setNewCourseData] = useState({ code: '', sections: '', course_title: '', instructor_id: '' });
    const [regCourseData, setRegCourseData] = useState({ course_id: '', user_id: '' });
    const [isErr, setIsErr] = useState("");
    const [isSucc, setIsSucc] = useState(false);

    const { data: student } = useGetStudentsQuery();
    const { data: teacher } = useGetTeachersQuery();
    const { data: allCourses, isError: cErr, error: cErrMsg } = useGetAllCoursesQuery();
    const [createCourse, { error: sError, isSuccess: sSuccess }] = useCreateCourseMutation();
    const [registerCourse, { error: tError, isSuccess: tSuccess }] = useRegisterCourseMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createCourse(newCourseData);
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        await registerCourse(regCourseData);
    };

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
            toast.success("Registered Succesfully!", {
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

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Interactive Computer Graphics', 'COMP0001-1', 15, 2, 1),
        createData('Computer Science for Dummies', 'COMP4036-1', 10, 1, 0),
        createData('Computer Algorithms', 'COMP4097-1', 30, 2, 1),
        createData('Introduction to English', 'ENG2045-1', 25, 1, 1),
        createData('Intro to Mathematics ', 'MATH2056-1', 10, 1, 0),
    ];

    const hCNewCourse = (e) => setNewCourseData({ ...newCourseData, [e.target.name]: e.target.value });

    const hCCourseCode = (e) => setRegCourseData({ ...regCourseData, [e.target.name]: e.target.value });

    return (
        <Container maxWidth="xl">
            {renderError()}
            <Typography variant="h4" color="primary" style={{ margin: theme.spacing(2) }}  >Home</Typography>
            <Divider style={{ margin: theme.spacing(2) }} />

            {userId?.role === "Student" &&
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7} >

                        <Card elevation={5} style={{ height: '120px' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h4">Welcome back, Sammuel Chan!</Typography>
                            </CardContent>
                        </Card>
                        <Card elevation={5} style={{ marginTop: '30px', height: '576px' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h5" textAlign={'center'}>Your Courses</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Course Name</TableCell>
                                                <TableCell align="center">Course Code</TableCell>
                                                <TableCell align="center">Student #</TableCell>
                                                <TableCell align="center">Project #</TableCell>
                                                <TableCell align="center">Projects Joined</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow
                                                    key={row.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="center">{row.calories}</TableCell>
                                                    <TableCell align="center">{row.fat}</TableCell>
                                                    <TableCell align="center">{row.carbs}</TableCell>
                                                    <TableCell align="center">{row.protein}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>

                    </Grid>
                    <Grid item xs={12} md={5} >
                        <Card elevation={5} style={{ height: '400px' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h5" textAlign={'center'}>Invitations</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                    <ListItem
                                        alignItems="flex-start"
                                        secondaryAction={
                                            <>
                                                <IconButton edge="end" aria-label="add">
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        }
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Sarah has invited you"
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            COMP0001-1
                                                        </Typography>
                                                        {" — Group 4"}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem
                                        alignItems="flex-start"
                                        secondaryAction={
                                            <>
                                                <IconButton edge="end" aria-label="add">
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        }
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Metthew has invited you"
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            COMP4097-1
                                                        </Typography>
                                                        {" — Group 2"}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem
                                        alignItems="flex-start"
                                        secondaryAction={
                                            <>
                                                <IconButton edge="end" aria-label="add">
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        }
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Tim has invited you"
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            COMP0001-1
                                                        </Typography>
                                                        {" — Group 3"}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                        <Card elevation={5} style={{ marginTop: '30px' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h5" textAlign={'center'}>Favorites</Typography>
                                <Divider />
                                <List
                                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                                    aria-label="contacts"
                                >
                                    <ListItem secondaryAction={
                                        <>
                                            <IconButton edge="end" aria-label="add">
                                                <Star />
                                            </IconButton>
                                        </>
                                    }
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AccountCircle />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Sarah Chan"
                                                secondary="18403841"
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    <ListItem secondaryAction={
                                        <>
                                            <IconButton edge="end" aria-label="add">
                                                <Star />
                                            </IconButton>
                                        </>
                                    }
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AccountCircle />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Mathew Lau"
                                                secondary="18358712"
                                            />
                                        </ListItemButton>
                                    </ListItem>

                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card elevation={5} sx={{ height: '390px', backgroundColor: '#fffff', padding: '2px' }}>
                            <Typography variant="h4" textAlign={'center'}>D.I.S.C Personality Types</Typography>
                            <Divider style={{ margin: theme.spacing(1) }} />
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '325px', backgroundColor: '#57ffe3' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={D}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    DOMINANT
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    Team members are great bottom-line organizers, place high value on time, can handle multiple tasks at once.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '325px', backgroundColor: '#f7baba' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={I}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    INFLUENTIAL
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    Team members are great communicators and motivate others to thrive, have a positive sense of humor and negotiate well.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '325px', backgroundColor: '#e6ffde' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={S}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    STEADY
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    Team members are reliable and dependable, maintain harmony, loyal, patient and trustworthy.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '325px', backgroundColor: '#d6edff' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={C}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    COMPLIANT
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    Team members are great with facts and information, incredible analyzers and developers, and focused on maintaining quality.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid >
            }

            {userId?.role === "Teacher" &&
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7} >

                        <Card elevation={5} style={{ height: '120px' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h4">Welcome back, Mr. Matthew Chau!</Typography>
                            </CardContent>
                        </Card>
                        <Card elevation={5} style={{ marginTop: '30px', height: '576px' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h5" textAlign={'center'}>Your Courses</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Course Name</TableCell>
                                                <TableCell align="center">Course Code</TableCell>
                                                <TableCell align="center">Student #</TableCell>
                                                <TableCell align="center">Project #</TableCell>
                                                <TableCell align="center">Projects Joined</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow
                                                    key={row.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="center">{row.calories}</TableCell>
                                                    <TableCell align="center">{row.fat}</TableCell>
                                                    <TableCell align="center">{row.carbs}</TableCell>
                                                    <TableCell align="center">{row.protein}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>

                    </Grid>
                    <Grid item xs={12} md={5} >
                        <Card elevation={5} style={{ height: '100%' }}>
                            <CardContent className={classes.infoContent}>
                                <Typography variant="h6">Create New Course</Typography>
                                <Divider style={{ margin: theme.spacing(2) }} />
                                <ValidatorForm
                                    useref='form'
                                    onSubmit={handleSubmit}
                                    noValidate
                                >
                                    <Grid container spacing={3}>
                                        <Input name="code" label="Course Code" value={newCourseData.course_code} handleChange={hCNewCourse} validators={['required']} errorMessages={['This field is required']} />
                                        <Input name="sections" label="Number of Sections" value={newCourseData.course_section} handleChange={hCNewCourse} validators={['required']} errorMessages={['This field is required']} />
                                        <Input name="course_title" label="Course Title" value={newCourseData.course_title} handleChange={hCNewCourse} validators={['required']} errorMessages={['This field is required']} />
                                        <Grid item xs={12} >
                                            <ControlledSelect name="instructor_id" value={newCourseData.instructor_id} options={teacher} handleChange={hCNewCourse} minWidth={"100%"} teacher={true} validators={['required']} errorMessages={['This field is required']} />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Button style={{ display: 'flex !important', justifyContent: 'right !important' }} variant="contained" color="primary" size="large" type="submit" >Create Course</Button>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Card elevation={5} sx={{ height: '390px', backgroundColor: '#fffff', padding: '2px' }}>
                            <Typography variant="h4" textAlign={'center'}>D.I.S.C Personality Types</Typography>
                            <Divider style={{ margin: theme.spacing(1) }} />
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '325px', backgroundColor: '#57ffe3' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={D}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    DOMINANT
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    Team members are great bottom-line organizers, place high value on time, can handle multiple tasks at once.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '325px', backgroundColor: '#f7baba' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={I}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    INFLUENTIAL
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    Team members are great communicators and motivate others to thrive, have a positive sense of humor and negotiate well.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '325px', backgroundColor: '#e6ffde' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={S}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    STEADY
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    Team members are reliable and dependable, maintain harmony, loyal, patient and trustworthy.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={3}>
                                    <Card sx={{ height: '325px', backgroundColor: '#d6edff' }} >
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={C}
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom textAlign={'center'} variant="h5" component="div">
                                                    COMPLIANT
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    Team members are great with facts and information, incredible analyzers and developers, and focused on maintaining quality.
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid >
            }

        </Container >
    )
}

export default Home;