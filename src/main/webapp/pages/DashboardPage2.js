// import React, { useState, useEffect } from 'react';
// import { TabContent, TabPane, Nav, NavItem, NavLink, Card } from 'reactstrap';
// import classnames from 'classnames';
// import axios from 'axios';
// import { connect } from "react-redux";
// import { FaUserPlus, FaCalendarAlt, FaUserCheck} from 'react-icons/fa';
// import { MdAirlineSeatIndividualSuite} from 'react-icons/md';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import {CardBody,CardTitle,Col,Row,} from 'reactstrap';
// import { Link } from 'react-router-dom'
// import { fetchAllRegisteredPatients } from "./../actions/generalUserDashboard";
// import { url } from "../api";
// import GridLayout from 'react-grid-layout';
//
//
// const cardStyle = {
//     borderColor: '#fff',
//   };
//
// const Example = (props) => {
//   const [activeTab, setActiveTab] = useState('1');
//
//   const toggle = tab => {
//     if(activeTab !== tab) setActiveTab(tab);
//   }
//   window.scrollTo(0, 0);
//   const [genderData, setGenderData] = useState({})
//   const [combineChartData, setcombineChartData] = useState({})
//   const [birthRateData, setbirthRateData] = useState({})
//   const [birthSeries, setBirthSereies] = useState({})
//   const [deathRateData, setdeathRateData] = useState({})
//   const [deathSeries, setDeathSereies] = useState({})
//   const [totalPatients,setTotalPatients] = useState()
//   const [totalAppointment,setTotalAppointment] = useState(21)
//   useEffect(() => {
//
//             props.fetchAllGender();
//     }, []); //componentDidMount
//   //Total Patients
//   useEffect(() => {
//     async function getCharacters() {
//         try {
//             const response = await axios.get( url+ 'patients/totalCount');
//                 const body2 = response.data && response.data!==null ? response.data :0.00;
//                 setTotalPatients(body2)
//
//         } catch (error) {}
//       }
//       getCharacters();
//   }, []);
//     //Total Appointment
//     useEffect(() => {
//       async function getCharacters() {
//           try {
//               const response = await axios.get( url+ 'visits/totalCount/');
//                   const body2 = response.data && response.data!==null ? response.data :0.00;
//                   setTotalAppointment(body2)
//
//           } catch (error) {}
//         }
//         getCharacters();
//     }, []);
//   useEffect(() => {
//     async function getCharacters() {
//         try {
//             const response = await axios.get( url+ 'patient-dashboard/pie');
//                 const body = response.data && response.data!==null ? response.data : {};
//
//                 setGenderData(body)
//         } catch (error) {}
//       }
//       getCharacters();
// }, []);
// // combine chart
// useEffect(() => {
//   async function getCharacters() {
//       try {
//           const response = await axios.get( url+ 'patient-dashboard/column');
//               const body = response.data && response.data!==null ? response.data : {};
//               setcombineChartData(body)
//       } catch (error) {}
//     }
//     getCharacters();
// }, []);
// // Birthrate chart
// useEffect(() => {
//   async function getCharacters() {
//       try {
//           const response = await axios.get( url+ 'patient-dashboard/column/birthRate');
//               const body2 = response.data && response.data!==null ? response.data : {};
//               setbirthRateData(body2)
//               setBirthSereies(body2.series && body2.series!==null ? body2.series : {})
//
//       } catch (error) {}
//     }
//     getCharacters();
// }, []);
// // Death Rate chart
// useEffect(() => {
//   async function getCharacters() {
//       try {
//           const response = await axios.get( url+ 'patient-dashboard/column/deathRate');
//               const body2 = response.data && response.data!==null ? response.data : {};
//               setdeathRateData(body2)
//               setDeathSereies(body2.series && body2.series!==null ? body2.series : {})
//
//       } catch (error) {}
//     }
//     getCharacters();
// }, []);
//
// /* Gender Pie Chart */
// const genderChart = {
//   chart: {
//       type:  genderData.type,
//       options3d: {
//           enabled: true,
//           alpha: 45,
//           beta: 0
//       }
//   },
//   title: {
//       text: 'Total Registered Patients (Male, Female and Pediatric) Pass 4 Months'
//   },
//   accessibility: {
//       point: {
//           valueSuffix: '%'
//       }
//   },
//   tooltip: {
//       pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//   },
//   plotOptions: {
//       pie: {
//           allowPointSelect: true,
//           cursor: 'pointer',
//           depth: 35,
//           dataLabels: {
//               enabled: true,
//               format: '{point.name}'
//           }
//       }
//   },
//   series: [{
//
//       name:  genderData.name,
//       data:  genderData.data
//   }]
// }
// /* End of Gender Pie chart */
//
// /* Combine Chart */
// const combineChart = {
//   chart: {
//       type: combineChartData.type
//   },
// title: {
//   text: "Total Appointment , Attendance and Emergencies"
// },
// xAxis: combineChartData.xAxis,
// labels: {
//   items: [{
//       html: 'Total Appointment , Attendance and Emergencies',
//       style: {
//           left: '50px',
//           top: '2px',
//           color: ( // theme
//               Highcharts.defaultOptions.title.style &&
//               Highcharts.defaultOptions.title.style.color
//           ) || 'black'
//       }
//   }]
// },
// series: combineChartData.series
// };
//
// /* End of Combine chart */
//
// /* BirthRate Chart */
// const birthChart = {
//
//   chart: {
//     type: birthRateData.type,
//     options3d: {
//         enabled: true,
//         alpha: 10,
//         beta: 25,
//         depth: 70
//     }
//   },
//   title: {
//     text: birthRateData.text
//   },
//   subtitle: {
//     text: birthRateData.text
//   },
//   plotOptions: {
//     column: {
//         depth: 25
//     }
//   },
//   xAxis: {
//     categories: Highcharts.getOptions().lang.shortMonths,
//     labels: {
//         skew3d: true,
//         style: {
//             fontSize: '16px'
//         }
//     }
//   },
//   yAxis: {
//     title: {
//         text: null
//     }
//   },
//
//   series: [{
//     name: birthSeries.name,
//     data: birthSeries.data
//   }]
//   };
// /* End of BirthRate Chart */
//
//
// /* DEATH Rate Chart */
// const deathChart = {
//
//   chart: {
//     type: deathRateData.type,
//     options3d: {
//         enabled: true,
//         alpha: 10,
//         beta: 25,
//         depth: 70
//     }
//   },
//   title: {
//     text: deathRateData.text
//   },
//   subtitle: {
//     text: deathRateData.text
//   },
//   plotOptions: {
//     column: {
//         depth: 25
//     }
//   },
//   xAxis: {
//     categories: Highcharts.getOptions().lang.shortMonths,
//     labels: {
//         skew3d: true,
//         style: {
//             fontSize: '16px'
//         }
//     }
//   },
//   yAxis: {
//     title: {
//         text: null
//     }
//   },
//
//   series: [{
//     name: deathSeries.name,
//     data: deathSeries.data
//   }]
//   };
// /* End of Death Rate Chart */
//
//
//   return (
//     <div>
//       <Nav tabs>
//         <NavItem>
//           <NavLink
//             className={classnames({ active: activeTab === '1' })}
//             onClick={() => { toggle('1'); }}
//           >
//            <span style={{color:'#000'}} color="dark">General Dashboard</span>
//           </NavLink>
//         </NavItem>
//         <NavItem>
//           <NavLink
//             className={classnames({ active: activeTab === '2' })}
//             onClick={() => { toggle('2'); }}
//           >
//             <span style={{color:'#000'}} color="dark">User Dashboard</span>
//           </NavLink>
//         </NavItem>
//       </Nav>
//       <TabContent activeTab={activeTab}>
//         <TabPane tabId="1">
//           <Row>
//             <Col sm="12">
//             <Row className={"p-3"}>
//                 <Col lg={3} md={6} sm={6} xs={12}>
//                   <Card  style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3">
//                     <CardBody>
//                       <Row>
//                       <Link
//                         to={{pathname: "/patients"}}
//                         style={{ cursor: "pointer",  }}>
//                         <div className="col">
//                           <CardTitle
//                            tag="h6"
//                             className=" text-uppercase text-muted mb-0"
//                           >
//                               <div className="icon icon-shape   " >
//                               <FaUserPlus size={10} className={"text-primary"}/> Patients
//                               </div>
//
//                           </CardTitle>
//                           <span className="h2 font-weight-bold mb-0">
//                             {totalPatients}
//                           </span>
//                         </div>
//
//                         </Link>
//                       </Row>
//                       <p className="mt-1 mb-0 text-muted text-sm">
//
//                         <span className="text-nowrap">This month</span>
//                       </p>
//                     </CardBody>
//                   </Card>
//                 </Col>
//                 <Col lg={3} md={6} sm={6} xs={12}>
//                   <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3">
//                     <CardBody>
//                       <Row>
//                         <Link
//                           to={{pathname: "/"}}
//                           style={{ cursor: "pointer",  }}>
//                         <div className="col">
//                           <CardTitle
//                             tag="h6"
//                             className="text-uppercase text-muted mb-0"
//                           >
//                                 <div className="icon icon-shape ">
//                                 <MdAirlineSeatIndividualSuite className={" text-danger"} size={13} /> Emergency
//                                 </div>
//
//                           </CardTitle>
//                           <span className="h2 font-weight-bold mb-0">
//                             22
//                           </span>
//                         </div>
//                         {/*<Col className="col-auto">*/}
//                         {/*  <div className="icon icon-shape  text-danger">*/}
//                         {/*  <MdAirlineSeatIndividualSuite size={10} />*/}
//                         {/*  </div>*/}
//                         {/*</Col>*/}
//                         </Link>
//                       </Row>
//                       <p className="mt-1 mb-0 text-muted text-sm">
//                        {" "}
//                         <span className="text-nowrap">This week</span>
//                       </p>
//                     </CardBody>
//                   </Card>
//                 </Col>
//                 <Col lg={3} md={6} sm={6} xs={12}>
//                   <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3">
//                     <CardBody>
//                       <Row>
//                         <Link
//                         to={{pathname: "/patients"}}
//                         style={{ cursor: "pointer",  }}>
//                         <div className="col">
//                           <CardTitle
//                             tag="h6"
//                             className="text-uppercase text-muted mb-0"
//                           >
//                                 <div className="icon icon-shape  ">
//                                   <FaUserCheck className="text-black" size={10} />  Checked In
//                                 </div>
//
//                           </CardTitle>
//                           <span className="h2 font-weight-bold mb-0">924</span>
//                         </div>
//
//                         </Link>
//                       </Row>
//                       <p className="mt-1 mb-0 text-muted text-sm">
//                         {" "}
//                         <span className="text-nowrap">As at Today</span>
//                       </p>
//                     </CardBody>
//                   </Card>
//                 </Col>
//                 <Col lg={3} md={6} sm={6} xs={12}>
//                   <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3 ">
//                     <CardBody>
//                       <Row>
//                       <Link
//                         to={{pathname: "/appointments"}}
//                         style={{ cursor: "pointer",  }}>
//                         <div className="col">
//                           <CardTitle
//                             tag="h6"
//                             className="text-uppercase text-muted mb-0"
//                           >
//
//                                   <div className="icon icon-shape">
//                                       <FaCalendarAlt className=" text-warning" size={10} />   Appointments
//                                   </div>
//
//
//                           </CardTitle>
//                           <span className="h2 font-weight-bold mb-0">
//                             {totalAppointment}
//                           </span>
//                         </div>
//
//                         </Link>
//                       </Row>
//                       <p className="mt-1 mb-0 text-muted text-sm">
//                         {" "}
//                         <span className="text-nowrap">As at Today</span>
//                       </p>
//                     </CardBody>
//                   </Card>
//                 </Col>
//               </Row>
//
//           <Row className={"pl-3 pr-3 "}>
//
//
//           <Col md="6" sm="12" xs="12" xl="6" lg="6" className={"pb-1"}>
//             <Card>
//
//               <CardBody>
//                 <div>
//                     <HighchartsReact options={genderChart} />
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//           <Col md="6" sm="12" xs="12" xl="6" lg="6">
//             <Card>
//
//               <CardBody>
//                 <div>
//                     <HighchartsReact options={combineChart} />
//                 </div>
//
//               </CardBody>
//             </Card>
//           </Col>
//
//           <Col md="6" sm="12" xs="12" xl="6" lg="6">
//             <Card>
//
//               <CardBody>
//                 <HighchartsReact
//                   highcharts={Highcharts}
//                   options={deathChart}
//                 />
//
//               </CardBody>
//             </Card>
//           </Col>
//
//           <Col md="6" sm="12" xs="12" xl="6" lg="6">
//             <Card>
//
//               <CardBody>
//                 <HighchartsReact
//                   highcharts={Highcharts}
//                   options={birthChart}
//                 />
//
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//
//             </Col>
//           </Row>
//         </TabPane>
//         <TabPane tabId="2">
//         <br/><br/>
//
//         <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
//
//         <div key="b" data-grid={{x: 1, y: 4, w: 4, h: 4, minW: 4, maxW: 4}}>
//         {/* <Col md="6" sm="12" xs="12" xl="6" lg="6"> */}
//             <Card>
//
//               <CardBody>
//                 <HighchartsReact
//                   highcharts={Highcharts}
//                   options={deathChart}
//                 />
//
//               </CardBody>
//             </Card>
//           {/* </Col> */}
//         </div>
//         <div key="c" data-grid={{x: 4, y: 0, w: 1, h: 2}}>
//
//         {/* <Col md="6" sm="12" xs="12" xl="6" lg="6"> */}
//             <Card>
//
//               <CardBody>
//                 <HighchartsReact
//                   highcharts={Highcharts}
//                   options={birthChart}
//                   style={{width: '100%', height: '400px', display: 'block'}}
//                 />
//
//               </CardBody>
//             </Card>
//           {/* </Col> */}
//         </div>
//       </GridLayout>
//
//         </TabPane>
//       </TabContent>
//     </div>
//   );
// }
//
//
// //export default DashboardPage;
//
// const mapStateToProps = state => {
//     return {
//         genderPieChartList: state.generalUsersDashboardModuleReducer.list
//     };
//   };
//   const mapActionToProps = {
//     fetchAllGender: fetchAllRegisteredPatients
//   };
//
//   export default connect(mapStateToProps, mapActionToProps)(Example);