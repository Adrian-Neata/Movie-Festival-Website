import React from 'react';
import Axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { DropzoneArea } from 'material-ui-dropzone';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
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

export default function EditMovieEntry(props={}) {
  const classes = useStyles();
  const cards = props.cards;
  const card_id = localStorage.getItem("movieEntryToEdit")
  const setCards = props.setCards;
  const openEditDialog = props.openEditDialog;
  const setOpenEditDialog = props.setOpenEditDialog;
  const [poster, setPoster] = React.useState(null)
  const movieDetails = props.movieDetails
  const setMovieDetails = props.setMovieDetails

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

  const getCard = () => {
    for(let i = 0; i < cards.length; i++) {
        if (cards[i]._id === card_id) { 
            return { ... cards[i] }
        }
    }
  }


  const handleChange = (event) => {
    let d = { ... movieDetails}
    d.genres = event.target.value
    setMovieDetails(d)
  };

  const setOpenErrorDialog = props.setOpenErrorDialog;

  const handleCloseEditDialog = () => {
    setMovieDetails(getCard())
    setOpenEditDialog(false);
  }

  const handleChangeTitle = (event) => {
    let d = movieDetails
    d.title = event.target.value
    setMovieDetails(d);
  }

  const handleChangeTrailerLink = (event) => {
    let d = movieDetails
    d.trailer_link = event.target.value
    setMovieDetails(d);
  }

  const handleChangeSummary = (event) => {
    let d = movieDetails
    d.summary = event.target.value
    setMovieDetails(d);
  }

  const handleChangeDirector = (event) => {
    let d = movieDetails
    d.director = event.target.value
    setMovieDetails(d);
  }

  const handleChangeWriter = (event) => {
    let d = movieDetails
    d.writer = event.target.value
    setMovieDetails(d);
  }

  const postImage = async () => {

    const formData = new FormData();

    formData.append("img", poster[0]);

    await Axios({
        method: "POST",
        url: "http://localhost:5000/image",
        headers: {
            "Content-Type": "application/json"
        },
        data: formData,
    }).then(res => {
        return res
    }).catch(err => {
        setOpenErrorDialog(true)
        throw new Error('Something bad happened')
    });

};

  const editMovieEntry = async () => {

    try {
        if (poster.length !== 0) {
            await postImage()

            let d = movieDetails
            d.poster_id = poster[0].name
            setMovieDetails(d);
        }

        Axios({
            method: "PUT",
            url: "http://localhost:5000/movies/" + movieDetails._id,
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            data: movieDetails,
        }).then(res => {
            let new_cards = cards
            for(let i = 0; i < new_cards.length; i++) {
              if (new_cards[i]._id === card_id) { 
                new_cards[i] = movieDetails
              }
            }

            setCards(new_cards);
            props.setRefresh(!props.refresh)
        }).catch(err => {
            setOpenErrorDialog(true)
        });

    } catch(err) {
      setOpenErrorDialog(true)
      return
    }

    handleCloseEditDialog(); 
  }

  return (
    <>

    <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle style={{fontWeight: 'bolder', marginRight: '200px', fontFamily: 'Arial'}}>Edit Movie Entry</DialogTitle>
        <DialogContent>
        <FormControl className={classes.formControl}>
        <TextField id="outlined-basic" label="Title" defaultValue={movieDetails.title} variant="outlined" onChange={handleChangeTitle} style={{marginBottom: '20px', minWidth: 500}}/>
        <TextField id="outlined-basic" label="Trailer Link" defaultValue={movieDetails.trailer_link} variant="outlined" onChange={handleChangeTrailerLink} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Summary" defaultValue={movieDetails.summary} variant="outlined" onChange={handleChangeSummary} multiline rows={10} rowsMax={20} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Director" defaultValue={movieDetails.director} variant="outlined" onChange={handleChangeDirector} style={{marginBottom: '20px'}} />
        <TextField id="outlined-basic" label="Writer" defaultValue={movieDetails.writer} variant="outlined" onChange={handleChangeWriter} style={{marginBottom: '20px'}} />
        <Select
          style={{marginBottom: '20px'}}
          variant="outlined"
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={movieDetails.genres}
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
        </Select>
        <DropzoneArea onChange={(event) => {setPoster(event)}} filesLimit={1} maxFileSize={12000000} acceptedFiles={['image/jpeg, image/png']}/>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {handleCloseEditDialog()}} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {editMovieEntry();}} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}