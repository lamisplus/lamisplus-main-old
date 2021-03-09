import React, { useState, useEffect } from "react";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {Card, CardBody, CardDeck, CardHeader } from 'reactstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { url } from "../../api";


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
  



export default function LaboratoryDashBoard(props) {
    const classes = useStyles();
    const [testOrderGroupData, settestOrderGroupData] = useState({})
    const [testOrdersStackChart, settestOrdersStackChart] = useState({})
    const [limsBarChart, setlimsBarChart] = useState({})
    // APi request for Pie chart
        useEffect(() => {
            async function getCharacters() {
                try {
                    const response = await axios.get( url+ 'laboratory-dashboard/pie');
                    //console.log(response)
                    const body = response.data && response.data!==null ? response.data : {}; 
                    settestOrderGroupData(body)
                        
                } catch (error) {}
            }
            getCharacters();
        }, []);  
    // API request for stack bar chart    
        useEffect(() => {
            async function getCharacters() {
                try {
                    const response = await axios.get( url+ 'laboratory-dashboard/column/testOrders');
                   
                    const body = response.data && response.data!==null ? response.data : {}; 
                    settestOrdersStackChart(body)
                        
                } catch (error) {}
            }
            getCharacters();
        }, []); 
    
console.log(testOrderGroupData)
console.log(testOrdersStackChart)
const testGroup = {

    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: testOrderGroupData.type
    },
    title: {
        text: ''
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
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: '',
        colorByPoint: true,
        data: testOrderGroupData.data
    }]
   
  }


  const testOrders =  {

    chart: {
        type: testOrdersStackChart.type
    },
  
    title: {
        text: testOrdersStackChart.subTitle
    },
  
    xAxis: testOrdersStackChart.xAxis,
  
    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: testOrdersStackChart.text
        }
    },
  
    tooltip: {
        formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y + '<br/>' +
                'Total: ' + this.point.stackTotal;
        }
    },
  
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
  
    series: testOrdersStackChart.series
  
  };

  const lamisChart = {
    chart: {
        type: limsBarChart.type
    },
    title: {
        text: limsBarChart.text
    },
    xAxis: limsBarChart.xAxis,
    labels: {
        items: [{
            html: '',
            style: {
                left: '50px',
                top: '18px',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'black'
            }
        }]
    },
    series: limsBarChart.series
}

    return (
        <div className={classes.root}>
             
                <CardDeck>
                    <Card >
                        <CardHeader> Radiology Test  Chart for the past 3months</CardHeader>
                            <CardBody>
                                <div>
                                    <HighchartsReact options={testGroup} />
                                </div>                     
                            </CardBody>                      
                    </Card>
                    <Card >
                        <CardHeader> Radiology Test  Results for 6months</CardHeader>
                            <CardBody>
                                <div>
                                    <HighchartsReact options={testOrders} />
                                </div>                       
                            </CardBody>                      
                    </Card>
                </CardDeck>
                    <br/><br/>
                

           
        </div>
    );
}

