import React, {useState} from 'react';
import { Modal, ModalHeader, ModalBody,Form,FormFeedback,
Row,Col,FormGroup,Label,Input, Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import moment from "moment";
import {url} from '../../../api'
import { Alert } from 'reactstrap';
import { createCollectedSample, fetchFormById } from '../../../actions/laboratory';
import { Spinner } from 'reactstrap';

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
    },
    error:{
        color: '#f85032',
        fontSize: '12.8px'
    }
}))


const ModalSampleTransfer = (props) => {
    const classes = useStyles()
    const datasample = props.datasample ? props.datasample : {};
    //console.log(datasample)
    const lab_test_group = datasample.data ? datasample.data.lab_test_group : null ;
    const description = datasample.data ? datasample.data.description : null ;
    console.log(lab_test_group)
    const labId = datasample.id
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    const [otherfields, setOtherFields] = useState({date_sample_transfered:"",sample_transfered_by:"",sample_priority:"",time_sample_transfered:"",comment:"", lab_test_order_status:""});
    const [errors, setErrors] = useState({});

    const handleOtherFieldInputChange = e => {
        setOtherFields ({ ...otherfields, [e.target.name]: e.target.value });
        console.log(otherfields)
    }
    const validate = () => {
        let temp = { ...errors }
        temp.date_sample_transfered = otherfields.date_sample_transfered ? "" : "Date is required"
        temp.time_sample_transfered = otherfields.time_sample_transfered ? "" : "Time  is required."
        temp.lab_test_order_status = otherfields.lab_test_order_status ? "" : "This field is required."
        temp.sample_transfered_by = otherfields.sample_transfered_by ? "" : "This filed is required."
        temp.comment = otherfields.comment ? "" : "Comment is required." 
        setErrors({
            ...temp
        })
      
            return Object.values(temp).every(x => x == "")
    }

    const saveSample = e => {
        e.preventDefault()
            if(validate()){
                setLoading(true);
                    const newDateSampleTransfered = moment(otherfields.date_sample_transfered).format("DD-MM-YYYY");
                    const newTimeSampleTransfered = moment(otherfields.time_sample_transfered).format("LT");
                    datasample.data.lab_test_order_status = 2;
                const onSuccess = () => {
                    setLoading(false);
                    props.togglestatus()       
                }
                const onError = () => {
                    setLoading(false); 
                    props.togglestatus()       
                }
                    datasample['lab_number']= props.labnumber['lab_number']
                    datasample.data['date_sample_transfered'] = newDateSampleTransfered
                    datasample.data['time_sample_transfered'] = newTimeSampleTransfered
                    datasample.data['sample_transfered_by'] = otherfields['sample_transfered_by']
                    datasample.data.comment= otherfields['comment']
                        props.createCollectedSample(datasample, labId,onSuccess,onError)
            }
    }
  
  function checklanumber (lab_num){
      if(lab_num===""){       
          return (                 
              <Alert color="danger" isOpen={visible} toggle={onDismiss}>
                  Please make sure you enter a lab number
              </Alert>
          )
      }
  }

  return (
      <div >
          <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
        
          <Form onSubmit={saveSample}>
            <ModalHeader toggle={props.togglestatus}>Transfer Sample</ModalHeader>
                <ModalBody>
                    {checklanumber(props.labnumber['lab_number'])}
                        <Card >
                            <CardBody>
                                <Row >
                                    <Col md={12} >
                                        <Alert color="dark" style={{backgroundColor:'#9F9FA5', color:"#000" , fontWeight: 'bolder', fontSize:'14px'}}>
                                            <p style={{marginTop: '.7rem' }}>Lab Test Group : <span style={{ fontWeight: 'bolder'}}> {' '} {lab_test_group}</span> 
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Lab Test Ordered : 
                                                <span style={{ fontWeight: 'bolder'}}>{' '}  {description}</span>
                                                    &nbsp;&nbsp;&nbsp; Lab Number : &nbsp;&nbsp;
                                                <span style={{ fontWeight: 'bolder'}}>{props.labnumber['lab_number']===""?" ---":props.labnumber['lab_number']}</span>
                                                    Order by : &nbsp;&nbsp;
                                                <span style={{ fontWeight: 'bolder'}}>{ "Debora"}</span>
                                                    &nbsp;&nbsp;&nbsp; Priority : &nbsp;&nbsp;
                                                <span style={{ fontWeight: 'bolder'}}>{ "Normal"}</span>
                                            </p>        
                                        </Alert>
                                    </Col>
                                    <Col md={6}>
                                        {/* <p>Sample Type {datasample.data.description}  </p> */}
                                          <FormGroup>
                                              <Label for='maritalStatus'>Date Transfer</Label>
                                          
                                                  <DateTimePicker
                                                      time={false}
                                                      name="date_sample_transfered"
                                                      id="date_sample_transfered"
                                                      onChange={date_transfered =>
                                                        setOtherFields({ ...otherfields, date_sample_transfered: date_transfered })
                                                      }
                                                      required
                                                  /> 
                                                      {errors.date_sample_transfered !="" ? (
                                                          <span className={classes.error}>{errors.date_sample_transfered}</span>
                                                      ) : "" }
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup> 
                                              <Label for=''>Time Transfer</Label>
                                                  <DateTimePicker
                                                      date={false}
                                                      name="time_sample_transfered"
                                                      id="time_sample_transfered"
                                                      onChange={value1 =>
                                                        setOtherFields({ ...otherfields, time_sample_transfered: value1 })
                                                      }
                                                  />
                                                      {errors.time_sample_transfered !="" ? (
                                                        <span className={classes.error}>{errors.time_sample_transfered}</span>
                                                      ) : "" }      
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="exampleSelect">Lab Transfered To</Label>
                                                  <Input type="select" name="lab_test_order_status" id="lab_test_order_status" 
                                                  onChange={handleOtherFieldInputChange}
                                                    {...(errors.lab_test_order_status && { invalid: true})}
                                                  >
                                                      <option value=""></option>
                                                      <option value="2">PCI Lab 1</option>
                                                      <option value="2">PCI Lab 2</option>
                                                      <option value="2">LIMS Lab</option>
                                                      <option value="2">Others</option>
                                                  </Input>
                                                      <FormFeedback>{errors.lab_test_order_status}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                      <Col md={5}>
                                          <FormGroup>
                                              <Label for="occupation">Transfer by </Label>

                                                <Input
                                                    type="select"
                                                    name="sample_transfered_by"
                                                    id="sample_transfered_by"
                                                    vaule={otherfields.sample_transfered_by}
                                                    onChange={handleOtherFieldInputChange}
                                                    {...(errors.sample_transfered_by && { invalid: true})} 
                                                >
                                                      <option value=""></option>
                                                      <option value="Dorcas"> Dorcas </option>
                                                      <option value="Jeph"> Jeph </option>
                                                      <option value="Debora"> Debora </option>
                                                </Input>
                                                    <FormFeedback>{errors.sample_transfered_by}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                      <Col md={7}>
                                          <FormGroup>
                                              <Label for='maritalStatus'>Note</Label>
                                                  <Input
                                                      type='textarea'
                                                      name='comment'
                                                      id='comment'
                                                      onChange={handleOtherFieldInputChange}
                                                        value = {otherfields.comment}                                     
                                                            {...(errors.comment && { invalid: true})}                                   
                                                  >                         
                                                   </Input>
                                                      <FormFeedback>{errors.comment}</FormFeedback>          
                                          </FormGroup>          
                                      </Col>
                                      
                                  </Row>
                                      <br/>
                                      {loading ? <Spinner /> : ""}
                                      <br/>
                                      {props.labnumber['lab_number']!==""?
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
                                              :
                                          <MatButton
                                              type='submit'
                                              variant='contained'
                                              color='primary'
                                              className={classes.button}
                                              startIcon={<SaveIcon />}
                                              disabled='true'
                                          >   
                                              Save
                                          </MatButton>
                                          
                                      }
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

export default connect(null, { createCollectedSample, fetchFormById })(ModalSampleTransfer);
