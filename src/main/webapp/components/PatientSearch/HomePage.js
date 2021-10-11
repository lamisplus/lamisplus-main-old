import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ActivePatientSearch from "components/PatientSearch/ActivePatientSearch";
import GeneralPatientSearch from "components/PatientSearch/PatientsPage";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { FaUserFriends, FaStethoscope } from "react-icons/fa";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";

//Dtate Picker package
Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: "20px",
    fontWeight: "bold",
    padding: "5px",
    paddingBottom: "10px",
  },
  inforoot: {
    margin: "5px",
  },
}));
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
function HomePage(props) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="secondary"
          textColor="inherit"
          aria-label="scrollable force tabs example"
        >
          <Tab
            className={classes.title}
            label="Find Patient"
            icon={<FaUserFriends />}
            {...a11yProps(0)}
          />
          <Tab
            className={classes.title}
            label="Checked-In Patients"
            icon={<FaStethoscope />}
            {...a11yProps(1)}
          />
         
        </Tabs>
        <div></div>
      </AppBar>

      <TabPanel value={value} index={0}>
        <GeneralPatientSearch />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ActivePatientSearch />
      </TabPanel>
     
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    hospitalNumber: ownProps.match.params.hospitalNumber,
  };
};

const mapActionToProps = {};

export default connect(mapStateToProps, mapActionToProps)(HomePage);
