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
    const newFormData = props.FormData;
    const [saving, setSaving] = React.useState(false);
    const defaultValues = {data:{files:[]}};
    const [testOrder, setTestOrder] = React.useState(defaultValues);
    const [note, setNote] = React.useState("");
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [uploadMessage, setUploadMessage] = useState("");
    const [files, setFiles] = useState([]);
    const classes = useStyles()

    useEffect(() => {
        if(newFormData) {
            setTestOrder(newFormData);
            setNote(newFormData.data.note);
        }
    }, []); //componentDidMount


    const uploadResult = async e => {
        e.preventDefault();

        if(files.length == 0){
            toast.error("You must upload at least one file");
            return;
        }
        testOrder.data["note"] = note;
        testOrder.data["test_order_status"] = 1
        setSaving(true);
        
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
       // props.updateRadiologyByFormId(testOrder, testOrder.id, onSuccess, onError)

        // sending radiology to backend
        setUploadMessage('Processing, please wait...')
        // const formData = new FormData();
        // formData.append('file', files);
        // formData.append('formData', testOrder);
        

        newFormData.data['file'] = files
        const form_Data = new FormData();
        form_Data.append('file', files); 
        form_Data.append('formData', newFormData); 
        console.log(form_Data)
        console.log(newFormData)
        try {
            const res = await axios.post(`${url}radiologies?formId=${testOrder.id},patientId=${newFormData.data.patient_id}`, newFormData, {
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
    }
    return (

    <>


        <Modal isOpen={props.showModal} toggle={props.toggleModal} size="xl">
            
                <Form onSubmit={uploadResult}>

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
                                            defaultValue={newFormData && newFormData.data && newFormData.data.result_date ? moment(newFormData.data.result_date + " " + newFormData.data.result_time, "DD-MM-YYYY LT").toDate() : null}
                                            //min={moment(testOrder.data.order_date + " " + testOrder.data.order_time, "DD-MM-YYYY LT").toDate()}
                                            max={new Date()}
                                            required
                                            onChange={(e) => {
                                                testOrder.data["result_date"] = e ? Moment(e).format("DD-MM-YYYY") : null
                                                testOrder.data["result_time"] = e ? Moment(e).format("LT") : null
                                                setTestOrder(testOrder)
                                            }
                                            }

                                        />
                                    </FormGroup>
                                </Col>

                            <Col md={12}>
                                <DropzoneArea
                                    acceptedFiles={[".jpg", ".png", ".jpeg", ".gif"]}
                                    onChange={(files) => {
                                        setFiles(files);
                                       // uploadFileToServer(files);

                                        console.log('Files:', files)}}

                                    // fileObjects={testOrder.data.files}
                                    // onAdd={newFileObjs => {
                                    //     console.log('onAdd', newFileObjs);
                                    //     testOrder.data["files"] = [].concat(testOrder.data.files, newFileObjs);
                                    //     setTestOrder(testOrder);
                                    // }}
                                    // onDelete={deleteFileObj => {
                                    //     //delete file object from the array
                                    //     const files = testOrder.data.files.filter(x => x.file.name !== deleteFileObj.file.name);
                                    //     console.log(files)
                                    //     testOrder.data["files"] = files;
                                    //     setTestOrder(testOrder);
                                    //     console.log('onDelete', deleteFileObj);
                                    // }}

                                />

<br/>
                            </Col>

                                    <Col md={"12"}>
                                        <Label for="comment">Notes</Label>
                                        <ReactQuill theme="snow" value={note} onChange={setNote}/>
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
                            type='submit'
                            variant='contained'
                            color='primary'
                            className={classes.button}
                            startIcon={<SaveIcon/>}
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