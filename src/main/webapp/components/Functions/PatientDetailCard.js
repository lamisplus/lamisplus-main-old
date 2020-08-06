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
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Patient ID : <b>{props.patient.hospitalNumber}</b>
              </span>
            </Col>

            <Col md={4} className={classes.root2}>
              <span>
                Date Of Birth : <b>{props.patient.dob}</b>
              </span>
            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Age : <b>{Age(props.patient.dob)}</b>
              </span>
            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Name :{" "}
                <b>
                  {props.patient.firstName} {props.patient.lastName}{" "}
                </b>
              </span>
            </Col>
            <Col md={4}>
              <span>
                {" "}
                Gender :{" "}
                <b>{props.patient.genderId === 1 ? "Female" : "Male"}</b>
              </span>
            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Phone Number : <b>{props.patient.mobilePhoneNumber || "N/A"}</b>
              </span>
            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Email Address : <b>{props.patient.email || "N/A"}</b>
              </span>
            </Col>
            <Col md={12}>
            <Label.Group color={"blue"} size={"mini"}>
              {props.patient.typePatient &&
              (props.patient.typePatient === CODES.IN_PATIENT_UNBOOKED ||
                props.patient.typePatient === CODES.IN_PATIENT_BOOKED) ? (
                <Label>
                  IN PATIENT
                  <Label.Detail>Isolation Ward</Label.Detail>
                </Label>
              ) : (
                <Label>OUT PATIENT</Label>
              )}
               </Label.Group>
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
  };
};

export default connect(mapStateToProps, {})(PatientDetailCard);
