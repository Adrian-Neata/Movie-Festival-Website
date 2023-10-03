import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Typography } from "@material-ui/core";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Social from "./Social.js";

const useStyles = makeStyles((theme) => ({
    snsIcon: {
        width: "60px",
        height: "60px",
        color: "white",
        [theme.breakpoints.down("xs")]: {
            width: "25px",
            height: "25px",
        },
        "&:hover": {
            color: theme.palette.info.main,
        },
    },
    footer: {
        backgroundColor: theme.palette.primary.main,
        width: '100%',
        position: "absolute",
        overflow: "hidden",
        padding: "2em 0 ",
        top: '100%',
    },
    link: {
        fontSize: "1.25em",
        color: "#fff",
        "&:hover": {
            color: theme.palette.info.main,
        },
    },
    copylight: {
        color: "#fff",
        fontSize: "1em",
    },
}));

const Footer = () => {
  const classes = useStyles();

  const test = () => {
    window.scrollTo(0, 0)
  }

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={3} justify="center">
          <ArrowDropUpIcon className={classes.snsIcon} onClick={test}/>
        </Grid>
        <Grid container direction="column" style={{ margin: "1.2em 0" }}>
          <Social />
        </Grid>
        <Grid
          item
          container
          component={"a"}
          target="_blank"
          rel="noreferrer noopener"
          href="https://satoruakiyama.com"
          justify="center"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography className={classes.copylight}>
            {'Copyright © '}
            <Link color="inherit" to="/" style={{textDecoration: 'none', color: 'white'}}>
            TIFF
            </Link>
            {' '}
            {new Date().getFullYear()}
          </Typography>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;