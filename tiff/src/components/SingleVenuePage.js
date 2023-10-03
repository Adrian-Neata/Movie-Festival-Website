import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Footer from './Footer.js'
import ErrorPage from './ErrorPage.js'

import {
    useParams
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    card: {
        marginLeft:'15%',
        width: '70%',
      },

    cardTitle: {
        fontWeight: 'bold'
    },
    chipContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    cardMedia: {
        width: '100%',
        paddingTop: '50%'
    }
  }));


export default function SingleVenuePage(props) {
    const classes = useStyles();
    let { venue_id } = useParams();
    const [venue, setVenue] = useState(null)
    
    useEffect(async () => {
        const axios = require('axios')
    
        await axios({
            method: 'get',
            url: 'http://localhost:5000/venues/' + venue_id,
        }).then(res => {
            setVenue(res.data.response)
        }).catch(e => {

        });

    }, [0]);

    return (
        <>
            {venue !== null ? 
            (                <Container style={{maxWidth:'60%', marginTop: '9vh'}}>
            <Card className={classes.card}>

                <CardMedia className={classes.cardMedia}
                    image={'http://localhost:5000/image/' + venue.photo_id}
                    title={venue.name}/>
                
                <Typography gutterBottom variant="h3" component="h2" align='center' className={classes.cardTitle}>
                    {venue.name}
                </Typography>
                <CardContent>
                    {venue.description}
                </CardContent>

            </Card>
        </Container>) : (<><ErrorPage/><Footer/></>)}
        </>
        )
}