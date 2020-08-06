import React from 'react';
import { useState, useEffect } from 'react';
import {
    Col,
    Row,
    Card,
    CardHeader,
    CardBody,
    Modal, ModalBody, ModalHeader
  } from 'reactstrap';
  import AddVitalsPage from 'components/Vitals/AddVitalsPage';
  import * as actions from "actions/patients";
  import * as encounterAction from "actions/encounter";
  import {connect} from 'react-redux';
  import * as _ from "lodash";
  import { Label } from 'semantic-ui-react';

 function PatientVitals(props) {
    const [data, setData] = useState({pulse:'', height: '', systolic: '', diastolic: '', bodyWeight: ''}); 
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bmiStatus, setBMIStatus] = useState();
    const [bmi, setBMI] = useState();
    const toggle = () => {
      return setShowModal(!showModal)
   }

   const calculateBMI = () => {
     if(props.vitalSigns.bodyWeight && props.vitalSigns.height){
     const bmi = (props.vitalSigns.bodyWeight / props.vitalSigns.height / props.vitalSigns.height) * 10000;
     if(bmi <= 18.5){
      setBMIStatus('Underweight');
     } 
     else if (bmi > 18.5 && bmi <= 24.9){
        setBMIStatus('Healthy Weight');
      }
      else if (bmi > 25.0 && bmi <= 29.9){
        setBMIStatus('Overweight');
      } else {
        setBMIStatus('Obese');
      }

     setBMI(Number(bmi).toFixed(1));
     }
    
   }

   useEffect(() => {    
    props.fetchPatientVitalSigns(props.patientId, ()=>{setLoading(false)}, ()=>{setLoading(false)})  
    }, [props.patient]); 

    useEffect(() => {
        setData({});
        setBMI()
        setBMIStatus()
      if(props.vitalSigns){
         setData(props.vitalSigns)
         calculateBMI() 
      } 
      
    }, [props.vitalSigns])
  return (
    
            <Card  >
                    <CardHeader> Recent Vital Signs  <button type="button" className="float-right ml-3" onClick={toggle}><i className="fa fa-plus"></i> Add Vitals</button></CardHeader>
                        
                    <CardBody>
                    {_.isEmpty(data) && 
                             <Label>
                             No Vital Signs
                           </Label>
                            }   
                    {!_.isEmpty(data) &&    
                    <Row xs='12'>
                           <Col xs='6'> 
                                     
                        Pulse (bpm) :< span> <b>{data.pulse || 'N/A'}</b></span> 
                                    
                                </Col>
                          
                                <Col xs='6'>
                                            Weight (kg): <span><b>{data.bodyWeight || 'N/A'}</b></span>                                 
                                            </Col>
                                <Col xs='6'>
                                            RR (bpm): <span><b>{data.respiratoryRate || 'N/A'}</b></span> 
                                </Col>
                                <Col xs='6'>
                                            Height (cm): <span><b>{data.height || 'N/A'}</b></span>  
                                </Col>
                                <Col xs='6'>
                                            Temperature (C):  <span><b>{data.temperature || 'N/A'}</b></span> 
                                </Col>
                                <Col xs='6'>
                                            BMI: <span><b>{bmi || 'N/A'}</b></span> 
                                </Col>
                                <Col xs='6'>
                                            BP (mmHg): <span><b>{data.systolic || ''} / {data.diastolic || ''}</b></span> 
                                </Col>
                                <Col xs='6'>
                                            BMI Status: <span><b>{bmiStatus || 'N/A'}</b></span> 
                                </Col>
                                <Col xs='12'>
  {props.vitalSigns ? <span>Updated on <b>{props.vitalSigns.dateEncounter || ""} {props.vitalSigns.timeCreated || ""}</b></span> : ""}
                                </Col>
                                </Row>
 }
                   </CardBody>  
                    <Modal isOpen={showModal} toggle={toggle} size='lg' zIndex={"9999"}>
                      <ModalHeader toggle={toggle}>Take Patient Vitals</ModalHeader>
                      <ModalBody>
                      <AddVitalsPage patientId={props.patientId} showModal={showModal} toggle={toggle}/>
                     </ModalBody>
                    </Modal>                       
            </Card>   
                           
  );
}

const mapStateToProps = state => {
  return {
  patient: state.patients.patient,
  vitalSigns: state.patients.vitalSigns
  }
}

const mapActionToProps = {
  fetchPatientByHospitalNumber: actions.fetchById,
  createVitalSigns: encounterAction.create,
  fetchPatientVitalSigns: actions.fetchPatientLatestVitalSigns
}

export default connect(mapStateToProps, mapActionToProps)(PatientVitals)