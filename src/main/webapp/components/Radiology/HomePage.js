import React, {useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import RadiologyDashBoard from "./RadiologyDashBoard";

import Typography from "@material-ui/core/Typography";
import { MdDashboard , MdFileUpload} from "react-icons/md";
import { GiTestTubes,GiFiles, GiDrippingTube } from "react-icons/gi";
import { GoRepoClone} from "react-icons/go";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import RadiologyUpload from "./Radiology/RadiologyTestSearch";
import {getQueryParams} from "components/Utils/PageUtils";

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
  const [value, setValue] = useState(null);
  const urlIndex = getQueryParams("tab", props.location.search); 
  const urlTabs = urlIndex !== null ? urlIndex : props.location.state ;
  useEffect ( () => {
    switch(urlTabs){  
      case "collect-sample": return setValue(1)
      case "sample-verification": return setValue(2)
      case "test-result": return setValue(3)
      case "radiology": return setValue(4)
      case "dispatched-sample-list" : return setValue(5)

      default: return setValue(0)
    }
  }, [urlIndex]);
  
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
          <Tab className={classes.title} label="Radiology Uploads" icon={<MdFileUpload />} {...a11yProps(1)} />
          </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
          <RadiologyDashBoard />
      </TabPanel>
      
      <TabPanel value={value} index={1}>
          <RadiologyUpload />
      </TabPanel>
      
     </div> 
    </>
  );
}



export default HomePage;
