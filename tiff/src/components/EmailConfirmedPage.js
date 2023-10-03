import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Footer from './Footer.js'
import ImageSlideshow from './ImageSlideshow.js'
import { useParams } from "react-router-dom";
import NotFound from './NotFound.js'

export default function EmailConfirmedPage() {
    let { confirm_id } = useParams();
    const [page, setPage] = useState(null)

    useEffect(async () => {
        const axios = require('axios')
        console.log(confirm_id)
        axios({
            method: 'get',
            url: 'http://localhost:5000/confirm/' + confirm_id,
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            setPage((
                <>
                <ImageSlideshow style={{position: 'relative'}}/>
                <Container component="main" maxWidth="xs" style={{paddingTop: '25px', paddingBottom: '25px', backgroundColor: 'rgba(238,238,238, 0.9)', position: 'relative', top: 'calc(20vh - 69px)'}}>
                    <Typography align='center' variant="h3">Your Registration is complete</Typography>
                </Container>
                <Footer/>
                </>
                ))
        }).catch(err => {
            setPage((<><NotFound/></>))
        })
    }, [0])

    return (
    <>
        {page}
    </>
    )
}