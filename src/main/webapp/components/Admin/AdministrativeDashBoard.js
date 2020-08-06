import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {
    MdDashboard,
    MdContacts
  } from 'react-icons/md';
import {GiFiles} from 'react-icons/gi';  
import { 
  Card, CardBody, CardDeck, CardHeader } from 'reactstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { getColor } from 'utils/colors';
import { randomNum } from 'utils/demos';
import UserProgressTable from 'components/UserProgressTable';
// import LabTestOrderSearch from './Testorders/LabTestOrderSearch';
// import LabTestResultSearch from './TestResult/LabTestResultSearch';
// import LabTestVerifySampleSearch from './Sampleverifications/LabTestVerifySampleSearch'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';

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


const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);
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
  

    const genPieData = () => {
      return {
        datasets: [
          {
            data: [randomNum(), randomNum(), randomNum(), randomNum(), randomNum()],
            backgroundColor: [
              getColor('primary'),
              getColor('secondary'),
              getColor('success'),
              getColor('info'),
              getColor('danger'),
            ],
            label: 'Test Order',
          },
        ],
        labels: ['Chemistry', 'Haematology', 'Microbiology', 'Virology', 'Biochemistry'],
      };
    };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const genLineData = (moreData = {}, moreData2 = {}) => {
  return {
    labels: MONTHS,
    datasets: [
      {
        label: 'Test Order',
        backgroundColor: getColor('primary'),
        borderColor: getColor('primary'),
        borderWidth: 1,
        data: [
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),
        ],
        ...moreData,
      },
      {
        label: 'Test Result',
        backgroundColor: getColor('secondary'),
        borderColor: getColor('secondary'),
        borderWidth: 1,
        data: [
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),
        ],
        ...moreData2,
      },
    ],
  };
};

const userProgressTableData = [
  {

    name: 'Tom Suliman'

  },
  {
    name: 'Jenny Alex'
  },
  {
    name: 'Simi Adedeji'
  },
  {
    
    name: 'Christine Ada'
  }
  
];

export default function ScrollableTabsButtonForce(props) {
  //console.log(props)
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(value)
  };
//drop downmenu
const [anchorEl, setAnchorEl] = React.useState(null);

const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleClose = () => {
  setAnchorEl(null);
};



  return (
    <div className={classes.root}>
       
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
          <Tab className={classes.title} label="User and Role Mangement" 
          icon={<MdContacts />} {...a11yProps(1)} 
          aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
          />
          <Tab className={classes.title} label="Configurations " icon={<GiFiles />} {...a11yProps(2)} />
          <Tab className={classes.title} label="Form Builder" icon={<GiFiles />} {...a11yProps(3)} />
        </Tabs>
        <div>
     
    </div>
      </AppBar>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Manage User" />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <DraftsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Manage Role" />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <InboxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="User Permision" />
        </StyledMenuItem>
      </StyledMenu>

      {/* The DashBoad Tab  */}
      <TabPanel value={value} index={0}>
      <CardDeck>
                <Card >
                    
                    <CardHeader> Laboratory Test Group Analysis</CardHeader>
                        <CardBody>
                        
                        <Pie data={genPieData()} />                      
                        </CardBody>                      
                        </Card>
                        <Card >
                        <CardHeader> Laboratory Test Order/ Result</CardHeader>
                            <CardBody>
                            <Bar data={genLineData()} />                     
                            </CardBody>                      
                    </Card>
                   
      </CardDeck>
      <br/><br/>
      <Grid container spacing={2}>
                <Grid item xs='6' >                    
                  <Card  >
                      <CardHeader> Recent Lab. Test Order</CardHeader>
                          
                        <CardBody>
                            <UserProgressTable
                                headers={[
                                  'name'  
                                ]}
                                usersData={userProgressTableData}
                            />
                        </CardBody>                      
                  </Card>   
                </Grid>
                <Grid item xs='6'>
                    <Card  >
                        <CardHeader> Recent Lab. Test Result</CardHeader>
                            
                        <CardBody>
                            <UserProgressTable
                                headers={[
                                  'name'  
                                ]}
                                usersData={userProgressTableData}
                            />
                      </CardBody>                      
                  </Card>  
                </Grid>
                
            </Grid> 

</TabPanel>
    {/* End of dashboard */}

{/* Begining of Service Form  */}
<TabPanel value={value} index={1} >
    
</TabPanel>     
 {/* Begining of consultation  */}
 <TabPanel value={value} index={2}>
          
</TabPanel>
<TabPanel value={value} index={3}>      
   
           
</TabPanel>

    {/* End of consultation */}
    <TabPanel value={value} index={4}>
        {/* Card stats */}
       
      </TabPanel>
      <TabPanel value={value} index={5}>
      <Grid container spacing={7} > 
                <Grid item xs='7'>                    
                    <Card >
                        <CardBody>
                            <Typography className={classes.title} color="primary" gutterBottom>
                            
                            </Typography>
                                <Grid >
                                    <Grid item xs='6'>
                                        <Typography className={classes.pos} color="textSecondary" >
                                                Pulse : <span style={{fontSize: 'bold'}}>56pm</span>
                                               
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>                               
                        </CardBody>                      
                        </Card>                     
                </Grid>
                
                <Grid item xs='5'>                    
                    <Card >
                        <CardBody>
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
                        </CardBody>                      
                        </Card>                     
                </Grid>
                <br/>
                <Grid item xs='7'>                    
                    <Card >
                        <CardBody>
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
                        </CardBody>                      
                        </Card>                     
                </Grid>
             
            
            </Grid>
      </TabPanel>

    </div>
  );
}

