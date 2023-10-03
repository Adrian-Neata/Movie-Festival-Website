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
https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js
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
    marginTop: theme.spacing(1),
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

function SignInMenu(props) {
  const classes = useStyles();
  const [credentials] = useState({email: '', password: ''});
  const [signinHelper, setSigninHelper] = useState('')
  const history = useHistory();

  const setEmail = (event) => {
    credentials.email = event.target.value
  }

  const setPassword = (event) => {
    credentials.password = event.target.value
  }

  const login = () => {
    console.log(credentials)
    Axios({
      method: "POST",
      url: "http://localhost:5000/login",
      headers: {
        "Content-Type": "application/json"
      },
      data: credentials,
    }).then(res => {
        localStorage.setItem("token", res.data.response.token);
        localStorage.setItem("role", res.data.response.role);
        localStorage.setItem("username", res.data.response.username);
        props.setLoggedIn(true);
    }).catch(err => {
      if (err.response.status === 401 || err.response.status === 404) {
        setSigninHelper('E-mail and password do not match')
      }
    });
  }

  return (
    <Container component="main" maxWidth="xs" style={{paddingTop: '25px', paddingBottom: '25px', backgroundColor: 'rgba(238,238,238, 0.9)', position: 'relative', top: 'calc(30vh - 69px)'}}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockIcon style={{fontSize:'40px'}}/>
        </Avatar>
        <Typography component="h1" variant="h5" style={{fontWeight: 'bold'}}>
          Sign in
        </Typography>
        <form className={classes.form}>
          <TextField
            onChange={setEmail}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            InputProps={{
                classes: {
                  input: classes.font,
                },
              }}
            inputProps={{ maxLength: 50 }}
            InputLabelProps={{style: {fontWeight: 'bold'}}}
          />
          <TextField
            onChange={setPassword}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
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
          /><FormHelperText className={classes.helper}>{signinHelper}</FormHelperText>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label={<Typography style={{fontWeight: 'bold'}}>Remember me</Typography>}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            style={{fontWeight: 'bold'}}
            onClick={login}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" style={{fontWeight: 'bold'}}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2" style={{fontWeight: 'bold'}}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default SignInMenu