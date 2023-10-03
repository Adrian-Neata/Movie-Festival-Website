import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { red } from '@material-ui/core/colors';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import letterColors from './constants/letterColors';

const useStyles = makeStyles((theme) => ({
    comment: {
        marginTop: 20,
        marginLeft:'15%',
        width: '70%',
        marginBottom: '10px',
    },
    button: {
        backgroundColor: 'rgba(255, 70, 70, 1)',
        marginTop: 10,
        width: '100px',
        color: 'white',
        fontWeight: 'bold',
        marginRight: 20,
        "&:hover": {
            backgroundColor: 'red',
        }
    },
    avatar: {
        fontWeight: 'bold',
    },

  }));

const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

const convertDate = (d) => {
    let hour
    let minute
    if (d.getHours() < 10) {
        hour = '0' + d.getHours()
    } else {
        hour = d.getHours()
    }
    if (d.getMinutes() < 10) {
        minute = '0' + d.getMinutes()
    } else {
        minute = d.getMinutes()
    }

    return monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' ' + hour + ':' + minute
}

export default function AddComment(props) {
    const classes = useStyles();
    const [username, setUsername] = useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openOptions, setOpenOptions] = useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [newBody, setNewBody] = useState('');

    const handleClick = (event) => {
        setOpenOptions(true);
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
      setOpenOptions(false);
    };

    useEffect(() => {
        const axios = require('axios')

        axios({
            method: 'get',
            url: 'http://localhost:5000/users/' + props.comment.user_id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
            },

        }).then(res => {
            setUsername(res.data.response.username)
        }).catch(e => {

        });
    }, [0])


    return (
        <>
            <Card className={classes.comment} style={{border: props.userComment ? '2px solid blue' : 'none'}}>
            <CardHeader
                avatar={
                <Avatar className={classes.avatar} style={{backgroundColor: username !== null ? letterColors[username[0].toUpperCase()] : 'red' }}>
                    {username !== null ? username[0].toUpperCase() : '?'}
                </Avatar>
                }
                action={localStorage.getItem("role") === '0' || localStorage.getItem("role") === '1' || props.userComment ?
                    (<><IconButton        
                        aria-label="more"
                        onClick={handleClick}
                        aria-haspopup="true"
                        aria-controls="long-menu">
                        <MoreVertIcon />
                    </IconButton>
                    <Menu 
                        anchorEl={anchorEl} 
                        keepMounted onClose={handleClose} 
                        open={openOptions}>
                        <MenuItem
                            key={'Edit'} 
                            onClick={() => setOpenEditDialog(true)}>
                        Edit
                        </MenuItem>
                        <MenuItem
                            key={'Delete'} 
                            onClick={() => {setOpenOptions(false);props.deleteComment(props.comment._id)}}>
                        Delete
                        </MenuItem>
                    </Menu>
                     </>   ) : null
                }
                title={username}
                subheader={convertDate(new Date(props.comment.date))}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p" style={{color: 'black', fontFamily: 'Segoe UI', fontSize: 16}}>
                    {
                        openEditDialog ? (
                            <>
                            <TextField style={{width: '94%'}} defaultValue={props.comment.body} multiline rowsMax={12} onChange={(event) => setNewBody(event.target.value)}/> 
                            <div>
                            <IconButton onClick={() => setOpenEditDialog(false)}>
                                <CloseIcon/>
                            </IconButton>
                            <IconButton onClick={() => { setOpenEditDialog(false); props.editComment({_id: props.comment._id, user_id: props.comment.user_id, movie_id: props.comment.movie_id, body: newBody, date: props.comment.date});}}>
                                <DoneIcon/>
                            </IconButton></div>
                            </>) : props.comment.body
                    }
                </Typography>
            </CardContent>
            {!props.userComment && !props.forum ? 
            (<CardActions disableSpacing>
                {
                    !props.comment.found_helpful ? (                
                    <Typography variant="body2" color="textSecondary" component="p" style={{fontFamily: 'Segoe UI'}}>
                    I found this review <Button style={{textTransform: 'none', fontFamily: 'Segoe UI'}} onClick={() => props.addHelpful(props.comment)}>helpful</Button>
                    </Typography>) :
                    (                
                    <Typography variant="body2" color="textSecondary" component="p" style={{fontFamily: 'Segoe UI'}}>
                    You found this review helpful <Button style={{textTransform: 'none', fontFamily: 'Segoe UI'}} onClick={() => props.removeHelpful(props.comment)}>cancel</Button>
                    </Typography>)
                }

            </CardActions>) : null }
            </Card>
        </>
        )
}