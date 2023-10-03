import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Footer from './Footer.js'
import AddComment from './AddComment.js'
import Chip from '@material-ui/core/Chip';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import IconButton from '@material-ui/core/IconButton';
import { useSnackbar } from 'notistack';
import Comment from './Comment.js'
import DeleteDialog from './DeleteDialog.js';

import {
    useParams
} from "react-router-dom";
import { CardActions } from '@material-ui/core';

const processVideo = (link) => {
    return "https://www.youtube.com/embed/" + link.substring(32, link.length);
}

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
  }));


export default function SingleMoviePage(props) {
    const classes = useStyles();
    let { movie_id } = useParams();
    const [movie, setMovie] = useState(null)
    const [likedState, setLikedState] = useState(null)
    const [likeButtonStyle, setLikeButtonStyle] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [dislikeButtonStyle, setDislikeButtonStyle] = useState({})
    const { enqueueSnackbar } = useSnackbar();
    const [comments, setComments] = useState([])
    const [commentId, setCommentId] = useState('')
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [userComment, setUserComment] = useState(undefined);

    useEffect(async () => {
        const axios = require('axios')

        await axios({
            method: 'get',
            url: 'http://localhost:5000/movies/' + movie_id,
        }).then(res => {
            setMovie(res.data.response)
            axios({
                method: 'get',
                url: 'http://localhost:5000/liked_movies/user/movie/' + movie_id,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                    },
            }).then(res => {
                if(res.data.response !== undefined) {
                    if (res.data.response.liked) {
                        setLikeButtonStyle({color: 'blue'})
                    } else {
                        setDislikeButtonStyle({color: 'blue'})
                    }
                    setLikedState(res.data.response)
                }
            }).catch(e => {
    
            });
        }).catch(e => {

        });

    }, [0]);

    const handleLikeChange = async (pressedLike) => {
        const axios = require('axios')

        if(likedState === null) {
            axios({
                method: 'post',
                url: 'http://localhost:5000/liked_movies/',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                    },
                data: {
                    movie_id: movie_id,
                    liked: pressedLike,
                }
            }).then(res => {
                if (res.data.response.liked) {
                    setLikeButtonStyle({color: 'blue'})
                } else {
                    setDislikeButtonStyle({color: 'blue'})
                }
                setLikedState(res.data.response)
            }).catch(e => {
    
            });
            return
        }

        if((likedState.liked && pressedLike) || (!likedState.liked && !pressedLike)) {
            axios({
                method: 'delete',
                url: 'http://localhost:5000/liked_movies/' + likedState._id,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                },
            }).then(res => {
                setLikedState(null)
                setLikeButtonStyle({})
                setDislikeButtonStyle({})
            }).catch(e => {
    
            });
            return
        }

        if((likedState.liked && !pressedLike) || (!likedState.liked && pressedLike)) {
            likedState.liked = pressedLike;
            axios({
                method: 'put',
                url: 'http://localhost:5000/liked_movies/' + likedState._id,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                },
                data: likedState
            }).then(res => {
                if (pressedLike) {
                    setLikeButtonStyle({color: 'blue'})
                    setDislikeButtonStyle({})
                } else {
                    setDislikeButtonStyle({color: 'blue'})
                    setLikeButtonStyle({})
                }
            }).catch(e => {
                console.log(e)
            });
            return
        }
    }

    useEffect(async () => {
        const axios = require('axios')

        axios({
            method: 'get',
            url: 'http://localhost:5000/reviews/movie/' + movie_id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
            },

        }).then(res => {
            setComments(res.data.response.sort((a, b) => (a.nr_helpfuls > b.nr_helpfuls) ? -1 : 1))
        }).catch(e => {
            console.log(e)
        });

    }, [0])

    useEffect(async () => {
        const axios = require('axios')

        axios({
            method: 'get',
            url: 'http://localhost:5000/reviews/user/movie/' + movie_id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
            },

        }).then(res => {
            setUserComment(res.data.response)
        }).catch(e => {
            console.log(e)
        });

    }, [0])

    const putReview = async (comment) => {
        const axios = require('axios')

        if(comment.body.length === 0) {
            return
        }
        axios({
            method: 'put',
            url: 'http://localhost:5000/reviews/' + comment._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                },
            data: comment
        }).then(res => {
            enqueueSnackbar('Review edited!', {variant:'success'});
            let i
            for (i = 0; i < comments.length; i++) {
                if(comments[i]._id === comment._id) {
                    break
                }
            }
            comments[i].body = comment.body
            if (userComment._id === comment._id) {
                setUserComment(comment)
            }
            setRefresh(!refresh)
        }).catch(e => {
            console.log(e)
        });

    }

    const postReview = async (comment) => {
        const axios = require('axios')
        if(comment.length === 0) {
            return
        }
        axios({
            method: 'post',
            url: 'http://localhost:5000/reviews/',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                },
            data: {
                movie_id: movie_id,
                body: comment,
            }
        }).then(res => {
            enqueueSnackbar('Review posted!', {variant:'success'});
            comments.push(res.data.response)
            setUserComment(res.data.response)
            setRefresh(!refresh)
        }).catch(e => {

        });

    }

    const deleteReview = async () => {
        const axios = require('axios')

        axios({
            method: 'delete',
            url: 'http://localhost:5000/reviews/' + commentId,
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                },

        }).then(res => {
            let i
            for (i = 0; i < comments.length; i++) {
                if(comments[i]._id === commentId) {
                    break
                }
            }
            comments.splice(i, 1)
            if (userComment._id === commentId) {
                setUserComment(undefined)
            }
            setRefresh(!refresh)
            enqueueSnackbar('Review deleted!', {variant:'success'});
        }).catch(e => {
            console.log(e)
        });

    }

    const addHelpful = async (comment) => {
        const axios = require('axios')
        
        axios({
            method: 'post',
            url: 'http://localhost:5000/helpful/',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                },
            data: {
                review_id: comment._id,
            }
        }).then(res => {
            comment.found_helpful = true
            setRefresh(!refresh)
        }).catch(e => {

        });
    }

    const removeHelpful = async (comment) => {
        const axios = require('axios')

        axios({
            method: 'delete',
            url: 'http://localhost:5000/helpful/review/' + comment._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                },

        }).then(res => {
            comment.found_helpful = false
            setRefresh(!refresh)
        }).catch(e => {

        });
    }

    return (
        <>
            {movie !== null ? 
            (
            <Container style={{maxWidth:'60%', marginTop: '9vh', marginBottom: '100px'}}>
            <DeleteDialog openDeleteDialog={openDeleteDialog} setOpenDeleteDialog={setOpenDeleteDialog} deleteEntry={deleteReview}/>
            <Card className={classes.card}>

                <iframe loading="lazy" title="title" style={{width: "100%", height: "300px"}} src={processVideo(movie.trailer_link)}>
                </iframe>
                
                <Typography gutterBottom variant="h3" component="h2" align='center' className={classes.cardTitle}>
                    {movie.title}
                </Typography>
                <CardContent>
                    <div className={classes.chipContainer}>
                    {movie.genres.map(g => (
                        <Chip label={g}/>
                    ))}</div>
                    {movie.summary}
                </CardContent>
                <CardActions>
                    <IconButton aria-label="like" style={likeButtonStyle} onClick={() => handleLikeChange(true)}>
                        <ThumbUpAltIcon fontSize="large" />
                    </IconButton>
                    <IconButton aria-label="dislike" style={dislikeButtonStyle} onClick={() => handleLikeChange(false)}>
                        <ThumbDownIcon fontSize="large" />
                    </IconButton>
                </CardActions>
            </Card>
            {
                userComment === undefined ? (<AddComment submit={postReview}/>) : (<Comment comment={userComment} userComment deleteComment={(id) => {setCommentId(id); setOpenDeleteDialog(true);}} editComment={putReview}/>)
            }
            
            {comments.map((c) => {if(userComment === undefined || userComment._id !== c._id) return (<Comment comment={c} deleteComment={(id) => {setCommentId(id); setOpenDeleteDialog(true);}} editComment={putReview} addHelpful={addHelpful} removeHelpful={removeHelpful}/>); return null; })}
        </Container>) : (<><Footer/></>)}
        </>
        )
}