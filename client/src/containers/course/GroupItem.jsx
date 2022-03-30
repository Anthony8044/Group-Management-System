import { AccountCircle, Add, AddCircle, Delete, Minimize, Person, PersonAdd, RemoveCircle } from '@mui/icons-material';
import { Avatar, Dialog, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useJoinGroupMutation, useLeaveGroupMutation } from '../../services/project';
import { useGetSectionStudentsQuery } from '../../services/student';
import { UserContext } from '../UserContext';
import PropTypes from 'prop-types';




const emails = ['Tom Smith', 'Harry Millar', 'Fiona Jones', 'Steven Park'];

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Invite Classmates</DialogTitle>
            <List sx={{ pt: 0 }}>
                {emails.map((email) => (
                    <ListItem button onClick={() => handleListItemClick(email)} key={email}>
                        <ListItemAvatar>
                            <Person />
                        </ListItemAvatar>
                        <ListItemText primary={email} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export const GroupItem = ({ value, itemNum, section, group_id, project_id, joined }) => {
    const userId = useContext(UserContext);
    const [isEmpty, setIsEmpty] = useState(true);

    const { data: student } = useGetSectionStudentsQuery(section, {
        selectFromResult: ({ data }) => ({ data: data?.find((u) => u.user_id === value), }),
    });
    const [joinGroup, { error: sError, isSuccess: sSuccess }] = useJoinGroupMutation();
    const [leaveGroup] = useLeaveGroupMutation();

    useEffect(() => {
        if (student?.user_id === value) {
            setIsEmpty(false);
        } else {
            setIsEmpty(true);
        }
    }, [student?.user_id, value]);

    const joinSubmit = async () => {
        await joinGroup({
            "group_id": group_id,
            "project_id": project_id,
            "course_id": section,
            "group_position": itemNum,
            "user_id": userId?.user_id
        });
    };
    const leaveSubmit = async () => {
        await leaveGroup({
            "group_id": group_id,
            "course_id": section,
            "group_position": itemNum,
            "user_id": userId?.user_id
        });
    };

    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(emails[1]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <>
            <List dense >
                <Divider />
                <ListItem
                    secondaryAction={
                        <>
                            {isEmpty && joined?.group_id === null &&
                                <IconButton edge="end" aria-label="add" onClick={() => joinSubmit()}>
                                    <AddCircle />
                                </IconButton>
                            }
                            {joined?.group_id != null && userId?.user_id === value &&
                                <IconButton edge="end" aria-label="add" onClick={() => leaveSubmit()}>
                                    <RemoveCircle />
                                </IconButton>
                            }
                            {joined?.group_id != null && joined?.group_id === group_id && joined?.array_position != itemNum &&
                                <IconButton edge="end" aria-label="add" onClick={handleClickOpen}>
                                    <PersonAdd />
                                </IconButton>
                            }
                        </>
                    }
                >
                    <ListItemAvatar>
                        <Avatar>
                            <AccountCircle />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={isEmpty ? "Empty Slot " + itemNum : student?.given_name + " " + student?.family_name}
                        secondary={isEmpty ? "Empty Slot " + itemNum : student?.student_id}
                    />
                </ListItem>
                <Divider />
                <SimpleDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                />
            </List>
        </>
    );
};

export default GroupItem;