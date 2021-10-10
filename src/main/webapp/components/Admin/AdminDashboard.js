import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
    Card,
    CardBody, CardDeck,  CardGroup,
} from 'reactstrap';
import { IconWidget } from 'components/Widget';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { url } from "../../api";
import axios from 'axios';
import {basicColumn} from './AdminDashboardVisualisation/FacilitySync';
import {Sms} from './AdminDashboardVisualisation/NumOfSms';
import {
    MdPersonPin,
    MdPeople,
    MdShowChart,
    MdDelete
  } from 'react-icons/md';


// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);

function AdminDashboard(props) {

    const [testOrderGroupData, settestOrderGroupData] = useState({})
    const [testOrdersStackChart, settestOrdersStackChart] = useState({})
    const [limsBarChart, setlimsBarChart] = useState({})
    const [TotalLoginUser, setTotalLoginUser] = useState(0)
    // APi request for Pie chart
        useEffect(() => {
            async function getCharacters() {
                try {
                    const response = await axios.get( url+ 'laboratory-dashboard/pie');
                    const body = response.data && response.data!==null ? response.data : {}; 
                    settestOrderGroupData(body)
                        
                } catch (error) {}
            }
            getCharacters();
        }, []);  
    //API TO GET TOTAL LOGIN USER 
    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get( url+ 'users/loggedInCount');
                    const loggedInCount = response.data && response.data!==null ? response.data :0;
                    setTotalLoginUser(loggedInCount) 
                    console.log(loggedInCount)
            } catch (error) {
    
            }
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
    // API request for LIMS BAR CHART   
    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get( url+ 'laboratory-dashboard/column/lims');
                const body = response.data && response.data!==null ? response.data : {}; 
                setlimsBarChart(body)
                    
            } catch (error) {}
        }
        getCharacters();
    }, []); 

// Test Group Pie Chart 

const testGroup = {

    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: testOrderGroupData.type
    },
    title: {
        text: 'LABORATORY TEST GROUP ANALYSIS FOR THE PAST 6'
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
        name: 'Test Group',
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

  const sync = {
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
        <React.Fragment>

<CardGroup style={{ marginBottom: '1rem' }}>
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdDelete}
            title="0"
            subtitle="Archive Records"
          />
          <IconWidget
            bgColor="success"
            inverse={false}
            icon={MdPersonPin}
            title="0"
            subtitle="Active Users"
          />
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdPeople}
            title={TotalLoginUser}
            subtitle="Login Users"
          />
          <IconWidget
            bgColor="primary"
            inverse={false}
            icon={MdShowChart}
            title="0"
            subtitle="Facilities"
          />
        </CardGroup>
            <Card>
                <CardBody>
            {/* <Statistic.Group widths='four'  size='mini'>
                <Statistic>
                    <Statistic.Value> <Icon name='trash alternate outline' />22</Statistic.Value>
                    <Statistic.Label>Achieved Records</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>
                        <Icon name='user outline' />
                        144
                    </Statistic.Value>
                    <Statistic.Label>Active Users</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>
                        <Icon name='wpforms' />5
                    </Statistic.Value>
                    <Statistic.Label>Login Users</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value >
                        <Icon name='chart bar' />  42
                    </Statistic.Value>
                    <Statistic.Label>Facilities</Statistic.Label>
                </Statistic>
            </Statistic.Group> */}
                </CardBody>
            </Card>
            <br></br>
            <CardDeck>
                <Card >
                  
                    <CardBody>
                        <div>
                           
                            <HighchartsReact options={basicColumn} />
                        </div> 
                    </CardBody>
                </Card>
                <Card >
                  
                    <CardBody>
                    <div>
                        <HighchartsReact
                       
                        options={Sms}
                        />
                    </div>
                    </CardBody>
                </Card>
            </CardDeck>
        </React.Fragment>
    );

}
const mapStateToProps = (state) => {
    return {
        patient: state.patients.patient,
    }
}

const mapActionToProps = {
}


export default connect(mapStateToProps, mapActionToProps)(AdminDashboard)