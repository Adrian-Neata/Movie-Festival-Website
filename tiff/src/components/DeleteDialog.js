import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default function DeleteDialog(props) {

    const handleCloseDeleteDialog = () => {
        props.setOpenDeleteDialog(false);
    }

    return (
        <>

        <Dialog
          open={props.openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this entry?"}</DialogTitle>
  
          <DialogActions>
            <Button onClick={() => {handleCloseDeleteDialog()}} color="primary">
              Cancel
            </Button>
            <Button onClick={() => {handleCloseDeleteDialog(); props.deleteEntry();}} color="primary" autoFocus>
              Apply
            </Button>
          </DialogActions>
        </Dialog>
        </>
    )
}