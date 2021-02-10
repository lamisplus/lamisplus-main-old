import Page from 'components/Page';
import React, {  useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { connect } from "react-redux";
import { FaUserPlus, FaCalendarAlt, FaUserCheck} from 'react-icons/fa'; 
import { MdAirlineSeatIndividualSuite} from 'react-icons/md';
import { Line } from 'react-chartjs-2';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Card,CardBody,CardHeader,CardTitle,Col,Row,} from 'reactstrap';
//import {genderChart} from './DashBoardVisualisation/GenderChart';
//import {combineChart} from './DashBoardVisualisation/CombineChart'
import CustomHighMap from './map';
import {deathChart} from './DashBoardVisualisation/DeathChart';
import { Link } from 'react-router-dom'
import { fetchAllRegisteredPatients } from "./../actions/generalUserDashboard";
import { url } from "../api";


const cardStyle = {
  borderColor: '#fff',
};



const  DashboardPage = (props) => {
  window.scrollTo(0, 0);
  const [genderData, setGenderData] = useState({})
  const [combineChartData, setcombineChartData] = useState({})
  const [birthRateData, setbirthRateData] = useState({})
  const [birthSeries, setBirthSereies] = useState({})
  const [deathRateData, setdeathRateData] = useState({})
  const [deathSeries, setDeathSereies] = useState({})
  const [totalPatients,setTotalPatients] = useState()
  const [totalAppointment,setTotalAppointment] = useState(21)
  useEffect(() => {
    
            props.fetchAllGender();
    }, []); //componentDidMount
  //Total Patients
  useEffect(() => {
    async function getCharacters() {
        try {
            const response = await axios.get( url+ 'patients/totalCount');
                const body2 = response.data && response.data!==null ? response.data :0.00;
                setTotalPatients(body2) 
                
        } catch (error) {}
      }
      getCharacters();
  }, []);
    //Total Appointment
    useEffect(() => {
      async function getCharacters() {
          try {
              const response = await axios.get( url+ 'visits/totalCount/');
                  const body2 = response.data && response.data!==null ? response.data :0.00;
                  setTotalAppointment(body2) 
                  
          } catch (error) {}
        }
        getCharacters();
    }, []);
  useEffect(() => {
    async function getCharacters() {
        try {
            const response = await axios.get( url+ 'patient-dashboard/pie');
                const body = response.data && response.data!==null ? response.data : {};
                
                setGenderData(body)   
        } catch (error) {}
      }
      getCharacters();
}, []); 
// combine chart 
useEffect(() => {
  async function getCharacters() {
      try {
          const response = await axios.get( url+ 'patient-dashboard/column');
              const body = response.data && response.data!==null ? response.data : {};
              setcombineChartData(body)  
      } catch (error) {}
    }
    getCharacters();
}, []);
// Birthrate chart 
useEffect(() => {
  async function getCharacters() {
      try {
          const response = await axios.get( url+ 'patient-dashboard/column/birthRate');
              const body2 = response.data && response.data!==null ? response.data : {};
              setbirthRateData(body2) 
              setBirthSereies(body2.series && body2.series!==null ? body2.series : {})
        
      } catch (error) {}
    }
    getCharacters();
}, []); 
// Death Rate chart 
useEffect(() => {
  async function getCharacters() {
      try {
          const response = await axios.get( url+ 'patient-dashboard/column/deathRate');
              const body2 = response.data && response.data!==null ? response.data : {};
              setdeathRateData(body2) 
              setDeathSereies(body2.series && body2.series!==null ? body2.series : {})
        
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
      text: ''
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
          depth: 35,
          dataLabels: {
              enabled: true,
              format: '{point.name}'
          }
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
  text: ""
},
xAxis: combineChartData.xAxis,
labels: {
  items: [{
      html: 'Total Appointment , Attendance and Emergencies',
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
    text: birthRateData.text
  },
  subtitle: {
    text: birthRateData.text
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
    data: birthSeries.data
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
    text: deathRateData.text
  },
  subtitle: {
    text: deathRateData.text
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
    data: deathSeries.data
  }]
  };
/* End of Death Rate Chart */


  return (
      <>
               {/* Card stats */}
               <Row className={"p-3"}>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card  style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3">
                    <CardBody>
                      <Row>
                      <Link
                        to={{pathname: "/patients"}}
                        style={{ cursor: "pointer",  }}>
                        <div className="col">
                          <CardTitle
                           tag="h6"
                            className=" text-uppercase text-muted mb-0" 
                          >
                              <div className="icon icon-shape   " >
                              <FaUserPlus size={10} className={"text-primary"}/> Patients
                              </div>

                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {totalPatients}
                          </span>
                        </div>
                        {/*<Col className="col-auto">*/}
                        {/*  <div className="icon icon-shape  text-primary " >*/}
                        {/*    <FaUserPlus size={10} />*/}
                        {/*  </div>*/}
                        {/*</Col>*/}
                        </Link>
                      </Row>
                      <p className="mt-1 mb-0 text-muted text-sm">
                        
                        <span className="text-nowrap">This month</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3">
                    <CardBody>
                      <Row>
                        <Link
                          to={{pathname: "/"}}
                          style={{ cursor: "pointer",  }}>
                        <div className="col">
                          <CardTitle
                            tag="h6"
                            className="text-uppercase text-muted mb-0"
                          >
                                <div className="icon icon-shape ">
                                <MdAirlineSeatIndividualSuite className={" text-danger"} size={13} /> Emergency
                                </div>

                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            22
                          </span>
                        </div>
                        {/*<Col className="col-auto">*/}
                        {/*  <div className="icon icon-shape  text-danger">*/}
                        {/*  <MdAirlineSeatIndividualSuite size={10} />*/}
                        {/*  </div>*/}
                        {/*</Col>*/}
                        </Link>
                      </Row>
                      <p className="mt-1 mb-0 text-muted text-sm">
                       {" "}
                        <span className="text-nowrap">This week</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3">
                    <CardBody>
                      <Row>
                        <Link
                        to={{pathname: "/patients"}}
                        style={{ cursor: "pointer",  }}>
                        <div className="col">
                          <CardTitle
                            tag="h6"
                            className="text-uppercase text-muted mb-0"
                          >
                                <div className="icon icon-shape  ">
                                  <FaUserCheck className="text-black" size={10} />  Checked In
                                </div>

                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">924</span>
                        </div>
                        {/*<Col className="col-auto">*/}
                        {/*  <div className="icon icon-shape text-black ">*/}
                        {/*    <FaUserCheck size={10} />*/}
                        {/*  </div>*/}
                        {/*</Col>*/}
                        </Link>
                      </Row>
                      <p className="mt-1 mb-0 text-muted text-sm">
                        {" "}
                        <span className="text-nowrap">As at Today</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3 ">
                    <CardBody>
                      <Row>
                      <Link
                        to={{pathname: "/appointments"}}
                        style={{ cursor: "pointer",  }}>
                        <div className="col">
                          <CardTitle
                            tag="h6"
                            className="text-uppercase text-muted mb-0"
                          >

                                  <div className="icon icon-shape">
                                      <FaCalendarAlt className=" text-warning" size={10} />   Appointments
                                  </div>


                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {totalAppointment}
                          </span>
                        </div>

                        </Link>
                      </Row>
                      <p className="mt-1 mb-0 text-muted text-sm">
                        {" "}
                        <span className="text-nowrap">As at Today</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

          <Row className={"pl-3 pr-3 "}>
      
          
          <Col md="6" sm="12" xs="12" xl="6" lg="6" className={"pb-1"}>
            <Card>
              <CardHeader>Total Registered Patients (Male, Female and Pediatric)  {' '}
              
                <small className="text-muted text-capitalize">In the last 4 Months</small>
              </CardHeader>
              <CardBody>
                <div>
                    <HighchartsReact options={genderChart} />
                </div> 
              </CardBody>
            </Card>
          </Col>
          <Col md="6" sm="12" xs="12" xl="6" lg="6">
            <Card>
              <CardHeader>Total Appointment , Attendance and Emergencies</CardHeader>
              <CardBody>
                <div>
                    <HighchartsReact options={combineChart} />
                </div>
              
              </CardBody>
            </Card>
          </Col>

          <Col md="6" sm="12" xs="12" xl="6" lg="6">
            <Card>
              <CardHeader></CardHeader>
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
              <CardHeader></CardHeader>
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
