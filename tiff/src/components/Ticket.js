import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import tiff_logo from "../resources/ticket_logo.svg";
import barcode from "../resources/barcode.svg";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    card: {
        width: '80%',
        height: '18vh',
        marginTop: '5vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },

    cardTitle: {
        fontWeight: 'bold'
    },
    cardMedia: {
        paddingTop: '60%',
        width: '10%'
    },
    img: {
        height: '70%',
        alignSelf: 'center',
    },
    barcode: {
        backgroundColor: 'rgba(255, 70, 70, 1)',
        alignSelf: 'center',
        height: '100%',
        padding: 10,
    },
    ticketName: {
        alignSelf: 'center',
        fontWeight: 'bold', 
        fontSize: 52,
        marginLeft: 10,
        marginRight: 10,
    },
    ticketPrice: {
        alignSelf: 'center',
        fontWeight: 'bold', 
        fontSize: 45,
        marginLeft: 10,
        marginRight: 10,
    },
    cardButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        height: '40%',
    },
    buyButton: {
        backgroundColor: 'rgba(255, 70, 70, 1)',
        height: '30%',
        alignSelf: 'center',
        width: '100px',
        color: 'white',
        fontWeight: 'bold',
        marginRight: 20,
        "&:hover": {
            backgroundColor: 'red',
        }
    }
  }));


export default function Ticket(props) {
    const classes = useStyles();
    const [counter, setCounter] = useState(0);
    const [cost, setCost] = useState(props.ticket.price);

    return (
        <Card className={classes.card}>
            <img src={barcode} alt="tiff_logo" className={classes.barcode}/>


            <Card style={{display: 'flex', flexDirection: 'column', border: 'none', boxShadow: "none"}}>
            <img src={tiff_logo} alt="tiff_logo" className={classes.img} style={{marginTop: 20}}/>
            <Typography className={classes.ticketName}>{props.ticket.name}</Typography>
            </Card>


            <Typography className={classes.ticketPrice}>{cost} RON</Typography>


            <Card className={classes.cardButtons}>
            <IconButton style={{alignSelf: 'center'}} onClick={() => {
                if (counter > 1) {
                    setCost(cost - props.ticket.price)
                }
                if (counter > 0) {
                    setCounter(counter - 1);
                } 
                }}>
                <RemoveCircleIcon style={{color:"black"}} fontSize="large"/>
            </IconButton>
            <Typography style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 30}}>{counter}</Typography>
            <IconButton style={{alignSelf: 'center'}} onClick={() => {
                if (counter > 0) {
                    setCost(cost + props.ticket.price)
                }
                setCounter(counter + 1) 
                }}>
                <AddCircleIcon style={{color:"black"}} fontSize="large"/>
            </IconButton>
            </Card>

            
            <Button variant="contained" className={classes.buyButton}>Buy</Button>
        </Card>
        )
}