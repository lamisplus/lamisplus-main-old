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

 function ArtCommencement(props) {
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
                    <CardHeader> ART Commencement</CardHeader>
                        
                    <CardBody>

                    <Row xs='12'>
                           <Col xs='6'> 
                                     
                        ART Start Date :< span> <b>{data.pulse || 'N/A'}</b></span>
                                    
                                </Col>
                          
                                <Col xs='6'>
                                            Clinical Stage: <span><b>{data.bodyWeight || 'N/A'}</b></span>
                                            </Col>
                                <Col xs='6'>
                                            Original Regimen Line: <span><b>{data.respiratoryRate || 'N/A'}</b></span>
                                </Col>
                                <Col xs='6'>
                                            TB Status: <span><b>{data.height || 'N/A'}</b></span>
                                </Col>
                                <Col xs='6'>
                                            Original Regimen:  <span><b>{data.temperature || 'N/A'}</b></span>
                                </Col>

                                <Col xs='6'>
                                            Next Appointment: <span><b>{data.systolic || ''} / {data.diastolic || ''}</b></span>
                                </Col>

                               </Row>

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

export default connect(mapStateToProps, mapActionToProps)(ArtCommencement)