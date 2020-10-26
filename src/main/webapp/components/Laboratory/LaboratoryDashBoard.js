import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
// {/* Auto textfield complete */}
import {MdDashboard,MdContacts} from 'react-icons/md';
import {GiFiles} from 'react-icons/gi';  
import {Card, CardBody, CardDeck, CardHeader } from 'reactstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { getColor } from 'utils/colors';
import { randomNum } from 'utils/demos';
import UserProgressTable from 'components/UserProgressTable';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {testGroup}  from './DashBoard/Visualisations/TestGroupChart';
import {testOrders} from './DashBoard/Visualisations/TestOrdersChart';
import {lamisChart} from './DashBoard/Visualisations/Limschart';



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
    iconColor: {
        color : '#fff'
    }
    }));

    const cardHeight = {
        height: 200, 
        position: 'relative',
        overflow: 'auto',
    };
  


  const userProgressTableData = 
      [
  
          {name: 'Total Sample Dispatached'},
          {name: 'Total Sample Results'},
          {name: 'Total Sample Rejected'}
  
      ];

export default function LaboratoryDashBoard(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
             
                <CardDeck>
                    <Card >
                        <CardHeader> Laboratory Test Group Analysis</CardHeader>
                            <CardBody>
                                <div>
                                    <HighchartsReact options={testGroup} />
                                </div>                     
                            </CardBody>                      
                    </Card>
                    <Card >
                        <CardHeader> Laboratory Test Order/ Result</CardHeader>
                            <CardBody>
                                <div>
                                    <HighchartsReact options={testOrders} />
                                </div>                       
                            </CardBody>                      
                    </Card>
                </CardDeck>
                    <br/><br/>
                <Grid container spacing={2}>
                    <Grid item xs='8' >                    
                        <Card  >
                            <CardHeader> LIMS Chart Analysis</CardHeader>
                                <CardBody>
                                    <div>
                                        <HighchartsReact options={lamisChart} />
                                    </div> 
                                    
                                </CardBody>                      
                        </Card>   
                    </Grid>
                  <Grid item xs='4'>
                      <Card  >
                          <CardHeader> Recent LIMS Analysis for the past 7days</CardHeader>
                              <CardBody>
                                  <UserProgressTable
                                      headers={['' ]}
                                      usersData={userProgressTableData}
                                  />
                              </CardBody>                      
                      </Card>  
                  </Grid>
                    
                </Grid> 

           
        </div>
    );
}

