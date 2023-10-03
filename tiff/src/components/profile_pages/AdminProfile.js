import React, { useState, useEffect } from 'react';
import ErrorPage from '../ErrorPage.js'
import ListOfUsers from '../ListOfUsers.js'
import TopMovies from '../graphs/TopMovies.js'
import TopUsers from '../graphs/TopUsers.js'
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      marginLeft: '26%',
      marginTop: '2vh',
    },
    formControl2: {
        margin: theme.spacing(1),
        minWidth: 120,
        marginLeft: '8%',
        marginTop: '2vh',
      },
    paperGraph: {
        position: 'static',
        width: '50%',
        marginLeft: '22vw',
        marginTop: '2vh',
        paddingTop: '2vh',
        paddingBottom: '2vh',
    },
  }));

  export default function AdminProfilePage() {
    const classes = useStyles();
    const [page, setPage] = useState('')
    const [topMoviesBy, setTopMoviesBy] = React.useState('likes');
    const [topUsersBy, setTopUsersBy] = React.useState('posts');

    const handleChangeTopMovies = (event) => {
        setTopMoviesBy(event.target.value);
    };

    const handleChangeTopUsersBy = (event) => {
        setTopUsersBy(event.target.value);
    };

    useEffect(async () => {
        const axios = require('axios')

        axios({
            method: 'get',
            url: 'http://localhost:5000/profile/admin',
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        }).then(res => {
            setPage(<> 
            <ListOfUsers props={res.data.response} /> 
            <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">Top Movies</InputLabel>
                <Select labelId="label" id="select" onChange={handleChangeTopMovies} defaultValue='likes'>
                    <MenuItem value={'likes'}>Likes</MenuItem>
                    <MenuItem value={'dislikes'}>Dislikes</MenuItem>
                    <MenuItem value={'reviews'}>Reviews</MenuItem>
                </Select>
            </FormControl>
            <TopMovies category={topMoviesBy}/> 
            <Paper className={classes.paperGraph}>
                <FormControl className={classes.formControl2}>
                <InputLabel id="demo-controlled-open-select-label">Top Users</InputLabel>
                    <Select labelId="label" id="select" onChange={handleChangeTopUsersBy} defaultValue='posts'>
                        <MenuItem value={'posts'}>Posts</MenuItem>
                        <MenuItem value={'reviews'}>Reviews</MenuItem>
                    </Select>
                </FormControl>
                <TopUsers category={topUsersBy}/> 
            </Paper></>)
        }).catch(e => {
            setPage(<ErrorPage/>)
        });
    }, [topMoviesBy, topUsersBy]);

    return (
    <>
        {page}
    </>
    )
}
