import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';



export default function SchedulePage(props) {


    const handleCloseErrorDialog = () => {
        props.setOpenErrorDialog(false);
    }


    return (
        <Dialog
            open={props.openErrorDialog}
            onClose={handleCloseErrorDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Something went wrong!"}</DialogTitle>
            <DialogContent>

            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseErrorDialog} color="primary" style={{marginRight: '37%'}}>
                Close
            </Button>
            </DialogActions>
      </Dialog>
    )
}