import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { Alert } from 'reactstrap'
import * as actions from "actions/patients";
import {connect} from 'react-redux';

const columns = [
  {
    name: 'Date',
    selector: 'dateEncounter',
    sortable: false,
    Display: true,
    cell: row => (
      <span>
        {row.dateEncounter || ''} 
      </span>
    )
  },
  {
    name: 'Pulse(bpm)',
    selector: 'pulse',
    sortable: false,
  },
  {
    name: 'Respiratory(bpm)',
    selector: 'respiratoryRate',
    sortable: false,
  },
  {
    name: 'Temperature(c)',
    selector: 'temperature',
    sortable: false,
  },
  {
    name: 'Blood Pressure(mmHg)',
    selector: 'row',
    sortable: false,
    cell: row => (
      <span>
        {row.systolic || ''} {' / '}{row.diastolic || ''}
      </span>
    )
  },
  {
    name: 'Weight(kg)',
    selector: 'weight',
    sortable: false,
  },
  {
    name: 'Height(cm)',
    selector: 'height',
    sortable: false,
  }
]
function DataTableList (props) {
  const [errorMsg, setErrorMsg] = React.useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const onDismiss = () => setShowErrorMsg(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    setLoading(true)
    const onSuccess = () => {
      setData(props.vitalSignsList);
      setLoading(false)
    }
    const onError = () => {
      setLoading(false)
      setErrorMsg("Could not fetch vital signs, try again later");
    }
    props.fetchPatientVitalSigns(props.patientId, onSuccess, onError)
  }, [props.patientId]);

  React.useEffect(() => {
    setData(props.vitalSignsList);

  }, [props.vitalSignsList]);
  
 
  return (
    <div>
<Alert color='danger' isOpen={showErrorMsg} toggle={onDismiss}>
            {errorMsg}
        </Alert>
        <DataTable
            columns={columns}
            data={data}
            pagination
            highlightOnHover={true}
            striped={true}
            subHeaderAlign={'left'}
            progressPending={loading}
            // noHeader={false}
            fixedHeader={true}
            persistTableHead
          />
    </div>
  )
}

const mapStateToProps = state => {
  return {
  vitalSignsList: state.patients.vitalSignsList
  }
}

const mapActionToProps = {
  fetchPatientVitalSigns: actions.fetchPatientVitalSigns,
}

export default connect(mapStateToProps, mapActionToProps)(DataTableList)