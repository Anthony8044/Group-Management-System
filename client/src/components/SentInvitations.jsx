import { Delete } from '@mui/icons-material';
import { Avatar, Card, CardContent, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import { useAcceptInviteMutation, useGetInviteSentQuery, useGetStudentInviteQuery, useRejectInviteMutation } from '../services/project';
import AlertDialog from './AlertDialog';
import { useSnackbar } from 'notistack';

export default function SentInvitations({ userId }) {
    const theme = useTheme();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { data: studentInvites } = useGetInviteSentQuery(userId, {
        skip: userId ? false : true,
    });
    const [regjectInvite, { isError: rIsError, error: rError, isSuccess: rSuccess, reset }] = useRejectInviteMutation();

    const removeInvite = async (invite_id) => {
        await regjectInvite({
            "invite_id": invite_id
        });
    };

    React.useEffect(() => {
        if (rSuccess) {
            enqueueSnackbar('Successfully deleted invitation', { variant: "success" });
            reset();
        }
    }, [rSuccess]);

    return (
        <Card elevation={5} style={{ marginTop: '30px' }}>
            <CardContent style={{ margin: theme.spacing(2) }} >
                <Typography variant="h5" textAlign={'center'}>Sent Invitations</Typography>
                <Divider style={{ margin: theme.spacing(2) }} sx={{ bgcolor: "primary.main" }} />
                <div style={{ height: '242px', overflow: 'auto' }}>
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
                                            <ListItemButton >
                                                <ListItemAvatar>
                                                    <Avatar alt={item.given_name} src="/static/images/avatar/1.jpg" />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={' You invited ' + item.given_name + ' ' + item.family_name + ' to join'}
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
                                </div>
                            ))}
                        </>
                        :
                        <Typography variant="h6" textAlign={'center'}>You have not sent any invitations</Typography>
                    }
                </div>
            </CardContent>
        </Card>
    );
}