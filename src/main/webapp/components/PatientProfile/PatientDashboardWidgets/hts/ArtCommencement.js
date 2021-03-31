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
  import {connect} from 'react-redux';
import axios from 'axios';
import {url as baseUrl, url} from '../../../../api';
import * as CODES from "api/codes";
import moment from 'moment';

 function ArtCommencement(props) {
    const [data, setData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bmiStatus, setBMIStatus] = useState();
    const [bmi, setBMI] = useState();
    const toggle = () => {
      return setShowModal(!showModal)
   }


        useEffect(() => {
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

                      ART Start Date :< span> <b>{data.date_enrollment ? moment(data.date_enrollment).format('DD MMM yyyy') : 'N/A'}</b></span>

                  </Col>

                  <Col xs='6'>
                      Clinical
                      Stage: <span><b>{data.clinic_stage && data.clinic_stage.display ? data.clinic_stage.display : 'N/A'}</b></span>
                  </Col>
                  <Col xs='6'>
                      Original Regimen Line: <span><b>{data.regimen || 'N/A'}</b></span>
                  </Col>
                  <Col xs='6'>
                      TB
                      Status: <span><b>{data.tb_status && data.tb_status.display ? data.tb_status.display : 'N/A'}</b></span>
                  </Col>
                  <Col xs='6'>
                      Original Regimen: <span><b>{data.regimen || 'N/A'}</b></span>
                  </Col>

                  <Col xs='6'>
                      Next Appointment: <span><b>{data.next_appointment ? moment(data.next_appointment).format('DD MMM yyyy') : ''}</b></span>
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
  vitalSigns: state.patients.vitalSigns
  }
}

const mapActionToProps = {
  fetchPatientByHospitalNumber: actions.fetchById,
  createVitalSigns: encounterAction.create,
  fetchPatientVitalSigns: actions.fetchPatientLatestVitalSigns
}

export default connect(mapStateToProps, mapActionToProps)(ArtCommencement)