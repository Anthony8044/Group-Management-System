import { AccountCircle, Add, Group } from '@mui/icons-material';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGetSectionStudentsQuery } from '../../services/student';
import GroupItem from './GroupItem';

export const GroupData = ({ value, section, group_id, project_id, joined }) => {


    return (
        <>
            {value && value?.map((it, index) => (
                <GroupItem key={index} value={it} itemNum={index + 1} section={section} group_id={group_id} project_id={project_id} joined={joined} />
            ))}

        </>
    );
};

export default GroupData;