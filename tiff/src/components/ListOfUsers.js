import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Axios from "axios";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const getRole = (r) => {
  if (r === 0) {
    return 'Admin'
  } else if (r === 1) {
    return 'Manager'
  } else if (r === 2) {
    return 'Film Producer'
  } else {
    return 'Member'
  }
}

const convertDate = (v) => {
  var d = new Date(v);
  let hour
  let minute
  if (d.getHours() < 10) {
      hour = '0' + d.getHours()
  } else {
      hour = d.getHours()
  }
  if (d.getMinutes() < 10) {
      minute = '0' + d.getMinutes()
  } else {
      minute = d.getMinutes()
  }

  return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + hour + ':' + minute
}

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    paddingLeft: '60px',
  }
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function ListOfUsers(props={}) {
  const classes = useStyles2();
  const classesForm = useStyles();
  const [rows, setUsers] = React.useState(props.props.users);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [new_username, setNewUsername] = React.useState('');
  const [new_role, setNewRole] = React.useState(3);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const [refresh, setRefresh] = React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeUsername = (event) => {
    setNewUsername(event.target.value);
  }

  const handleChangeRole = (event) => {
    setNewRole(parseInt(event.target.value, 10));
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  }

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  }

  const deleteRow = async () => {
    let row = localStorage.getItem("rowToDelete")
    localStorage.removeItem("rowToDelete")
  
    Axios({
      method: "DELETE",
      url: "http://localhost:5000/users/" + row,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    }).then(res => {
      let new_users = []
      for (let i=0; i < rows.length; i++) {
        if (rows[i]._id == row) {
          continue
        } else {
          new_users.push(rows[i])
        }
      }
      setUsers(new_users)
      setRefresh(!refresh)
    }).catch(err => {
      setOpenErrorDialog(true)
    });

  }

  const editRow = async () => {
    let row = localStorage.getItem("rowToEdit")
    localStorage.removeItem("rowToEdit")

    Axios({
      method: "PUT",
      url: "http://localhost:5000/users/" + row,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      data: {
        username: new_username,
        role_id: new_role
      },
    }).then(res => {
      let new_users = []
      console.log(new_role)
      for (let i=0; i < rows.length; i++) {
        if (rows[i]._id === row) {
          new_users.push({
            _id: rows[i]._id,
            email: rows[i].email,
            username: new_username,
            role_id: new_role,
            date_created: rows[i].date_created,
          })
        } else {
          new_users.push(rows[i])
        }
      }
      setUsers(new_users)
      setRefresh(!refresh)
    }).catch(err => {
      setOpenErrorDialog(true)
    });

  }
  return (
      <>
      <div>
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
    </div>
      <div>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle style={{fontWeight: 'bolder', marginRight: '200px', fontFamily: 'Arial'}}>Edit</DialogTitle>
        <DialogContent>
        <FormControl className={classesForm.formControl}>
        <span style={{marginRight: '20px'}}>Username</span>
          <TextField
            autoFocus
            margin="dense"
            type="username"
            value={new_username}
            onChange={handleChangeUsername}
            style={{marginBottom:'20px', marginRight: '20px'}}/>
            
            <span style={{marginRight: '20px'}}>Role</span>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={new_role}
                onChange={handleChangeRole}
                input={<Input />}
                style={{minWidth:'150px'}}
              >
                  <MenuItem value={3}>Member</MenuItem>
                  <MenuItem value={2}>Film Producer</MenuItem>
                  <MenuItem value={1}>Manager</MenuItem>

              </Select>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {localStorage.removeItem("rowToEdit"); handleCloseEditDialog()}} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {handleCloseEditDialog(); editRow();}} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>


      <div>
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this entry?"}</DialogTitle>
  
          <DialogActions>
            <Button onClick={() => {localStorage.removeItem("rowToDelete"); handleCloseDeleteDialog()}} color="primary">
              Cancel
            </Button>
            <Button onClick={() => {handleCloseDeleteDialog(); deleteRow();}} color="primary" autoFocus>
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </div>


      <Typography component="h1" variant="h4" style={{fontWeight: 'bold', marginLeft: '22.5vw', marginTop: '10vh'}}>
          User List
        </Typography>
    <TableContainer component={Paper} style={{position: 'static', width: '50%', marginLeft: '22vw', marginTop: '1vh'}}>
      <Table className={classes.table} aria-label="custom pagination table">
      <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeader}>E-mail</TableCell>
            <TableCell className={classes.tableHeader} align="right">Username</TableCell>
            <TableCell className={classes.tableHeader} align="right">Role</TableCell>
            <TableCell className={classes.tableHeader} align="right">Date&nbsp;created</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row}>
              <TableCell component="th" scope="row" style={{fontFamily: 'Arial'}}>
                {row.email}
              </TableCell>
              <TableCell align="right" style={{fontFamily: 'Arial'}}>
                {row.username}
              </TableCell>
              <TableCell align="right" style={{fontFamily: 'Arial', minWidth: '150px'}}>
                {getRole(row.role_id)}
              </TableCell>
              <TableCell align="right" style={{fontFamily: 'Arial'}}>
                {convertDate(row.date_created)}
              </TableCell>

              {row.role_id !== 0 ?
                (<TableCell align="right">
                <IconButton aria-label="delete" onClick={() => {localStorage.setItem("rowToDelete", row._id); setOpenDeleteDialog(true)}}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="edit" onClick={() => {
                  localStorage.setItem("rowToEdit", row._id); 

                  setNewUsername(row.username); 
                  if (row.role === "Member") {
                    setNewRole(3);
                  } else if (row.role === "Film Producer") {
                    setNewRole(2);
                  } else if (row.role === "Manager") {
                    setNewRole(1);
                  }
                  setOpenEditDialog(true)}}>
                  <EditIcon fontSize="small" />
                </IconButton>
                </TableCell>) : <TableCell></TableCell>}
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={5}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>

    </>
  );
}