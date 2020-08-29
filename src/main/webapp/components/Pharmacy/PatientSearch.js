import React from 'react';
import MaterialTable from 'material-table';
import { useSelector} from 'react-redux';
import { Link } from 'react-router-dom'
import "./patientPrescriptions.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const PatientSearch = (props) => {
  const prescriptions = useSelector(state => state.pharmacy.allPrescriptions)

  const totalDrugsPrescribed = (drugsArray) => {
    const dispensed = []

    drugsArray.map(drugs => {
      for (let drug in drugs) {
        if (drugs[drug].prescription_status === 1)
          dispensed.push(drugs[drug])
      }
    })
    
    return dispensed.length
  }
 
  return (
    <div>
      <MaterialTable
        title="Drug Prescriptions"
        columns={[
          { title: "Patient ID", field: "Id" },
          {
            title: "Patient Name",
            field: "name",
          },
          { title: "Prescription Date", field: "date", type: "date" },
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
        data={prescriptions.map((prescription) => ({
          Id: prescription.patientId,
          name: prescription.firstName,
          date: prescription.dateEncounter,
          prescribedCount: prescription.formDataObj.length,
          dispensedCount: totalDrugsPrescribed(prescription.formDataObj),
          actions: (
            <Link
              to={{
                pathname: "/prescriptions",
                form: prescription,
                patientName:
                  prescription.firstName + " " + prescription.lastName,
                encounterId: prescription.encounterId,
              }}
              style={{ cursor: "pointer", color: "blue", fontStyle: "bold" }}
            >
              <Tooltip title="View Prescription">
                <IconButton aria-label="View Prescription">
                  <VisibilityIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Link>
          ),
        }))}
        options={{
          actionsColumnIndex: -1,
          headerStyle: {
            backgroundColor: "#9F9FA5",
            color: "#000",
            margin: "auto",
          },
          filtering: true,

          searchFieldStyle: {
            width: "300%",
            margingLeft: "250px",
          },

          exportButton: true,
          searchFieldAlignment: "left",
        }}
      />
    </div>
  );
}

export default PatientSearch;


