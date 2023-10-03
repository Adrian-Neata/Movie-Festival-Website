import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockIcon from '@material-ui/icons/Lock';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormHelperText from '@material-ui/core/FormHelperText';
import Axios from "axios";

/*
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-up/SignUp.js
*/

function Copyright() {
    return (
      <Typography variant="body1" color="textSecondary" align="center" style={{fontWeight: 'bold'}}>
        {'Copyright © '}
        <Link color="inherit" to="/" style={{textDecoration: 'none', color: '#6D6D6D'}}>
          TIFF
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    );
  }

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#FF4646',
    width: '60px',
    height: '60px'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  font: {
    fontWeight: 'bold',
  },

  helper: {
    color: 'red',
    fontWeight: 'bold',
  },
}));


function SignUpMenu() 
{
  const history = useHistory();
  const classes = useStyles();
  const [credentials] = useState({email: '', username: '', password: '', confirm_Password: ''});
  const [emailHelper, setEmailHelper] = useState('')
  const [usernameHelper, setUsernameHelper] = useState('')
  const [passwordHelper, setPasswordHelper] = useState('')
  const [confPasswordHelper, setConfPasswordHelper] = useState('')

  const setEmail = (event) => {
    credentials.email = event.target.value
  }

  const setUsername = (event) => {
    credentials.username = event.target.value
  }

  const setPassword = (event) => {
    credentials.password = event.target.value
  }

  const setConfirm_Password = (event) => {
    credentials.confirm_Password = event.target.value
  }

  const register = () => {
    if (checkField() === false) {
      return
    }

    Axios({
      method: "POST",
      url: "http://localhost:5000/register",
      headers: {
        "Content-Type": "application/json"
      },
      data: credentials,
    }).then(res => {
      localStorage.setItem('email', credentials.email)
      if (res.status === 201) {
        history.push("/confirm");
      }
    }).catch(err => {
      if (err.response.status === 403) {
        setEmailHelper('E-mail adress already exists')
      }
    });
  }

  const checkField = () => {
    var good = true

    if (credentials.email === "") {
      setEmailHelper('Field is empty')
      good = false
    } else if (!credentials.email.includes("@")) {
      setEmailHelper('Invalid e-mail adress')
      good = false
    } else {
      setEmailHelper('')
    }

    if (credentials.username === "") {
      setUsernameHelper('Field is empty')
      good = false
    } else {
      setUsernameHelper('')
    }

    if (credentials.password === "") {
      setPasswordHelper('Field is empty')
      good = false
    } else if (! /\d/.test(credentials.password)) {
      setPasswordHelper('Password must contain at least one digit')
      good = false
    } else if (! /[A-Z]/.test(credentials.password)) {
      setPasswordHelper('Password must contain at least one capital leter')
      good = false
    } else {
      setPasswordHelper('')
    }

    if (credentials.confirm_Password === "") {
      setConfPasswordHelper('Field is empty')
      good = false
    } else if (credentials.password !== credentials.confirm_Password) {
      setConfPasswordHelper('Confirmation doesn\'t match password')
      good = false
    } else {
      setConfPasswordHelper('')
    }
    return good
  }

  return (
    <Container component="main" maxWidth="xs" style={{paddingTop: '25px', paddingBottom: '25px', backgroundColor: 'rgba(238,238,238, 0.9)', position: 'relative', top: 'calc(20vh - 69px)'}}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
            <LockIcon style={{fontSize:'40px'}}/>
        </Avatar>
        <Typography component="h1" variant="h5" style={{fontWeight: 'bold'}}>
          Sign up
        </Typography>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                onChange={setEmail}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                InputProps={{
                    classes: {
                      input: classes.font,
                    },
                  }}
                inputProps={{ maxLength: 50 }}
                InputLabelProps={{style: {fontWeight: 'bold'}}}
              /><FormHelperText className={classes.helper}>{emailHelper}</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={setUsername}
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="Username"
                autoFocus
                InputProps={{
                    classes: {
                      input: classes.font,
                    },
                  }}
                inputProps={{ maxLength: 30 }}
                InputLabelProps={{style: {fontWeight: 'bold'}}}
              /><FormHelperText className={classes.helper}>{usernameHelper}</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={setPassword}
                variant="outlined"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                InputProps={{
                    classes: {
                      input: classes.font,
                    },
                  }}
                inputProps={{ maxLength: 30 }}
                InputLabelProps={{style: {fontWeight: 'bold'}}}
              /><FormHelperText className={classes.helper}>{passwordHelper}</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={setConfirm_Password}
                variant="outlined"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                InputProps={{
                    classes: {
                      input: classes.font,
                    },
                  }}
                inputProps={{ maxLength: 30 }}
                InputLabelProps={{style: {fontWeight: 'bold'}}}
              /><FormHelperText className={classes.helper}>{confPasswordHelper}</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label={<Typography style={{fontWeight: 'bold'}}>I want to receive inspiration, marketing promotions and updates via email.</Typography>}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={register}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/profile" variant="body2" style={{fontWeight: 'bold'}}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default SignUpMenu