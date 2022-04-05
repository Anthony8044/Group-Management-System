import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import { Button, Grid, TextField } from '@mui/material';
import * as React from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { useDeleteProjectMutation, useUpdateProjectMutation } from '../services/project';
import ExportGroups from './ExportGroups';
import Input from './login&register/Input';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { useSnackbar } from 'notistack';

export const UpdateProject = ({ project_title, project_description, group_submission_date, project_submission_date, project_id, sectionid, course_code }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [projectData, setProjectData] = React.useState({
        project_id: project_id,
        project_title: project_title,
        project_description: project_description,
        course_code: course_code
    });

    const [updateProject, { error: sError, isSuccess: sSuccess, reset: sReset }] = useUpdateProjectMutation();
    const [deleteProject, { isError: rIsError, error: rError, isSuccess: rSuccess, reset: rReset }] = useDeleteProjectMutation();

    React.useEffect(() => {
        if (sError) {
            enqueueSnackbar(sError?.data.message, { variant: "error" });
            sReset();
        }
        if (sSuccess) {
            enqueueSnackbar("Successfully Updated!", { variant: "success" });
            sReset();
        }
        if (rSuccess) {
            enqueueSnackbar("Successfully Deleted!", { variant: "success" });
            rReset();
        }
    }, [sError?.data, sSuccess, rSuccess]);

    const handleChange = (e) => setProjectData({ ...projectData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await updateProject(projectData);
    }

    const removeProject = async (project_id) => {
        await deleteProject({
            "project_id": project_id
        });
    };



    return (
        <>
            <ValidatorForm
                useref='form'
                onSubmit={handleSubmit}
                noValidate
            >
                <LocalizationProvider dateAdapter={DateAdapter}>
                    <Grid container spacing={3} marginBottom={2} justifyContent="center" alignItems="center">
                        <Input name="project_title" label="Project Title" handleChange={handleChange} value={projectData.project_title} validators={['required']} errorMessages={['This field is required']} />
                        <Input name="project_description" label="Project Description" handleChange={handleChange} value={projectData.project_description} validators={['required']} errorMessages={['This field is required']} />
                        <Grid item xs={6} >
                            <DateTimePicker
                                label="Group Members Submission Date"
                                name="group_submission_date"
                                value={group_submission_date}
                                onChange={() => { }}
                                renderInput={(params) => <TextField {...params} />}
                                readOnly
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <DateTimePicker
                                label="Project Submission Date"
                                name="project_submission_date"
                                value={project_submission_date}
                                onChange={() => { }}
                                renderInput={(params) => <TextField {...params} />}
                                readOnly
                            />
                        </Grid>
                        <Grid item xs={4} >
                            <ExportGroups project_id={project_id} sectionid={sectionid} projectname={project_title} />
                        </Grid>
                        <Grid item xs={4} >
                            <Button variant="contained" color="primary" size="Small" type="submit" >Update</Button>
                        </Grid>
                        <Grid item xs={4} >
                            <Button variant="contained" color="primary" size="Small" onClick={() => removeProject(project_id)} >Delete</Button>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </ValidatorForm>
        </>
    );
}

export default UpdateProject;