import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import LaboratoryDashBoard from "./LaboratoryDashBoard";
import LabTestOrders from "./Testorders/LabTestOrderSearch";
import LabTestResultSearch from './TestResult/LabTestResultSearch';
import LabTestVerifySampleSearch from './Sampleverifications/LabTestVerifySampleSearch';
import DispatchedManifest from './DispatchedManifest/DispatchedManifest';
import Typography from "@material-ui/core/Typography";
import { MdDashboard } from "react-icons/md";
import { GiTestTubes,GiFiles, GiDrippingTube } from "react-icons/gi";
import { GoRepoClone} from "react-icons/go";
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
    <>
    <div className={classes.root}>
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
          <Tab className={classes.title} label="Dashboard" icon={<MdDashboard />} {...a11yProps(0)} /> 
          <Tab className={classes.title} label="Sample Collection" icon={<GiTestTubes />} {...a11yProps(1)} />
          <Tab className={classes.title} label="Sample Verification " icon={<GiDrippingTube style={{ color:'#fff'}}/>} {...a11yProps(2)} />
          <Tab className={classes.title} label="Results Reporting" icon={<GoRepoClone />} {...a11yProps(3)} />
          <Tab className={classes.title} label="Sample Dispatch " icon={<GiFiles />} {...a11yProps(4)} />
      </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
          <LaboratoryDashBoard />
      </TabPanel>
      <TabPanel value={value} index={1}>
          <LabTestOrders /> 
      </TabPanel>
      <TabPanel value={value} index={2}>
          <LabTestVerifySampleSearch />
      </TabPanel>
      <TabPanel value={value} index={3}>
          <LabTestResultSearch />
      </TabPanel>
      <TabPanel value={value} index={4}>
          <DispatchedManifest />
      </TabPanel>
        
     </div> 
    </>
  );
}



export default HomePage;
