import React, { useState } from 'react'
import useForm from '../Functions/UseForm'
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert
  } from 'reactstrap';
  import { ToastContainer, toast } from 'react-toastify'
  import 'react-toastify/dist/ReactToastify.css'
  import MatButton from '@material-ui/core/Button'

//Date Picker
import 'react-widgets/dist/css/react-widgets.css';
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { create } from 'actions/checkIn'
import * as actions from "actions/patients";
import { connect } from 'react-redux'
import { initialfieldState_checkInPatient } from './initailFieldState'
import Spinner from 'react-bootstrap/Spinner';
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
//Dtate Picker package
Moment.locale('en');
momentLocalizer();

const CheckInModal = (props ) => {

    const [errorMsg, setErrorMsg] = React.useState('')
    const [showErrorMsg, setShowErrorMsg] = useState(false)
    const [loading, setLoading] = React.useState(false)
    const onDismiss = () => setShowErrorMsg(false)

    const toggle = () => {
   return props.setShowModal(!props.showModal)
}

const {
  values,
  setValues,
  errors,
  setErrors,
  handleInputChange      } = useForm(initialfieldState_checkInPatient, validate)
  
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('dateVisitStart' in fieldValues)
          temp.dateVisitStart = fieldValues.dateVisitStart
            ? ''
            : 'This field is required.'
        if ('timeVisitStart' in fieldValues)
          temp.timeVisitStart = fieldValues.timeVisitStart
            ? ''
            : 'This field is required.'
        setErrors({
          ...temp
        })
    
        if (fieldValues === values) return Object.values(temp).every(x => x === '')
      }

    

    const handleSubmit = e => {
        setShowErrorMsg(false)
        const checkInDate = Moment(values.visitDate).format('DD-MM-YYYY')
        const checkInTime = Moment(values.visitTime).format('hh:mm A')
        values['dateVisitStart'] = checkInDate
        values['timeVisitStart'] = checkInTime
        values['patientId'] = props.patientId
        e.preventDefault()
        setLoading(true);
        if (validate()) {
          const onSuccess = () => {
            setLoading(false)
            toast.success('Patient Checked In Successfully')
            props.fetchPatientByHospitalNumber(props.patient.hospitalNumber)
            props.setShowModal(false);
          }
          const onError = errstatus => {
            setLoading(false)
            toast.error('An error occurred.');
            const msg = !(errstatus && errstatus.data && errstatus.data.apierror && errstatus.data.apierror.message) ? 'Something went wrong' : errstatus.data.apierror.message
            setErrorMsg(msg)
            setShowErrorMsg(true)
          }
          props.checkInPatient(values, onSuccess, onError)
          
        }
      }

    return (
        
        <Modal isOpen={props.showModal} toggle={toggle} size='lg'  zIndex={"9999"} >
             <ToastContainer />
        <ModalHeader toggle={toggle}>Check In Patient</ModalHeader>
        <ModalBody>
          <Alert color='danger' isOpen={showErrorMsg} toggle={onDismiss}>
            {errorMsg}
          </Alert>
          <Row form>
            <Col md={4}>
              <FormGroup>
                <Label for='qualification'>Visit Type</Label>
                <Input
                  type='select'
                  name='visitTypeId'
                  id='visitTypeId'
                  value={values.visitTypeId}
                  onChange={handleInputChange}
                  required
                >
                  <option value='2'>Booked</option>
                  <option value='3'>Unbooked</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for='middleName'>Date Of Visit</Label>
                <DateTimePicker
                  time={false}
                  id='visitDate'
                  name='visitDate'
                  value={values.visitDate}
                  onChange={value1 =>
                    setValues({ ...values, visitDate: value1 })
                  }
                  defaultValue={new Date()}
                  max={new Date()}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for='middleName'>Time of Visit</Label>
                <DateTimePicker
                  date={false}
                  name='visitTime'
                  id='visitTime'
                  value={values.visitTime}
                  onChange={value1 =>
                    setValues({ ...values, visitTime: value1 })
                  }
                  defaultValue={new Date()}
                  max={new Date()}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <div class="float-left">
        <MatButton
            type='submit'
            variant='contained'
            color='primary'
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            Check In { loading ? <Spinner animation="border" role="status">
                                            </Spinner> : ""}
          </MatButton>
          &nbsp;
          <MatButton
            variant='contained'
            color='default'
            onClick={toggle}
            startIcon={<CancelIcon />}
          >
            Cancel
          </MatButton>
          </div>
          
        </ModalFooter>
      </Modal>
    );
}

const mapStateToProps = state => {
  return {
    patient: state.patients.patient
  }
}
  
  const mapActionToProps = {
    checkInPatient: create,
    fetchPatientByHospitalNumber: actions.fetchById,
  }
  
  export default connect(mapStateToProps, mapActionToProps)(CheckInModal)
  