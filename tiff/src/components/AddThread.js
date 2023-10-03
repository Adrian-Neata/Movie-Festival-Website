import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
    helper: {
      color: 'red',
      fontWeight: 'bold',
    },
}));

export default function AddThread(props={}) {
    const classes = useStyles();
    const [refresh, setRefresh] = React.useState(false)

    const [threadDetails, setThreadDetails] = React.useState({
        title: '',
        description: '',
    })

  useEffect(() => {
    if(props.editData !== undefined) {
      threadDetails.title = props.editData.title
      threadDetails.description = props.editData.description
      setRefresh(!refresh)
    }
  }, [props.openAddDialog])

  const handleCloseAddDialog = () => {
    props.setOpenAddDialog(false);
  }

  const handleChangeTitle = (event) => {
    threadDetails.title = event.target.value
  }

  const handleChangeDescription = (event) => {
    threadDetails.description = event.target.value
  }

  return (
    <>

    <Dialog open={props.openAddDialog} onClose={handleCloseAddDialog}>
      {
        props.editData !== undefined ? 
        (<DialogTitle style={{fontWeight: 'bolder', marginRight: '200px', fontFamily: 'Arial'}}>Edit Thread Entry</DialogTitle>) :
        (<DialogTitle style={{fontWeight: 'bolder', marginRight: '200px', fontFamily: 'Arial'}}>Add New Thread Entry</DialogTitle>)
      }
        <DialogContent>
        <FormControl className={classes.formControl}>
        <TextField id="outlined-basic" label="Title" variant="outlined" defaultValue={threadDetails.title} onChange={handleChangeTitle} style={{marginBottom: '20px', minWidth: 500}}/>
        <TextField id="outlined-basic" label="Description" variant="outlined" defaultValue={threadDetails.description}  onChange={handleChangeDescription} multiline rows={4} rowsMax={6} style={{marginBottom: '20px'}} />
        <FormHelperText className={classes.helper}>{props.uploadHelper}</FormHelperText>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {handleCloseAddDialog()}} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {props.addThread(threadDetails);}} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}