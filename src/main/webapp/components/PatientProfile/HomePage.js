import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ToastContainer } from "react-toastify";
import InPatientDashboard from "components/PatientProfile/Dashboards/InPatientDashboard";

// {/* Auto textfield complete */}
import { MdDashboard, MdContacts } from "react-icons/md";
import { GiFiles, GiTestTubes } from "react-icons/gi";
import { FaBriefcaseMedical } from "react-icons/fa";
//{/*  Check box list */}

import PatientDashboardSubMenu from "components/PatientProfile/PatientDashboardSubMenu";

import Consultation from "./Consultation/consultation";
import PatientDetailCard from "components/Functions/PatientDetailCard";
import TestOrder from "./TestOrder/TestOrder";
import Medication from "./Medication/Medication";
import ServiceForm from "./ServiceForm/serviceForm";
import * as actions from "actions/patients";
import { connect } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={5}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  inforoot: {
    width: "100%",
    margin: 0,
    backgroundColor: "#eee",
  },
}));

function HomePage(props) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [fetchingPatient, setFetchingPatient] = useState(false);
  const getQueryParams = (params, url) => {
    let href = url;
    //this expression is to get the query strings
    let reg = new RegExp("[?&]" + params + "=([^&#]*)", "i");
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
  };

  const hospitalNumber =
    getQueryParams("hospitalNumber", props.location.search) ||
    props.patient.hospitalNumber ||
    "";

  const isEmpty = (value) => {
    if (JSON.stringify(value) === "{}") {
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    setFetchingPatient(true);
    const onSuccess = () => {
      setFetchingPatient(false);
    };
    const onError = () => {
      setFetchingPatient(false);
    };
    props.fetchPatientByHospitalNumber(hospitalNumber, onSuccess, onError);
  }, [hospitalNumber]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  switch (isEmpty(props.patient)) {
  }

  if (!fetchingPatient && isEmpty(props.patient)) {
    {
      /* Show couldnt load patient info if api call to fetch patient is unsuccessful, else show patient dashboard */
    }
    return (
      <React.Fragment>
        <div className={classes.inforoot}>
          Couldn't load patient information.
        </div>
      </React.Fragment>
    );
  }

  if (fetchingPatient) {
    return (
      <React.Fragment>
        <div className={classes.root}>
          <div className={classes.inforoot}>
            <PatientDetailCard />
          </div>
          <LinearProgress color="primary" thickness={5} />
        </div>
      </React.Fragment>
    );
  }
  return (
    <div className={classes.root}>
      <ToastContainer />
      <div className={classes.inforoot}>
        <PatientDetailCard />
      </div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab
            className={classes.title}
            label="Dashboard"
            icon={<MdDashboard />}
            {...a11yProps(0)}
          />
          <Tab
            className={classes.title}
            label="Consultation"
            icon={<MdContacts />}
            {...a11yProps(1)}
          />
          <Tab
            className={classes.title}
            label="Test Order"
            icon={<GiTestTubes />}
            {...a11yProps(2)}
          />
          <Tab
            className={classes.title}
            label="Medication"
            icon={<FaBriefcaseMedical />}
            {...a11yProps(3)}
          />{" "}
          <Tab
            className={classes.title}
            label="Service Form"
            icon={<GiFiles />}
            {...a11yProps(4)}
          />
        </Tabs>

        <div></div>
      </AppBar>

      <div>
        <PatientDashboardSubMenu
          patientHospitalNumber={props.patient.hospitalNumber}
        />

        {/* The DashBoard Tab  */}
        <TabPanel value={value} index={0}>
          <InPatientDashboard patientId={props.patient.patientId} />
        </TabPanel>
        {/* End of dashboard */}

        {/* Begining of consultation  */}
        <TabPanel value={value} index={1}>
          <Consultation
            patientId={props.patient.patientId}
            visitId={props.patient.visitId}
          />
        </TabPanel>
        {/* End of consultation */}

        {/* test orders */}
        <TabPanel value={value} index={2}>
          <TestOrder
            patientId={props.patient.patientId}
            visitId={props.patient.visitId}
          />
        </TabPanel>
        {/* test orders */}

        {/* medication */}
        <TabPanel value={value} index={3}>
          <Medication
            patientId={props.patient.patientId}
            visitId={props.patient.visitId}
          />
        </TabPanel>
        {/* medication */}

        {/* service forms */}
        <TabPanel value={value} index={4}>
          <ServiceForm
            patientId={props.patient.patientId}
            visitId={props.patient.visitId}
          />
        </TabPanel>
        {/* service forms */}
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    patient: state.patients.patient,
    // hospitalNumber: this.props.location.query.hospitalNumber,
  };
};

const mapActionToProps = {
  fetchPatientByHospitalNumber: actions.fetchByHospitalNumber,
};

export default connect(mapStateToProps, mapActionToProps)(HomePage);
