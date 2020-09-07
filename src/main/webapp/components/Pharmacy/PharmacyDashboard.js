import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { MdDashboard, MdContacts } from 'react-icons/md';
import {Card, CardBody, CardDeck, CardHeader} from 'reactstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { getColor } from 'utils/colors';
import { randomNum } from 'utils/demos';
import UserProgressTable from 'components/UserProgressTable';
import PatientSearch from './PatientSearch';
import { fetchPrescriptions } from "../../actions/pharmacy";
import { connect } from 'react-redux'

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
        margin: theme.spacing(7),
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
        cardContent: {
            padding: 2,
        },
        cardroot: {
            margin: theme.spacing(1),
            height: 250 + 'px !important',
        }

    },
    alertmsge: {
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
        labels: ['Paracetamol', 'Chloroquine', 'Panadol', 'Ampiclox', 'Flagyl'],
    };
};
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const genLineData = (moreData = {}, moreData2 = {}) => {
    return {
        labels: MONTHS,
        datasets: [
            {
                label: 'Pending',
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
                label: 'Dispensed',
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

const ScrollableTabsButtonForce = (props) => {
    useEffect(() => {
      props.fetchPrescriptions();
    }, []);
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    
    return (
      <div className={classes.root}>
        <div className={classes.inforoot}>
          {/* <PatientDetailCard getpatientdetails={props.location.state }/>    */}
        </div>

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
              label="Dashboard"
              icon={<MdDashboard />}
              {...a11yProps(0)}
            />
            <Tab
              className={classes.title}
              label="Prescriptions"
              icon={<MdContacts />}
              {...a11yProps(1)}
            />
            {/* <Tab
              className={classes.title}
              label="Dispensed Prescription"
              icon={<FaBriefcaseMedical />}
              {...a11yProps(2)}
            /> */}
          </Tabs>
          <div></div>
        </AppBar>

        <TabPanel value={value} index={0}>
          <CardDeck>
            <Card>
              <CardHeader> Most Commonly Prescribed Drugs</CardHeader>
              <CardBody>
                <Pie data={genPieData()} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader> Total Monthly Prescriptions</CardHeader>
              <CardBody>
                <Bar data={genLineData()} />
              </CardBody>
            </Card>
          </CardDeck>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card>
                <CardHeader> Recent Dispensed Orders</CardHeader>

                <CardBody>
                  <UserProgressTable
                    headers={["name"]}
                    usersData={userProgressTableData}
                  />
                </CardBody>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardHeader> Recent Pending Orders</CardHeader>

                <CardBody>
                  <UserProgressTable
                    headers={["name"]}
                    usersData={userProgressTableData}
                  />
                </CardBody>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PatientSearch />
        </TabPanel>

        <TabPanel value={value} index={3}></TabPanel>
        <TabPanel value={value} index={4}></TabPanel>
        <TabPanel value={value} index={5}>
          <Grid container spacing={7}>
            <Grid item xs="7">
              <Card>
                <CardBody>
                  <Typography
                    className={classes.title}
                    color="primary"
                    gutterBottom
                  ></Typography>
                  <Grid>
                    <Grid item xs={6}>
                      <Typography className={classes.pos} color="textSecondary">
                        Pulse : <span style={{ fontSize: "bold" }}>56pm</span>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardBody>
              </Card>
            </Grid>

            <Grid item xs="5">
              <Card>
                <CardBody>
                  <Typography
                    className={classes.title}
                    color="primary"
                    gutterBottom
                  >
                    Drug Order
                  </Typography>
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.pos} color="textSecondary">
                        Pulse : <span style={{ fontSize: "bold" }}>56pm</span>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardBody>
              </Card>
            </Grid>
            <br />
            <Grid item xs="7">
              <Card>
                <CardBody>
                  <Typography
                    className={classes.title}
                    color="primary"
                    gutterBottom
                  >
                    Drug Order
                  </Typography>
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.pos} color="textSecondary">
                        Pulse : <span style={{ fontSize: "bold" }}>56pm</span>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardBody>
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

const mapStateToProps = state => ({
  patients: state.pharmacy.allPrescriptions
});

export default connect(mapStateToProps , { fetchPrescriptions })(ScrollableTabsButtonForce);