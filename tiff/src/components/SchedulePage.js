import React, { useState, useEffect } from 'react';
import ErrorPage from './ErrorPage.js'
import Schedule from './Schedule.js'
import AddVenueEntry from './AddVenueEntry.js'
import AddScreeningEntry from './AddScreeningEntry.js'
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const days = [new Date(2021, 6, 23), new Date(2021, 6, 24), new Date(2021, 6, 25), new Date(2021, 6, 26), new Date(2021, 6, 27), new Date(2021, 6, 28), new Date(2021, 6, 29), new Date(2021, 6, 30), new Date(2021, 6, 31), new Date(2021, 7, 1)]

function convertDate(v) {
    var d = new Date(v);
    if (d.getDate() < 10) {
        return '0' + d.getDate() + '/0' + (d.getMonth() + 1) + '/' + d.getFullYear()
    }
    return d.getDate() + '/0' + (d.getMonth() + 1) + '/' + d.getFullYear()
}

export default function SchedulePage() {
    const [page, setPage] = useState('')
    const [openAddVenueDialog, setOpenAddVenueDialog] = React.useState(false);
    const [openAddScreeningDialog, setOpenAddScreeningDialog] = React.useState(false);
    const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
    const [venues, setVenues] = React.useState([]);
    const [movies, setMovies] = React.useState([]);
    const [currentDay, setCurrentDay] = React.useState(days[0]);
    const [screenings, setScreenings] = React.useState([]);
    const [refresh, setRefresh] = React.useState(false);
    
    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
    }

    const handleChangeDay = async (day) => {
        const axios = require('axios')
        
        await axios({
            method: 'get',
            url: 'http://localhost:5000/screenings/date/' + day,
        }).then((res) =>  {
            setScreenings(res.data.response.screenings)
            setCurrentDay(day)
        }).catch(e => {
            setPage(<ErrorPage/>)
        });
        
    }
    useEffect(async () => {
        const axios = require('axios')

        await axios({
            method: 'get',
            url: 'http://localhost:5000/movies',
        }).then(res => {
            setMovies(res.data.response.movies)
        }).catch(e => {
            setPage(<ErrorPage/>)
        });

        await axios({
            method: 'get',
            url: 'http://localhost:5000/screenings/date/' + new Date(2021, 6, 23),
        }).then(res => {
            setScreenings(res.data.response.screenings)
        }).catch(e => {
            setPage(<ErrorPage/>)
        });

        await axios({
            method: 'get',
            url: 'http://localhost:5000/venues',
        }).then(res => {
            setVenues(res.data.response.venues)
        }).catch(e => {
            setPage(<ErrorPage/>)
        });

    }, [0]);

    const errorDialog = (    <Dialog
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
    )

    
    return (
    <>
    <Container style={{maxWidth:'80%', marginTop: 50}}>
        <Table><TableRow>
        {
            days.map((d) => {
                if (d !== currentDay) {
                return (
                <TableCell align="center">
                <Card>
                    <CardActionArea style={{padding: 20}} onClick={() => {handleChangeDay(d)}}>{convertDate(d)}
                    </CardActionArea>
                </Card>
                </TableCell>)
                }
                return (
                    <TableCell align="center">
                    <Card style={{opacity: 0.2}}>
                        <CardActionArea style={{padding: 20}}>{convertDate(d)}
                        </CardActionArea>
                    </Card>
                    </TableCell>)
            })
        
        }
        </TableRow></Table>
        {errorDialog}
        {
            localStorage.getItem("role") === '0' ? 
            (   <>
                <AddVenueEntry setRefresh={setRefresh} refresh={refresh} venues={venues} setVenues={setVenues} openAddDialog={openAddVenueDialog} setOpenAddDialog={setOpenAddVenueDialog} setOpenErrorDialog={setOpenErrorDialog}/>
                <AddScreeningEntry setRefresh={setRefresh} refresh={refresh} screenings={screenings} currentDay={currentDay} days={days} venues={venues} movies={movies} openAddDialog={openAddScreeningDialog} setOpenAddDialog={setOpenAddScreeningDialog} setOpenErrorDialog={setOpenErrorDialog}/>
                <Button onClick={() => {setOpenAddVenueDialog(true)}}>
                    Add new venue
                </Button>
                <Button onClick={() => {setOpenAddScreeningDialog(true)}}>
                    Add new screening
                </Button>
                </>
            ) : null
        }
    </Container>
        <Schedule props={{venues, movies, screenings}} setRefresh={setRefresh} refresh={refresh}></Schedule>
    
    </>
    )
}