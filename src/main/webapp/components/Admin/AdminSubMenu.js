import React, { useState } from "react";
import { Button, Dropdown, Menu } from "semantic-ui-react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import * as CODES from "api/codes";
import { ToastContainer, toast } from "react-toastify";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { update } from "actions/visit";
import { fetchByHospitalNumber} from "actions/patients";
import { fetchApplicationCodeSet } from "actions/applicationCodeset";
import {Link} from "react-router-dom";

Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles((theme) => ({
  navItemText: {
    padding: theme.spacing(2),
  },
}));

function AdminSubMenu(props) {
  const classes = useStyles();
  const [showFormModal, setShowFormModal] = useState(false);
  const [currentForm, setCurrentForm] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [patientType, setPatientType] = useState();

  //TODO: Add appointments to patient submenu
  const formInfo = [
    {
      code: CODES.ADMIT_PATIENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "ADMIT_PATIENT",
      typePatient: CODES.IN_PATIENT_UNBOOKED,
    },
    {
      code: CODES.DISCHARGE_PATIENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "DISCHARGE_PATIENT",
      typePatient: CODES.OUT_PATIENT_UNBOOKED,
    },
    {
      code: CODES.TRANSFER_INPATIENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "TRANSFER_INPATIENT",
    },
    {
      code: CODES.CHECK_OUT_PATIENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "CHECK_OUT_PATIENT",
    },
  ];



  const displayFormByFormName = (formName) => {
    setCurrentForm(formInfo.find((x) => x.formName === formName));
    setShowFormModal(true);
  };

  /*# Get list of RELATIVE parameter  #*/
  React.useEffect(() => {
    if(props.relationships.length === 0){
      //props.fetchApplicationCodeSet("RELATIONSHIP", APPLICATION_CODESET_RELATIONSHIPS);
    }
  }, [props.relationships]);

  React.useEffect(() => {
   // setPatientType(props.patient.typePatient);
  }, [props.patient]);

  return (
    <React.Fragment>
      <Menu size="mini" color={"silver"} inverted>
          <Dropdown text="System Configurations"   labeled simple    className='icon link item'>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to={{pathname: "/admin/application-codesets"}} >
                 Application Codeset Manager
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link
                      to={{
                        pathname: "/admin/global-variable"}}
                  >
                  Global Variables
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item >
                  <Link
                      to={{
                        pathname: "/admin/standards"}}
                  >
                  International Standard setup
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item >
                  Organization Unit setup
                </Dropdown.Item>
                <Dropdown.Item >
                  <Link
                      to={{
                        pathname: "/admin/wards"}}
                  >
                    Ward Manager
                  </Link>
                </Dropdown.Item>

              </Dropdown.Menu>

          </Dropdown>

        <Dropdown text="Designer" className='link item' simple>
          <Dropdown.Menu>
            <Dropdown.Header>Form Designer</Dropdown.Header>
            <Dropdown.Item>New Form</Dropdown.Item>
            <Dropdown.Item>View All Forms</Dropdown.Item>
            {/*<Dropdown.Item>*/}
            {/*  <Dropdown text='New Form Designer'>*/}
            {/*    <Dropdown.Menu>*/}
            {/*      <Dropdown.Header>Mens</Dropdown.Header>*/}
            {/*      <Dropdown.Item>Shirts</Dropdown.Item>*/}
            {/*      <Dropdown.Item>Pants</Dropdown.Item>*/}
            {/*      <Dropdown.Item>Jeans</Dropdown.Item>*/}
            {/*      <Dropdown.Item>Shoes</Dropdown.Item>*/}
            {/*      <Dropdown.Divider />*/}
            {/*      <Dropdown.Header>Womens</Dropdown.Header>*/}
            {/*      <Dropdown.Item>Dresses</Dropdown.Item>*/}
            {/*      <Dropdown.Item>Shoes</Dropdown.Item>*/}
            {/*      <Dropdown.Item>Bags</Dropdown.Item>*/}
            {/*    </Dropdown.Menu>*/}
            {/*  </Dropdown>*/}
            {/*</Dropdown.Item>*/}
            <Dropdown.Divider />
            <Dropdown.Header>Report Designer</Dropdown.Header>
            <Dropdown.Item>New Report</Dropdown.Item>
            <Dropdown.Item>View All Reports</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      </Menu>

      <ToastContainer />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
    relationships: state.applicationCodesets.relationships
  };
};

const mapActionToProps = {
  checkOutPatient: update,
  fetchPatientByHospitalNumber: fetchByHospitalNumber,
  fetchApplicationCodeSet: fetchApplicationCodeSet,
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(AdminSubMenu);
