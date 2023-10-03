import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

export default function ConfirmEmailPage() {

    const resendMail = async () => {
        const axios = require('axios')
        axios({
            method: 'post',
            url: 'http://localhost:5000/confirm',
            headers: {
                "Content-Type": "application/json"
            },
            data: {email: localStorage.getItem('email')},
        })
    }

    return (
    <>
    <Container component="main" width="50%" style={{paddingTop: '25px', paddingBottom: '25px', backgroundColor: 'rgba(238,238,238, 0.9)', position: 'relative', top: 'calc(30vh - 69px)'}}>
        <Typography align='center' variant="h3">A mail has been sent to your e-mail address.</Typography>
        <Typography align='center' variant="h4">Please click the confirmation <b>link</b> inside it.</Typography>
        <Typography align='center' variant="h4">Haven't received the mail yet?</Typography>
        <Button onClick={resendMail} style={{marginLeft: '39%'}}><b>Resend confirmation mail</b></Button>
    </Container>
    </>
    )
}