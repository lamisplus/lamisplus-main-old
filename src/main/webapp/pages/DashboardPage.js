
import React, {  useState, useEffect } from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { FaUserPlus, FaCalendarAlt, FaUserCheck} from 'react-icons/fa'; 
import { MdAirlineSeatIndividualSuite} from 'react-icons/md';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Card,CardBody,CardHeader,CardTitle,Col,Row,} from 'reactstrap';
import { Link } from 'react-router-dom'
import { fetchAllRegisteredPatients } from "./../actions/generalUserDashboard";
import { url } from "../api";
// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';

// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);
const cardStyle = {
  borderColor: '#fff',
  color: '#fff',
  padding: '-10px, 0px'
};



const  DashboardPage = (props) => {
  window.scrollTo(0, 0);
  console.log(props)
  const [genderData, setGenderData] = useState({})
  const [combineChartData, setcombineChartData] = useState({})
  const [birthRateData, setbirthRateData] = useState({})
  const [birthSeries, setBirthSereies] = useState({})
  const [deathRateData, setdeathRateData] = useState({})
  const [deathSeries, setDeathSereies] = useState({})
  const [totalPatients,setTotalPatients] = useState(0)
  const [totalEmergency,setTotalEmergency] = useState(0)
  const [totalCheckin,setTotalCheckin] = useState(0)
  const [totalAppointment,setTotalAppointment] = useState(0)
  useEffect(() => {
    
            props.fetchAllGender();
    }, []); //componentDidMount
  //Total Patients
  useEffect(() => {
    async function getCharacters() {
        try {
            const responsetotalCount = await axios.get( url+ 'patients/totalCount');
                const patientTotalCount = responsetotalCount.data && responsetotalCount.data!==null ? responsetotalCount.data :0;
                setTotalPatients(patientTotalCount && patientTotalCount >0 ? patientTotalCount : 0 ) 
                
        } catch (error) {

        }
      }
      getCharacters();
  }, []);
    //Total emergency
    useEffect(() => {
      async function getCharacters() {
          try {
              const responsevisits = await axios.get( url+ 'visits/count/1');
                  const visitCount = responsevisits.data && responsevisits.data!==null ? responsevisits.data :0;
                  setTotalEmergency(visitCount && visitCount >0 ? visitCount : 0) 
                  
                  
          } catch (error) {}
        }
        getCharacters();
    }, []);
        //Total Checkin
        useEffect(() => {
          async function getCharacters() {
              try {
                  const responsevisitsCheckin = await axios.get( url+ 'visits/count/0');
                      const checkinCounts = responsevisitsCheckin.data && responsevisitsCheckin.data!==null ? responsevisitsCheckin.data :0;
                      setTotalCheckin(checkinCounts && checkinCounts > 0 ? checkinCounts : 0) 
                      
              } catch (error) {}
            }
            getCharacters();
        }, []);
  useEffect(() => {
    async function getCharacters() {
        try {
            const response = await axios.get( url+ 'patient-dashboard/pie');
                const pieChartDashboard = response.data && response.data!==null ? response.data : {};
                //console.log(pieChartDashboard && pieChartDashboard !==null ? pieChartDashboard : {})
                setGenderData(pieChartDashboard && pieChartDashboard !==null ? pieChartDashboard : {})   
        } catch (error) {}
      }
      getCharacters();
}, []); 
// combine chart 
useEffect(() => {
  async function getCharacters() {
      try {
          const response = await axios.get( url+ 'patient-dashboard/column');
              const columnChartDashboard = response.data && response.data!==null ? response.data : {};

              setcombineChartData(columnChartDashboard && columnChartDashboard !==null ? columnChartDashboard : {})  
      } catch (error) {}
    }
    getCharacters();
}, []);
// Total Appointment 
useEffect(() => {
  async function getCharacters() {
      try {
          const response = await axios.get( url+ 'appointments/count');
              const appointCount = response.data && response.data!==null ? response.data :0;
              setTotalAppointment(appointCount && appointCount !==null ? appointCount : 0)  
      } catch (error) {}
    }
    getCharacters();
}, []);
// Birthrate chart 
useEffect(() => {
  async function getCharacters() {
      try {
          const responsebirthRate = await axios.get( url+ 'patient-dashboard/column/birthRate');
              const bithRateChart = responsebirthRate.data && responsebirthRate.data!==null ? responsebirthRate.data : {};
              setbirthRateData(bithRateChart) 
              setBirthSereies(bithRateChart.series && bithRateChart.series!==null ? bithRateChart.series : {})
        
      } catch (error) {}
    }
    getCharacters();
}, []); 
// Death Rate chart 
useEffect(() => {
  async function getCharacters() {
      try {
          const response = await axios.get( url+ 'patient-dashboard/column/deathRate');
              const deathRateChart = response.data && response.data!==null ? response.data : {};
              setdeathRateData(deathRateChart) 
              setDeathSereies(deathRateChart.series && deathRateChart.series!==null ? deathRateChart.series : {})
        
      } catch (error) {}
    }
    getCharacters();
}, []);  

/* Gender Pie Chart */
const genderChart = {
  chart: {
      type:  genderData.type,
      options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
      }
  },
  title: {
      text: genderData.title,
      style:{ "fontSize": "14px" }
  },
  accessibility: {
      point: {
          valueSuffix: '%'
      }
  },
  tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
         
          dataLabels: {
              enabled: true,
              format: '{point.name}'
          },
          showInLegend: true
      }
      
  },
  series: [{
      
      name:  genderData.name,
      data:  genderData.data
  }]
}
/* End of Gender Pie chart */

/* Combine Chart */
const combineChart = {
  chart: {
      type: combineChartData.type
  },
title: {
  text: combineChartData.text,
  style:{ "fontSize": "14px" }
},
xAxis: combineChartData.xAxis,
labels: {
  items: [{
      html: combineChartData.name,
      style: {
          left: '50px',
          top: '2px',
          color: ( // theme
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color
          ) || 'black'
      }
  }]
},
series: combineChartData.series
};

/* End of Combine chart */

/* BirthRate Chart */
const birthChart = {

  chart: {
    type: birthRateData.type,
    options3d: {
        enabled: true,
        alpha: 10,
        beta: 25,
        depth: 70
    }
  },
  title: {
    text: birthRateData.text,
    style:{ "fontSize": "14px" }
  },
 
  plotOptions: {
    column: {
        depth: 25
    }
  },
  xAxis: {
    categories: Highcharts.getOptions().lang.shortMonths,
    labels: {
        skew3d: true,
        style: {
            fontSize: '16px'
        }
    }
  },
  yAxis: {
    title: {
        text: null
    }
  },
  
  series: [{
    name: birthSeries.name,
    data: []
  }]
  };
/* End of BirthRate Chart */


/* DEATH Rate Chart */
const deathChart = {

  chart: {
    type: deathRateData.type,
    options3d: {
        enabled: true,
        alpha: 10,
        beta: 25,
        depth: 70
    }
  },
  title: {
    text: deathRateData.text,
    style:{ "fontSize": "14px" }
  },

  plotOptions: {
    column: {
        depth: 25
    }
  },
  xAxis: {
    categories: Highcharts.getOptions().lang.shortMonths,
    labels: {
        skew3d: true,
        style: {
            fontSize: '16px'
        }
    }
  },
  yAxis: {
    title: {
        text: null
    }
  },
  
  series: [{
    name: deathSeries.name,
    data: []
  }]
  };
/* End of Death Rate Chart */


  return (
      <>
               {/* Card stats */}
            <Row className={"p-3"}>
              
                <Col lg={3} md={6} sm={6} xs={12} >
                  <Card  className="card-stats mb-4 mb-xl-0 " style={{backgroundColor: '#FFBF43', color: '#fff',  boxShadow: '1px 2px #eee'}}>
                    <CardBody >
                      <Row >
                      <Link
                        to={{pathname: "/patients"}}
                        style={{ cursor: "pointer",  }}>
                        <div className="col">
                          <CardTitle
                           tag="h6"
                            className=" text-uppercase text-muted mb-0" 
                            style={{ color: 'white'}}
                          >
                              <div className="icon icon-shape   " style={{ color: 'white'}}>
                              <FaUserPlus size={10} className={"text-primary"}/> Patients
                              </div>

                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0" style={{ color: 'white'}}>
                            {Number.isInteger(totalPatients) ===true ? totalPatients : 0}
                          </span>
                        </div>
                        
                        </Link>
                      </Row>
                      <p className="mt-1 mb-0 text-muted text-sm">
                        
                        <span className="text-nowrap" style={{ color: 'white'}}>This month</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 "  style={{backgroundColor: '#E27D5F', color: '#fff'}}>
                    <CardBody>
                      <Row>
                        <Link
                          to={{pathname: "/"}}
                          style={{ cursor: "pointer",  }}>
                        <div className="col">
                          <CardTitle
                            tag="h6"
                            className="text-uppercase text-muted mb-0"
                            style={{ color: 'white'}}
                          >
                                <div className="icon icon-shape " style={{ color: 'white'}}>
                                <MdAirlineSeatIndividualSuite className={" text-danger"} size={13} /> Emergency
                                </div>

                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0" style={{ color: 'white' }}>
                          {Number.isInteger(totalEmergency) ===true ? totalEmergency : 0}
                            
                          </span>
                        </div>
                       
                        </Link>
                      </Row>
                      <p className="mt-1 mb-0 text-muted text-sm">
                       {" "}
                        <span className="text-nowrap" style={{ color: 'white'}}>This week</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 " style={{backgroundColor: '#7DC2AF', color: '#fff'}}>
                    <CardBody>
                      <Row>
                        <Link
                        to={{pathname: "/patients"}}
                        style={{ cursor: "pointer",  }}>
                        <div className="col">
                          <CardTitle
                            tag="h6"
                            className="text-uppercase text-muted mb-0"
                            style={{ color: 'white'}}
                          >
                                <div className="icon icon-shape  " style={{ color: 'white'}}>
                                  <FaUserCheck className="text-black" size={10} />  Checked In
                                </div>

                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0" style={{ color: 'white'}}>
                          
                          {Number.isInteger(totalCheckin) ===true ? totalCheckin : 0}
                          </span>
                        </div>
                        
                        </Link>
                      </Row>
                      <p className="mt-1 mb-0 text-muted text-sm">
                        {" "}
                        <span className="text-nowrap" style={{ color: 'white'}}>As at Today</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card style={cardStyle} className="card-stats mb-4 mb-xl-0  " style={{backgroundColor: '#05396B', color: '#fff'}}>
                    <CardBody style={{ color: 'white'}}>
                      <Row>
                      <Link
                        to={{pathname: "/appointments"}}
                        style={{ cursor: "pointer",  }}>
                        <div className="col">
                          <CardTitle
                            tag="h6"
                            className="text-uppercase text-muted mb-0"
                           
                          >

                                  <div className="icon icon-shape" style={{ color: 'white'}}>
                                      <FaCalendarAlt className=" text-warning" size={10} />   Appointments
                                  </div>


                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                          {Number.isInteger(totalAppointment) ===true ? totalAppointment : 0}
                          
                          </span>
                        </div>

                        </Link>
                      </Row>
                      <p className="mt-1 mb-0 text-muted text-sm" style={{ color: 'white'}}>
                        {" "}
                        <span className="text-nowrap" style={{ color: 'white'}}>As at Today</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
          </Row>

          <Row className={"pl-3 pr-3 "}>
      
          
          <Col md="6" sm="12" xs="12" xl="6" lg="6" className={"pb-1"}>
            <Card>
             
              <CardBody>
                <div>
                    <HighchartsReact options={genderChart} />
                </div> 
              </CardBody>
            </Card>
          </Col>
          <Col md="6" sm="12" xs="12" xl="6" lg="6">
            <Card>
             
              <CardBody>
                <div>
                    <HighchartsReact options={combineChart} />
                </div>
              
              </CardBody>
            </Card>
          </Col>

          <Col md="6" sm="12" xs="12" xl="6" lg="6">
            <Card>
             
              <CardBody>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={deathChart}
                />
                
              </CardBody>
            </Card>
          </Col>

          <Col md="6" sm="12" xs="12" xl="6" lg="6">
            <Card>
              
              <CardBody>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={birthChart}
                />
              
              </CardBody>
            </Card>
          </Col>
        </Row>
       
      </>
  ); 
}

//export default DashboardPage;

const mapStateToProps = state => {
  return {
      genderPieChartList: state.generalUsersDashboardModuleReducer.list
  };
};
const mapActionToProps = {
  fetchAllGender: fetchAllRegisteredPatients
};

export default connect(mapStateToProps, mapActionToProps)(DashboardPage);
