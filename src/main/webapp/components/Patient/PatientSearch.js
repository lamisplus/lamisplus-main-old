import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { fetchAll, Delete as Del } from "../../actions/patients";
import "./Patient.css";
import { MdDashboard, MdDeleteForever, MdModeEdit } from "react-icons/md";
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";




const PatientSearch = (props) => {
    const [loading, setLoading] = useState('')
    const [patients, setPatients] = useState()

        
    useEffect(() => {
        console.log(props.patientsList)
        setLoading('true');
        const onSuccess = () => {
            
        
        setLoading(false)
      }
        const onError = () => {
        setLoading(false)     
      }
          props.fetchAllPatients(onSuccess, onError);
    }, []); //componentDidMount

        const onDelete = id => {      
                if (window.confirm(`Are you sure to delete this record? ${id}`))
                    props.deletePatient(id)
        }


        const calculate_age = dob => {
            var today = new Date();
            var dateParts = dob.split("-");
            var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
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
                title="Find patients"
                    columns={[
                        {
                          title: "Patient Name",
                          field: "name",
                        },
                        { title: "Patient ID", field: "id" },
                        { title: "Age", field: "age", filtering: false },
                        { title: "Address", field: "address", filtering: false },
                        {title: "", field: "actions", filtering: false,},
                    ]}
                    isLoading={loading}
                    data={props.patientsList.map((row) => ({
                        name: row.firstName +  ' ' + row.lastName,
                        id: row.hospitalNumber,
                        age: (row.dob === 0 ||
                        row.dob === undefined ||
                        row.dob === null ||
                        row.dob === "" )
                          ? 0
                          : calculate_age(row.dob),
                        address: row.street || '',
                        actions: 
          <div>
          
            <Menu>
                <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                  Actions <span aria-hidden>▾</span>
                </MenuButton>
                    <MenuList style={{ color:"#000 !important"}} >
                        <MenuItem  style={{ color:"#000 !important"}}>                      
                            <Link
                                to={{
                                  pathname: "/patient-dashboard",
                                  state: { hospitalNumber: row.hospitalNumber  }
                                }}
                             >
                                <MdDashboard size="15" />{" "}<span style={{color: '#000'}}>Patient Dashboard</span>
                          </Link>                               
                          </MenuItem>
                          <MenuItem style={{ color:"#000 !important"}}>
                                <Link
                                    to={{
                                      pathname: "/patient-update",
                                      currentId: row
                                    }}
                                  >
                                <MdModeEdit size="15" />{" "}<span style={{color: '#000'}}>Edit Patient </span>                   
                              </Link>
                          </MenuItem>                                      
                          <MenuItem style={{ color:"#000 !important"}}>
                              <Link
                                  onClick={() => onDelete(row.patientId)}
                              >
                                <MdDeleteForever size="15"  />{" "}
                                <span style={{color: '#000'}}>Delete Patient</span>
                            </Link>                                  
                          </MenuItem>
                  </MenuList>
            </Menu>
          </div>            
          }))}
          
          options={{
              headerStyle: {
                  backgroundColor: "#9F9FA5",
                  color: "#000",
              },
              searchFieldStyle: {
                  width : '300%',
                  margingLeft: '250px',
              },
              filtering: true,
              exportButton: false,
              searchFieldAlignment: 'left',

          }}
        />
      </div>
    );
  }

    const mapStateToProps = state => {
      return {
          patientsList: state.patients.list
      };
    };    
  
    const mapActionToProps = {
        fetchAllPatients: fetchAll,
        deletePatient: Del
    };
      
  export default connect(mapStateToProps, mapActionToProps)(PatientSearch);