import React, {useState, useEffect} from 'react';
import { Modal, ModalHeader, ModalBody,Form,FormFeedback,
Row,Col,Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import "react-widgets/dist/css/react-widgets.css";
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import {url} from '../../../../api'
import { Alert } from 'reactstrap';
import { fetchPatientUser } from '../../../../actions/caseManager';
import { Spinner } from 'reactstrap';
import axios from "axios";
import Typography from '@material-ui/core/Typography';

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
        width: '100%', // Fix IE 11 issue.
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
    // const row = props.location.state location.state
    console.log(props.listOfPatient)
    const listOfPatient =  props.listOfPatient
    const classes = useStyles()
    console.log(listOfPatient)
    const manifestSamples = props.manifestSamples && props.manifestSamples !==null ? props.manifestSamples : {};
    const manifestSample= Object.values(manifestSamples);
    const manifestSampleForUpDateFormDataObj= Object.values(manifestSamples);
    const  totalSampleShipment = Object.keys(manifestSamples).length;
    const labId = manifestSamples.id
    const [loading, setLoading] = useState(false);
    const [manifestId, setManifestId] = useState();
    const [otherfields, setOtherFields] = useState({dateSampleDispatched:"",sampleDispatchedBy:"",courierPhoneNumber:"",timeSampleDispatched:"",sampleDispatchedByPhoneNumber:"", courierName:"", receivingLabName:"", manifest_status:""});
    const [manifestObj, setManifestObj] = useState(manifestSample)
    const [errors, setErrors] = useState({});
    const [pcrOptions, setOptionPcr] = useState([]);
    const [sampleManifest, setSampleManifest] = useState({patientIds:"" , userId:""})
    const [setPatientObj, setsetPatientObj] = useState([listOfPatient])


    let tifOptions = [];

    Object.keys(listOfPatient).forEach(function(key) {
        tifOptions.push(listOfPatient[key].patientId);
    });
    console.log(tifOptions)

    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios(
                    url + "organisation-units/organisation-unit-level/7"
                );
                const body = response.data && response.data !==null ? response.data : {};
                setOptionPcr(
                     body.map(({ name, id }) => ({ title: name, value: id }))
                 );
            } catch (error) {
            }
        }
        getCharacters();
    }, []);

    const handleOtherFieldInputChange = e => {
        setOtherFields ({ ...otherfields, [e.target.name]: e.target.value });
    }

    //Assign case manager

    const assignCaseManager = e => {

      e.preventDefault()

        sampleManifest["patientIds"] = tifOptions

        sampleManifest["userId"] = props.userId

        console.log(sampleManifest)

        props.fetchPatientUser(sampleManifest)

        //Closing of the modal
        props.togglestatus();
        //console.log(tifOptions)

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
                                            <p style={{marginTop: '.7rem' }}>
                                                {/*<Typography color="textPrimary">Are you sure you want to assign patient to this case manager - {row.firstName +  ' ' + row.lastName || ''} </Typography>*/}
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

export default connect(null, { fetchPatientUser })(ModalViewResult);
