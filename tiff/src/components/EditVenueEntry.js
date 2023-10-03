import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { DropzoneArea } from 'material-ui-dropzone';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
    formControl2: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));

export default function EditVenueEntry(props={}) {
  const classes = useStyles();
  const openEditDialog = props.openEditDialog;
  const setOpenEditDialog = props.setOpenEditDialog;
  const [photo, setPhoto] = React.useState(null)
  const [venueDetails, setVenueDetails] = useState({
    name: '',
    address: '',
    description: '',
    latitude: 0,
    longitude: 0,
    nr_seats: 0,
    photo_id: '',
})
  const [uploadHelper, setUploadHelper] = React.useState('')
  
  const setOpenErrorDialog = props.setOpenErrorDialog;

  useEffect(() => {
      for(let i = 0; i < props.venues.length; i++) {
          if(props.venues[i]._id === localStorage.getItem('rowToEdit')) {
              setVenueDetails(props.venues[i])
              break
          }
      }
  }, [openEditDialog]);

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  }

  const handleChangeName = (event) => {
    venueDetails.name = event.target.value
  }

  const handleChangeAddress = (event) => {
    venueDetails.address = event.target.value
  }

  const handleChangeLatitude = (event) => {
    venueDetails.latitude = event.target.value
  }

  const handleChangeLongitude = (event) => {
    venueDetails.longitude = event.target.value
  }

  const handleChangeNumberSeats = (event) => {
    venueDetails.nr_seats = event.target.value
  }

  const handleChangeDescription = (event) => {
    venueDetails.description = event.target.value
  }

  const postImage = async () => {

    const formData = new FormData();

    formData.append("img", photo[0]);

    await Axios({
        method: "POST",
        url: "http://localhost:5000/image",
        headers: {
            "Content-Type": "application/json"
        },
        data: formData,
    }).then(res => {
        return res
    }).catch(err => {
        setOpenErrorDialog(true)
        throw new Error('Something bad happened')
    });

};

  const editVenueEntry = async () => {

    try {
        if (photo.length !== 0) {
            await postImage()
            venueDetails.photo_id = photo[0].name
        }

        Axios({
            method: "PUT",
            url: "http://localhost:5000/venues/" + venueDetails._id,
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            data: venueDetails,
        }).then(res => {
            for(let i = 0; i < props.venues.length; i++) {
              if (props.venues[i]._id === venueDetails._id) { 
                props.venues[i] = venueDetails
              }
            }
        }).catch(err => {
            console.log(err)
            setOpenErrorDialog(true)
        });

    } catch(err) {
        console.log(err)
      setOpenErrorDialog(true)
      return
    }

    handleCloseEditDialog(); 
  }

  return (
    <>
    <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle style={{fontWeight: 'bolder', marginRight: '200px', fontFamily: 'Arial'}}>Edit Venue Entry</DialogTitle>
        <DialogContent>
        <FormControl className={classes.formControl}>
        <TextField id="outlined-basic" label="Name" variant="outlined" defaultValue={venueDetails.name} onChange={handleChangeName} style={{marginBottom: '20px', minWidth: 500}}/>
        <TextField id="outlined-basic" label="Address" variant="outlined" defaultValue={venueDetails.address} onChange={handleChangeAddress} multiline rows={2} rowsMax={4} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Description" variant="outlined" defaultValue={venueDetails.description} onChange={handleChangeDescription} multiline rows={4} rowsMax={6} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Latitude" variant="outlined" defaultValue={venueDetails.latitude} onChange={handleChangeLatitude} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Longitude" variant="outlined" defaultValue={venueDetails.longitude} onChange={handleChangeLongitude} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Number seats" variant="outlined" defaultValue={venueDetails.nr_seats} onChange={handleChangeNumberSeats} style={{marginBottom: '20px'}} />
        <DropzoneArea onChange={(event) => {setUploadHelper(''); setPhoto(event)}} filesLimit={1} maxFileSize={12000000} acceptedFiles={['image/jpeg, image/png']}/>
        <FormHelperText className={classes.helper}>{uploadHelper}</FormHelperText>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {handleCloseEditDialog()}} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {editVenueEntry();}} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}