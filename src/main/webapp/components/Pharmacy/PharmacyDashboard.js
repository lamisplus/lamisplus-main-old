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
import PatientSearch from './PatientSearch';
import { fetchPrescriptions } from "../../actions/pharmacy";
import { connect } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
//import {drugChart} from './DashBoard/Visualisation/DrugChart';
//import {basicColumn} from './DashBoard/Visualisation/DrugChartBar';
import { url } from "../../api";
import axios from 'axios';
import {getQueryParams} from "components/Utils/PageUtils";

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



const ScrollableTabsButtonForce = (props) => {
    useEffect(() => {
      props.fetchPrescriptions();
    }, []);
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const urlIndex = getQueryParams("tab", props.location.search); 
  const urlTabs = urlIndex !== null ? urlIndex : props.location.state ;
  useEffect ( () => {
    switch(urlTabs){  
      case "prescription": return setValue(1)
      default: return setValue(0)
    }
  }, [urlIndex]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [drugPieChart, setdrugPieChart] = useState({})
    const [drugBarChart, setdrugBarChart] = useState({})

    // APi request for Pie chart
      useEffect(() => {
          async function getCharacters() {
              try {
                  const response = await axios.get( url+ 'pharmacy-dashboard/pie');
                  const body = response.data && response.data!==null ? response.data : {}; 
                  setdrugPieChart(body)                         
              } catch (error) {}
          }
          getCharacters();
      }, []); 
     // APi request for Bar chart
     useEffect(() => {
      async function getCharacters() {
          try {
              const response = await axios.get( url+ 'pharmacy-dashboard/column');
              const body2 = response.data && response.data!==null ? response.data : {}; 
              setdrugBarChart(body2)                         
          } catch (error) {}
      }
      getCharacters();
    }, []);
    console.log(drugBarChart.categories)
    /// This is for the Pie Chart
    const drugChart = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            type: drugPieChart.type
        },
        title: {
            text: 'Drug<br>Chart<br>',
            align: 'center',
            verticalAlign: 'middle',
            y: 60
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '110%'
            }
        },
        series: [{
            name: drugPieChart.name,
            innerSize: '50%',
            data: drugPieChart.data
        }]
        }
    // This is for the BAR chart
        const basicColumn = {
          chart: {
              type: drugBarChart.type
          },
          title: {
              text: drugBarChart.text
          },
          subtitle: {
              text: drugBarChart.subtitle
          },
          xAxis: drugBarChart.xAxis,
          yAxis: {
              min: 0,
              title: {
                  text: ' '
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: drugBarChart.series
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
          </Tabs>
          <div></div>
        </AppBar>

        <TabPanel value={value} index={0}>
          <CardDeck>
            <Card>
              <CardHeader> Total Prescriptions and Dispensed Drugs in last 7days</CardHeader>
              <CardBody>
                <div>
                    <HighchartsReact options={drugChart} />
                </div> 
              </CardBody>
            </Card>
            <Card>
              <CardHeader> Total Drug Prescriptions and Dispensed</CardHeader>
              <CardBody>
                <div>
                    <HighchartsReact options={basicColumn} />
                </div> 
              
              </CardBody>
            </Card>
          </CardDeck>
          <br />
          <br />

        </TabPanel>
        <TabPanel value={value} index={1}>
          <PatientSearch />
        </TabPanel>

      </div>
    );
}

const mapStateToProps = state => ({
  patients: state.pharmacy.allPrescriptions
});

export default connect(mapStateToProps , { fetchPrescriptions })(ScrollableTabsButtonForce);