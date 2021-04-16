import React, {useState, useEffect} from 'react';
import { Modal, ModalHeader, ModalBody,Form,
Row,Col,Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import "react-widgets/dist/css/react-widgets.css";
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { Alert } from 'reactstrap';
import { create } from '../../../../actions/caseManager';
import Spinner from 'react-bootstrap/Spinner';

Moment.locale('en');
momentLocalizer();

const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    input: {
        display: 'none'
    } 
}))
Moment.locale('en');
momentLocalizer();


const ModalViewResult = (props) => {
    const [loading, setLoading] = useState('')
    const listOfPatient =  props.listOfPatient
    const classes = useStyles()
    const PatientList = props.PatientList && props.PatientList !==null ? props.PatientList : [];
    const PatientLists= Object.values(PatientList);
    const labId = PatientLists.id
    const [patientObj, setpatientObj] = useState(PatientList)
    const [PatientListsArray, setPatientListsArray] = useState({patientIds:"" , userId:""})
    const [setPatientObj, setsetPatientObj] = useState([listOfPatient])

    let patientArray = [];

    Object.keys(listOfPatient).forEach(function(key) {
        patientArray.push(listOfPatient[key].patientId);
        console.log((listOfPatient[key].patientId))
    });
    console.log(patientArray)


    const assignCaseManager = e => {
        e.preventDefault()
        PatientListsArray["patientIds"] = patientArray
        PatientListsArray["userId"] = props.userId
        console.log(PatientListsArray)
        props.create(PatientListsArray)
        props.togglestatus();
  }


  return (      
      <div >
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
              <Form onSubmit={assignCaseManager}>
            <ModalHeader toggle={props.togglestatus}>Assign Case Manager</ModalHeader>
                <ModalBody>
                        <Card >
                            <CardBody>
                                <Row >
                                    <Col md={12} >
                                        <Alert color="dark" style={{backgroundColor:'#9F9FA5', color:"#000" , fontWeight: 'bolder', fontSize:'14px'}}>
                                          Are you sure you want to assign patient to this case manager
                                            <p style={{marginTop: '.7rem' }}>
                                            </p>
                                        </Alert>
                                    </Col>
                                  </Row>
                                      <br/>
                                      {loading ? <Spinner /> : ""}
                                      <br/>
                                          <MatButton
                                              type='submit'
                                              variant='contained'
                                              color='primary'
                                              className={classes.button}
                                              startIcon={<SaveIcon />}
                                              disabled={loading}>
                                              Yes
                                          </MatButton>
                                          <MatButton
                                              variant='contained'
                                              color='default'
                                              onClick={props.togglestatus}
                                              className={classes.button}
                                              startIcon={<CancelIcon />}>
                                              No
                                          </MatButton>
                            </CardBody>
                        </Card> 
                    </ModalBody>
                </Form>
      </Modal>
    </div>
  );
}

export default connect(null, { create })(ModalViewResult);
