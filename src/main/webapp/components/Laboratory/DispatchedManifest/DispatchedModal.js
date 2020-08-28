import React, {useState} from 'react';
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
import { dispatchedManifestSamples } from '../../../actions/laboratory';
import { Spinner } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';

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
    const  totalSampleShipment = Object.keys(manifestSamples).length;
    console.log(Object.values(manifestSamples));
    const labId = manifestSamples.id
    const [loading, setLoading] = useState(false);
    const [manifestId, setManifestId] = useState(uuidv4());
    const [otherfields, setOtherFields] = useState({date_sample_dispatched:"",packaged_by:"",courier_phone_number:"",time_sample_dispatched:"",packaged_by_phone_number:"", courier_name:"", receiving_lab_name:"", manifest_status:""});
    const [manifestObj, setManifestObj] = useState(manifestSample)
    const [errors, setErrors] = useState({});

    const handleOtherFieldInputChange = e => {
        setOtherFields ({ ...otherfields, [e.target.name]: e.target.value });
        console.log(otherfields)
    }
    const validate = () => {

        let temp = { ...errors }
        temp.date_sample_dispatched = otherfields.date_sample_dispatched ? "" : "Date is required"
        temp.time_sample_dispatched = otherfields.time_sample_dispatched ? "" : "Time  is required."
        temp.courier_name = otherfields.courier_name ? "" : "This field is required."
        temp.packaged_by = otherfields.packaged_by ? "" : "This field is required."
        temp.receiving_lab_name = otherfields.receiving_lab_name ? "" : "This is required." 
        temp.courier_phone_number = otherfields.courier_phone_number ? "" : "This is required." 
        setErrors({
            ...temp
            })
    
        return Object.values(temp).every(x => x == "")
  }

  const saveSample = e => {
      e.preventDefault()
          
                    
            const modifyManifestSample= manifestSample.map(item => {                       
                item.formDataObj.data['date_sample_dispatched']=otherfields['date_sample_dispatched'];
                item.formDataObj.data['time_sample_dispatched'] = otherfields['time_sample_dispatched'];
                item.formDataObj.data['receiving_lab_name'] =otherfields['receiving_lab_name'];
                item.formDataObj.data['courier_name'] =otherfields['courier_name'];
                item.formDataObj.data['sample_dispatched_by'] =otherfields['packaged_by'];
                item.formDataObj.data['courier_phone_number'] =otherfields['courier_phone_number'];
                item.formDataObj.data['manifest_status'] = 1;
                
                return item;
            })
            console.log(manifestObj);  
            console.log(modifyManifestSample);
                if(validate()){
                    //setLoading(true);
                    modifyManifestSample.forEach(function(value, index, array) {
                        console.log(value.formDataObj,value.formDataObj.id);
                        props.dispatchedManifestSamples(value.formDataObj, value.formDataObj.id)
                            if(array.length == Object.keys(manifestSamples).length){
                                props.togglestatus();
                            }
                    });
                
                    //props.createCollectedSample(manifestSamples, labId,'','')
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
                                                
                                            </p>

                                        </Alert>
                                    </Col>
                                    
                                    <Col md={6}>
                                        {/* <p>Sample Type {manifestSamples.data.description}  </p> */}
                                          <FormGroup>
                                              <Label >Date Dispatched</Label>
                                          
                                                  <DateTimePicker
                                                      time={false}
                                                      name="date_sample_dispatched"
                                                      id="date_sample_dispatched"
                                                      onChange={date_transfered =>
                                                        setOtherFields({ ...otherfields, date_sample_dispatched: moment(date_transfered).format("DD-MM-YYYY") })
                                                      }
                                                      required
                                                  /> 
                                                      {errors.date_sample_dispatched !="" ? (
                                                          <span className={classes.error}>{errors.date_sample_dispatched}</span>
                                                      ) : "" }
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup> 
                                              <Label for=''>Time Dispatched</Label>
                                                  <DateTimePicker
                                                      date={false}
                                                      name="time_sample_dispatched"
                                                      id="time_sample_dispatched"
                                                      onChange={value1 =>
                                                        setOtherFields({ ...otherfields, time_sample_dispatched: moment(value1).format("LT") })
                                                      }
                                                  />
                                                      {errors.time_sample_dispatched !="" ? (
                                                        <span className={classes.error}>{errors.time_sample_dispatched}</span>
                                                      ) : "" }      
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="exampleSelect">Courier Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="courier_name"
                                                        id="courier_name"
                                                        
                                                        value={otherfields.courier_name}
                                                        onChange={handleOtherFieldInputChange}
                                                        {...(errors.courier_name && { invalid: true})}
                                                        
                                                    />
                                                      <FormFeedback>{errors.courier_name}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="exampleSelect">Courier Phone Number</Label>
                                                    <Input
                                                        type="text"
                                                        name="courier_phone_number"
                                                        id="courier_phone_number"
                                                        
                                                        value={otherfields.courier_phone_number}
                                                        onChange={handleOtherFieldInputChange}
                                                        {...(errors.courier_phone_number && { invalid: true})}
                                                        
                                                    />
                                                      <FormFeedback>{errors.courier_phone_number}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="occupation">Packaged by </Label>

                                                <Input
                                                    type="select"
                                                    name="packaged_by"
                                                    id="packaged_by"
                                                    vaule={otherfields.packaged_by}
                                                    onChange={handleOtherFieldInputChange}
                                                    {...(errors.packaged_by && { invalid: true})} 
                                                >
                                                      <option value=""></option>
                                                      <option value="Dorcas"> Dorcas </option>
                                                      <option value="Jeph"> Jeph </option>
                                                      <option value="Debora"> Debora </option>
                                                </Input>
                                                    <FormFeedback>{errors.sample_transfered_by}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                      
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="occupation">Receiving Lab Name </Label>

                                                <Input
                                                    type="select"
                                                    name="receiving_lab_name"
                                                    id="receivingLabId"
                                                    vaule={otherfields.receiving_lab_name}
                                                    onChange={handleOtherFieldInputChange}
                                                    {...(errors.receiving_lab_name && { invalid: true})} 
                                                >
                                                      <option value=""></option>
                                                      <option value="Lab1"> FHI360 Lab </option>
                                                      <option value="Lab2"> Abuja Teaching Hospital Lab </option>
                                                      <option value="otherlabs"> Others </option>
                                                </Input>
                                                    <FormFeedback>{errors.receiving_lab_name}</FormFeedback>
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

export default connect(null, { dispatchedManifestSamples })(ModalViewResult);
