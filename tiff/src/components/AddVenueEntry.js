import React from 'react';
import Axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { DropzoneArea } from 'material-ui-dropzone';

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

export default function AddVenueEntry(props={}) {
    const classes = useStyles();
    const openAddDialog = props.openAddDialog;
    const setOpenAddDialog = props.setOpenAddDialog;
    const [uploadHelper, setUploadHelper] = React.useState('')
    const setOpenErrorDialog = props.setOpenErrorDialog;
    const venues = props.venues;
    const setVenues = props.setVenues;
    const [poster, setPoster] = React.useState(null)

    const [venueDetails, setVenueDetails] = React.useState({
        name: '',
        address: '',
        description: '',
        latitude: 0,
        longitude: 0,
        nr_seats: 0,
        photo_id: '',
    })



  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  }

  const handleChangeName = (event) => {
    let d = venueDetails
    d.name = event.target.value
    setVenueDetails(d);
  }

  const handleChangeAddress = (event) => {
    let d = venueDetails
    d.address = event.target.value
    setVenueDetails(d);
  }

  const handleChangeLatitude = (event) => {
    let d = venueDetails
    d.latitude = event.target.value
    setVenueDetails(d);
  }

  const handleChangeLongitude = (event) => {
    let d = venueDetails
    d.longitude = event.target.value
    setVenueDetails(d);
  }

  const handleChangeNumberSeats = (event) => {
    let d = venueDetails
    d.nr_seats = event.target.value
    setVenueDetails(d);
  }

  const handleChangeDescription = (event) => {
    let d = venueDetails
    d.description = event.target.value
    setVenueDetails(d);
  }

  const postImage = async () => {
    if (poster.length === 0) {
      setUploadHelper('No image uploaded');
      throw new Error('No image uploaded')
    }

    const formData = new FormData();

    formData.append("img", poster[0]);

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

  const addVenueEntry = async () => {
    setUploadHelper('');

    try {
      let res = await postImage()

      let d = venueDetails
      d.photo_id = poster[0].name
      setVenueDetails(d);

      Axios({
        method: "POST",
        url: "http://localhost:5000/venues/",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data: venueDetails,
      }).then(res => {
        venues.push(res.data.response)
        props.setRefresh(!props.refresh)
      }).catch(err => {
        setOpenErrorDialog(true)
      });

    } catch(err) {
      setOpenErrorDialog(true)
      return
    }

    handleCloseAddDialog(); 
  }

  return (
    <>

    <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle style={{fontWeight: 'bolder', marginRight: '200px', fontFamily: 'Arial'}}>Add New Venue Entry</DialogTitle>
        <DialogContent>
        <FormControl className={classes.formControl}>
        <TextField id="outlined-basic" label="Name" variant="outlined" onChange={handleChangeName} style={{marginBottom: '20px', minWidth: 500}}/>
        <TextField id="outlined-basic" label="Address" variant="outlined" onChange={handleChangeAddress} multiline rows={2} rowsMax={4} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Description" variant="outlined" onChange={handleChangeDescription} multiline rows={4} rowsMax={6} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Latitude" variant="outlined" onChange={handleChangeLatitude} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Longitude" variant="outlined" onChange={handleChangeLongitude} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Number seats" variant="outlined" onChange={handleChangeNumberSeats} style={{marginBottom: '20px'}} />
        <DropzoneArea onChange={(event) => {setUploadHelper(''); setPoster(event)}} filesLimit={1} maxFileSize={12000000} acceptedFiles={['image/jpeg, image/png']}/>
        <FormHelperText className={classes.helper}>{uploadHelper}</FormHelperText>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {handleCloseAddDialog()}} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {addVenueEntry();}} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}