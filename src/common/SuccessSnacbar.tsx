import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useAppDispatch, useAppSelector} from "./hooks/hooks";
import {setAppError, setAppStatus} from "../redux/appReducer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SuccessSnackbars() {

    const statusApp = useAppSelector<string | null>(state => state.app.statusApp)

    const dispatch = useAppDispatch()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppStatus('idle'))
    }

    return (
        <Stack spacing={2} sx={{width: '100%'}}>
            <Snackbar open={statusApp === 'saveSucceeded'} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>This is a success message!</Alert>
            </Snackbar>
        </Stack>
    );
}
