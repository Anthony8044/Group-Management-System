import { Delete } from '@mui/icons-material';
import { Avatar, Card, CardContent, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import { useAcceptInviteMutation, useGetStudentInviteQuery, useRejectInviteMutation } from '../services/project';
import AlertDialog from './AlertDialog';
import SnackbarToast from './SnackbarToast';

export default function Invitations({ userId }) {
    const theme = useTheme();
    const [openSucc, setOpenSucc] = React.useState(false);

    const { data: studentInvites } = useGetStudentInviteQuery(userId, {
        skip: userId ? false : true,
    });
    const [regjectInvite, { isError: rIsError, error: rError, isSuccess: rSuccess }] = useRejectInviteMutation();
    const [acceptInvite, { isError: aIsError, error: aError, isSuccess: aSuccess }] = useAcceptInviteMutation();

    const removeInvite = async (invite_id) => {
        await regjectInvite({
            "invite_id": invite_id
        });
    };
    const clickInvite = async (invite_id, section_id_fk, project_id_fk, group_id_fk) => {
        await acceptInvite({
            "invite_id": invite_id,
            "recipient_id_fk": userId,
            "section_id_fk": section_id_fk,
            "project_id_fk": project_id_fk,
            "group_id_fk": group_id_fk
        });
    };

    React.useEffect(() => {
        if (aSuccess) {
            setOpenSucc(true);
            setTimeout(() => { setOpenSucc(false); }, 1000);
        }
    }, [aIsError, aSuccess]);

    return (
        <Card elevation={5} >
            <CardContent style={{ margin: theme.spacing(2) }} >
                <AlertDialog alertTitle={'Error!'} alertMessage={aError?.data.message} isOpen={aIsError} />
                <Typography variant="h5" textAlign={'center'}>Invitations</Typography>
                <Divider style={{ margin: theme.spacing(2) }} sx={{ bgcolor: "primary.main" }} />
                <div style={{ height: '310px', overflow: 'auto' }}>
                    {studentInvites && studentInvites.length != 0 ?
                        <>
                            {studentInvites && studentInvites?.map((item) => (
                                <div key={item.invite_id}>
                                    <List dense key={item.invite_id} sx={{ width: '100%', bgcolor: 'background.paper', padding: '4px' }}>
                                        <ListItem
                                            alignItems="flex-start"
                                            disablePadding
                                            sx={{ border: 1, borderColor: 'primary.main', borderRadius: 1 }}
                                            secondaryAction={
                                                <>
                                                    <IconButton edge="end" aria-label="add" onClick={() => removeInvite(item.invite_id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </>
                                            }
                                        >
                                            <ListItemButton onClick={() => clickInvite(item.invite_id, item.section_id_fk, item.project_id_fk, item.group_id_fk)}>
                                                <ListItemAvatar>
                                                    <Avatar alt={item.given_name} src="/static/images/avatar/1.jpg" />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={item.given_name + ' ' + item.family_name + ' has invited you to join'}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                sx={{ display: 'inline' }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"
                                                            >
                                                                {item.section_id_fk}
                                                            </Typography>
                                                            {"— " + item.project_title + ": Group " + item.group_num}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </List>
                                    <SnackbarToast openned={openSucc} message={"Successfully joined " + item.section_id_fk + "— " + item.project_title + ": Group " + item.group_num} />
                                </div>
                            ))}
                        </>
                        :
                        <Typography variant="h6" textAlign={'center'}>You do not have any pending invitations</Typography>
                    }
                </div>
            </CardContent>
        </Card>
    );
}