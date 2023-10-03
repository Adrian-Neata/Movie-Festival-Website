import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Footer from './Footer.js'
import AddComment from './AddComment.js'
import { useSnackbar } from 'notistack';
import Comment from './Comment.js'
import DeleteDialog from './DeleteDialog.js';

import {
    useParams
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    card: {
        marginLeft:'15%',
        width: '70%',
      },

    cardTitle: {
        fontWeight: 'bold',
        marginTop: '3vh',
    },
    chipContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
  }));

export default function SingleThreadPage(props) {
    const classes = useStyles();
    let { thread_id: thread_id } = useParams();
    const [thread, setThread] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const [comments, setComments] = useState([])
    const [commentId, setCommentId] = useState('')
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [userComments, setUserComments] = useState([]);

    const isUserComment = (c) => {
        if(userComments === undefined) {
            return false
        }

        for(let i = 0; i < userComments.length; i++) {
            if(userComments[i]._id === c._id) {
                return true
            }
        }

        return false
    }

    useEffect(async () => {
        const axios = require('axios')

        await axios({
            method: 'get',
            url: 'http://localhost:5000/threads/' + thread_id,
        }).then(res => {
            setThread(res.data.response)
        }).catch(e => {

        });

    }, [0]);

    useEffect(async () => {
        const axios = require('axios')

        axios({
            method: 'get',
            url: 'http://localhost:5000/posts/thread/' + thread_id,
        }).then(res => {
            setComments(res.data.response)
            setRefresh(!refresh)
        }).catch(e => {

        });

    }, [0])

    useEffect(async () => {
        const axios = require('axios')

        axios({
            method: 'get',
            url: 'http://localhost:5000/posts/user/thread/' + thread_id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
            },

        }).then(res => {
            setUserComments(res.data.response)
        }).catch(e => {
            console.log(e)
        });

    }, [0])

    const putPost = async (comment) => {
        const axios = require('axios')

        if(comment.body.length === 0) {
            return
        }
        axios({
            method: 'put',
            url: 'http://localhost:5000/posts/' + comment._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                },
            data: comment
        }).then(res => {
            enqueueSnackbar('Post edited!', {variant:'success'});
            let i
            for (i = 0; i < comments.length; i++) {
                if(comments[i]._id === comment._id) {
                    break
                }
            }
            comments[i].body = comment.body
            if (userComments._id === comment._id) {
                setUserComments(comment)
            }
            setRefresh(!refresh)
        }).catch(e => {
            console.log(e)
        });

    }

    const postPost = async (comment) => {
        const axios = require('axios')
        if(comment.length === 0) {
            return
        }

        axios({
            method: 'post',
            url: 'http://localhost:5000/posts/',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
                },
            data: {
                thread_id: thread_id,
                body: comment,
            }
        }).then(res => {
            enqueueSnackbar('Posted!', {variant:'success'});
            comments.push(res.data.response)
            userComments.push(res.data.response)
            setRefresh(!refresh)
        }).catch(e => {

        });

    }

    const deletePost = async () => {
        const axios = require('axios')

        axios({
            method: 'delete',
            url: 'http://localhost:5000/posts/' + commentId,
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
            if (userComments._id === commentId) {
                setUserComments(undefined)
            }
            setRefresh(!refresh)
            enqueueSnackbar('Post deleted!', {variant:'success'});
        }).catch(e => {
            console.log(e)
        });

    }


    return (
        <>
            {thread !== null ? 
            (
            <Container style={{maxWidth:'60%', marginTop: '9vh', marginBottom: '100px'}}>
            <DeleteDialog openDeleteDialog={openDeleteDialog} setOpenDeleteDialog={setOpenDeleteDialog} deleteEntry={deletePost}/>
            <Card className={classes.card}>
                <Typography gutterBottom variant="h3" component="h2" align='center' className={classes.cardTitle}>
                    {thread.title}
                </Typography>
                <CardContent gutterBottom variant="h4" component="h3">
                    {thread.description}
                </CardContent>
            </Card>
            
            {comments.map((c) => {
                if(!isUserComment(c)) 
                    return (<Comment forum comment={c} deleteComment={(id) => {setCommentId(id); setOpenDeleteDialog(true);}} editComment={putPost}/>); 
                return (<Comment forum comment={c} userComment deleteComment={(id) => {setCommentId(id); setOpenDeleteDialog(true);}} editComment={putPost}/>) })
            }
            <AddComment submit={postPost} comment/>
        </Container>) : (<><Footer/></>)}
        </>
        )
}