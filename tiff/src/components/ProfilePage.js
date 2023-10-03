import React, { useState, useEffect } from 'react';
import AdminProfilePage from './profile_pages/AdminProfile.js'
import ManagerProfilePage from './profile_pages/ManagerProfile.js'
import MemberProfilePage from './profile_pages/MemberProfile.js'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import letterColors from './constants/letterColors';
import { Typography, IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: letterColors[localStorage.getItem('username')[0].toUpperCase()],
        fontWeight: 'bold',
        marginLeft: '47.6vw',
        marginTop: '5vh',
        marginBottom: '2vh',
        width: 100,
        height: 100,
        fontSize: 48,
    },
    logoutButton: {
        backgroundColor: '#FF4646',
        marginLeft: '48.8vw',
        marginTop: '2vh',
        color: 'white',
        '&:hover': {
            backgroundColor: 'red'
        }
    }

  }));


function ProfilePage(props) {
    const classes = useStyles();
    const [page, setPage] = useState('')

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        props.setLoggedIn(false);
    }

    useEffect(async () => {

        if(localStorage.getItem("role") === '0') {
            setPage(<AdminProfilePage/>)
            return
        } else if(localStorage.getItem("role") === '1') {
            setPage(<ManagerProfilePage/>)
            return
        } else if(localStorage.getItem("role") === '2') {
            setPage(<MemberProfilePage/>)
            return
        } else if(localStorage.getItem("role") === '3') {
            setPage(<MemberProfilePage/>)
            return
        }
    }, [0]);

    return (
    <>
            <Avatar className={classes.avatar}>
                {localStorage.getItem('username') !== null ? localStorage.getItem('username')[0].toUpperCase() : '?'}
            </Avatar>
            <Typography align='center' style={{fontSize: 20}}>Welcome back {localStorage.getItem('username')}!</Typography>
            <div>
            <Link to='/login' onClick={handleLogout}>
            <IconButton className={classes.logoutButton}>
                <ExitToAppIcon fontSize='large'/>
            </IconButton>
            </Link>
            </div>
        {page}
    </>
    )
}

export default ProfilePage