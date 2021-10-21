import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import axios from "axios";
import { url as baseUrl } from "../../api";
import { forwardRef } from 'react';
import { Link } from 'react-router-dom'
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
import {  FaUserPlus } from "react-icons/fa";
import Button from "@material-ui/core/Button";
import AddCaseManager from './addCaseManager';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

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


const CaseManagerSearch = (props) => {

  const [caseManagersList, setCaseManagersList] = useState( [])
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  useEffect(() => {
    fetchMe()

  }, []);

  ///GET LIST OF Case Manager
  async function fetchMe() {

    axios
        .get(`${baseUrl}roles/8/user`,
        // { headers: {"Authorization" : `Bearer ${token}`} }
          )
        .then((response) => {
          setCaseManagersList(response.data);
           })
        .catch((error) => {

        });
  
}

const addManager =()=> {  
  setModal(!modal)
}

 
  return (
    <div>
        <Button
            variant="contained"
            color="primary"
            className=" float-right mr-1"
            startIcon={<FaUserPlus />}
            onClick={() =>addManager()}
          >
            <span style={{ textTransform: "capitalize" }}>Add Case Manager</span>
        </Button>
        <br/><br/>
      <MaterialTable
       icons={tableIcons}
        title="Case Managers"
        columns={[
         // { title: " ID", field: "Id" },
          {
            title: "Name",
            field: "name",
          },
          { title: "Gender", field: "gender", filtering: false },
          { title: "Status", field: "status", filtering: false, },
          {
            title: "Total Patients",
            field: "patients",
            filtering: false,
          },
         
          {
            title: "Action",
            field: "actions",
            filtering: false,
          },
        ]}
        data={ caseManagersList.map((manager) => ({
          //Id: manager.id,
          name: <Link
                  to ={{
                      pathname: "/case-manager-patients",
                      state: manager.id,
                      caseManagerName: manager.firstName + " " + manager.lastName  
                  }}

                  title={"Click to view patients"}
              >{manager.firstName} {' '} {manager.lastName} </Link>,
          gender: manager.gender,
          status: "Active",
          patients: manager.managedPatientCount,

          actions: "View"
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
                    filtering: false,
                    exportButton: false,
                    searchFieldAlignment: 'left',
                    pageSizeOptions:[10,20,100],
                    pageSize:10,
                    debounceInterval: 400
                }}
      />
      <AddCaseManager modalstatus={modal} togglestatus={toggle} />
      
    </div>
  );
}

export default CaseManagerSearch;


