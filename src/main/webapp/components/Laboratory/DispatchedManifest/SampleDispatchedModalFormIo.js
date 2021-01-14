import React, { useState, useEffect } from "react";
import {Modal,ModalHeader, ModalBody,Form,FormFeedback,Row,Alert,Col,Input,FormGroup,Label,Card,CardBody,} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import { dispatchedManifestSamples, updateFormDataObj } from '../../../actions/laboratory';
import * as CODES from "./../../../api/codes";
import FormRenderer from "components/FormManager/FormRenderer";
import axios from "axios";
import {url} from '../../../api';

Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    cardBottom: {
        marginBottom: 20,
    },
    Select: {
        height: 45,
        width: 350,
    },
    button: {
        margin: theme.spacing(1),
    },
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: "none",
    },
    error: {
        color: "#f85032",
        fontSize: "12.8px",
    },
}));

const ModalSample = (props) => {
    const classes = useStyles()
    const manifestSamples = props.manifestSamples && props.manifestSamples !==null ? props.manifestSamples : {};
    const manifestSample= Object.values(manifestSamples);
    const manifestSampleForUpDateFormDataObj= Object.values(manifestSamples);
    const  totalSampleShipment = Object.keys(manifestSamples).length;
    const [manifestId, setManifestId] = useState();
    const [sampleManifest, setSampleManifest] = useState({sampleManifests: []})
    useEffect(() => {
      async function getCharacters() {
          try {
              const response = await axios(
                  url + "sample-manifests/generate-manifest-id/{length}?length=5"
              );
              const body = response.data;
              setManifestId(body);
          } catch (error) {
              setManifestId(null);
          }
      }
      getCharacters();
  }, []);

    const currentForm = {
          code: CODES.LAB_SAMPLE_DISPATCHED_CODE_FORM,
          programCode: CODES.GENERAL_SERVICE,
          formName: "Laboratory Sample Dispatched",
          options:{
              hideHeader: true
          },
      };
  
    const saveSample = (e) => {
        const newData = e.data 
        const modifyFormDataObjLabTest= manifestSampleForUpDateFormDataObj.map(formobj => {                                 
            formobj.formDataObj.data['manifest_status']=1;
            //props.updateFormDataObj(formobj.formDataObj, formobj.formDataObj.id)
            return formobj;
          })
            if(newData.dateSampleDispatched){
                newData['dateSampleDispatched'] = moment(newData.dateSampleDispatched).format(
                "DD-MM-YYYY"
              );
            }
            if(newData.timeSampleDispatched){
                newData['timeSampleDispatched'] = moment(newData.timeSampleDispatched, "hh:mm").format('LT')
            }

            // Modifying manifest samples by forming the object
            const modifyManifestSample= manifestSample.map(item => { 
                                    
              item['labNumber'] = manifestId;
             
              item['clientId'] = item.formDataObj.data['patient_id']
              item['timeSampleTransferred'] = item.formDataObj.data['time_sample_transfered']
              item['dateSampleTransferred'] = item.formDataObj.data['date_sample_transfered']
              item['labOrderPriority'] = item.formDataObj.data.order_priority['display'] 
              item['sampleTransferredBy'] = item.formDataObj.data['sample_transfered_by']
              item['sampleOrderedBy'] = item.formDataObj.data['sample_ordered_by']
              if(item.formDataObj.data.viral_load_indication){
                item['viralLoadIndication'] = item.formDataObj.data.viral_load_indication['display']

              }else{
                item['viralLoadIndication'] = null
              }
              item['dateSampleDispatched'] = newData.timeSampleDispatched
              if(item.formDataObj.data['time_sample_ordered']){
                  item['timeSampleOrdered'] =  item.formDataObj.data['time_sample_ordered'] 
                  
              } 
              if(item.formDataObj.data['time_sample_collected'] ==='undefined' ){
                item['timeSampleCollected'] = null 
              }else{
                item['timeSampleCollected'] = item.formDataObj.data['time_sample_collected']
              }               
              item['timeSampleDispatched'] =newData.timeSampleDispatched ;
              item['courierName'] = newData['courierName'];
              item['courierPhoneNumber'] = newData['courierPhoneNumber'];
              item['sampleDispatchedBy'] = newData['sampleDispatchedBy'];
              item['sampleDispatchedByPhoneNumber'] = newData['sampleDispatchedByPhoneNumber'];
              item['manifestId'] = manifestId;
              item['receivingLabId'] = newData.receivingLabName['id'];
              item['receivingLabName'] = newData.receivingLabName['name'];
              item['totalSampleShipment'] = totalSampleShipment;
              item['sendingFacilityId'] = 'lamis567';
              item['sendingFacilityName'] = 'Lamisplus'
              item['dispatched'] = true
              item['id'] = 0;
              item['visitDate'] = item.formDataObj.data['date_sample_ordered'];
              item['dateResultReported'] = null
              item['dateAssayed'] = null
              item['dateResultDispatched'] = null
              item['sampleStatus'] = null
              item['sampleTestable'] = null
              item['testResult'] = null
              item['dateSampleReceivedLab'] = null
              item['pcrLabSampleNumber'] = null
              delete item['formDataObj'];
              delete item['tableData'];
              Object.assign(item, newData)
              
              return item;
          })          
            //Process the Samples to be dispatched 
            sampleManifest['sampleManifests'] = modifyManifestSample;
            console.log(sampleManifest)
            props.dispatchedManifestSamples(sampleManifest)                        
            //Closing of the modal 
            props.togglestatus();
          
    };


    return (
        <div >
            <Card >
                <CardBody>
                    <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                        <Form onSubmit={saveSample}>
                            <ModalHeader toggle={props.togglestatus}>Dispatch Samples</ModalHeader>
                            <ModalBody>
                            <Card >
                                <CardBody>
                                  <Col md={12} >
                                          <Alert color="dark" style={{backgroundColor:'#9F9FA5', color:"#000" , fontWeight: 'bolder', fontSize:'14px'}}>
                                              <p style={{marginTop: '.7rem' }}>
                                                  Total Sample Shipment : &nbsp;&nbsp;&nbsp;<span style={{ fontWeight: 'bolder'}}>{Object.keys(manifestSamples).length }</span>
                                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                  Manifest ID : &nbsp;&nbsp;&nbsp;<span style={{ fontWeight: 'bolder'}}>{manifestId}</span>
                                              </p>

                                          </Alert>
                                      </Col>
                                    <FormRenderer
                                        formCode={currentForm.code}
                                        programCode={currentForm.programCode}
                                        onSubmit={saveSample}
                                    />
                                </CardBody>
                            </Card>
                                
                            </ModalBody>
                        </Form>
                    </Modal>
                </CardBody>
            </Card>
        </div>
    );
};

export default connect(null, { dispatchedManifestSamples, updateFormDataObj })(
    ModalSample
);
