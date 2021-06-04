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
const TestUpload = (props) => {
    const NewFormData = props.formDataObj;
    const [saving, setSaving] = React.useState(false);
    const defaultValues = {data:{files:[]}};
    const [testOrder, setTestOrder] = React.useState(defaultValues);
    const [note, setNote] = React.useState("");
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [uploadMessage, setUploadMessage] = useState("");
    const [files, setFiles] = useState([]);
    const classes = useStyles()

    const [fileToUpload, setFileToUpload] = useState({})

    useEffect(() => {
        if(NewFormData) {
            setTestOrder(NewFormData);
            setNote(NewFormData.data.note);
        }
    }, [NewFormData]); //componentDidMount


    const uploadResult = async e => {


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

        NewFormData.data['file'] = files
        const formData = new FormData();
        formData.append('file', files); 
        formData.append('formData', NewFormData); 

        console.log(formData)
        console.log(NewFormData)

        try {
            const res = await axios.post(`${url}radiologies?formId=${testOrder.id},patientId=${NewFormData.data.patient_id}`, formData, {
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

            //const { fileName, filePath } = res.data;
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

    const handleUploadFile = async e => {  
        if(fileToUpload[0]){
              
          const form_Data = new FormData();
          form_Data.append('file', fileToUpload[0]);    
            
          try {
            const res = await axios.post(url+'modules/upload', form_Data, {
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
             
          } catch (err) {
              console.log(err)
              if (err.response && err.response.status === 500) {
               
              } else if(err.response && err.response.status === 400){
               
              }else{

              }
              
            }
          }else{
            
          }
      }
    

    return (

    <>

            
                <Form  enctype="multipart/form-data">

                        <DropzoneArea
                            //onChange={(files) => console.log('Files:', files)}
                            onChange = {(file) => setFileToUpload(file)}
                            showFileNames="true"
                            //acceptedFiles={['jar']}
                            maxFileSize ={'100000000'}
  
                          />
                      <Row>
                      <Col sm={12}>
                          <Progress percentage={uploadPercentage} />
                          <br/>
                         
                      </Col>
                    </Row>
                        <Button
                            
                            variant='contained'
                            color='primary'
                            className={classes.button}
                            startIcon={<SaveIcon/>}
                            onClick={handleUploadFile}
                           
                        >
                            Save 
                        </Button>
                        <Button
                            variant='contained'
                            color='default'
                           
                            startIcon={<CancelIcon/>}
                        >
                            Cancel
                        </Button>
                   
                </Form>
      

    </>

    );
}



export default TestUpload;