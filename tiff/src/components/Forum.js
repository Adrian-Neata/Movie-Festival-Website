import React, { useState, useEffect } from 'react';
import Thread from './Thread.js'
import AddThread from './AddThread.js'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import DeleteDialog from './DeleteDialog.js';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: '5vh',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 40,
        borderBottom: '2px solid black',
    }
  }));

export default function Forum(props) {
    const classes = useStyles();
    const [threads, setThreads] = useState([])
    const [uploadHelper, setUploadHelper] = React.useState('')
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [threadToDelete, setThreadToDelete] = useState('')
    const [threadToEdit, setThreadToEdit] = useState('')

    useEffect(() => {
        const axios = require('axios')

        axios({
            method: 'get',
            url: 'http://localhost:5000/threads/',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
            },

        }).then(res => {
            setThreads(res.data.response)
        }).catch(e => {

        });
    }, [0])

    const addThread = async (threadDetails) => {
        const axios = require('axios')

        axios({
            method: 'post',
            url: 'http://localhost:5000/threads/',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
            },
            data: threadDetails,
        }).then(res => {
            threads.push(res.data.response)
            setRefresh(!refresh)
        }).catch(e => {
            console.log(e)
        });
        setOpenAddDialog(false)
    }

    const editThread = async (threadDetails) => {
        const axios = require('axios')
        threadToEdit.title = threadDetails.title
        threadToEdit.description = threadDetails.description
        axios({
            method: 'put',
            url: 'http://localhost:5000/threads/' + threadToEdit._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
            },
            data: threadToEdit,
        }).then(res => {
            for(let i = 0; i < threads.length; i++) {
                if (threads[i]._id === threadToEdit._id) {
                    threads[i] = threadToEdit
                }
            }
            setRefresh(!refresh)
        }).catch(e => {
            console.log(e)
        });
        setOpenEditDialog(false)
    }

    const deleteThread = async () => {
        const axios = require('axios')

        axios({
            method: 'delete',
            url: 'http://localhost:5000/threads/' + threadToDelete,
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : null,
            },
        }).then(res => {
            for (let i = 0; i < threads.length; i++) {
                if (threads[i]._id === threadToDelete) {
                    threads.splice(i, 1)
                    break
                }
            }
            setRefresh(!refresh)
        }).catch(e => {
            console.log(e)
        });
        setOpenAddDialog(false)
    }

    return (
        <Container className={classes.container}>
            <DeleteDialog openDeleteDialog={openDeleteDialog} setOpenDeleteDialog={setOpenDeleteDialog} deleteEntry={deleteThread}/>
            <AddThread openAddDialog={openAddDialog} setOpenAddDialog={setOpenAddDialog} uploadHelper={uploadHelper} addThread={addThread}/>
            <AddThread editData={threadToEdit} openAddDialog={openEditDialog} setOpenAddDialog={setOpenEditDialog} uploadHelper={uploadHelper} addThread={editThread}/>
            <Typography className={classes.title} align='center'>Forum</Typography>
            {localStorage.getItem("role") === '0'?
            (<Button onClick={() => setOpenAddDialog(true)}>ADD NEW THREAD</Button>) : null
            }
            {threads.map(t => <Thread thread={t} setThreadToEdit={setThreadToEdit} setOpenEditDialog={setOpenEditDialog} deleteComment={(id) => {setThreadToDelete(id); setOpenDeleteDialog(true);}}/>)}
        </Container>
        )
}