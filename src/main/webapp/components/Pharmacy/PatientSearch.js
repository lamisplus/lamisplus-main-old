import React from 'react';
import MaterialTable from 'material-table';
import { useSelector} from 'react-redux';
import { Link } from 'react-router-dom'
import "./patientPrescriptions.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

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
  const prescriptions = useSelector(state => state.pharmacy.allPrescriptions)

  const totalDrugsPrescribed = (drugsArray) => {

    const dispensed = []

    drugsArray.map(drugs => {
        if (drugs.data.prescription_status === 1)
          dispensed.push(drugs.data)
       
    })
    
    return dispensed.length
  }
  const drugType = (drugsArray) => {
    //console.log(prescriptions)
    const type = []
    drugsArray.map(drugs => {
        if (drugs.data.type === 1){
          type.push('Drug')
        }else if(drugs.data.type === 0){
          type.push('Regimen')
        }else{
          type.push('')
        }
       
    })
    
    return type
  }
 
  return (
    <div>
      <MaterialTable
       icons={tableIcons}
        title="Drug Prescriptions"
        columns={[
          { title: "Patient ID", field: "Id" },
          {
            title: "Patient Name",
            field: "name",
          },
          { title: "Prescription Date", field: "date", type: "date", filtering: false, },
          {
            title: "Total Prescribed",
            field: "prescribedCount",
            filtering: false,
          },
          {
            title: "Total Dispensed",
            field: "dispensedCount",
            filtering: false,
          },
          {
            title: "Action",
            field: "actions",
            filtering: false,
          },
        ]}
        data={ prescriptions.map((prescription) => ({
          Id: prescription.hospitalNumber,
          name: prescription.firstName + " " + prescription.lastName,
          date: prescription.dateEncounter,
          prescribedCount: prescription.formDataObj.length,
          dispensedCount: totalDrugsPrescribed(prescription.formDataObj),
         // type:   drugType(prescription.formDataObj),
          actions: (
            
            <Link
              to={{
                pathname: "/prescriptions",
                state: prescription,
               
              }}
              style={{ cursor: "pointer", color: "blue", fontStyle: "bold" }}>
              <Tooltip title="View Prescription">
                <IconButton aria-label="View Prescription">
                  <VisibilityIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Link>
          ),
        }))}
        options={{
          pageSizeOptions: [50,100,150,200],
          actionsColumnIndex: -1,
          headerStyle: {
            backgroundColor: "#9F9FA5",
            color: "#000",
            margin: "auto",
          },
          searchFieldStyle: {
                width : '300%',
                margingLeft: '250px',
            },
            filtering: true,
            exportButton: false,
            searchFieldAlignment: 'left',
            actionsColumnIndex: -1
        }}
      />
    </div>
  );
}

export default PatientSearch;


