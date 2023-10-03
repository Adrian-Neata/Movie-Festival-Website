import React from 'react';
import Axios from "axios";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import AddMovieEntry from './AddMovieEntry.js'
import EditMovieEntry from './EditMovieEntry.js'
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  cardMedia: {
    paddingTop: '130%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  overlay: {
    textDecoration: 'none',
    position: 'absolute',
    color: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: '100%',
    width: '100%',
    overflow: 'wrap',
    '&:hover': {
      color: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
    formControl2: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
 },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MoviesPage(props={}) {
  
  const classes = useStyles();
  const [cards, setCards] = React.useState(props.props.movies);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [filmGenre, setFilmGenre] = React.useState([]);
  const [movieDetails, setMovieDetails] = React.useState({})
  const [refresh, setRefresh] = React.useState(false);

  const handleChange = (event) => {
    setFilmGenre(event.target.value);
  };

  const checkIfGenresMatched = (card) => {
    for(let i = 0; i < filmGenre.length; i++) {
        if(!card.genres.includes(filmGenre[i])) {
            return false
        }
    }
    return true
  }
  
  const genres = [
    'Action',
    'Romance',
    'Horror',
    'Drama',
    'Comedy',
    'Documentary',
    'Musical',
    'Science Fiction',
    'Thriller',
    'Western',
    'Adventure',
    'Mystery',
    'Historical',
    'Fantasy',
    'War',
    'Superhero',
  ];
  
  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  }

  const deleteMovieEntry = async (card) => {

    Axios({
      method: "DELETE",
      url: "http://localhost:5000/movies/" + card,
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
      },
    }).then(res => {
      let new_cards = []
      for (let i=0; i < cards.length; i++) {
        if (cards[i]._id == card) {
          continue
        } else {
            new_cards.push(cards[i])
        }
      }
      setCards(new_cards)
    }).catch(err => {
      setOpenErrorDialog(true)
    });

  }

  const parseGenres = (g) => {
    let s = ''
    for(let i = 0 ; i < g.length; i++) {
      s += g[i] + ' '
    }
    return s
  }

  return (
    <>
    <AddMovieEntry cards={cards} setCards={setCards} setRefresh={setRefresh} refresh={refresh} openAddDialog={openAddDialog} setOpenAddDialog={setOpenAddDialog} setOpenErrorDialog={setOpenErrorDialog}/>
    <Dialog
        open={openErrorDialog}
        onClose={handleCloseErrorDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Something went wrong!"}</DialogTitle>
        <DialogContent>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" style={{marginRight: '37%'}}>
            Close
          </Button>
        </DialogActions>
    </Dialog>
    <Container style={{backgroundColor: 'white', marginTop: '5vh'}}>
    <Typography gutterBottom variant="h2" component="h2" style={{paddingTop: '3vh', paddingBottom: '3vh', textAlign: 'center', borderBottom: '3px solid black'}}>
        Movies
    </Typography>
        <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        {localStorage.getItem("role") === '0' ?
        (
            <Button onClick={() => {setOpenAddDialog(true)}}>
              Add new film entry
            </Button>
        ) : null
        }
        <span>
        <InputLabel>Genres</InputLabel>
        <Select
          style={{minWidth: '200px'}}
          variant="outlined"
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={filmGenre}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div  className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value}/>
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {genres.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select></span>
        </span>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {cards.map((card, i) => {
              if (checkIfGenresMatched(card) === false) 
                return null
              
               return (
                 <>
                {localStorage.getItem("role") === '0' && i === 0 ?
                (
                  <>
                <Dialog
                  open={openDeleteDialog}
                  onClose={handleCloseDeleteDialog}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this entry?"}</DialogTitle>
            
                  <DialogActions>
                    <Button onClick={() => {localStorage.removeItem("movieEntryToDelete"); handleCloseDeleteDialog()}} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={() => {handleCloseDeleteDialog(); deleteMovieEntry(localStorage.getItem("movieEntryToDelete")); localStorage.removeItem("movieEntryToDelete");}} color="primary" autoFocus>
                      Apply
                    </Button>
                  </DialogActions>
                </Dialog>
                <EditMovieEntry setRefresh={setRefresh} refresh={refresh} movieDetails={movieDetails} setMovieDetails={setMovieDetails}cards={cards} setCards={setCards} openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} setOpenErrorDialog={setOpenErrorDialog}/>
                </>) : null}
              <Grid item key={card._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={'http://localhost:5000/image/' + card.poster_id}
                    title={card.title}
                  />
                  
                  <Link to={"/movies/" + card._id} className={classes.overlay}>
                  <CardActionArea>

                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2" style={{fontWeight: 'bold'}}>{card.title}</Typography>
                      <Typography>{'Summary: ' + card.summary}</Typography>
                      <Typography style={{marginTop: '10px'}}>{'Genres: ' + parseGenres(card.genres)}</Typography>
                    </CardContent>
                  </CardActionArea>
                  </Link>
                  {
                  localStorage.getItem("role") === '0' ? (
                    <CardActions style={{backgroundColor:"rgba(255, 255, 255, 1)", zIndex:1000}}>
                      <IconButton aria-label="delete" onClick={() => {localStorage.setItem("movieEntryToDelete", card._id); setOpenDeleteDialog(true)}}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton aria-label="edit" onClick={() => {localStorage.setItem("movieEntryToEdit", card._id); setMovieDetails(card); setOpenEditDialog(true)}}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </CardActions>) : '' 
                  }
                </Card>
              </Grid>
                  </>)
                }
              )
            }
          </Grid>
        </Container>
    </Container>
    </>
  );
}