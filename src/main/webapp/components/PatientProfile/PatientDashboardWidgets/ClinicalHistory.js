import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Table } from "reactstrap";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import PreviousTestOrder from "../TestOrder/TestOrderHistory";
import PreviousMedication from "../Medication/PreviousMedication";
import ViewVitalsSearch from "components/Vitals/ViewVitalsSearch";
import ConsultationHistory from "components/PatientProfile/Consultation/ConsultationHistory";
import { connect } from "react-redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
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
    id: `wrapped-tab-${index}`,
    "aria-controls": `wrapped-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function ClinicalHistory(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.title} gutterBottom>
        Clinical History
      </Typography>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
        >
          <Tab value="one" label="Clinic" {...a11yProps("one")} />
          <Tab value="two" label="Vital Signs" wrapped {...a11yProps("two")} />
          <Tab value="three" label="Pharmacy" {...a11yProps("three")} />
          <Tab value="four" label="Laboratory" {...a11yProps("four")} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index="one">
        <ConsultationHistory patientId={props.patient.patientId} />
      </TabPanel>
      <TabPanel value={value} index="two">
        <ViewVitalsSearch patientId={props.patient.patientId} />
      </TabPanel>
      <TabPanel value={value} index="three">
        <PreviousMedication patientId={props.patient.patientId} />
      </TabPanel>
      <TabPanel value={value} index="four">
        <PreviousTestOrder patientId={props.patient.patientId} />
      </TabPanel>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
  };
};

const mapActionToProps = {};

export default connect(mapStateToProps, mapActionToProps)(ClinicalHistory);
