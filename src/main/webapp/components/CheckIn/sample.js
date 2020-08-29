
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { useState, useEffect } from 'react' ;
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import {
    FaUserCheck
} from 'react-icons/fa';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Form
} from 'reactstrap';
//Date Picker
import 'react-widgets/dist/css/react-widgets.css';
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
// React Notification
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from 'axios';
import {url} from 'axios/url';
//Dtate Picker package
Moment.locale('en');
momentLocalizer();


const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },


});
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 11,
    },
}))(TableCell);
const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);



export default function CheckInList(props) {
    const classes = useStyles();

    const [page, setPage] = React.useState(0);


    //Modal state
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    //end og modal state
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    //Get list of Visit/checkin patients API
    const [data, setData] = useState([]);
    const apipatient = url+"patients";
    useEffect(() => {
        const GetData = async () => {
            const result = await axios(apipatient);
            setData(result.data);
        }
        GetData();

    }, []);
//get the user that need to be checked in
    const [patientrow, setpatientValue] = useState();

    const getUsermodal = (patientrow)=> {
        // setpatientValue(props.patientrow);
        //const [newpatientrow, setnewpatientValue] = useState(newpatientid);
        setModal(!modal);

    }
//Save Checkedin

    const [checkin, setcheckedin] = useState({ dateVisitStart: new Date(), timeVisitStart: null, visitTypeId:'', patientId:'' });
    const [showLoading, setShowLoading] = useState(false);
    const apiUrl =url+"visits";

    const saveCheckedin = (e) => {

        e.preventDefault();
        const newdateVisitStart = moment(checkin.dateVisitStart).format('DD-MM-YYYY');moment().format('HH.mm')
        const newtimeVisitStart = moment(checkin.timeVisitStart).format('HH:mm');
        const data = {
            dateVisitStart: newdateVisitStart,
            timeVisitStart:newtimeVisitStart,
            visitTypeId:'2',
            patientId:patientrow
        };
        console.log(data);
        axios.post(apiUrl, data)
            .then((result) => {
                toast.success("Patient Checked In was Successful!");
                setModal(!modal);
                setShowLoading(false);
                props.history.push('/checkin')

                console.log(result);
            }).catch((error) => {
                console.log(error);
                setShowLoading(false)
                // console.log("Error in CreateBook!");
                //toast.error("Something went wrong!");
            }
        );
    };

    const handleChangePage = (event, newPage) => {

        setPage(newPage);

    };

    const handleChangeRowsPerPage = event => {

        setRowsPerPage(+event.target.value);

        setPage(0);

    };
    const onChange = (e) => {
        e.persist();
        setcheckedin({...checkin, [e.target.name]: e.target.value});
    }
    return (

        <Paper className={classes.root}>
            <ToastContainer autoClose={2000} />
            <TableContainer className={classes.container}>

                <Table stickyHeader aria-label="sticky table">

                    <TableHead>

                        <TableRow>

                            <StyledTableCell>Patient ID</StyledTableCell>

                            <StyledTableCell align="right">Patient Name</StyledTableCell>

                            <StyledTableCell align="right">Phone Number</StyledTableCell>

                            <StyledTableCell align="right">Age </StyledTableCell>

                            <StyledTableCell align="right">Action</StyledTableCell>


                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                            return (

                                <StyledTableRow >

                                    <TableCell component="th" scope="row">

                                        {row.id}

                                    </TableCell>
                                    <TableCell align="right">{row.firstName} {' '} {row.lastName}</TableCell>

                                    <TableCell align="right">+2347045678790</TableCell>

                                    <TableCell align="right">{row.dob}</TableCell>

                                    <TableCell align="right">

                                        <Tooltip title="check in Patient">
                                            <IconButton aria-label="check in Patient"
                                                        onClick={() => {
                                                            getUsermodal(setpatientValue(row.id));

                                                        }} >
                                                < FaUserCheck size={20} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>

                                </StyledTableRow>

                            );

                        })}

                    </TableBody>
                </Table>

                {/* The checkedin modal  */}
                <Modal isOpen={modal} toggle={toggle} size="lg">
                    <Form onSubmit={saveCheckedin}>
                        <ModalHeader toggle={toggle}>Check In Patient </ModalHeader>
                        <ModalBody>
                            <Row form>
                                <Col md={4}>
                                    <Input type="hidden" name="patientId" value={patientrow}  onChange={value1 => setcheckedin({...checkin, patientId: value1})} ></Input>
                                    <FormGroup>
                                        <Label for="qualification">Visit Type</Label>
                                        <Input type="select" name="visitTypeId" value={checkin.visitTypeId}  onChange={onChange}>
                                            <option value="2">Booked</option>
                                            <option value="3">Unbooked</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="middleName">Date Of Visit</Label>
                                        <DateTimePicker time={false} name="dateVisitStart"  id="dateVisitStart" value={checkin.dateVisitStart}
                                                        defaultValue={new Date()} max={new Date()}
                                                        onChange={value1 => setcheckedin({...checkin, dateVisitStart: value1})}/>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="middleName">Time of Visit</Label>
                                        <DateTimePicker date={false} name="timeVisitStart"  id="timeVisitStart"
                                                        value={checkin.timeVisitStart}  defaultValue="clock"  onChange={value1 => setcheckedin({...checkin, timeVisitStart: value1})} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Row>
                                <Col md={12}>
                                    {showLoading &&
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                    }
                                </Col>
                            </Row>
                            <Button color="primary"  type="submit" >Check In</Button>{' '}
                            <Button color="secondary" onClick={() => toggle()}>Close</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}

                component="div"

                count={data.length}

                rowsPerPage={rowsPerPage}

                page={page}

                onChangePage={handleChangePage}

                onChangeRowsPerPage={handleChangeRowsPerPage}

            />

        </Paper>

    );

}