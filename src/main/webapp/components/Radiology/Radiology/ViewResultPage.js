import React, {useEffect, useState} from 'react';
import { connect } from "react-redux";
import {fetchByHospitalNumber} from "actions/patients";
import {fetchRadiologyTestOrdersByEncounterID, updateRadiologyByFormId} from "actions/laboratory"

import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader, Spinner
    ,CardHeader,Col,Row,Alert,Table, Form,FormGroup,Label,Input} from 'reactstrap'
import Moment from "moment";
import parse from 'html-react-parser';
import momentLocalizer from "react-widgets-moment";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Carousel} from "react-bootstrap";
import "./Radiology.css";

import ModalImage from "react-modal-image";

import 'react-widgets/dist/css/react-widgets.css'
import { ToastContainer } from "react-toastify";
//Dtate Picker package
Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    td: { borderBottom :'#fff'},
    previewChip: {
        minWidth: 160,
        maxWidth: 210
    },
}))
const ViewResultPage = (props) => {
    const [saving, setSaving] = React.useState(false);
    const [testOrder, setTestOrder] = React.useState({data:{files:[]}});
    const [note, setNote] = React.useState("");
    const classes = useStyles()

    useEffect(() => {
        if(props.formData) {
            setTestOrder(props.formData);
            setNote(props.formData.data);
        }

    }, [props.formData]); //componentDidMount

    const isImageFile = (fileName) => {
        const fileExt = fileName.split('.').pop();
        const imageExt = ["png", "jpg", "jpeg"];
        if(imageExt.includes(fileExt)){
            return true;
        }
        return false

    }

    return (

    <React.Fragment>
        <Modal isOpen={props.showModal} toggle={props.toggleModal} size="xl">
                <ModalHeader toggle={props.toggleModal}> View Radiology Result </ModalHeader>
                <ModalBody>

                    <Row style={{marginTop: '20px'}}>
                        <Col md="12">
                            <Alert color="dark" style={{backgroundColor: '#9F9FA5', color: "#000"}}>
                                <Row>
                                    <Col md={6}>
                                        Test
                                        Area: <b>{testOrder && testOrder.data && testOrder.data.description ? testOrder.data.description : ""}</b>
                                    </Col>
                                    <Col md={6}>
                                        Test: <b>{testOrder && testOrder.data && testOrder.data.description ? testOrder.data.description : ""}</b>
                                    </Col>
                                    <Col md={6}>
                                        Date Ordered : <b>{testOrder && testOrder.data && testOrder.data.sample_order_date ? testOrder.data.sample_order_date : ""}  {" "}
                                        {testOrder && testOrder.data && testOrder.data.sample_order_time ? testOrder.data.sample_order_time : ""} </b>
                                    </Col>
                                    <Col md={6}>
                                        Ordered By : <b>{testOrder && testOrder.data && testOrder.data.ordered_by ? testOrder.data.ordered_by : ""}</b>
                                    </Col>

                                </Row>

                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <span>Upload Date & Time: </span>
                            <b>{testOrder && testOrder.data && testOrder.data.result_date ? testOrder.data.result_date : ""} {" "}
                                {testOrder && testOrder.data && testOrder.data.result_time ? testOrder.data.result_time : ""}
                            </b>
                        </Col>
                        <Col md={12}>
                            <h3 className={"pt-3"}>Radiology Notes: </h3>
                            <div className={"p-2"} style={{borderStyle: 'ridge', color: "#000"}}>
                                {   parse(testOrder && testOrder.data && testOrder.data.note ? testOrder.data.note : "")}
                            </div>
                        </Col>

                        <Col md={12}>
                            <h3 className={"pt-3"}>Uploaded Files <small>(Click to view)</small></h3>

                        </Col>
                    </Row>

                            {/*<Carousel>*/}
                            {/*<Row >*/}
                                {testOrder && testOrder.data && testOrder.data.files ?

                                       <Row>
                                        {testOrder.data.files.map((file, index) => (
                                                <Col md={4} key={index}>
                                            <ModalImage small={file.data}
                                            large={file.data}
                                                        className={"file-height"}
                                            alt={file.file.path}
                                            /></Col>
                                        ))
                                        }
                                       </Row>


                                    : <span>No file has been uploaded.</span>


                                }
                            {/*</Row>*/}
                            {/*</Carousel>*/}


                </ModalBody>
                <ModalFooter>

                    <Button
                        variant='contained'
                        color='default'
                        onClick={props.toggleModal}
                        startIcon={<CancelIcon/>}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
        </Modal>

    </React.Fragment>

    );
}


const mapStateToProps = state => {

    return {
        list: state.laboratory.radiologyTests,
        patient: state.patients.patient,
    };
};

const mapActionToProps = {
    fetchAll: fetchRadiologyTestOrdersByEncounterID,
    fetchPatientByHospitalNumber: fetchByHospitalNumber,
    updateRadiologyByFormId: updateRadiologyByFormId
};

export default connect(mapStateToProps, mapActionToProps)(ViewResultPage);