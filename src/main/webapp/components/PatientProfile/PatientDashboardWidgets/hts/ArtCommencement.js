import React from 'react';
import { useState, useEffect } from 'react';
import {
    Col,
    Row,
    Card,
    CardHeader,
    CardBody,
    Modal, ModalBody, ModalHeader, Spinner
  } from 'reactstrap';
  import AddVitalsPage from 'components/Vitals/AddVitalsPage';
  import * as actions from "actions/patients";
  import * as encounterAction from "actions/encounter";
  import {fetchAllRegimen, fetchAllRegimenLine} from "../../../../actions/medication";
import {connect} from 'react-redux';
import axios from 'axios';
import {url as baseUrl, url} from '../../../../api';
import * as CODES from "api/codes";
import moment from 'moment';

 function ArtCommencement(props) {
    const [data, setData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [appointment, setAppointment] = useState();
    const [bmiStatus, setBMIStatus] = useState();
    const [bmi, setBMI] = useState();
    const toggle = () => {
      return setShowModal(!showModal)
   }
     const fetchAppointment = () => {


         axios
             .get(`${baseUrl}appointments/${props.patientId}`)
             .then(response => {
                 console.log(response.data);
                 setAppointment(response.data.length > 0 ? response.data[0] : null);
             })
             .catch(error => {

                 }

             );
     }


        useEffect(() => {
            if(props.regimenList.length <= 0) {
                props.fetchAllRegimen(() => {
                }, () => {
                });
            }
            if(props.regimenLineList.length <= 0) {
                props.fetchAllRegimenLine(() => {
                }, () => {
                });
            }
            fetchAppointment();
            setLoading(true);
            async function fetchFormData() {
                axios
                    .get(`${baseUrl}patients/${props.patientId}/encounters/${CODES.ART_COMMENCEMENT_FORM}`, {limit: 1, sortField: "id", sortOrder: "desc"} )
                    .then(response => {
                        setLoading(false);
                        setData(response.data[0]);
                    })
                    .catch(error => {
                        setLoading(false);

                    })
            }
            fetchFormData();
        }, [])

  if(loading){
           return (<span className="text-center">
       <Spinner style={{ width: "3rem", height: "3rem" }} type="grow" />{" "}
               Searching...
     </span>);
       }
  return (
      <>
      {data ?
      <Card>
          <CardHeader> ART Commencement</CardHeader>

          <CardBody>

              <Row xs='12'>
                  <Col xs='6'>

                      ART Start Date :< span> <b>{data.date_art_start ? moment(data.date_art_start).format('DD MMM yyyy') : 'N/A'}</b></span>

                  </Col>

                  <Col xs='6'>
                      Clinical
                      Stage: <span><b>{data.clinic_stage && data.clinic_stage.display ? data.clinic_stage.display : 'N/A'}</b></span>
                  </Col>
                  <Col xs='6'>
                      Original Regimen Line: <span><b>{data.regimenId ? (props.regimenLineList.find(x => x.id == data.regimenId) ? props.regimenLineList.find(x => x.id === data.regimenId).name: 'N/A') : 'N/A'}</b></span>
                  </Col>
                  <Col xs='6'>
                      TB
                      Status: <span><b>{data.tb_status && data.tb_status.display ? data.tb_status.display : 'N/A'}</b></span>
                  </Col>
                  <Col xs='6'>
                      Original Regimen: <span><b>{data.regimen ? (props.regimenList.find(x => x.id == data.regimen) ? props.regimenList.find(x => x.id === data.regimen).name: 'N/A') : 'N/A'}</b></span>
                  </Col>

                  <Col xs='6'>
                      Next Appointment: <span><b>{appointment && appointment.detail && appointment.detail.appointment_date ?  moment(appointment.detail.appointment_date).format('DD MMM yyyy') : ''} {appointment && appointment.detail && appointment.detail.appointment_type ? appointment.detail.appointment_type.toString() : ''}</b></span>
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
 : ""}
 </>
  );
}

const mapStateToProps = state => {
  return {
  patient: state.patients.patient,
      regimenList: state.medication.regimenList,
      regimenLineList: state.medication.regimenLineList,
  vitalSigns: state.patients.vitalSigns
  }
}

const mapActionToProps = {
  fetchPatientByHospitalNumber: actions.fetchById,
  createVitalSigns: encounterAction.create,
  fetchPatientVitalSigns: actions.fetchPatientLatestVitalSigns,
    fetchAllRegimen:fetchAllRegimen,
    fetchAllRegimenLine: fetchAllRegimenLine
}

export default connect(mapStateToProps, mapActionToProps)(ArtCommencement)