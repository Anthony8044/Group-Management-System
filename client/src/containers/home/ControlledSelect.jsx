import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { SelectValidator } from 'react-material-ui-form-validator';

export const ControlledSelect = ({ name, value, options, onFocus, handleChange, onBlur, minWidth, student, course, teacher, formation, general, errorMessages, validators }) => {
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
        <FormControl variant="outlined" fullWidth>
            {student &&
                <>
                    <InputLabel id="demo-simple-select-outlined-label">Students</InputLabel>
                    <Select
                        name={name}
                        value={localValue}
                        onFocus={handleFocus}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Students"
                    >
                        {options?.map(option => {
                            return (

                                <MenuItem key={option.user_id} value={option.user_id}>
                                    {option.given_name + " " + option.family_name + " | " + option?.student_id}
                                </MenuItem>

                            );
                        })}
                    </Select>
                </>
            }
            {course &&
                <>
                    <InputLabel >Course Code</InputLabel>
                    <Select
                        name={name}
                        value={localValue}
                        onFocus={handleFocus}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Course Code"
                    >
                        {options?.map(option => {
                            return (

                                <MenuItem key={option.course_id} value={option.course_id}>
                                    {option.course_id}
                                </MenuItem>

                            );
                        })}
                    </Select>
                </>
            }
            {teacher &&
                <>
                    <InputLabel >Teacher</InputLabel>
                    <Select
                        name={name}
                        value={localValue}
                        onFocus={handleFocus}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Teacher"
                    >
                        {options?.map(option => {
                            return (

                                <MenuItem key={option.user_id} value={option.user_id}>
                                    {option.given_name + " " + option.family_name}
                                </MenuItem>

                            );
                        })}
                    </Select>
                </>
            }
            {formation &&
                <>
                    <InputLabel>Formation Type</InputLabel>
                    <Select
                        name={name}
                        value={localValue}
                        onFocus={handleFocus}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Formation Type"
                    >
                        {options?.map(option => {
                            return (

                                <MenuItem key={option.id} value={option.type}>
                                    {option.type}
                                </MenuItem>

                            );
                        })}
                    </Select>
                </>
            }
            {general &&
                <>
                    <SelectValidator
                        name={name}
                        value={localValue}
                        onFocus={handleFocus}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        validators={validators}
                        errorMessages={errorMessages}
                        label={general}
                        sx={{ minWidth: minWidth }}
                    >
                        {options?.map(option => {
                            return (

                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>

                            );
                        })}
                    </SelectValidator>
                </>
            }
        </FormControl>
    );
};

export default ControlledSelect;