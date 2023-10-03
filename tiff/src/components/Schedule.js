import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import CardActionArea from '@material-ui/core/CardActionArea';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import EditVenueEntry from './EditVenueEntry.js'

const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

function convertHour(h) {
    if(h < 10) {
        return '0' + h + ':00'
    } else {
        return h + ':00'
    }
}

const useStyles = makeStyles((theme) => ({
    cardMovie: {
        paddingBottom: 10, 
        paddingTop: 10, 
        paddingRight:10, 
        paddingLeft:10, 
        color: 'black', 
        fontWeight: 'bold',
    },
    cardNothing: {
        paddingRight:10, 
        paddingLeft:10, 
        paddingBottom: 10, 
        paddingTop: 10, 
        fontWeight: 'bold',
    },
    cardHour: {
        padding: 10, 
        fontWeight: 'bold',
    },
    linkStyle: {
        textDecoration: 'none',
        color: 'black',
    },
    cardMedia: {
        width: '100%',
        height: 100,
        maxHeight: 300,
    },
  }));


export default function SchedulePage(props) {
    const params = props.props;
    const venues = params.venues;
    const movies = params.movies;
    let schedule = params.screenings;
    const classes = useStyles();
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [deleteVenue, setDeleteVenue] = React.useState(false);

    const getScheduleForVenue = (v) => {
        let s = []

        for(let i = 0; i < schedule.length; i++) {

            if (schedule[i].venue_id === v._id) {
                s.push(schedule[i])
            }
        }
        return s
    }

    const getMovieById = (id) => {
        for(let i = 0; i < movies.length; i++) {
            if(movies[i]._id === id) {
                return movies[i]
            }
        }
        return null
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
    }

    const deleteRow = async () => {
        const axios = require('axios')
        let url = "http://localhost:5000/screenings/" + localStorage.getItem('rowToDelete')
        if (deleteVenue) {
            url = "http://localhost:5000/venues/" + localStorage.getItem('rowToDelete')
        }
        await axios({
          method: "DELETE",
          url: url,
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
          },
        }).then(res => {
            let i
            let l = schedule
            if (deleteVenue) {
                l = venues
            }
            for (i = 0; i < l.length; i++) {
                if (l[i]._id === localStorage.getItem('rowToDelete')) {
                    break
                }
            }
            l.splice(i, 1)
            localStorage.removeItem('rowToDelete')
            props.setRefresh(!props.refresh)
        }).catch(err => {
          setOpenErrorDialog(true)
        });
    
    }

    const getVenueRow = (v, s) => {
        let rows = []

        for(let i = 0; i < hours.length; i++) {
            for(let j = 0; j < s.length; j++) {
                if(s[j].startHour === hours[i]) {
                    i = s[j].endHour - 9
                    rows.push((<TableCell colSpan={s[j].endHour - s[j].startHour} align="center">
                            <Card>
                            <Link to={"/movies/" + s[j].movie_id} className={classes.linkStyle}>
                                <CardActionArea className={classes.cardMovie}>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image={'http://localhost:5000/image/' + getMovieById(s[j].movie_id).poster_id}
                                    title={getMovieById(s[j].movie_id).title}
                                />
                                <Typography style={{paddingTop: 10}}>{getMovieById(s[j].movie_id).title}</Typography>
                            </CardActionArea>
                            </Link>
                            {localStorage.getItem('role') === '0' || localStorage.getItem("role") === '1' ? (
                                <IconButton aria-label="delete" onClick={() => {setDeleteVenue(false); localStorage.setItem('rowToDelete', s[j]._id); setOpenDeleteDialog(true)}}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>) : null}
                            </Card>
                                </TableCell>))
                }
            }
            rows.push((
            <TableCell align="center">
            </TableCell>))
        }

        return (
            <TableRow>
                <TableCell align="center">
                        <Card>
                            <Link to={"/venues/" + v._id} className={classes.linkStyle}>
                            <CardActionArea  className={classes.cardNothing}>
                            <CardMedia
                                className={classes.cardMedia}
                                image={'http://localhost:5000/image/' + v.photo_id}
                                title={v.name}
                            />
                            <Typography style={{paddingTop: 10}}>{v.name}</Typography>
                            </CardActionArea>
                            </Link>
                            {localStorage.getItem('role') === '0' || localStorage.getItem("role") === '1' ? (
                                <>
                                <IconButton aria-label="edit" onClick={() => {localStorage.setItem('rowToEdit', v._id); setOpenEditDialog(true)}}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => {setDeleteVenue(true); localStorage.setItem('rowToDelete', v._id); setOpenDeleteDialog(true)}}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton></>) : null}
                        </Card>
                </TableCell>
                {rows}
            </TableRow>
        )
    }

    return (
        <Container style={{maxWidth:'80%'}}>
            <EditVenueEntry venues={venues} openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} setOpenErrorDialog={setOpenErrorDialog}/>
        <Dialog
            open={openErrorDialog}
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

        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this entry?"}</DialogTitle>
  
          <DialogActions>
            <Button onClick={() => {handleCloseDeleteDialog()}} color="primary">
              Cancel
            </Button>
            <Link to='/schedule'>
            <Button onClick={() => {handleCloseDeleteDialog(); deleteRow();}} color="primary" autoFocus>
              Apply
            </Button>
            </Link>
          </DialogActions>
        </Dialog>
    <TableContainer component={Paper}>
    <Table style={{borderLeft: "20px solid rgba(255, 70, 70, 1)"}} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{fontWeight: 'bold', fontSize: 30}}>Venues</TableCell>
            {hours.map(hour => (
                <TableCell align="center">
                <Card className={classes.cardHour}>{convertHour(hour)}</Card>
                </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
            {venues.map(venue => getVenueRow(venue, getScheduleForVenue(venue)))}
        </TableBody>
    </Table>
    </TableContainer>
    </Container>
    )
}