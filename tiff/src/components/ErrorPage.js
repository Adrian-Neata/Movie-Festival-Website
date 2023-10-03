import Avatar from '@material-ui/core/Avatar';
import databaseError from "../resources/database-error.svg";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: '#FF4646',
      width: '200px',
      height: '200px',
      textAlign: 'center',
      boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
      marginLeft: 'calc(50vw - 100px)',
      marginTop: 'calc(40vh - 100px)',
    },
  }));


function ErrorPage() {
    const classes = useStyles();

    return (
    <>
            <div style={{backgroundColor: '#EEEEEE'}}>
                <div style={{textAlign: 'center'}}> 
                    <Avatar className={classes.avatar}>
                        <img src={databaseError} alt="database_error" width='120px' style={{marginLeft: 20}}></img>
                    </Avatar>
                </div>   
                <h1 style={{marginTop: '5vh', textAlign: 'center'}}> Ooops! Something went wrong! </h1>
                <h1 style={{textAlign: 'center'}}> Please reload page </h1>
            </div>
    </>
    )
}

export default ErrorPage