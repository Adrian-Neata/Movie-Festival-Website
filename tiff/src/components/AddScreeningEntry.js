import React from 'react';
import Axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
    helper: {
      color: 'red',
      fontWeight: 'bold',
    },
    formControl2: {
        display: 'flex',
        flexDirection: 'column',
      },
}));

function convertDate(v) {
    var d = new Date(v);
    if (d.getDate() < 10) {
        return '0' + d.getDate() + '/0' + (d.getMonth() + 1) + '/' + d.getFullYear()
    }
    return d.getDate() + '/0' + (d.getMonth() + 1) + '/' + d.getFullYear()
}

function convertHour(h) {
    if(h < 10) {
        return '0' + h + ':00'
    } else {
        return h + ':00'
    }
}

export default function AddScreeningEntry(props={}) {
    const classes = useStyles();
    const openAddDialog = props.openAddDialog;
    const setOpenAddDialog = props.setOpenAddDialog;
    const [uploadHelper, setUploadHelper] = React.useState('')
    const setOpenErrorDialog = props.setOpenErrorDialog;
    const movies = props.movies;
    const venues = props.venues;
    const [hoursStart, setHoursStart] = React.useState([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
    const [hoursEnd, setHoursEnd] = React.useState([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])

    const [screeningDetails, setScreeningDetails] = React.useState({
        movie_id: '',
        venue_id: '',
        date: null,
        startHour: 0,
        endHour: 0,
    })

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  }

  const addScreeningEntry = async () => {
    setUploadHelper('');

    Axios({
        method: "POST",
        url: "http://localhost:5000/screenings/",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data: screeningDetails,
    }).then(res => {
        if (props.currentDay === screeningDetails.date) {
          console.log(res.data.response)
          props.screenings.push(res.data.response)
        }
        props.setRefresh(!props.refresh)
    }).catch(err => {
        setOpenErrorDialog(true)
    });

    handleCloseAddDialog(); 
  }

  const handleChangeMovie= (event) => {
    let s = screeningDetails
    s.movie_id = event.target.value
    setScreeningDetails(s)
  }

  const handleChangeVenue = (event) => {
    let s = screeningDetails
    s.venue_id = event.target.value
    setScreeningDetails(s)
  }

  const handleChangeDate = (event) => {
    let s = screeningDetails
    s.date = event.target.value
    setScreeningDetails(s)
  }

  const handleChangeStart = (event) => {
    let newHoursEnd = []
    for(let i = 0; i < hours.length; i++) {
        if(hours[i] > event.target.value) {
            newHoursEnd.push(hours[i])
        }
    }
    let s = screeningDetails
    s.startHour = event.target.value
    setScreeningDetails(s)

    setHoursEnd(newHoursEnd)
  }

  const handleChangeEnd = (event) => {
    let newHoursStart = []
    for(let i = 0; i < hours.length; i++) {
        if(hours[i] < event.target.value) {
            newHoursStart.push(hours[i])
        }
    }
    let s = screeningDetails
    s.endHour = event.target.value
    setScreeningDetails(s)
    setHoursStart(newHoursStart)
  }

  return (
    <>

    <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle style={{fontWeight: 'bolder', marginRight: '200px', fontFamily: 'Arial'}}>Add New Screening Entry</DialogTitle>
        <DialogContent className={classes.formControl2}>
        <FormControl className={classes.formControl}>
        <InputLabel>Movie</InputLabel>
        <Select labelId="label" id="select" style={{marginTop:'20px'}} onChange={handleChangeMovie}>
            {
                movies.map((m) => (
                    <MenuItem value={m._id}>{m.title}</MenuItem>
                ))
            }
        </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
        <InputLabel>Venue</InputLabel>
        <Select labelId="label" id="select" style={{marginTop:'20px'}} onChange={handleChangeVenue}>
        {
                venues.map((v) => (
                    <MenuItem value={v._id}>{v.name}</MenuItem>
                ))
            }
        </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
        <InputLabel>Date</InputLabel>
        <Select labelId="label" id="select" style={{marginTop:'20px'}} onChange={handleChangeDate}>
        {
                props.days.map((v) => (
                    <MenuItem value={v}>{convertDate(v)}</MenuItem>
                ))
        }
        </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
        <InputLabel>Start Hour</InputLabel>
        <Select labelId="label" id="select" style={{marginTop:'20px'}} onChange={handleChangeStart}>
        {
                hoursStart.map((h) => (
                    <MenuItem value={h}>{convertHour(h)}</MenuItem>
                ))
        }
        </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
        <InputLabel>Finish Hour</InputLabel>
        <Select labelId="label" id="select" style={{marginTop:'20px'}} onChange={handleChangeEnd}>
        {
                hoursEnd.map((h) => (
                    <MenuItem value={h}>{convertHour(h)}</MenuItem>
                ))
        }
        </Select>

        <FormHelperText className={classes.helper}>{uploadHelper}</FormHelperText>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {handleCloseAddDialog()}} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {addScreeningEntry();}} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}