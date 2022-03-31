import * as React from 'react';
import useStyles from './styles'
import { UserContext } from '../containers/UserContext';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SnackbarToast from './SnackbarToast';
import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { AccountCircle, Person } from '@mui/icons-material';
import { useGetSectionStudentsQuery } from '../services/student';
import { useInviteMutation } from '../services/project';
import AlertDialog from './AlertDialog';

export default function AlertInvite({ isOpen, section, project_id, group_id, group_num, group_position, }) {
    const classes = useStyles();
    const userId = React.useContext(UserContext);
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [openSucc, setOpenSucc] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState("");

    const { data: studentList } = useGetSectionStudentsQuery(section);
    const [inviteStudent, { isError: isError, error: iError, isSuccess: iSuccess, reset }] = useInviteMutation();

    React.useEffect(() => {
        if (isOpen) {
            setOpen(true);
        }

        if (isError) {
            setOpen2(true);
            setTimeout(() => { setOpen2(false); }, 1000);
        } else if (iSuccess) {
            setOpenSucc(true);
            setTimeout(() => { setOpenSucc(false); }, 1000);
        }
    }, [isOpen, isError, iSuccess]);


    const handleClose = () => {
        setOpen(false);
        setSelectedValue("");
        reset();
    };

    const handleListItemClick = (user_id) => {
        setSelectedValue(user_id);
    };

    const handleSubmit = async () => {
        await inviteStudent({
            "sender_id_fk": userId?.user_id,
            "recipient_id_fk": selectedValue,
            "section_id_fk": section,
            "project_id_fk": project_id,
            "group_id_fk": group_id,
            "group_num": group_num,
            "group_position": group_position
        });
    };

    const handleClickOpen = () => {
        setOpen2(true);
        setTimeout(() => { setOpen2(false); }, 1000);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Invite Classmate
            </DialogTitle>
            <DialogContent>
                {studentList?.map((ite) => (
                    <List key={ite.user_id} dense sx={{ bgcolor: 'background.paper', padding: '4px' }} >
                        <ListItemButton
                            sx={{ border: 1, borderColor: 'primary.main', borderRadius: 1 }}
                            onClick={() => handleListItemClick(ite.user_id)}
                            selected={selectedValue === ite.user_id ? true : false}
                            classes={{ selected: classes.selected }}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <AccountCircle />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={ite.given_name + ' ' + ite.family_name}
                                secondary={ite.student_id}

                            />
                        </ListItemButton>
                        <SnackbarToast openned={openSucc} message={"Successfully sent invitation to " + ite.given_name + ' ' + ite.family_name} />
                    </List>
                ))}
            </DialogContent>
            <DialogActions>
                <Button disabled={selectedValue ? false : true} autoFocus onClick={handleSubmit}>
                    Invite
                </Button>
                <Button onClick={handleClose} >Close</Button>
            </DialogActions>
            <AlertDialog alertTitle={'Error!'} alertMessage={iError?.data.message} isOpen={open2} />
        </Dialog>
    );
}