import React, {useState, useEffect} from 'react';
import { Modal, ModalHeader, ModalBody,Form,FormFeedback,
Row,Col,FormGroup,Label,Input, Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { DateTimePicker } from 'react-widgets';
import "react-widgets/dist/css/react-widgets.css";
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import moment from "moment";
import {url} from '../../../api'
import { Alert } from 'reactstrap';
import { dispatchedManifestSamples, updateFormDataObj } from '../../../actions/laboratory';
import { Spinner } from 'reactstrap';
import axios from "axios";

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
    const classes = useStyles()
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
    ///const [formdataObjUpdate, setformdataObjUpdate] = useState(manifestSampleForUpDateFormDataObj);
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
    const validate = () => {
        let temp = { ...errors }
        temp.dateSampleDispatched = otherfields.dateSampleDispatched ? "" : "Date is required"
        temp.timeSampleDispatched = otherfields.timeSampleDispatched ? "" : "Time  is required."
        temp.courierName = otherfields.courierName ? "" : "This field is required."
        temp.sampleDispatchedBy = otherfields.sampleDispatchedBy ? "" : "This field is required."
        temp.receivingLabName = otherfields.receivingLabName ? "" : "This is required." 
        temp.courierPhoneNumber = otherfields.courierPhoneNumber ? "" : "This is required." 
        setErrors({
            ...temp
            })    
        return Object.values(temp).every(x => x == "")
  }

  //const samplesdispatched ={"sampleManifests": [] };
    const saveSample = e => {
      e.preventDefault()

            const modifyFormDataObj= manifestSampleForUpDateFormDataObj.map(formobj => {                       
                
                formobj.formDataObj.data['manifest_status']=1;
                return formobj;
            })
            // Modifying manifest samples by forming the object
            const modifyManifestSample= manifestSample.map(item => {                       

                item['labNumber'] = '67484';
            
                item['clientId'] = item.formDataObj.data['patient_id']
                item['timeSampleTransferred'] = "10:10"//item.formDataObj.data['time_sample_transfered']
                item['dateSampleTransferred'] = item.formDataObj.data['date_sample_transfered']
                item['labOrderPriority'] = item.formDataObj.data.order_priority['display']
                item['sampleTransferredBy'] = item.formDataObj.data['sample_transfered_by']
                item['sampleOrderedBy'] = item.formDataObj.data['sample_ordered_by']
                item['viralLoadIndication'] = item.formDataObj.data.viral_load_indication['display']
                item['dateSampleDispatched'] = otherfields['dateSampleDispatched'];
                item['timeSampleOrdered'] = "10:10"; //item.formDataObj.data['time_sample_collected]
                item['timeSampleCollected'] = "10:10"//item.formDataobj.data['time_sample_collected]                
                item['timeSampleDispatched'] = "10:10"//otherfields['timeSampleDispatched'];
                item['courierName'] = otherfields['courierName'];
                item['courierPhoneNumber'] = otherfields['courierPhoneNumber'];
                item['sampleDispatchedBy'] = otherfields['sampleDispatchedBy'];
                //item['sampleDispatchedByPhoneNumber'] = otherfields['sampleDispatchedByPhoneNumber'];
                item['manifestId'] = manifestId;
                item['receivingLabId'] = 'c5ty'
                item['receivingLabName'] = otherfields['receivingLabName'];
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
                //delete item['formDataObj'];
                delete item['tableData'];
                
                return item;
            })
            //Manipulating the formDataObj to update the lab_test_status            
                if(validate()){
                    //Updating the FormDataObj informations
                    modifyFormDataObj.forEach(function(value, index, array) {
                        props.updateFormDataObj(value.formDataObj, value.formDataObj.id)
                    });
                    
                    const modifyFormObj= manifestSample.map(item => { 
                        delete item['formDataObj'];
                        return item;
                    })

                    //Process the Samples to be dispatched 
                    sampleManifest['sampleManifests'] = modifyManifestSample;
                    
                    props.dispatchedManifestSamples(sampleManifest)
                                       
                    //Closing of the modal 
                    props.togglestatus();
                    

          }
  }


      
  return (      
      <div >
         
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
              <Form onSubmit={saveSample}>
            <ModalHeader toggle={props.togglestatus}>Dispatch Samples</ModalHeader>
                <ModalBody>
                    
                        <Card >
                            <CardBody>
                                <Row >
                                    <Col md={12} >
                                        <Alert color="dark" style={{backgroundColor:'#9F9FA5', color:"#000" , fontWeight: 'bolder', fontSize:'14px'}}>
                                            <p style={{marginTop: '.7rem' }}>
                                                Total Sample Shipment : &nbsp;&nbsp;&nbsp;<span style={{ fontWeight: 'bolder'}}>{Object.keys(manifestSamples).length }</span>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                Manifest ID : &nbsp;&nbsp;&nbsp;<span style={{ fontWeight: 'bolder'}}>{manifestId}</span>
                                            </p>

                                        </Alert>
                                    </Col>
                                    
                                    <Col md={6}>
                                        {/* <p>Sample Type {manifestSamples.data.description}  </p> */}
                                          <FormGroup>
                                              <Label >Date Dispatched</Label>
                                          
                                                  <DateTimePicker
                                                      time={false}
                                                      name="dateSampleDispatched"
                                                      id="dateSampleDispatched"
                                                      onChange={date_transfered =>
                                                        setOtherFields({ ...otherfields, dateSampleDispatched: moment(date_transfered).format("DD-MM-YYYY") })
                                                      }
                                                      required/>
                                                      {errors.dateSampleDispatched !="" ? (
                                                          <span className={classes.error}>{errors.dateSampleDispatched}</span>
                                                      ) : "" }
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup> 
                                              <Label for=''>Time Dispatched</Label>
                                                  <DateTimePicker
                                                      date={false}
                                                      name="timeSampleDispatched"
                                                      id="timeSampleDispatched"
                                                      onChange={value1 =>
                                                        setOtherFields({ ...otherfields, timeSampleDispatched: moment(value1).format("LT") })
                                                      }/>
                                                      {errors.timeSampleDispatched !="" ? (
                                                        <span className={classes.error}>{errors.timeSampleDispatched}</span>
                                                      ) : "" }      
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="">Dispatch Rider/Courier Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="courierName"
                                                        id="courierName"
                                                        
                                                        value={otherfields.courierName}
                                                        onChange={handleOtherFieldInputChange}
                                                        {...(errors.courierName && { invalid: true})}
                                                        
                                                    />
                                                      <FormFeedback>{errors.courierName}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="exampleSelect">Dispatch Rider/Courier Phone Number</Label>
                                                    <Input
                                                        type="number"
                                                        name="courierPhoneNumber"
                                                        id="courierPhoneNumber"
                                                        
                                                        value={otherfields.courierPhoneNumber}
                                                        onChange={handleOtherFieldInputChange}
                                                        {...(errors.courierPhoneNumber && { invalid: true})}
                                                        
                                                    />
                                                      <FormFeedback>{errors.courierPhoneNumber}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="occupation">Sample Dispatched By </Label>

                                                <Input
                                                    type="select"
                                                    name="sampleDispatchedBy"
                                                    id="sampleDispatchedBy"
                                                    vaule={otherfields.sampleDispatchedBy}
                                                    onChange={handleOtherFieldInputChange}
                                                    {...(errors.sampleDispatchedBy && { invalid: true})} 
                                                >
                                                      <option value=""></option>
                                                      <option value="Dorcas"> Dorcas </option>
                                                      <option value="Jeph"> Jeph </option>
                                                      <option value="Debora"> Debora </option>
                                                </Input>
                                                    <FormFeedback>{errors.sampleDispatchedBy}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="">Sender Phone Number</Label>
                                                    <Input
                                                        type="text"
                                                        name="sampleDispatchedByPhoneNumber"
                                                        id="sampleDispatchedByPhoneNumber"
                                                        
                                                        value={otherfields.sampleDispatchedByPhoneNumber}
                                                        onChange={handleOtherFieldInputChange}
                                                        {...(errors.sampleDispatchedByPhoneNumber && { invalid: true})}
                                                        
                                                    />
                                                      <FormFeedback>{errors.sampleDispatchedByPhoneNumber}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="occupation">Receiving Lab Name </Label>
                                              <Input type="select" name="receivingLabName" id="receivingLabName" 
                                                    vaule={otherfields.receivingLabName}
                                                    onChange={handleOtherFieldInputChange}
                                                    {...(errors.receivingLabName && { invalid: true})}
                                                  >
                                                        <option> </option>
                                                        {pcrOptions.map(({ title, value }) => (
                                                            
                                                            <option key={title} value={title}>
                                                                {title}
                                                            </option>
                                                        ))}
                                                  </Input>
                                                      <FormFeedback>{errors.receivingLabName}</FormFeedback>
                                          </FormGroup>                                        
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
                                              disabled={loading}
                                          >   
                                              Save
                                          </MatButton>
                                           
                                          <MatButton
                                              variant='contained'
                                              color='default'
                                              onClick={props.togglestatus}
                                              className={classes.button}
                                              startIcon={<CancelIcon />}
                                          >
                                              Cancel
                                          </MatButton>
                            </CardBody>
                        </Card> 
                    </ModalBody>
        
                </Form>
      </Modal>
    </div>
  );
}

export default connect(null, { dispatchedManifestSamples, updateFormDataObj })(ModalViewResult);
