import React from 'react';
import {Card, CardBody,CardHeader, Col, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import Select from "react-select";
import {connect} from "react-redux";
import {APPLICATION_CODESET_BIOMETRICS_FINGERPRINT} from "../../actions/types";
import {fetchByHospitalNumber} from "../../actions/patients";
import { fetchApplicationCodeSet } from "actions/applicationCodeset";
import SaveIcon from "@material-ui/icons/Save";
import MatButton from "@material-ui/core/Button";
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { Button, Image, List } from 'semantic-ui-react'
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import CloseIcon from '@material-ui/icons/Close';
import Spinner from "react-bootstrap/Spinner";
import PatientDetailCard from "../PatientProfile/PatientDetailCard";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CancelIcon from '@material-ui/icons/Cancel';
import {CircularProgress} from "@material-ui/core";
import ErrorIcon from '@material-ui/icons/Error';

const CaptureBiometrics = (props) => {
    const [formData, setFormData] = React.useState([]);
    const [devices, setDevices] = React.useState([]);
    const [device, setDevice] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [status, setStatus] = React.useState('Pending');
    const toggleModal = () => setShowModal(!showModal);

    const placeFingerMsg = 'Please place your hand on scanner';
    const fingerIdentified = 'This finger has already been captured! Click Recapture to capture finger again.';
    const errorMessage = 'Could not capture fingerprint, try again';
    const [fingerCaptureMessage, setFingerCaptureMsg] = React.useState(placeFingerMsg);
    const [currentFingerprint, setCurrentFingerprint] = React.useState();
    const defaultData = {
        fingerType:"",
        template: [],

    }
    const hospitalNumber = props.location.state;

    React.useEffect(() => {
       // if(!props.patient) {
            props.fetchPatientByHospitalNumber(hospitalNumber);
        //}
    }, [hospitalNumber]);

    /*# Get list of biometric finger parameter  #*/
    React.useEffect(() => {
       // if(props.biometricsFinger.length === 0){
            props.fetchApplicationCodeSet("BIOMETRIC_CAPTURE_FINGERS", APPLICATION_CODESET_BIOMETRICS_FINGERPRINT);
      //  }
    }, []);

    React.useEffect(() => {
        fetchDevice();
    }, []);

    const fetchDevice = () => {
        if(loading){
            return;
        }
        setLoading(true);
        axios
            .get(`http://localhost:8888/api/biometrics/readers`)
            .then((response) => {
                setLoading(false);
                setDevices(response.data);
                if(response.data && response.data.length == 0){
                    toast.info("There are no devices. Plug a device and try again");
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.error("Could not fetch list of devices, please make sure the biometrics service is running.");
            });
    }

     function readFingerprint (){
        axios
            .post(`http://localhost:8888/api/biometrics/identify`, {templates:[]}, { params: {
           server:'localhost:8080',
           accessToken:'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJBZG1pbmlzdHJhdG9yLFVzZXIiLCJleHAiOjE2MjA1NTYwNDF9.P5X4Av0v2k5jUlR1Wl73xT__uYnJR1DLV3luDKA7eIOkXmOr-9dvPsuTKbqG6tZ3Tw8wXkfRBUvlnCipg7Qecg',
             reader: device.value.name
         }})
           // axios
             //   .post('http://localhost:8888/api/biometrics/identify?reader=Futronic+FS80H+%231&server=localhost%3A8080&accessToken=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJBZG1pbmlzdHJhdG9yLFVzZXIiLCJleHAiOjE2MjA1NTYwNDF9.P5X4Av0v2k5jUlR1Wl73xT__uYnJR1DLV3luDKA7eIOkXmOr-9dvPsuTKbqG6tZ3Tw8wXkfRBUvlnCipg7Qecg', {templates:[]})
                .then((response) => {
                    if(response.data.template){
                        setStatus('Success');
                        setFingerCaptureMsg('Finger successfully captured.');
                        templateCaptured(response.data);
                        return;
                    }
                    if(response.data.message && response.data.message === 'PATIENT_IDENTIFIED'){
                        setFingerCaptureMsg(fingerIdentified);
                        setStatus('Duplicate');
                    }else {
                        setFingerCaptureMsg(errorMessage);
                        setStatus('Error');
                    }



               // return response.data;
            })
            .catch((error) => {
                setStatus('Error');
                setFingerCaptureMsg("Could not read fingerprint, try again.");
                //setLoading(false);
                //toggleModal();
            });
    }

    const templateCaptured = (response) => {
        const data = defaultData;
        data['fingerType'] = currentFingerprint.value;
        data['template'] = [response];
        formData.push(data);
        setCurrentFingerprint(null);

    }
    const saveBiometrics = () => {

    }

    const addToFingerprintList = () => {
        if(!device){
            toast.error("Select a device");
            return;
        }
        if(!currentFingerprint){
            toast.error("Select a finger to capture");
            return;
        }
       // setLoading(true);
        setFingerCaptureMsg(`Please place your ${currentFingerprint.value}  on scanner.`);
        setStatus('Pending');
        setShowModal(true);
        readFingerprint();

    }
    return (
        <>

            <Card>
                <CardBody>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to={{pathname: "/patient-dashboard", state: props.patient.hospitalNumber}} >
                    Patient dashboard
                </Link>
                <Typography color="textPrimary">Capture Biometrics</Typography>
            </Breadcrumbs>
                </CardBody>
            </Card>
            <PatientDetailCard />
            <br/>
            <Card>
                <CardHeader>
                    Capture Biometrics
                </CardHeader>
                <CardBody>
                    <Row form>

                        <ToastContainer />
                        <Col md={4}>
                            <FormGroup>
                                <Label for='device'>Select Device <span onClick={fetchDevice} style={{cursor:'pointer'}}>(click to refresh)</span></Label>
                                <Select
                                    required
                                    isMulti={false}
                                    value={device}
                                    isLoading={loading}
                                    onChange={value => {setDevice(value)}}
                                    options={devices.map((x) => ({
                                        label: x.name,
                                        value: x,
                                    }))}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for='device'>Select Finger</Label>
                                <Select
                                    required
                                    isMulti={false}
                                    value={currentFingerprint}
                                    onChange={value => {setCurrentFingerprint(value)}}
                                    options={props.biometricsFinger.map((x) => ({
                                        label: x.display,
                                        value: x.display,
                                    })).filter(x => !formData.map(y => y.fingerType).includes(x.value))}
                                />

                            </FormGroup>
                        </Col>
                        <Col md={4}>
                        <MatButton
                            type='button'
                            variant='contained'
                            color='primary'
                            onClick={addToFingerprintList}
                            className={'mt-4'}
                            startIcon={<FingerprintIcon />}
                        >
                            Capture Finger
                        </MatButton>

                        </Col>

                    </Row>
                    {formData.length > 0 &&
                    <>
                        <hr/>
                        <Row>
                            <Col md={12} className={"pb-3"}>
                                <h3>Captured Fingerprints</h3>
                            </Col>
                            <Col md={12}>
                                <List celled ordered>
                                    {formData.map((x) => (
                                        <List.Item>
                                            {/* <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' /> */}
                                            <List.Content> <FingerprintIcon/> {x.fingerType}</List.Content>
                                        </List.Item>
                                    ))}

                                </List>

                            </Col>

                            <Col md={12} className={'pt-2'}>
                                <MatButton
                                    type='button'
                                    variant='contained'
                                    color='primary'
                                    onClick={saveBiometrics}
                                    // className={classes.button}
                                    startIcon={<SaveIcon/>}
                                >
                                    Save Enrollment
                                </MatButton>
                            </Col>
                        </Row>
                    </>
                    }

                </CardBody>
            </Card>

            <Modal isOpen={showModal} toggle={toggleModal} zIndex={"9999"}>
                <ModalHeader toggle={toggleModal}>Capturing Fingerprint</ModalHeader>
                <ModalBody className={'text-center'}>
                    <h4 className={'text-center'}>{fingerCaptureMessage}</h4>
                    {status && status === 'Duplicate' && <ErrorIcon color={'secondary'} fontSize={'large'}/>}
                    {status && status === 'Success' && <ThumbUpIcon color={'success'} fontSize={'large'}/>}
                    {status && status === 'Error' && <>
                    <CancelIcon color={'secondary'} fontSize={'large'}/>
                    <p style={{cursor:'pointer'}} onClick={addToFingerprintList}>Click to Capture Again</p>
                    </>
                    }
                    {status && status === 'Pending' && <CircularProgress />}
             </ModalBody>
                <ModalFooter>
                    <MatButton
                        type='button'
                        variant='contained'
                        color='primary'
                        onClick={toggleModal}
                        // className={classes.button}
                        startIcon={<CloseIcon />}
                    >
                        Close
                    </MatButton>
                </ModalFooter>
            </Modal>
            </>
    )
}

const mapStateToProps = (state) => {
    return {
        patient: state.patients.patient,
        biometricsFinger: state.applicationCodesets.biometricsFinger
    };
};

const mapActionToProps = {
    fetchApplicationCodeSet: fetchApplicationCodeSet,
    fetchPatientByHospitalNumber: fetchByHospitalNumber,
};
export default connect(
    mapStateToProps,
    mapActionToProps
)(CaptureBiometrics);