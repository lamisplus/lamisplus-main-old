import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { Alert } from 'reactstrap'
import * as actions from "actions/patients";
import {connect} from 'react-redux';
import {LAB_ORDER_STATUS} from 'api/codes'
import { Badge } from 'reactstrap';

const columns = [
//   {
//     name: 'Date',
//     selector: '',
//     sortable: false,
//     cell: (row) => (
//         <span>{row.dateEncounter || ''}</span>
//       )
//   },
  {
    name: 'Test',
    selector: 'description',
    sortable: false,
  },
  {
    name: 'Test Status',
    selector: 'lab_test_order_status',
    sortable: false,
    cell: (row) => (
        <span><Badge  color="primary">{LAB_ORDER_STATUS.find(x => x.id == row.lab_test_order_status) ? LAB_ORDER_STATUS.find(x => x.id == row.lab_test_order_status).name : ''}</Badge></span>
      )
  },
  {
    name: 'Date Sample Collected',
    selector: 'date_sample_collected',
    sortable: false,
  },
  {
    name: 'Test Result',
    selector: 'test_result',
    sortable: false,
    cell: row => (
      <span>
        {row.test_result  ? row.test_result +'' +row.unit_measurement : ''}
      </span>
    )
  }
]
function PreviousTestOrder (props) {
  const [errorMsg, setErrorMsg] = React.useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const onDismiss = () => setShowErrorMsg(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    setLoading(true)
    const onSuccess = () => {
      setData(props.previousTests);
      setLoading(false)
    }
    const onError = () => {
      setLoading(false)
      setErrorMsg("Could not fetch previous medications, try again later");
    }
    props.fetchPatientTestOrder(props.patientId, onSuccess, onError)
  }, [props.patientId]);

  React.useEffect(() => {
    setData(props.previousTests);
  }, [props.previousTests]);
  
 
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
    previousTests: state.patients.previousTestOrders
  }
}

const mapActionToProps = {
  fetchPatientTestOrder: actions.fetchPatientTestOrders,
}

export default connect(mapStateToProps, mapActionToProps)(PreviousTestOrder)