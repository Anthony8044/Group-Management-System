import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const Input = ({ name, handleChange, value, label, half, autoFocus, read, type, handleShowPassword, isFormInvalid, errorMessage, errorMessages, validators }) => (
  <Grid item xs={12} sm={half ? 6 : 12} >
    <TextValidator
      name={name}
      variant="outlined"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      value={value}
      onChange={handleChange}
      validators={validators}
      errorMessages={errorMessages}
      InputProps={{
        readOnly: read ? true : false,
        inputProps: { min: 0, max: 10 },
        endAdornment: (
          < InputAdornment position="end" >
            {name === 'password' &&
              <IconButton onClick={handleShowPassword}>
                {type === 'password' ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            }
          </InputAdornment>
        )
      }
      }
    />
  </Grid >
);

export default Input;