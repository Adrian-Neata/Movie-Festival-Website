import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CardHeader from '@material-ui/core/CardHeader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    comment: {
        marginTop: 20,
        width: '100%',
        marginBottom: '10px',
        backgroundColor: 'rgba(63, 81, 181, 0.9)',
        color: 'white',
        "&:hover": {
            backgroundColor: 'rgba(105, 123, 219, 0.9)',
            transition: '0.4s',
        }
    },
    cardHeader: {
        fontFamily: 'Segoe UI',
        fontWeight: 'bold',
        width: '100%',
    }

  }));

export default function Thread(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openOptions, setOpenOptions] = useState(false);

    const handleClick = (event) => {
        setOpenOptions(true);
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
      setOpenOptions(false);
    };

    return (
        <>
            <Card className={classes.comment}>
            <CardHeader
                action={localStorage.getItem("role") === '0' ?
                    (<>
                    <IconButton        
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
                            onClick={() => {setOpenOptions(false);props.setThreadToEdit(props.thread);props.setOpenEditDialog(true)}}>
                        Edit
                        </MenuItem>
                        <MenuItem
                            key={'Delete'} 
                            onClick={() => {setOpenOptions(false);props.deleteComment(props.thread._id)}}>
                        Delete
                        </MenuItem>
                    </Menu>
                     </>   ) : null
                }
                title={(<Link to={"/forum/" + props.thread._id} style={{color: 'white'}}>{props.thread.title}</Link>)}
                subheader={props.thread.description}
                classes={{subheader: classes.cardHeader, title: classes.cardHeader}}
            />
            </Card>
        </>
        )
}