import React from 'react';
import {CardBody, Col, FormGroup, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import  {BIOMETRICS_CAPTURE_FORM, GENERAL_SERVICE} from "../../api/codes";
import Select from "react-select";
import {connect} from "react-redux";
import {default as ACTION_TYPES, APPLICATION_CODESET_BIOMETRICS_FINGERPRINT} from "../../actions/types";
import { fetchApplicationCodeSet } from "actions/applicationCodeset";
import SaveIcon from "@material-ui/icons/Save";
import MatButton from "@material-ui/core/Button";
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { Button, Image, List } from 'semantic-ui-react'
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";

const CaptureBiometrics = (props) => {
    const [formData, setFormData] = React.useState([]);
    const [devices, setDevices] = React.useState([]);
    const [device, setDevice] = React.useState();
    const [currentFingerprint, setCurrentFingerprint] = React.useState();
    const defaultData = {
        fingerType:"",
        template: [],

    }

    /*# Get list of RELATIVE parameter  #*/
    React.useEffect(() => {
       // if(props.biometricsFinger.length === 0){
            props.fetchApplicationCodeSet("BIOMETRIC_CAPTURE_FINGERS", APPLICATION_CODESET_BIOMETRICS_FINGERPRINT);
      //  }
    }, []);

    React.useEffect(() => {
        fetchDevice();
    }, []);

    const fetchDevice = () => {
        axios
            .get(`localhost:8888/api/biometrics/readers`)
            .then((response) => {
                setDevices(response.data);
                if(response.data && response.data.length == 0){
                    toast.info("There are no devices. Plug a device and try again");
                }
            })
            .catch((error) => {
                toast.error("Could not fetch list of devices");
            });
    }

    const saveBiometrics = () => {

    }

    const addToFingerprintList = () => {

        const data = defaultData;
        data['fingerType'] = currentFingerprint.value;
        data['template'] = [];
        formData.push(data);
        setCurrentFingerprint(null);
    }
    return (
        <>
            <Modal isOpen={props.show} toggle={props.toggle} size='lg' zIndex={"9999"}>
                <ModalHeader toggle={props.toggle}>Capture Patient Biometrics</ModalHeader>
                <ModalBody>
                    <Row form>
                        <Col md={12}>
                            <FormGroup>
                                <Label for='device'>Select Device</Label>
                                <Select
                                    required
                                    isMulti={false}
                                    value={device}
                                    onChange={value => {setDevice(value)}}
                                    options={devices.map((x) => ({
                                        label: x.name,
                                        value: x,
                                    }))}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={12}>
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
                                    }))}
                                />

                            </FormGroup>
                        </Col>
                        <Col md={12}>
                        <MatButton
                            type='button'
                            variant='contained'
                            color='primary'
                            onClick={addToFingerprintList}
                           // className={classes.button}
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
                                <List divided verticalAlign='middle'>
                                    {formData.map((x) => (
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <Button>Recapture</Button>
                                            </List.Content>

                                            {/* <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' /> */}
                                            <List.Content> <FingerprintIcon/> {x.fingerType}</List.Content>
                                        </List.Item>
                                    ))}

                                </List>
                                <Col md={12}>
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
                            </Col>
                        </Row>
                    </>
                    }
                </ModalBody>
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
};
export default connect(
    mapStateToProps,
    mapActionToProps
)(CaptureBiometrics);