import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    accordion: {
        marginTop: 20,
        marginLeft:'15%',
        width: '70%',
        marginBottom: '100px',
    },
    button: {
        backgroundColor: 'rgba(255, 70, 70, 1)',
        marginTop: 10,
        width: '100px',
        color: 'white',
        fontWeight: 'bold',
        marginRight: 20,
        "&:hover": {
            backgroundColor: 'red',
        }
    }
  }));


export default function AddComment(props) {
    const classes = useStyles();
    const [comment, setComment] = useState('')
    const [openAccordion, setOpenAccordion] = useState(false)

    const handleChangeComment = (event) => {
        setComment(event.target.value)
    }

    return (
        <>
            <Card className={classes.accordion}>
            <Accordion expanded={openAccordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    IconButtonProps={{onClick: () => setOpenAccordion(!openAccordion)}}
                >
                    {
                        props.comment ? (<Typography className={classes.heading}>Write a comment</Typography>) : (<Typography className={classes.heading}>Write a review</Typography>)
                    }
                    
                </AccordionSummary>
                <AccordionDetails style={{display: 'flex', flexDirection: 'column'}}>
                    {
                        props.comment ? (<TextField id="outlined-basic" label="Comment" variant="outlined"  multiline rows={6} rowsMax={12} style={{width: '100%'}} onChange={handleChangeComment}/>) : (<TextField id="outlined-basic" label="Review" variant="outlined"  multiline rows={6} rowsMax={12} style={{width: '100%'}} onChange={handleChangeComment}/>)
                    }
                    <Button className={classes.button} onClick={async () => { setOpenAccordion(false); await props.submit(comment); setComment('')}}>Submit</Button>
                </AccordionDetails>
            </Accordion>
            </Card>
        </>
        )
}