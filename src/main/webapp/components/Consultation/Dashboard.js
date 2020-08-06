import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Chip from '@material-ui/core/Chip';
import TagFacesIcon from '@material-ui/icons/TagFaces';
// {/* Auto textfield complete */}
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {
    MdDashboard,
    MdContacts
  } from 'react-icons/md';
import {GiFiles,GiTestTubes } from 'react-icons/gi';  
import { FaBriefcaseMedical, FaChartLine} from "react-icons/fa"; 
//{/*  Check box list */}
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import {
CardBody,
Col,
Row,
FormGroup,
Input,
} from 'reactstrap';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

//the paper for the patient detail at the header 
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


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
    }
    
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
  chiproot: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
  chip: {
    margin: theme.spacing(0.5),
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
const cardStyle = {
    borbderColor: '#fff',
    marginBottom: 10,
  };


export default function ScrollableTabsButtonForce() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    
  };
  const [chipData, setChipData] = React.useState([
    { key: 0, label: 'Haemoglobin' },
    { key: 1, label: 'HIV(Blood)' },
    { key: 2, label: 'Absolute Cocunt' },

  ]);

  const handleDelete = chipToDelete => () => {
    setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  };

  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChangecheckbox = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter(v => v).length !== 2;

  return (
    <div className={classes.root}>
         <div className={classes.inforoot} style={{ backgroundColor: 'blue !important'}}>
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
                >
                <div className={classes.column}>
                    <Typography className={classes.heading}>
                        Name: Mathew Adeoye
                        <br/>
                        Gender : Female
                    </Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>
                        Birthday : June, 14 1990 (20 years)
                        <br/>
                        phone Number : +234567890
                    </Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>
                        Email Address : Mathew Adegbite
                        
                    </Typography>
                </div>
                </ExpansionPanelSummary>
               
            </ExpansionPanel>
        </div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab className={classes.title} label="Dashboard" icon={<MdDashboard />} {...a11yProps(0)} />         
          <Tab className={classes.title} label="Consultation" icon={<MdContacts />} {...a11yProps(1)} />
          <Tab className={classes.title} label="Service Form" icon={<GiFiles />} {...a11yProps(2)} />
          <Tab className={classes.title} label="Test Order" icon={<GiTestTubes />} {...a11yProps(3)} />
          <Tab className={classes.title} label="Medication" icon={<FaBriefcaseMedical />} {...a11yProps(4)} />
          <Tab className={classes.title} label="Patient Chart" icon={<FaChartLine />} {...a11yProps(5)} />
          
        </Tabs>
      </AppBar>
      {/* The DashBoad Tab  */}
      <TabPanel value={value} index={0}>
            <Grid container spacing={2}>
                <Grid item xs='6' >                    
                    <Card className={classes.cardroot} style={{ height: '200px'}}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Latest Vital Signs
                            </Typography>
                                <Grid container spacing={12}>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Pulse : <span style={{fontSize: 'bold'}}>56pm</span>
                                               
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary" > 
                                                Weight: 23kg
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                RR : 56pm
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                Height: 23kg
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                Tempreature : 56pm
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                BMI: 23kg
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                Blood Presure : 56pm
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                BMI Sstatus: 23kg
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='23'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                Paulse : 56pm
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                        </Card>                     
                </Grid>
                <Grid item xs='6' >
                    <Card className={classes.cardroot} style={{ height: '200px'}}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Relationship
                            </Typography>
                                <Grid container spacing={12}>
                                    <Grid item xs='12'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Wife: Mr Debora Johnson | 08072023085
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                    </Card>
                </Grid>
                <Grid item xs='6' height="50%">
               
                    <Card className={classes.cardroot} style={{ height: '200px'}}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Lab Results
                            </Typography>
                                <Grid container spacing={12}>
                                    <Grid item xs='12'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Wife: Mr Debora Johnson | 08072023085
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                    </Card>
                </Grid>
                <Grid item xs='6'>
                
                    <Card className={classes.cardroot} style={{ height: '200px'}}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Allergies
                            </Typography>
                                <Grid container spacing={12}>
                                    <Grid item xs='12'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Wife: Mr Debora Johnson | 08072023085
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                    </Card>
                </Grid>
                <Grid item xs='6'>
                    
                    <Card className={classes.cardroot} style={{ height: '200px'}}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                                Recent Visit
                            </Typography>
                                <Grid container spacing={12}>
                                    <Grid item xs='12'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Wife: Mr Debora Johnson | 08072023085
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                    </Card>
                </Grid>
                <Grid item xs='6'>
                
                    <Card className={classes.cardroot} style={{ height: '200px'}}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Recent Diagnosis
                            </Typography>
                                <Grid container spacing={12}>
                                    <Grid item xs='12'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Wife: Mr Debora Johnson | 08072023085
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                    </Card>
                </Grid>
                <Grid item xs='6'>
                
                    <Card className={classes.cardroot} style={{ height: '200px'}}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Forms
                            </Typography>
                                <Grid container spacing={12}>
                                    <Grid item xs='12'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Wife: Mr Debora Johnson | 08072023085
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                    </Card>
                </Grid>
            </Grid>

      </TabPanel>
{/* End of dashboard */}

{/* Begining of Service Form */}

      <TabPanel value={value} index={1}>
        <Grid container spacing={2}>
                <Grid item xs='6'>                    
                    <Card className={classes.cardroot} style={{ height: '200px'}}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Latest Vital Signs
                            </Typography>
                                <Grid container spacing={12}>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Pulse : <span style={{fontSize: 'bold'}}>56pm</span>
                                               
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary" > 
                                                Weight: 23kg
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                RR : 56pm
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                Height: 23kg
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                Tempreature : 56pm
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                BMI: 23kg
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                Blood Presure : 56pm
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                BMI Sstatus: 23kg
                                        </Typography>
                                    </Grid>
                                    <Grid item xs='23'>
                                        <Typography className={classes.pos} color="textSecondary">
                                                Paulse : 56pm
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                        </Card>                     
                </Grid>
               
                <Grid item xs='6'>
                
                    <Card className={classes.cardroot} style={{ height: '200px'}}>
                        <CardContent>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            Allergies
                            </Typography>
                                <Grid container spacing={12}>
                                    <Grid item xs='12'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                        <div className={classes.allergiesroot}>
                                           <Chip
                                                label="Pencline"
                                                color="secondary"
                                                variant="outlined"
                                            />
                                            <Chip
                                                label="Nut Shirm"
                                                color="secondary"
                                                variant="outlined"
                                            />
                                            <Chip
                                                label="Deletable secondary"
                                                color="secondary"
                                                variant="outlined"
                                            />
                                            
                                            </div>
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardContent>                      
                    </Card>
                </Grid>
            
                <Grid item xs='6'>
                    <Card className={classes.cardroot} style={{ height: '200px'}}>
                            <CardContent>
                                <Typography className={classes.title} color="primary" gutterBottom>
                                Presenting Complaints
                                </Typography>
                                    <Grid container spacing={12}>
                                        <Grid item xs='12'>
                                            <Typography className={classes.pos} color="textSecondary" >
                                            <FormGroup>
                                            
                                            <Input type="textarea" name="text"  style={{height: '150px' }}/>
                                            </FormGroup>
                                                
                                            </Typography>
                                        </Grid>
                                        
                                    </Grid>                               
                            </CardContent>                      
                        </Card>
                </Grid>
                <Grid item xs='6'>
                <Card className={classes.cardroot} style={{ height: '200px'}}>
                            <CardContent>
                                <Typography className={classes.title} color="primary" gutterBottom>
                                Consultation Notes
                                </Typography>
                                    <Grid container spacing={12}>
                                        <Grid item xs='12'>
                                            <Typography className={classes.pos} color="textSecondary" >
                                            <FormGroup>
                                            
                                            <Input type="textarea" name="text"  style={{height: '150px' }}/>
                                            </FormGroup>
                                            </Typography>
                                        </Grid>
                                        
                                    </Grid>                               
                            </CardContent>                      
                        </Card>
                </Grid>
            </Grid>
          <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<SaveIcon />}
          >
              Save
          </Button>
      </TabPanel>
{/* End of Service Form */}
 {/* Begining of consultation  */}
 <TabPanel value={value} index={2}>
      <Grid container spacing={2}>
                <Grid item xs='12'> 

                </Grid>
        </Grid>
</TabPanel>

      <TabPanel value={value} index={3}>
      <Grid container spacing={2}>
                <Grid item xs='12'> 
                    <Card className={classes.cardroot}>
                            <CardContent>
                                <Typography className={classes.title} color="primary" gutterBottom>
                                    Selected Test Order
                                </Typography>
                                 
                                <Paper className={classes.chiproot}>
                                    {chipData.map(data => {
                                        let icon;

                                        if (data.label === 'React') {
                                        icon = <TagFacesIcon />;
                                        }

                                        return (
                                        <Chip
                                            key={data.key}
                                            icon={icon}
                                            label={data.label}
                                            onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                                            className={classes.chip}
                                        />
                                        );
                                    })}
                                </Paper>                                                                  
                        </CardContent>                      
                    </Card>
                </Grid>
            
                <Grid item xs='12'>
                    <Card className={classes.cardroot}>
                            <CardContent>
                                <Typography className={classes.title} color="primary" gutterBottom>
                                Test Order
                                </Typography>
                                    <Grid container spacing={12}>
                                        <Grid item xs='12'>
                                            <Typography className={classes.pos} color="textSecondary" >
                                            <Autocomplete
                                                id="highlights-demo"
                                                style={{ width: 300 }}
                                                options={top100Films}
                                                getOptionLabel={option => option.title}
                                                renderInput={params => (
                                                    <TextField {...params} label="Lab Test Group" variant="outlined" fullWidth margin="normal" />
                                                )}
                                                renderOption={(option, { inputValue }) => {
                                                    const matches = match(option.title, inputValue);
                                                    const parts = parse(option.title, matches);

                                                    return (
                                                    <div>
                                                        {parts.map((part, index) => (
                                                        <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                                            {part.text}
                                                        </span>
                                                        ))}
                                                    </div>
                                                    );
                                                }}
                                                />   

                                                <br/>
                                                <div className={classes.checkboxroot}>
                                                    <FormControl component="fieldset" className={classes.formControl}>
                                                        <FormLabel component="legend">Assign responsibility</FormLabel>
                                                        <FormGroup>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={gilad} onChange={handleChangecheckbox('gilad')} value="gilad" />}
                                                            label="Gilad Gray"
                                                        />
                                                        <FormControlLabel
                                                            control={<Checkbox checked={jason} onChange={handleChangecheckbox('jason')} value="jason" />}
                                                            label="Jason Killian"
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                            <Checkbox checked={antoine} onChange={handleChangecheckbox('antoine')} value="antoine" />
                                                            }
                                                            label="Antoine Llorca"
                                                        />
                                                        </FormGroup>
                                                        <FormHelperText>Be careful</FormHelperText>
                                                    </FormControl>
                                                    <FormControl required error={error} component="fieldset" className={classes.formControl}>
                                                        <FormLabel component="legend">Pick two</FormLabel>
                                                        <FormGroup>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={gilad} onChange={handleChangecheckbox('gilad')} value="gilad" />}
                                                            label="Gilad Gray"
                                                        />
                                                        <FormControlLabel
                                                            control={<Checkbox checked={jason} onChange={handleChangecheckbox('jason')} value="jason" />}
                                                            label="Jason Killian"
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                            <Checkbox checked={antoine} onChange={handleChangecheckbox('antoine')} value="antoine" />
                                                            }
                                                            label="Antoine Llorca"
                                                        />
                                                        </FormGroup>
                                                        <FormHelperText>You can display an error</FormHelperText>
                                                    </FormControl>
                                                    </div>
                                                
                                            </Typography>
                                        </Grid>
                                        
                                    </Grid>                               
                            </CardContent>                      
                        </Card>

                </Grid>
                
            </Grid>
      </TabPanel>
    {/* End of consultation */}
    <TabPanel value={value} index={4}>
        {/* Card stats */}
        <Row>
                <Col lg={4} >
                  <Card  style={cardStyle} className=" p-3">
                    <CardBody>
                        <Typography className={classes.title} color="primary" gutterBottom>
                                        Drug Order
                        </Typography>
                                <form className={classes.formroot} noValidate autoComplete="off">
                                        
                                        <div>
                                            <TextField
                                            required
                                            id="outlined-required"
                                            label="Enter Drug Name"
                                            defaultValue="Drug Name"
                                            variant="outlined"
                                            />
                                            <TextField
                                            disabled
                                            id="outlined-required"
                                            label="Drug Unit"
                                            defaultValue="Drug Unit"
                                            variant="outlined"
                                            />
                                            <TextField
                                            id="outlined-password-input"
                                            label="Frequency"
                                            autoComplete="current-password"
                                            variant="outlined"
                                            />
                                            <TextField
                                            id="outlined-read-only-input"
                                            label="Start Date"
                                            defaultValue="Start Date"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            />
                                            <TextField
                                            id="outlined-number"
                                            label="Duration"
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            />
                                            <TextField id="outlined-search" label="Duration Unit" type="text" variant="outlined" />
                                            <TextField
                                            id="outlined-helperText"
                                            label="Enter Instruction"
                                            defaultValue="Enter Instruction"
                                            variant="outlined"/>
                                        </div>
                                    </form> 
                                </CardBody>
                              </Card>
                            </Col>
                            <Col lg={8} >
                                <Row>
                                    <Col lg={12} >
                                        <Card  style={cardStyle} >
                                            <CardBody>
                                                <Typography className={classes.title} color="primary" gutterBottom>
                                                        Previous Order
                                                </Typography>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <br/>
                                    <br/>
                                    <Col lg={12} >
                                        <Card  style={cardStyle} >
                                            <CardBody>
                                                <Typography className={classes.title} color="primary" gutterBottom>
                                                        Current Order
                                                </Typography>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>

                            </Col>

                          </Row>

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

            // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
            const top100Films = [
                { title: 'Psycho', year: 1960 },
                { title: 'The Green Mile', year: 1999 },
                { title: 'The Intouchables', year: 2011 },
                { title: 'Modern Times', year: 1936 },
                { title: 'Raiders of the Lost Ark', year: 1981 },
              ];