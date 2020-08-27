import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import { Age } from "../Functions/GetAge";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

function PatientDetailCard(props) {
    console.log(props)
 const patientDetail = props.getpatientdetails;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <Row className={classes.root}>
            <Col md={4}>
              <span>
                {" "}
                Patient ID : <b>{patientDetail.patientId}</b>
              </span>
            </Col>
            <Col md={4}>
              <span>
                Date Of Birth : <b>{patientDetail.dob}</b>
              </span>
            </Col>
            <Col md={4}>
              <span>
                {" "}
                Age : <b>{Age(patientDetail.dob)}</b>
              </span>
            </Col>
            <Col md={4}>
              <span>
                {" "}
                Name :{" "}
                <b>
                  {patientDetail.firstName} {patientDetail.lastName}{" "}
                </b>
              </span>
            </Col>
            <Col md={4}>
              <span>
                {" "}
                Gender :{" "}
                <b>{patientDetail.genderId === 1 ? "Female" : "Male"}</b>
              </span>
            </Col>
            <Col md={4}>
              <span>
                {" "}
                Phone Number : <b>{patientDetail.mobilePhoneNumber || "N/A"}</b>
              </span>
            </Col>
            <Col md={4}>
              <span>
                {" "}
                Email Address : <b>{patientDetail.email || "N/A"}</b>
              </span>
            </Col>
          </Row>
        </ExpansionPanelSummary>
      </ExpansionPanel>
    </div>
  );
}

export default PatientDetailCard;
