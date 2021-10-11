import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// {/* Auto textfield complete */}
import {
    MdDashboard,
    MdContacts
  } from 'react-icons/md';
import {GiFiles,GiTestTubes } from 'react-icons/gi';  
import { FaBriefcaseMedical} from "react-icons/fa"; 
//{/*  Check box list */}
import { Line } from 'react-chartjs-2';
import {
    ViralLoad,Weight
  } from './node_modules/demos/patientVIral';
import PatientAlert from './node_modules/components/PatientDashboard/PatientAlert';
import PatientAllergies from './node_modules/components/PatientDashboard/PatientAllergies';
import PatientVitals from './node_modules/components/PatientDashboard/PatientVitals';
import PatientLabTest from './node_modules/components/PatientDashboard/PatientLabTest';
import ClinicalHistory from './node_modules/components/PatientDashboard/ClinicalHistory';
import Consultation from './consulatation/consultation';
import PatientDetailCard from './node_modules/components/Functions/PatientDetailCard';
import TestOrder from './TestOrder/TestOrder';
import Medication from './Medication/Medication';
import ServiceForm from './ServiceForm/serviceForm';

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
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root2: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    margin:theme.spacing(7),
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
      },
      title: {
        fontSize: 12,
          
      },
      pos: {
        fontSize: 11,
      },
    cardContent:{
        padding: 2,
    },
    cardroot:{
        margin:theme.spacing(1),
        height: 250 + 'px !important' ,
    }
    
    },
    alertmsge:{
        marginTop: theme.spacing(2),
    },
    rootaccordia: {
        width: '100%',
    },
    accordiaheading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    allergiesroot: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
        margin: theme.spacing(0.5),
        },
    },
    
    checkboxroot: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(3),
    },
    
    root: {
        '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 200,
        },
        
    },

    formroot: {
        '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 200,
        },
    },

    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '33.33%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
        textDecoration: 'underline',
        },
    },
    inforoot: {
        width: '95%',
        margin: 20,
        backgroundColor: '#eee',
    },
    }));

    const cardHeight = {
        height: 200, 
        position: 'relative',
        overflow: 'auto',
    };


export default function ScrollableTabsButtonForce(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    
  };




  return (
    <div className={classes.root}>
        <div className={classes.inforoot} >
            <PatientDetailCard getpatientdetails={props.location.state }/>   
        </div> 

      <AppBar position="static" >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="white"
          aria-label="scrollable force tabs example"
        >
          <Tab className={classes.title} label="Dashboard" icon={<MdDashboard />} {...a11yProps(0)} />         
          <Tab className={classes.title} label="Consultation" icon={<MdContacts />} {...a11yProps(1)} />
          <Tab className={classes.title} label="Service Form" icon={<GiFiles />} {...a11yProps(2)} />
          <Tab className={classes.title} label="Test Order" icon={<GiTestTubes />} {...a11yProps(3)} />
          <Tab className={classes.title} label="Medication" icon={<FaBriefcaseMedical />} {...a11yProps(4)} />
          {/* <Tab className={classes.title} label="Others" icon={<FaChartLine />} {...a11yProps(5)}  onClick={handleClick}/> */}
          
          
        </Tabs>
        <div>
     
    </div>
      </AppBar>
      {/* The DashBoad Tab  */}
      <TabPanel value={value} index={0}>
            <Grid container spacing={2}>
                <Grid item xs='6' >                    
                    <PatientAlert height={cardHeight}/>   
                </Grid>
                <Grid item xs='6'>
                    <PatientAllergies height={cardHeight} addstatus={false}/>   
                </Grid>
                <Grid item xs='6' >                    
                    <PatientVitals height={cardHeight}/> 
                </Grid>
                <Grid item xs='6' >
                                           
                    <PatientLabTest height={cardHeight}/>
                </Grid>
                <Grid item xs='6' >
               
                    <Card className={classes.cardroot} style={cardHeight}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Viral Load
                            </Typography>
                            <Line data={ViralLoad({ fill: false }, { fill: false })} style={{ height: 200 }}/>                      
                        </CardContent>                      
                    </Card>
                </Grid>
                <Grid item xs='6' >
               
                    <Card className={classes.cardroot} style={cardHeight}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Weight 
                            </Typography>
                            <Line data={Weight({ fill: false }, { fill: false })}/>                      
                        </CardContent>                      
                    </Card>
                </Grid>
                <Grid item xs='12' >
               
                    <Card className={classes.cardroot} style={cardHeight}>
                        <CardContent>
                            <ClinicalHistory />                     
                        </CardContent>                      
                    </Card>
                </Grid>
                
                
            </Grid> 

      </TabPanel>
{/* End of dashboard */}

{/* Begining of Service Form */}
<TabPanel value={value} index={1}>
 
            <Consultation getpatientdetails={props.location.state } height={cardHeight}/>

</TabPanel>     
 {/* Begining of consultation  */}
 <TabPanel value={value} index={2}>
      <Grid container spacing={2}>
                <Grid item xs='12'> 
                <ServiceForm getpatientdetails={props.location.state } height={cardHeight}/>
                </Grid>
        </Grid>
</TabPanel>

      <TabPanel value={value} index={3}>
        <TestOrder getpatientdetails={props.location.state } height={cardHeight}/>
      </TabPanel>
    {/* End of consultation */}
    <TabPanel value={value} index={4}>
        {/* Card stats */}
        <Medication getpatientdetails={props.location.state }  />

      </TabPanel>
      <TabPanel value={value} index={5}>
      <Grid container spacing={7} > 
                <Grid item xs='7'>                    
                    <Card className={classes.cardroot}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            
                            </Typography>
                                <Grid >
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Pulse : <span style={{fontSize: 'bold'}}>56pm</span>
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                        </Card>                     
                </Grid>
                
                <Grid item xs='5'>                    
                    <Card >
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Drug Order 
                            </Typography>
                                <Grid container >
                                    <Grid item >
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Pulse : <span style={{fontSize: 'bold'}}>56pm</span>
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                        </Card>                     
                </Grid>
                <br/>
                <Grid item xs='7'>                    
                    <Card >
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Drug Order 
                            </Typography>
                                <Grid container >
                                    <Grid item >
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Pulse : <span style={{fontSize: 'bold'}}>56pm</span>
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                        </Card>                     
                </Grid>
             
            
            </Grid>
      </TabPanel>
      

      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </div>
  );
}

