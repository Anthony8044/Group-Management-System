import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Input = ({ name, handleChange, value, label, half, autoFocus, read, type, handleShowPassword, isFormInvalid, errorMessage }) => (
  <Grid item xs={12} sm={half ? 6 : 12} >
    <TextField
      error={isFormInvalid}
      helperText={isFormInvalid && errorMessage}
      name={name}
      variant="outlined"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      value={value}
      onChange={handleChange}
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