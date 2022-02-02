import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Input = ({ name, handleChange, value, label, half, autoFocus, read, type, handleShowPassword }) => (
  <Grid item xs={12} sm={half ? 6 : 12} >
    <TextField
      name={name}
      variant="outlined"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      value={value}
      onChange={handleChange}
      InputProps={name === 'password' ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleShowPassword}>
              {type === 'password' ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      } : null,
        read === 'true'? { readOnly: true } : null
      }
    />
  </Grid>
);

export default Input;