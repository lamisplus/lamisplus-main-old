import React, {useState} from 'react';
import { Modal, ModalHeader, ModalBody,Form,FormFeedback,Row,Col,
FormGroup,Label,Input,Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';

import "react-widgets/dist/css/react-widgets.css";
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import moment from "moment";
import {url} from '../../../api'
import { useSelector, useDispatch } from 'react-redux';
import { createCollectedSample, fetchFormById } from '../../../actions/laboratory'
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { Alert } from 'reactstrap';
import { Spinner } from 'reactstrap';

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



const ModalSampleResult = (props) => {
    const classes = useStyles()
    const datasample = props.datasample ? props.datasample : {};
    const lab_test_group = datasample.data ? datasample.data.lab_test_group : null ;
    const description = datasample.data ? datasample.data.description : null ;
    const unit_measurement = datasample.data ? datasample.data.unit_measurement : null ;
    const labId = datasample.id
    const [loading, setLoading] = useState(false)
    const [samples, setSamples] = useState({}) 
    const [otherfields, setOtherFields] = 
            useState({
            sample_priority:"",
            time_result_enetered:"",
            date_result_reported:"",
            result_reported_by:"",
            test_result:"",
            date_asseyed:""
          }); 
    const [errors, setErrors] = useState({});

  const handleOtherFieldInputChange = e => {
      setOtherFields ({ ...otherfields, [e.target.name]: e.target.value });
      //console.log(otherfields)
  }

  const validate = () => {
      let temp = { ...errors }
      temp.time_result_enetered = otherfields.time_result_enetered ? "" : "Date is required"
      temp.date_result_reported = otherfields.date_result_reported ? "" : "Time  is required."
      temp.result_reported_by = otherfields.result_reported_by ? "" : "This filed is required." 
      temp.date_asseyed = otherfields.date_asseyed ? "" : "This filed is required." 
      temp.test_result = otherfields.test_result ? "" : "This filed is required." 
      setErrors({
          ...temp
      })
        return Object.values(temp).every(x => x == "")
  }
    const saveSample = e => {
        e.preventDefault()
        if(validate()){
              setLoading(true);
              const newDateReported = moment(otherfields.date_result_reported).format("DD-MM-YYYY");
              const newTimeSampleEntered = moment(otherfields.time_result_enetered).format("LT");
              datasample.data.date_result_reported = newDateReported
              datasample.data['time_sample_transfered'] = newTimeSampleEntered
              datasample.data.lab_test_order_status = 5;
              datasample.data.test_result = otherfields.test_result
              datasample.data['result_reported_by'] = otherfields['result_reported_by']
              datasample.data['date_asseyed'] = otherfields['date_asseyed']
              datasample.data['comment_sample_reported'] = samples.comment
            
        const onSuccess = () => {
            setLoading(false);
            props.togglestatus()       
        }
        const onError = () => {
            setLoading(false); 
            props.togglestatus()       
        }
            props.createCollectedSample(datasample, labId,onSuccess,onError)

      }
    }
    //console.log(formdata)
    const textstyle = {
        fontSize: '14px',
        fontWeight: 'bolder'
      };
      
  return (
      
      <div >
          <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
              <Form onSubmit={saveSample}>
                  <ModalHeader toggle={props.togglestatus}>Result Reporting</ModalHeader>
                      <ModalBody>
                          <Card>
                              <CardBody>
                                  <Row style={{ marginTop: '20px'}}>
                                      <Col md="12" >
                                          <Alert color="dark" style={{backgroundColor:'#9F9FA5', color:"#000" , fontWeight: 'bolder'}}>
                                              <p style={{marginTop: '.7rem' }}>Lab Test Group : <span style={{ fontWeight: 'bolder'}}> {' '} {lab_test_group}</span> 
                                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Lab Test Ordered : 
                                                  <span style={{ fontWeight: 'bolder'}}>{' '}  {description}</span>
                                              </p>
                                          </Alert>
                                      </Col>
                                      <Col xs="6">
                                          Date Assayed
                                            <br/>
                                            <DateTimePicker time={false} name="date_asseyed"  id="date_asseyed"  
                                              onChange={value1 =>
                                                setOtherFields({ ...otherfields, date_asseyed: value1 })
                                              }
                                            /> 
                                      </Col>
                                      <Col xs="6">
                                          Date Reported
                                              <br/>
                                              <DateTimePicker time={false} name="date_result_reported"  id="date_result_reported"  
                                                onChange={value1 =>
                                                  setOtherFields({ ...otherfields, date_result_reported: value1 })
                                                }
                                              />            
                                      </Col>
                                      <Col md="6">
                                          <Label for=''>Time Reported</Label>
                                              <DateTimePicker
                                                  date={false}
                                                  name="time_result_reported"
                                                  id="time_result_enetered"
                                                  onChange={value1 =>
                                                    setOtherFields({ ...otherfields, time_result_enetered: value1 })
                                                  }
                                              />
                                                  {errors.time_result_enetered !="" ? (
                                                    <span className={classes.error}>{errors.time_result_enetered}</span>
                                                  ) : "" }
                                      </Col> 
                                      <Col md="6">
                                        <FormGroup>
                                            <Label>Result Reported by </Label>
                                                <Input
                                                  type="select"
                                                  name="result_reported_by"
                                                  id="result_reported_by"
                                                  vaule={otherfields.result_reported_by}
                                                  onChange={handleOtherFieldInputChange}
                                                  {...(errors.result_reported_by && { invalid: true})} 
                                                >
                                                    <option value=""></option>
                                                    <option value="Dorcas"> Dorcas </option>
                                                    <option value="Jeph"> Jeph </option>
                                                    <option value="Debora"> Debora </option>
                                                </Input>
                                                    <FormFeedback>{errors.result_reported_by}</FormFeedback>
                                        </FormGroup>
                                    </Col> 
                                  </Row>
                                  <Row>             
                                      <Col xs="7">
                                          <FormGroup>
                                            <br/>
                                              <Label for="examplePassword"> Result  </Label>
                                                  <Input
                                                    type='text'
                                                    name='test_result'
                                                    id='test_result'
                                                    onChange={handleOtherFieldInputChange}
                                                    value = {otherfields.test_result}
                                                    style={{marginTop: '0rem' }}                                    
                                                  >
                                                  </Input>
                                          </FormGroup>
                                      </Col>
                                    <Col xs="3">
                                        <FormGroup>
                                            <p style={{marginTop: '2rem' }} >{unit_measurement}</p>   
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

export default connect(null, { createCollectedSample })(ModalSampleResult);
