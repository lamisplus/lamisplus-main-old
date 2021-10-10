import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { fetchAll, Delete as Del } from "../../actions/patients";
import "./PatientSearch.css";
import { MdDashboard, MdDeleteForever, MdModeEdit } from "react-icons/md";
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { APPLICATION_CODESET_GENDER } from "actions/types";
import { fetchApplicationCodeSet } from "actions/applicationCodeset";
import axios from "axios";
import {url as baseUrl} from "../../api";
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


const PatientSearch = (props) => {
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState()
    const tableRef = React.createRef();
    /*# Get list of Gender parameter  #*/
    React.useEffect(() => {
        if(props.genderList.length === 0){
            props.fetchApplicationCodeSet("GENDER", APPLICATION_CODESET_GENDER);
        }
    }, [props.genderList]);

    function getGenderById(id) {
        return id ? ( props.genderList.find((x) => x.id == id) ? props.genderList.find((x) => x.id == id).display : "" ) : "";
    }
  useEffect(() => {
    //  console.log(props.patientsList)
     // setLoading('true');
      const onSuccess = () => {


      setLoading(false)
    }
      const onError = () => {
      setLoading(false)
    }
       // props.fetchAllPatients(onSuccess, onError);
  }, []); //componentDidMount

    const onDelSuccess = () => {
        try {
            tableRef.current.onQueryChange();
        }catch(x){
            console.log(x)
        }
    }

      const onDelete = row => {

              if (window.confirm(`Are you sure to delete this record? ${row.firstName}`))
                  props.deletePatient(row.patientId, onDelSuccess);
      }


      const calculate_age = dob => {
          var today = new Date();
          var dateParts = dob.split("-");
          var dateObject = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
          var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
          var age_now = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age_now--;
                }
              if (age_now === 0) {
                      return m + " month(s)";
                  }
                  return age_now + " year(s)";
        };


  return (
      <div>
        <ToastContainer autoClose={3000} hideProgressBar />
          <MaterialTable
            icons={tableIcons}
              title="Find patients"
              tableRef={tableRef}
                  columns={[
                      {
                        title: "Patient Name",
                        field: "name",
                      },
                      { title: "Patient ID", field: "id" },
                      { title: "Age", field: "age", filtering: false },
                      { title: "Gender", field: "gender", filtering: false },
                      { title: "Address", field: "address", filtering: false },
                      {title: "", field: "actions", filtering: false,},
                  ]}
                  isLoading={loading}
              data={query =>
                  new Promise((resolve, reject) =>
                      axios.get(`${baseUrl}patients?size=${query.pageSize}&page=${query.page}&searchValue=${query.search}`)
                          .then(response => response)
                          .then(result => {

                              //console.log('in result')
                              //console.log( result.headers);
                              console.log( result.headers['x-total-count']);
                              resolve({
                                  data: result.data.map((row) => ({
                                      name: <Link
                                          to ={{
                                              pathname: "/patient-dashboard",
                                              state: row.hospitalNumber
                                          }}

                                          title={"Click to view patient dashboard"}
                                      >{row.firstName}  { ' '}  {row.lastName ? row.lastName.toUpperCase() : ""}</Link>,
                                      id: row.hospitalNumber,
                                      gender: row.details && row.details.gender && row.details.gender.display ? row.details.gender.display : 'N/A',
                                      age: (row.dob === 0 ||
                                          row.dob === undefined ||
                                          row.dob === null ||
                                          row.dob === "" )
                                          ? 0
                                          : calculate_age(row.details && row.details.dob ? row.details.dob : row.dob),
                                      address: row.street || '',
                                      actions:
                                          <div>

                                              <Menu>
                                                  <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                                      Actions <span aria-hidden>▾</span>
                                                  </MenuButton>
                                                  <MenuList style={{ color:"#000 !important"}} >

                                                      {/*<MenuItem  style={{ color:"#000 !important"}} onClick={() => window.location.href = "/patient-dashboard?hospitalNumber="+row.hospitalNumber}>*/}
                                                      {/*        <MdDashboard size="15" color="blue" />{" "}<span style={{color: '#000'}}>Patient Dashboard</span>*/}
                                                      {/*  </MenuItem>*/}

                                                      <MenuItem  style={{ color:"#000 !important"}}>
                                                          <Link
                                                              to ={{
                                                                  pathname: "/patient-dashboard",
                                                                  state: (row.details && row.details.hospitalNumber ? row.details.hospitalNumber : row.hospitalNumber)
                                                              }}
                                                          >
                                                              <MdDashboard size="15" color="blue" />{" "}<span style={{color: '#000'}}>Patient Dashboard</span>
                                                          </Link>
                                                      </MenuItem>

                                                      <MenuItem style={{ color:"#000 !important"}}>
                                                          <Link
                                                              to={{
                                                                  pathname: "/patient-update-formio",
                                                                  state: (row.details && row.details.hospitalNumber ? row.details.hospitalNumber : row.hospitalNumber)
                                                              }}
                                                          >
                                                              <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Edit Patient </span>
                                                          </Link>
                                                      </MenuItem>
                                                      <MenuItem style={{ color:"#000 !important"}}>
                                                          <Link
                                                              onClick={() => onDelete(row)}>
                                                              <MdDeleteForever size="15" color="blue" />{" "}
                                                              <span style={{color: '#000'}}>Delete Patient</span>
                                                          </Link>
                                                      </MenuItem>
                                                  </MenuList>
                                              </Menu>
                                          </div>
                                  })),
                                  page: query.page,
                                  totalCount: result.headers['x-total-count'],
                              })
                          })
                  )}
        //           data={props.patientsList.map((row) => ({
        //               name: <Link
        //                   to ={{pathname: "/patient-dashboard", state: row.hospitalNumber}}
        //                   title={"Click to view patient dashboard"}>
        //                   {row.firstName}  { ' '}  {row.lastName ? row.lastName.toUpperCase() : ""}</Link>,
        //               id: row.hospitalNumber,
        //               gender: getGenderById(row.genderId),
        //               age: (row.dob === 0 ||
        //               row.dob === undefined ||
        //               row.dob === null ||
        //               row.dob === "" )
        //                 ? 0
        //                 : calculate_age(row.dob),
        //               address: row.street || '',
        //               actions:
        // <div>
        //
        //   <Menu>
        //       <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
        //         Actions <span aria-hidden>▾</span>
        //       </MenuButton>
        //           <MenuList style={{ color:"#000 !important"}} >
        //
        //               {/*<MenuItem  style={{ color:"#000 !important"}} onClick={() => window.location.href = "/patient-dashboard?hospitalNumber="+row.hospitalNumber}>*/}
        //               {/*        <MdDashboard size="15" color="blue" />{" "}<span style={{color: '#000'}}>Patient Dashboard</span>*/}
        //               {/*  </MenuItem>*/}
        //
        //               <MenuItem  style={{ color:"#000 !important"}}>
        //                   <Link
        //                       to ={{
        //                           pathname: "/patient-dashboard",
        //                           state: row.hospitalNumber
        //                       }}
        //                   >
        //                       <MdDashboard size="15" color="blue" />{" "}<span style={{color: '#000'}}>Patient Dashboard</span>
        //                   </Link>
        //               </MenuItem>
        //
        //                 <MenuItem style={{ color:"#000 !important"}}>
        //                       <Link
        //                           to={{
        //                             pathname: "/patient-update-formio",
        //                               state: row.hospitalNumber
        //                           }}
        //                         >
        //                       <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Edit Patient </span>
        //                     </Link>
        //                 </MenuItem>
        //                 <MenuItem style={{ color:"#000 !important"}}>
        //                     <Link
        //                         onClick={() => onDelete(row.patientId)}>
        //                       <MdDeleteForever size="15" color="blue" />{" "}
        //                       <span style={{color: '#000'}}>Delete Patient</span>
        //                   </Link>
        //                 </MenuItem>
        //         </MenuList>
        //   </Menu>
        // </div>
        // }))}

        options={{
            headerStyle: {
                backgroundColor: "#9F9FA5",
                color: "#000",
            },
            searchFieldStyle: {
                width : '300%',
                margingLeft: '250px',
            },
            filtering: false,
            exportButton: false,
            searchFieldAlignment: 'left',
            pageSizeOptions:[10,20,100],
            pageSize:10,
            debounceInterval: 400
        }}
      />
    </div>
  );
}

  const mapStateToProps = state => {
    return {
        patientsList: state.patients.list,
        genderList: state.applicationCodesets.genderList
    };
  };

  const mapActionToProps = {
      fetchAllPatients: fetchAll,
      deletePatient: Del,
      fetchApplicationCodeSet: fetchApplicationCodeSet,
  };

export default connect(mapStateToProps, mapActionToProps)(PatientSearch);