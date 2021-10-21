import React from 'react';
import {CardBody, Col, FormGroup, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import Select from "react-select";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import ErrorIcon from "@material-ui/icons/Error";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CancelIcon from "@material-ui/icons/Cancel";
import {CircularProgress} from "@material-ui/core";
import {connect} from "react-redux";

const SearchPatientByFingerprint = (props) => {
    const [devices, setDevices] = React.useState([]);
    const [device, setDevice] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const placeFingerMsg = 'Please place your hand on scanner';
    const fingerIdentified = 'This finger has already been captured! Click view patient to view patient.';
    const errorMessage = 'Could not capture fingerprint, try again';
    const [fingerCaptureMessage, setFingerCaptureMsg] = React.useState('');

    React.useEffect(() => {
        if(props.showModal) {
            fetchDevice();
        }
    }, [props.showModal]);

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

    const findPatient = () => {
        if(!device){
            toast.error("Select a device");
            return;
        }

        setFingerCaptureMsg(`Please place your finger on scanner.`);
        setStatus('Pending');
        readFingerprint();
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
                    setStatus('Error');
                    setFingerCaptureMsg('Finger does not exist.');
                   // templateCaptured(response.data);
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

    return (
        <>

            <Modal isOpen={props.showModal} toggle={props.toggleModal} zIndex={"9999"}>
                <ModalHeader toggle={props.toggleModal}>Search Patient By Fingerprint</ModalHeader>
                <ModalBody>
                    <ToastContainer />
                    <Row form>
                        <Col md={12}>
                            <FormGroup>
                                <Label for='device'>Select Device <span onClick={fetchDevice} style={{cursor:'pointer'}}>(click to refresh)</span></Label>
                                <Select
                                    required
                                    isMulti={false}
                                    value={device}
                                    isLoading={loading}
                                    onChange={value => {
                                        setDevice(value);
                                        findPatient();
                                    }}
                                    options={devices.map((x) => ({
                                        label: x.name,
                                        value: x,
                                    }))}
                                />
                            </FormGroup>
                        </Col>

                        <Col md={12} className={'text-center'}>
                            <h4 className={'text-center'}>{fingerCaptureMessage}</h4>
                            {status && status === 'Duplicate' && <ErrorIcon color={'secondary'} fontSize={'large'}/>}
                            {status && status === 'Success' && <ThumbUpIcon color={'success'} fontSize={'large'}/>}
                            {status && status === 'Error' && <>
                                <CancelIcon color={'secondary'} fontSize={'large'}/>
                                <p style={{cursor:'pointer'}} onClick={findPatient}>Click to Capture Again</p>
                            </>
                            }
                            {status && status === 'Pending' && <CircularProgress />}

                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )

}
const mapStateToProps = (state) => {
    return {
        patient: state.patients.patient,
    };
};
const mapActionToProps = {
};
export default connect(
    mapStateToProps,
    mapActionToProps
)(SearchPatientByFingerprint);