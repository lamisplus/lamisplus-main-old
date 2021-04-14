// import React, {useEffect, useState} from 'react';
// import MaterialTable from 'material-table';
// import { Link } from 'react-router-dom'
// import { connect } from "react-redux";
// import { fetchPatientUser } from "../../../../actions/caseManager";
// import "../casemanager.css";
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import Tooltip from '@material-ui/core/Tooltip';
// import IconButton from '@material-ui/core/IconButton';
// import {Card, CardBody} from 'reactstrap';
// import Breadcrumbs from '@material-ui/core/Breadcrumbs';
// import Typography from '@material-ui/core/Typography';
// import { APPLICATION_CODESET_GENDER } from "../../../actions/types";
// import { fetchApplicationCodeSet } from "../../../../actions/applicationCodeset";
//
//
// const CaseManager = (props) => {
//     const [loading, setLoading] = useState('')
//     useEffect(() => {
//     setLoading('true');
//         const onSuccess = () => {
//             setLoading(false)
//         }
//         const onError = () => {
//             setLoading(false)
//         }
//             props.fetchPatientUser(10, onSuccess, onError);
//     }, []);
//
//     React.useEffect(() => {
//         if(props.genderList.length === 0){
//             props.fetchApplicationCodeSet("GENDER", APPLICATION_CODESET_GENDER);
//         }
//     }, [props.genderList]);
//
//     function getGenderById(id) {
//         return id ? ( props.genderList.find((x) => x.id == id) ? props.genderList.find((x) => x.id == id).display : "" ) : "";
//     }
//     console.log(props.list)
//
//     const calculate_age = dob => {
//         var today = new Date();
//         var dateParts = dob.split("-");
//         var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
//         var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
//         var age_now = today.getFullYear() - birthDate.getFullYear();
//         var m = today.getMonth() - birthDate.getMonth();
//         if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//             age_now--;
//         }
//         if (age_now === 0) {
//             return m + " month(s)";
//         }
//         return age_now + " year(s)";
//     };
//
//   return (
//       <Card>
//           <CardBody>
//               <Breadcrumbs aria-label="breadcrumb">
//                   <Link color="inherit" to={{pathname: "/admin"}} >
//                       Admin
//                   </Link>
//                   <Typography color="textPrimary">Patients List</Typography>
//               </Breadcrumbs>
//               <br/>
//           <MaterialTable
//               title="Patient List"
//               columns={[
//                   {title: "Patient Name", field: "name",},
//                   { title: "Patient ID", field: "id" },
//                   { title: "Gender", field: "gender", filtering: false },
//                   { title: "Age", field: "age", filtering: false },
//                   {title: "Address", field: "address", filtering: false},
//               ]}
//               isLoading={loading}
//               data={list.map((row) => ({
//                   name: row.firstName +  ' ' + row.lastName,
//                   id: row.hospitalNumber,
//                   gender: getGenderById(row.genderId),
//                   age: (row.dob === 0 ||
//                       row.dob === undefined ||
//                       row.dob === null ||
//                       row.dob === "" )
//                       ? 0
//                       : calculate_age(row.dob),
//                   address: row.street || '',
//                   actions:  <Link to ={{pathname: "/case-manager", state: row}}
//                                   style={{ cursor: "pointer", color: "blue", fontStyle: "bold"}}>
//                                 <Tooltip title="Collect Sample">
//                                     <IconButton aria-label="Collect Sample" >
//                                         <VisibilityIcon color="primary"/>
//                                     </IconButton>
//                                 </Tooltip>
//                             </Link>
//                         }))}
//                options={{
//                   pageSizeOptions: [5,10,50,100,150,200],
//                   headerStyle: {
//                   backgroundColor: "#9F9FA5",
//                   color: "#000",
//                   margin: "auto"},
//                   filtering: true,
//                   searchFieldStyle: {width : '300%', margingLeft: '250px',},
//                   exportButton: true,
//                   searchFieldAlignment: 'left',
//               }}/>
//           </CardBody>
//       </Card>
//   );
// }
//
// const mapStateToProps = state => {
//     return {
//         list: state.caseManager.list,
//         genderList: state.applicationCodesets.genderList,
//     };
// };
// const mapActionToProps = {
//     fetchPatientUser: fetchPatientUser,
//     fetchApplicationCodeSet: fetchApplicationCodeSet
// };
//
// export default connect(mapStateToProps, mapActionToProps)(CaseManager);