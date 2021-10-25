// import React, {  useState, useEffect } from "react";
// import {Card,CardBody,CardHeader,CardTitle,Col,Row,} from 'reactstrap';
// import { FaUserPlus, FaCalendarAlt, FaUserCheck} from 'react-icons/fa'; 
// import { Link } from 'react-router-dom';
// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';

// import GridLayout from 'react-grid-layout';

// class MyFirstGrid extends React.Component {
//   render() {
//     // layout is an array of objects, see the demo for more complete usage
//     // const layout = [
//     //   {i: 'a', x: 0, y: 0, w: 2, h: 2},
//     //   {i: 'b', x: 2, y: 0, w: 2, h: 2, minW: 2, maxW: 4},
//     //   {i: 'c', x: 4, y: 0, w: 2, h: 2}
//     // ];
//     return (
//       <GridLayout className="layout"  cols={10} rowHeight={50} width={1200} >
//         <div key="a" data-grid={{x: 0, y: 0, w:2, h: 2}}> 
//                   <Card  className="card-stats mb-4 mb-xl-0 " style={{backgroundColor: '#FFBF43', color: '#fff',  boxShadow: '1px 2px #eee'}}>
//                     <CardBody >
//                       <Row >
             
//                         <div className="col">
//                           <CardTitle
//                            tag="h6"
//                             className=" text-uppercase text-muted mb-0" 
//                             style={{ color: 'white'}}
//                           >
//                               <div className="icon icon-shape   " style={{ color: 'white'}}>
//                               <FaUserPlus size={10} className={"text-primary"}/> Patients
//                               </div>

//                           </CardTitle>
//                           <span className="h2 font-weight-bold mb-0" style={{ color: 'white'}}>
//                             546
//                           </span>
//                         </div>
                       
//                       </Row>
//                       <p className="mt-1 mb-0 text-muted text-sm">
                        
//                         <span className="text-nowrap" style={{ color: 'white'}}>This month</span>
//                       </p>
//                     </CardBody>
//                   </Card>
             
//                 </div>
//         <div key="b" data-grid={{x: 2, y: 0, w:0, h: 0}}>
//                   <Card  className="card-stats mb-4 mb-xl-0 " style={{backgroundColor: '#FFBF43', color: '#fff',  boxShadow: '1px 2px #eee'}}>
//                     <CardBody >
//                       <Row >
                    
//                         <div className="col">
//                           <CardTitle
//                            tag="h6"
//                             className=" text-uppercase text-muted mb-0" 
//                             style={{ color: 'white'}}
//                           >
//                               <div className="icon icon-shape   " style={{ color: 'white'}}>
//                               <FaUserPlus size={10} className={"text-primary"}/> Patients
//                               </div>

//                           </CardTitle>
//                           <span className="h2 font-weight-bold mb-0" style={{ color: 'white'}}>
//                             546
//                           </span>
//                         </div>
                     
//                       </Row>
//                       <p className="mt-1 mb-0 text-muted text-sm">
                        
//                         <span className="text-nowrap" style={{ color: 'white'}}>This month</span>
//                       </p>
//                     </CardBody>
//                   </Card>
             
//                 </div>
//         <div key="c" data-grid={{x: 4, y: 0, w:2, h: 2}}>
//                   <Card  className="card-stats mb-4 mb-xl-0 " style={{backgroundColor: '#FFBF43', color: '#fff',  boxShadow: '1px 2px #eee'}}>
//                     <CardBody >
//                       <Row >
                    
//                         <div className="col">
//                           <CardTitle
//                            tag="h6"
//                             className=" text-uppercase text-muted mb-0" 
//                             style={{ color: 'white'}}
//                           >
//                               <div className="icon icon-shape   " style={{ color: 'white'}}>
//                               <FaUserPlus size={10} className={"text-primary"}/> Patients
//                               </div>

//                           </CardTitle>
//                           <span className="h2 font-weight-bold mb-0" style={{ color: 'white'}}>
//                             546
//                           </span>
//                         </div>
                     
//                       </Row>
//                       <p className="mt-1 mb-0 text-muted text-sm">
                        
//                         <span className="text-nowrap" style={{ color: 'white'}}>This month</span>
//                       </p>
//                     </CardBody>
//                   </Card>
             
//                 </div>
//                 <div key="d" data-grid={{x: 6, y: 0, w:2, h: 2}}>
//                   <Card  className="card-stats mb-4 mb-xl-0 " style={{backgroundColor: '#FFBF43', color: '#fff',  boxShadow: '1px 2px #eee'}}>
//                     <CardBody >
//                       <Row >
                    
//                         <div className="col">
//                           <CardTitle
//                            tag="h6"
//                             className=" text-uppercase text-muted mb-0" 
//                             style={{ color: 'white'}}
//                           >
//                               <div className="icon icon-shape   " style={{ color: 'white'}}>
//                               <FaUserPlus size={10} className={"text-primary"}/> Patients
//                               </div>

//                           </CardTitle>
//                           <span className="h2 font-weight-bold mb-0" style={{ color: 'white'}}>
//                             546
//                           </span>
//                         </div>
                     
//                       </Row>
//                       <p className="mt-1 mb-0 text-muted text-sm">
                        
//                         <span className="text-nowrap" style={{ color: 'white'}}>This month</span>
//                       </p>
//                     </CardBody>
//                   </Card>
             
//                 </div>
//       </GridLayout>
//     )
//   }
// }
// export default MyFirstGrid;
