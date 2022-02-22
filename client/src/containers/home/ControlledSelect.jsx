import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export const ControlledSelect = ({ name, value, options, onFocus, handleChange, onBlur, minWidth, user }) => {
    const [localValue, setLocalValue] = useState(value ?? '');
    useEffect(() => setLocalValue(value ?? ''), [value]);
    const handleFocus = () => {
        if (onFocus) {
            onFocus();
        }
    };

    const handleBlur = (e) => {
        if (onBlur) {
            onBlur(e.target.value);
        }
    };
    return (
        <FormControl variant="outlined" sx={{ m: 1, minWidth: minWidth }}>
            {user ? (
                <InputLabel >Users</InputLabel>
            )
                :
                <InputLabel >Course Code</InputLabel>
            }
            <Select
                name={name}
                value={localValue}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
            >
                {options?.map(option => {
                    return (

                        <MenuItem key={user ? option.user_id : option.course_id} value={user ? option.user_id : option.course_id}>
                            {user ? (option.given_name + " " + option.family_name + " | " + option?.student_id) : option.course_id}
                        </MenuItem>

                    );
                })}
            </Select>
        </FormControl>
    );
};

export default ControlledSelect;