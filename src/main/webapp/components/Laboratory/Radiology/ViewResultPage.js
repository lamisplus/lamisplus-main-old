import React, {useEffect, useState} from 'react';
import { connect } from "react-redux";
import {fetchByHospitalNumber} from "actions/patients";
import {fetchRadiologyTestOrdersByEncounterID, updateRadiologyByFormId} from "actions/laboratory"

import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import { Modal, ModalBody, ModalFooter, ModalHeader, Spinner
    ,CardHeader,Col,Row,Alert,} from 'reactstrap'
import Moment from "moment";
import parse from 'html-react-parser';
import momentLocalizer from "react-widgets-moment";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Carousel} from "react-bootstrap";
import "./Radiology.css";
import axios from "axios";
import {url} from "../../../api";
import ModalImage from "react-modal-image";
import ReactHtmlParser from 'react-html-parser'

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
    const [imageBlob, setImage] = React.useState({});
    const [imagesrc, setImageSrc] = React.useState([]);
    const classes = useStyles()
    const [imageClick, setimageClick] = React.useState(false);
    console.log()
    useEffect(() => {
        if(props.formData) {
            setTestOrder(props.formData);
            setNote(props.formData.data);
            setImageSrc([])
        }
        getImageUuids(props.formData && props.formData.data && props.formData.data.image_uuid)
    }, [props.formData]); //componentDidMount

    //ENDPOINT FOR IMAGE UUID
    
    const newDatalist = [props.formData && props.formData.data && props.formData.data.image_uuid]
    
    const getImageUuids = (newDatalist) => {
        const ArrayList = [newDatalist]
        const newArrList = JSON.stringify(ArrayList[0])
        const items =newArrList

            let i=0;
            const urllist=[]    
        for(i; i< ArrayList.length;i++){

            //const newVar = newDatalist[i]
            for (var key in ArrayList[i]) {
                //console.log(ArrayList[i][key])
                if ( ArrayList[i][key]!==null ){
                    //MAKE A CALL TO THE GET THE IMAGE 
                    const res = axios.get(`${url}images/${ArrayList[i][key]}`,
                    {
                        responseType: 'blob'
                    })
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                        var binaryData = []
                        binaryData.push(res.data)
                        const Newurl = window.URL.createObjectURL(new Blob(binaryData, {type: "image/jpeg"}))
                        console.log(Newurl)
                        urllist.push(Newurl)
                        //setImage(Newurl)
                        
            
                    })   
                    }
                        
            }
            
        } 
        console.log(urllist)
        setImage(urllist)
        return urllist;
    }
    
    const isImageFile = (fileName) => {
        const fileExt = fileName.split('.').pop();
        const imageExt = ["png", "jpg", "jpeg"];
        if(imageExt.includes(fileExt)){
            return true;
        }
        return false

    }
const ViewImage = () => {
    setimageClick(true)
    setImageSrc(imageBlob)
    console.log(imageBlob)
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
                            <span style={{ fontWeight: 'bold', color:"#000"}}>Upload Date & Time: </span>
                                {testOrder && testOrder.data && testOrder.data.result_date ? testOrder.data.result_date : ""} {" "}
                                {testOrder && testOrder.data && testOrder.data.result_time ? testOrder.data.result_time : ""}
                            
                        </Col>
                        <Col md={12}>
                            <h4 className={"pt-3"}>Radiology Notes:</h4>
                            <div className={"p-2"} style={{borderStyle: 'ridge', color: "#000"}}>
                            <span style={{ fontWeight: 'bold', fontColor:"#000", color:"#000"}}> {ReactHtmlParser(testOrder.data.note)}</span>
                            </div>
                            
                        </Col>

                        <Col md={12}>
                            <h3 className={"pt-3"}>Uploaded Files <small><span onClick={() =>ViewImage()} style={{ cursor: "pointer"}}>(Click to view)</span> </small></h3>

                        </Col>
                    </Row>

                            {/*<Carousel>*/}
                            {/*<Row >*/}
                             {imageClick=== "false" ? setImageSrc([]) :
                             <>
                             {imagesrc && imagesrc!=null ?

                                <Row>
                                {imagesrc && imagesrc !=null && imagesrc.map((file, index) => (
                                    <Col md={4} key={index}>
                                        <ModalImage small={file}
                                            large={file}
                                            className={"file-height"}
                                            alt={file}
                                        />
                                        <br/>
                                    
                                    </Col>
                                ))
                                }
                                
                                </Row>
    
    
                                : <span>No file has been uploaded.</span>
    
    
                                }
                             </>
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