import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import {Alert, CardBody} from 'reactstrap'
import * as actions from "actions/patients";
import {connect} from 'react-redux';
import "./Style.css";
import { Badge } from 'reactstrap';
import {DRUG_ORDER_STATUS} from 'api/codes'
import MaterialTable from "material-table";
import {Paper} from "@material-ui/core";
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
import {toast, ToastContainer} from "react-toastify";

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

function PreviousMedication (props) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    setLoading(true)
    const onSuccess = () => {
      setData(props.previousMedications);
      setLoading(false)
    }
    const onError = () => {
      setLoading(false)
      toast.error("Could not fetch previous medications, try again later");
    }
    props.fetchPatientMedicationOrder(props.patientId, onSuccess, onError)
  }, [props.patientId]);

  React.useEffect(() => {
    setData(props.previousMedications);

  }, [props.previousMedications]);
  
 
  return (
    <div>
<ToastContainer />
      <MaterialTable
          icons={tableIcons}
          components={{
            Container: props => <Paper {...props} elevation={0}/>
          }}
          isLoading={loading}
          title=""
          columns={[
            { title: 'Date', field: 'date_prescribed', type:'datetime' },
            { title: 'Drug Name', field: 'dateEncounter' , render: rowData => <span>
        {rowData.regimen ?
            ( rowData.regimen && rowData.regimen.name ? rowData.regimen.name + ' - ': '')
            :
            <b> {rowData.drugs && rowData.drugs.length > 0 ? rowData.drugs.map(x=>x.drug.name).toString() : ''}</b>}
      </span>},
            { title: 'Dose', field: 'dosage_frequency' },
            { title: 'Period', field: 'start_date', render: rowData =>  <span>
        {'Start at '} <b>{rowData.start_date || ''}</b> {' for '} <b>{rowData.duration}{' '}{rowData.duration_unit}</b>
      </span>},
            { title: 'Prescription', field: 'prescription_status', render: rowData => <span>
      <Badge  color="primary">{DRUG_ORDER_STATUS.find(x => x.id == rowData.prescription_status) ? DRUG_ORDER_STATUS.find(x => x.id == rowData.prescription_status).name : 'Not Dispensed'}</Badge>
      </span>},
          ]}
          data={data}
          // actions={[
          //   rowData => ({
          //     icon: VisibilityIcon,
          //     tooltip: 'View Form',
          //     onClick: (event, rowData) => viewForm(rowData),
          //     disabled: !authentication.userHasRole(["patient_write"]),
          //   }),
          //   {
          //     icon: EditIcon,
          //     tooltip: 'Edit Form',
          //     onClick: (event, rowData) => editForm(rowData)
          //   },
          // ]}
          options={{
            padding: 'dense',
            header: true,
            showTitle: false,
            pageSize: 5,
            search: false
          }}
      />

    </div>
  )
}

const mapStateToProps = state => {
  return {
    previousMedications: state.patients.previousMedications
  }
}

const mapActionToProps = {
  fetchPatientMedicationOrder: actions.fetchPatientLatestMedicationOrder,
}

export default connect(mapStateToProps, mapActionToProps)(PreviousMedication)