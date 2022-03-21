import { AccountCircle, Add, Delete, Minimize } from '@mui/icons-material';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useJoinGroupMutation, useLeaveGroupMutation } from '../../services/project';
import { useGetSectionStudentsQuery } from '../../services/student';
import { UserContext } from '../UserContext';

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

    return (
        <>
            <List >
                <ListItem
                    secondaryAction={
                        <>
                            {isEmpty && !joined &&
                                <IconButton edge="end" aria-label="add" onClick={() => joinSubmit()}>
                                    <Add />
                                </IconButton>
                            }
                            {joined && userId?.user_id === value &&
                                <IconButton edge="end" aria-label="add" onClick={() => leaveSubmit()}>
                                    <Minimize />
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
                        secondary={isEmpty ? "" : student?.student_id}
                    />
                </ListItem>
            </List>
        </>
    );
};

export default GroupItem;