import * as React from 'react';
import { Alert, Snackbar } from '@mui/material';


export default function AlertInvite({ openned, message }) {
    const [openSuccess, setOpenSuccess] = React.useState(false);

    React.useEffect(() => {
        if (openned) {
            setOpenSuccess(true);
        }
    }, [openned]);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
    };

    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openSuccess} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}