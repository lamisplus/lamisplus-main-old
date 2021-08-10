import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import { Age } from "components/Functions/GetAge";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { Label } from "semantic-ui-react";
import * as CODES from "api/codes";
import { fetchApplicationCodeSet } from "actions/applicationCodeset";
import {APPLICATION_CODESET_GENDER} from "actions/types";
import { Image } from 'semantic-ui-react'
import axios from "axios";
import {url} from "../../api";
import {toast} from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root2: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    fontSize: 13,
    margin: "0px -2px",
    padding: "0px -2px",
  },
}));

function PatientDetailCard(props) {
  const patientDetail = props.getpatientdetails;
  const patient = patientDetail || props.patient;
  const [biometricsStatus, setBiometricsStatus] = React.useState("Not Captured");
  React.useEffect(() => {
    if (props.genderList.length === 0) {
     // props.fetchApplicationCodeSet("GENDER", APPLICATION_CODESET_GENDER);
    }
    fetchBiometrics();
  }, [props.genderList]);

  const fetchBiometrics = () => {
    axios
        .get(`${url}biometrics/patient/${props.patient.patientId}`)
        .then((response) => {
      console.log(response);
      if(response.length > 0) {
        setBiometricsStatus("Captured");
      }
    })
        .catch((error) => {
          setBiometricsStatus("N/A");
        });
  }

  const getGender = (id) => {
    const gender = props.genderList.find((x) => x.id === id);
    if(gender){
      return gender.display
    }
    return 'N/A'
  }
  const classes = useStyles();

  return (
    <div className={classes.root2}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <Row>
            <Col md={1}>
              <Image src='https://react.semantic-ui.com/images/wireframe/white-image.png' size='small' bordered />
            </Col>
            <Col md={11}>
              <Row className={"mt-1"}>
            <Col md={12} className={classes.root2}>
                <b style={{fontSize: "25px"}}>
                  {patient.firstName} {patient.lastName}{" "}
                </b>

            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Patient ID : <b>{patient.hospitalNumber}</b>
              </span>
            </Col>

            <Col md={4} className={classes.root2}>
              <span>
                Date Of Birth : <b>{patient.dob}</b>
              </span>
            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Age : <b>{Age(patient.details && patient.details.dob ? patient.details.dob : patient.dob)}</b>
              </span>
            </Col>
            <Col md={4}>
              <span>
                {" "}
                Gender :{" "}
                <b>{patient.details && patient.details.gender && patient.details.gender.display ? patient.details.gender.display : 'N/A'}</b>
              </span>
            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Phone Number : <b>{patient.mobilePhoneNumber || "N/A"}</b>
              </span>
            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                 Address : <b>{patient.street || ""} {", "}{patient.details && patient.details.province && patient.details.province.name ? patient.details.province.name : ' '}{", "}{patient.details && patient.details.state && patient.details.state.name ? patient.details.state.name : ' '} </b>
              </span>
            </Col>

            <Col md={12}>
            <Label.Group >
              {patient.typePatient &&
              (patient.typePatient === CODES.IN_PATIENT_UNBOOKED ||
                patient.typePatient === CODES.IN_PATIENT_BOOKED) ? (
                <Label color={"blue"} size={"mini"}>
                  IN PATIENT
                  <Label.Detail>Isolation Ward</Label.Detail>
                </Label>
              ) : (
                <Label color={"blue"} size={"mini"}>OUT PATIENT</Label>
              )}
              <Label color={"red"} size={"mini"}>
                Biometric Status
                <Label.Detail>{biometricsStatus}</Label.Detail>
              </Label>
               </Label.Group>

            </Col>
              </Row>
            </Col>
          </Row>
        </ExpansionPanelSummary>
      </ExpansionPanel>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
    genderList: state.applicationCodesets.genderList
  };
};

export default connect(mapStateToProps, {fetchApplicationCodeSet})(PatientDetailCard);
