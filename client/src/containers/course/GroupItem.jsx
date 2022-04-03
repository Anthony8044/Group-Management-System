import { AccountCircle, Add, AddCircle, Delete, Minimize, Person, PersonAdd, RemoveCircle } from '@mui/icons-material';
import { Avatar, Chip, Dialog, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useInviteMutation, useJoinGroupMutation, useLeaveGroupMutation } from '../../services/project';
import { useGetSectionStudentsQuery } from '../../services/student';
import { UserContext } from '../UserContext';
import PropTypes from 'prop-types';
import AlertInvite from '../../components/AlertInvite';


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

    const handleClickOpen = () => {
        setOpen(true);
        setTimeout(() => { setOpen(false); }, 1000);
    };


    return (
        <>
            <List dense sx={{ bgcolor: 'background.paper', padding: '4px' }} >
                <Divider />
                <ListItem
                    sx={{ border: 2, borderColor: 'primary.main', borderRadius: 1 }}
                    secondaryAction={
                        <>
                            {isEmpty && joined?.group_id === null &&
                                <Chip label="Join" icon={<AddCircle />} onClick={() => joinSubmit()} />
                            }
                            {joined?.group_id != null && userId?.user_id === value &&
                                <Chip label="Leave" icon={<RemoveCircle />} onClick={() => leaveSubmit()} />
                            }
                            {isEmpty && joined?.group_id === group_id && joined?.array_position != itemNum &&
                                <Chip label="Invite" icon={<PersonAdd />} onClick={handleClickOpen} />
                            }
                        </>
                    }
                >
                    <ListItemAvatar>
                        <Avatar src={student?.profile_img}>
                            <AccountCircle />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={isEmpty ? "Empty Slot " + itemNum : student?.given_name + " " + student?.family_name}
                        secondary={isEmpty ? "Empty Slot " + itemNum : student?.student_id}
                    />
                </ListItem>
                <Divider />
                <AlertInvite isOpen={open} section={section} project_id={project_id} group_id={group_id} group_num={joined?.group_num} group_position={itemNum} />
            </List>
        </>
    );
};

export default GroupItem;