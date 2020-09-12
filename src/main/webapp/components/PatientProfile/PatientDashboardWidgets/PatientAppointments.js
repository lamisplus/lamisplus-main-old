import React, { useState }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardBody,
  Modal, ModalBody, ModalHeader
} from 'reactstrap';
import { Label } from 'semantic-ui-react';
import FormRendererModal from 'components/FormManager/FormRendererModal';
import * as CODES from "api/codes";
import { ToastContainer, toast } from 'react-toastify';
import {connect} from 'react-redux';
import AllergyList from '../Allergy/AllergyList';
import LinearProgress from "@material-ui/core/LinearProgress";
import {fetchPatientAppointments} from "actions/patients";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";

Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  chiproot: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
},
chip: {
    margin: theme.spacing(0.5),
},
}));

 function PatientAppointments(props ) {
  const classes = useStyles(props);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAllergyList, setShowAllergyList] = useState(false);
  const [currentForm, setCurrentForm] = useState(false);
  const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      if(!props.patientAllergies || props.patientAllergies.length === 0){
        setLoading(true);
        const onSuccess = () => {
            setLoading(false);
          };
          const onError = () => {
            setLoading(false);
          };
        props.fetchPatientAppointments(props.patientId, onSuccess, onError);
      }
    }, [])

  const onSuccess = () => {
    toast.success('Form saved successfully!', { appearance: 'success' })
    setShowFormModal(false);
    props.fetchPatientAllergies(props.patientId, () => setLoading(false), () => setLoading(false));
  }

  const onError = () => {
    toast.error('Something went wrong, request failed.')
    setShowFormModal(false);
  }
  
  const addAllergy = () => {
    setCurrentForm({
      code:CODES.PATIENT_ALLERGY_FORM,
      programCode:CODES.GENERAL_SERVICE,
      formName:"PATIENT ALLERGY",
      options:{
        modalSize: "modal-lg"
      },
  });
    setShowFormModal(true);
}

const toggleAllergyList = () => {
  return setShowAllergyList(!showAllergyList)
}
  return (
<React.Fragment>
            <Card >
              <CardHeader>Appointments
                  {/*<button type="button" className="float-right ml-3" onClick={addAllergy}><i className="fa fa-plus"></i> Add Appointment</button> &nbsp; <button type="button" className="float-right ml-3" onClick={toggleAllergyList}><i className="fa fa-list"></i> List All</button>*/}
              </CardHeader>
             {loading && <LinearProgress color="primary" thickness={1}/>}
                    <CardBody>
                                
                                {props.appointments && props.appointments.length > 0 &&
                                 <Label.Group color='blue' >
                               { props.appointments.map((x) => (
                                <Label>
                                {x.appointmentDate ? moment(x.appointmentDate).format('DD MMM YYYY') : ''} {' '}
                                {x.appointmentTime ? moment(x.appointmentTime, "HH:mm:ss").format('LT') : ''}
                                    {' '} <small>{moment(x.appointmentDate).fromNow()}</small>
                                <Label.Detail>{x.service} {' '} {x.serviceProvider}</Label.Detail>
                                
                              </Label>
 
                              
                                ))}
                                </Label.Group>
                                } 

                                 {!loading && props.appointments && props.appointments.length === 0 &&
                                 <Label>
                                 No Appointment
                               </Label>
 }
                            <br></br>
                                                 
                    </CardBody>                      
            </Card>
            <Modal isOpen={showAllergyList} toggle={toggleAllergyList} size='lg' zIndex={"9999"}>
                      <ModalHeader toggle={toggleAllergyList}>Patient Allergies</ModalHeader>
                      <ModalBody>
                      <AllergyList patientId={props.patient.patientId} showModal={showAllergyList} toggle={toggleAllergyList}/>
                     </ModalBody>
                    </Modal>  
            <FormRendererModal patientId={props.patient.patientId} showModal={showFormModal} setShowModal={setShowFormModal} currentForm={currentForm} onSuccess={onSuccess} onError={onError} options={currentForm.options}/>
      <ToastContainer />
      </React.Fragment>
  );
}
const mapStateToProps = state => {
  return {
  patient: state.patients.patient,
  appointments: state.patients.appointments
  }
}

const mapActionToProps = {
    fetchPatientAppointments: fetchPatientAppointments
}

export default connect(mapStateToProps, mapActionToProps)(PatientAppointments)