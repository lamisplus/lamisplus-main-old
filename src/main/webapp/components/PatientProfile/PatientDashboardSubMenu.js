import React, { useState } from "react";
import { Button, Dropdown, Menu } from "semantic-ui-react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Popover from "@material-ui/core/Popover";
import { connect } from "react-redux";
import { Badge } from "reactstrap";
import FormRendererModal from "components/FormManager/FormRendererModal";
import * as CODES from "api/codes";
import { ToastContainer, toast } from "react-toastify";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { update } from "actions/visit";
import { create } from 'actions/checkIn';
import { fetchByHospitalNumber} from "actions/patients";
import { APPLICATION_CODESET_RELATIONSHIPS } from "actions/types";
import { fetchApplicationCodeSet } from "actions/applicationCodeset";
import {Modal, ModalBody, ModalHeader } from 'reactstrap';
import AddVitalsPage from 'components/Vitals/AddVitalsPage';
import { authentication } from '../../_services/authentication';


Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles((theme) => ({
  navItemText: {
    padding: theme.spacing(2),
  },
}));

function PatientDashboardSubMenu(props) {
  const classes = useStyles();
  const [showFormModal, setShowFormModal] = useState(false);
  const [currentForm, setCurrentForm] = useState(false);
  const [patientType, setPatientType] = useState();
  const [showVitalSignsModal, setShowVitalSignsModal] = useState(false);
  const userRoles = authentication.getCurrentUserRole();
  const toggleVitalSign = () => {
    return setShowVitalSignsModal(!showVitalSignsModal)
  }
  //TODO: Add appointments to patient submenu
  const formInfo = [
    {
      code: CODES.ADMIT_PATIENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "Admit Patient",
      typePatient: CODES.IN_PATIENT_UNBOOKED,
    },
    {
      code: CODES.DISCHARGE_PATIENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "Discharge Patient",
      typePatient: CODES.OUT_PATIENT_UNBOOKED,
    },
    {
      code: CODES.TRANSFER_INPATIENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "Transfer Patient",
    },
    {
      code: CODES.CHECK_OUT_PATIENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "Check Out Patient",
    },
    {
      code: CODES.APPOINTMENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "New Appointment",
    },
  ];
  // const checkInPatient = () => {
  //   setCheckIn(true);
  // };
  const onSuccess = () => {
    toast.success("Form saved successfully!", { appearance: "success" });
    setShowFormModal(false);
    props.fetchPatientByHospitalNumber(props.patientHospitalNumber)
  };

  const onError = () => {
    toast.error("Something went wrong, request failed.");
    setShowFormModal(false);
  };

  const checkOutPatient = () => {
    displayFormByFormName("Check Out Patient");
    const onSubmit = (submission) => {
      const data = {
        id: props.patient.visitId,
        dateVisitEnd: Moment(submission.data.checkOutDate).format("DD-MM-YYYY"),
        dateVisitStart: props.patient.dateVisitStart,
        timeVisitEnd: Moment(submission.data.checkOutTime).format("hh:mm A"),
        timeVisitStart: props.patient.timeVisitStart,
        dateNextAppointment: null,
        patientId: props.patient.patientId,
        visitTypeId: null,
        typePatient: props.patient.typePatient,
      };

      props.checkOutPatient(props.patient.visitId, data, onSuccess, onError);
    };
    setCurrentForm({
      code: CODES.CHECK_OUT_PATIENT_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "Check Out Patient",
      options: {
        modalSize: "modal-lg",
      },
      onSubmit: onSubmit,
    });
    setShowFormModal(true);
  };

  const checkInPatient = () => {
    //displayFormByFormName("Check Out Patient");
    const onSubmit = (submission) => {
      const data = submission.data;
      data['patientId'] = props.patient.patientId;
      props.checkInPatient(data, onSuccess, onError);
    };
    setCurrentForm({
      code: CODES.CHECK_IN_FORM,
      programCode: CODES.GENERAL_SERVICE,
      formName: "Check In Patient",
      options: {
        modalSize: "modal-lg",
      },
      onSubmit: onSubmit,
    });
    setShowFormModal(true);
  };

  const displayFormByFormName = (formName) => {
    setCurrentForm(formInfo.find((x) => x.formName === formName));
    setShowFormModal(true);
  };

  /*# Get list of RELATIVE parameter  #*/
  React.useEffect(() => {
    if(props.relationships.length === 0){
      props.fetchApplicationCodeSet("RELATIONSHIP", APPLICATION_CODESET_RELATIONSHIPS);
    }
  }, [props.relationships]);

  React.useEffect(() => {
    setPatientType(props.patient.typePatient);
  }, [props.patient]);

  function getRelationshipName(id) {
    return id ? ( props.relationships.find((x) => x.id == id) ? props.relationships.find((x) => x.id == id).display : "" ) : "";
  }

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <React.Fragment>
      <Menu size="mini" color={"silver"} inverted>
        {false && props.mainMenuTabIndex === 0 ?
        <Dropdown simple className='link item' options={props.dashboardOptions}  value={props.currentDashboard} onChange={props.changeDashboard}/>
            :""}

        <Menu.Item name="Alerts" active={false}>
          Alerts &nbsp;
          <Badge color="dark">0</Badge>
        </Menu.Item>
        <Menu.Item name="Relationships">
          <div aria-describedby={id} onClick={handleClick}>
            Relationships &nbsp;
            <Badge color="dark">
              {props.patient.personRelativeDTOs
                ? props.patient.personRelativeDTOs.length
                : 0}
            </Badge>
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <List>
              {props.patient.personRelativeDTOs &&
              props.patient.personRelativeDTOs.length > 0 ? (
                props.patient.personRelativeDTOs.map((relative, index) => (
                  <RelativeList
                    key={index}
                    index={index}
                    relative={relative}
                    relationshipTypeName={getRelationshipName(
                      relative.relationshipTypeId
                    )}
                  />
                ))
              ) : (
                <Typography className={classes.navItemText}>
                  No Relationship{" "}
                </Typography>
              )}
            </List>
          </Popover>
        </Menu.Item>

        {/* Show visit actions only when patient is checked in */}
        {props.patient  ? (
          <Dropdown simple text="Actions" className='link item'>

            {props.patient.dateVisitStart && patientType && ( patientType === CODES.IN_PATIENT_UNBOOKED || patientType === CODES.IN_PATIENT_BOOKED)  ? (
                <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => displayFormByFormName("Transfer Patient")}
                  disabled={!authentication.userHasRole(["patient_write"])}
                >
                  Transfer Patient to Ward / Service
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => displayFormByFormName("Discharge Patient")}
                  disabled={!authentication.userHasRole(["patient_write"])}
                >
                  Discharge Patient
                </Dropdown.Item>
                  <Dropdown.Item onClick={() => toggleVitalSign()}
                                 disabled={!authentication.userHasRole(["patient_write"])}
                  >Capture Vital Signs</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item  onClick={() => displayFormByFormName("New Appointment")}
                                  disabled={!authentication.userHasRole(["patient_write"])}
                  >
                    New Appointment
                  </Dropdown.Item>
              </Dropdown.Menu>
            ) : (
                <Dropdown.Menu>
                {/*<Dropdown.Header>Visit Actions</Dropdown.Header>*/}
                <Dropdown.Item
                  onClick={() => displayFormByFormName("Admit Patient")}
                  disabled={!authentication.userHasRole(["patient_write"])}
                >
                  Admit Patient
                </Dropdown.Item>
                  <Dropdown.Item onClick={() => toggleVitalSign()}
                                 disabled={!authentication.userHasRole(["patient_write"])}
                  >Capture Vital Signs</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item  onClick={() => displayFormByFormName("New Appointment")}
                                  disabled={!authentication.userHasRole(["patient_write"])}
                  >
                    New Appointment
                  </Dropdown.Item>
                </Dropdown.Menu>
            )}
          </Dropdown>
        ) : (
          ""
        )}

        {/* Show visit actions only when patient is checked in */}
        {false && props.patient  ? (
            <Dropdown simple text="Actions" className='link item'>

              {props.patient.dateVisitStart && patientType && ( patientType === CODES.IN_PATIENT_UNBOOKED || patientType === CODES.IN_PATIENT_BOOKED)  ? (
                  <Dropdown.Menu>
                    <Dropdown.Header>Visit Actions</Dropdown.Header>
                    <Dropdown.Item
                        onClick={() => displayFormByFormName("Transfer Patient")}
                        disabled={!authentication.userHasRole(["patient_write"])}
                    >
                      Transfer Patient to Ward / Service
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => displayFormByFormName("Discharge Patient")}
                        disabled={!authentication.userHasRole(["patient_write"])}
                    >
                      Discharge Patient
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => toggleVitalSign()}
                                   disabled={!authentication.userHasRole(["patient_write"])}
                    >Capture Vital Signs</Dropdown.Item>
                    <Dropdown.Header>Other Actions</Dropdown.Header>
                    <Dropdown.Item  onClick={() => displayFormByFormName("New Appointment")}
                                    disabled={!authentication.userHasRole(["patient_write"])}
                    >
                      New Appointment
                    </Dropdown.Item>
                  </Dropdown.Menu>
              ) : (
                  <Dropdown.Menu>
                    <Dropdown.Header>Visit Actions</Dropdown.Header>
                    <Dropdown.Item
                        onClick={() => displayFormByFormName("Admit Patient")}
                        disabled={!authentication.userHasRole(["patient_write"])}
                    >
                      Admit Patient
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => toggleVitalSign()}
                                   disabled={!authentication.userHasRole(["patient_write"])}>Capture Vital Signs</Dropdown.Item>
                    <Dropdown.Header>Other Actions</Dropdown.Header>
                    <Dropdown.Item  onClick={() => displayFormByFormName("New Appointment")}
                                    disabled={!authentication.userHasRole(["patient_write"])}
                    >
                      New Appointment
                    </Dropdown.Item>
                  </Dropdown.Menu>
              )}
            </Dropdown>
        ) : (
            ""
        )}
        <Menu.Menu position="right">
          {props.patient && props.patient.dateVisitStart ? (
            <Menu.Item>
              Current Visit:&nbsp;{" "}
              <b>
                {props.patient.dateVisitStart} {props.patient.timeVisitStart}
              </b>{" "}
              | &nbsp; &nbsp;
              <Button color="black" onClick={checkOutPatient}
                      disabled={!authentication.userHasRole(["patient_write"])}
              >
                Check Out
              </Button>
            </Menu.Item>
          ) : (
            <Menu.Item>
              <Button color="black" onClick={checkInPatient}
                      disabled={!authentication.userHasRole(["patient_write"])}
              >
                Check In
              </Button>
            </Menu.Item>
          )}
        </Menu.Menu>
      </Menu>

      <FormRendererModal
        patientId={props.patient.patientId}
        showModal={showFormModal}
        setShowModal={setShowFormModal}
        currentForm={currentForm}
        onSuccess={onSuccess}
        onError={onError}
        options={currentForm.options}
      />
      <Modal isOpen={showVitalSignsModal} toggle={toggleVitalSign} size='lg' zIndex={"9999"}>
        <ModalHeader toggle={toggleVitalSign}>Take Patient Vitals</ModalHeader>
        <ModalBody>
          <AddVitalsPage patientId={props.patient.patientId} showModal={showVitalSignsModal} toggle={toggleVitalSign}/>
        </ModalBody>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  );
}

function RelativeList({ relative, relationshipTypeName }) {
  return (
    <ListItem>
      <ListItemText
        primary={
          <React.Fragment>
            {relationshipTypeName}, {relative.firstName} {relative.otherNames}{" "}
            {relative.lastName}
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body2" color="textPrimary">
              {relative.mobilePhoneNumber} {relative.email} <br></br>
            </Typography>
            {relative.address}
          </React.Fragment>
        }
      />
    </ListItem>
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
  checkInPatient: create,
  fetchPatientByHospitalNumber: fetchByHospitalNumber,
  fetchApplicationCodeSet: fetchApplicationCodeSet,
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(PatientDashboardSubMenu);
