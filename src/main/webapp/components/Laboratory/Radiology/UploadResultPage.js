import React, {useEffect, useState} from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { connect } from "react-redux";
import {fetchByHospitalNumber} from "actions/patients";
import {fetchRadiologyTestOrdersByEncounterID, updateRadiologyByFormId} from "actions/laboratory"

import Button from "@material-ui/core/Button";
import {toast, ToastContainer} from "react-toastify";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader, Spinner
    ,CardHeader,Col,Row,Alert,Table, Form,FormGroup,Label,Input} from 'reactstrap'
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";
import Moment from "moment";
import moment from "moment";
import momentLocalizer from "react-widgets-moment";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Progress from "../../Admin/BootstrapConfiguration/Progress";
import axios from "axios";
import {url} from "../../../api";
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
const UploadResultPage = (props) => {
    const NewFormData = props.formDataObj;
    const [saving, setSaving] = React.useState(false);
    const defaultValues = {data:{oldfiles:[]}};
    const [testOrder, setTestOrder] = React.useState(defaultValues);
    const [note, setNote] = React.useState("");
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [uploadMessage, setUploadMessage] = useState("");
    const [files, setFiles] = useState([]);
    const classes = useStyles()

    const [fileToUpload, setFileToUpload] = useState([])

    useEffect(() => {
        if(NewFormData) {
            setTestOrder(NewFormData);
            setNote(NewFormData.data.note);
            setUploadMessage("")
        }
    }, [NewFormData]); //componentDidMount


    const handleUploadFile = async e => { 
        if(fileToUpload.length == 0){
            toast.error("You must upload at least one file");
            return;
        }
        //testOrder.data["note"] = note;
        testOrder.data["test_order_status"] = 1
        setSaving(true);
         
        if(fileToUpload[0]){
        NewFormData.data["test_order_status"] = 1
        testOrder.data["test_order_status"] = 1
        //NewFormData.data["image_uuid"] = []
        const FormID = NewFormData.id
        const PatientIdID = NewFormData.data.patient_id
        //NewFormData.data['files'] = fileToUpload[0]
        const form_Data = new FormData();
       
        fileToUpload.forEach(function(value) {
            form_Data.append('file', value); 
        })
          
        form_Data.append('formData', JSON.stringify(NewFormData));
        const onSuccess = () => {
            setSaving(false);
            props.toggleModal();
            toast.success("Result uploaded successfully!");
            props.loadSearch();
        };
        const onError = () => {
            setSaving(false);
            toast.error("Something went wrong, please contact administration");
        };

          try {
            const res = await axios.post(`${url}radiologies/${FormID}/${PatientIdID}`,form_Data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              
            onUploadProgress: progressEvent => {
              setUploadPercentage(
                parseInt(
                  Math.round((progressEvent.loaded * 100) / progressEvent.total)
                )
              );
                  // Clear percentage
                  setTimeout(() => setUploadPercentage(0), 10000);
                }
              });
              
              const { fileName, filePath } = res.data;
              onSuccess();
              setUploadMessage('File Uploaded');
          } catch (err) {
            console.log(err)
            onError();
            if (err.response && err.response.status === 500) {
                setUploadMessage('There was a problem in uploading file! please try again...');
            } else{
                setUploadMessage('Something went wrong! please try again...');
            }
              
            }
          }else{
            
          }
      }



    return (

    <>
        <Modal isOpen={props.showModal} toggle={props.toggleModal} size="xl">
            
                <Form  enctype="multipart/form-data">

                    <ModalHeader toggle={props.toggleModal}> Upload Result </ModalHeader>
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
                                            Date Ordered
                                            : <b>{testOrder && testOrder.data && testOrder.data.order_date ? testOrder.data.order_date : ""} {" "} {testOrder && testOrder.data && testOrder.data.order_time ? testOrder.data.order_time : ""}</b>
                                        </Col>
                                        <Col md={6}>
                                            Ordered By
                                            : <b>{testOrder && testOrder.data && testOrder.data.ordered_by ? testOrder.data.ordered_by : ""}</b>
                                        </Col>
                                    </Row>

                                </Alert>
                            </Col>
                        </Row>
                        <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label for="encounterDate">Upload Date & Time*</Label>
                                        <DateTimePicker
                                            name="encounterDate"
                                            id="encounterDate"
                                            defaultValue={NewFormData && NewFormData.data && NewFormData.data.result_date ? moment(NewFormData.data.result_date + " " + NewFormData.data.result_time, "DD-MM-YYYY LT").toDate() : null}
                                            //min={moment(testOrder.data.order_date + " " + testOrder.data.order_time, "DD-MM-YYYY LT").toDate()}
                                            max={new Date()}
                                            required
                                            onChange={(e) => {
                                                testOrder.data["result_date"] = e ? Moment(e).format("YYYY-MM-DD") : null
                                                testOrder.data["result_time"] = e ? Moment(e).format("LT") : null
                                                setTestOrder(testOrder)
                                            }
                                            }

                                        />
                                    </FormGroup>
                                </Col>

                            <Col md={12}>
                                

                        
                            <br/>
                            <DropzoneArea
                                acceptedFiles={[".jpg", ".png", ".jpeg", ".gif"]}
                                //onChange={(files) => console.log('Files:', files)}
                                onChange = {(file) => setFileToUpload(file)}
                                showFileNames="true"
                                //acceptedFiles={['jar']}
                                maxFileSize ={'100000000'}
  
                          />

                            </Col>

                                    <Col md={"12"}>
                                        <Label for="comment">Notes</Label>
                                        <ReactQuill theme="snow" value={note} onChange={(note) => NewFormData.data["note"]=note}/>
                                    </Col>
                            <Col sm={12}>
                                <br/>
                                <Progress percentage={uploadPercentage} />
                                <br/>
                                <strong>{uploadMessage}</strong>
                            </Col>
                        </Row>

                    </ModalBody>
                    <ModalFooter>
                        <Button
                            
                            variant='contained'
                            color='primary'
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                            onClick={handleUploadFile}
                            disabled={saving}
                        >
                            Save {saving ? <Spinner/> : ""}
                        </Button>
                        <Button
                            variant='contained'
                            color='default'
                            onClick={props.toggleModal}
                            startIcon={<CancelIcon/>}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
        </Modal>

    </>

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

export default connect(mapStateToProps, mapActionToProps)(UploadResultPage);