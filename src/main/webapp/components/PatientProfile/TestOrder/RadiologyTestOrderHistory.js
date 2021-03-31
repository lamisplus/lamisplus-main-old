import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import {Alert, Card} from 'reactstrap'
import {fetchPatientRadiologyTestOrder} from "actions/patients";
import {connect} from 'react-redux';
import {RADIOLOGY_ORDER_STATUS} from 'api/codes'
import { Badge } from 'reactstrap';
import ViewResultPage from "../../Laboratory/Radiology/ViewResultPage";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { FaRegEye} from 'react-icons/fa';

import {Link} from "react-router-dom";

const columns = (openViewModal) => [
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
    selector: 'test_order_status',
    sortable: false,
    cell: (row) => (
        <span><Badge  color="primary">{RADIOLOGY_ORDER_STATUS.find(x => x.id == row.test_order_status) ? RADIOLOGY_ORDER_STATUS.find(x => x.id == row.test_order_status).name : ''}</Badge></span>
      )
  },
  {
    name: 'Date Ordered',
    selector: 'order_date',
    sortable: false,
  },
  {
    name: 'Test Result',
    selector: 'test_result',
    sortable: false,
    cell: row => (
        <Tooltip title="View Result" >
          <IconButton aria-label="Enter Result" onClick={(e) => {
            const data = {data: row}
            openViewModal(e, data)
          }}>
            <FaRegEye color="primary"/>
          </IconButton>
        </Tooltip>
    )
  }
]
function PreviousRadiologyTestOrder (props) {
  const [errorMsg, setErrorMsg] = React.useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const onDismiss = () => setShowErrorMsg(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showViewModal, setShowViewModal] = React.useState(false);
  const toggleViewModal = () => setShowViewModal(!showViewModal)
  const [testOrder, setTestOrder] = React.useState(null);

  useEffect(() => {
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

  useEffect(() => {
    setData(props.previousTests);
  }, [props.previousTests]);

  const openResultPage = (e, row) => {
    e.preventDefault();
    if(row.files) {
      const files  = row.files.map(x => {
        x.file["name"] = x.file.path;
        return x
      })
      row["files"] = files;
    } else {
      //row["data"] = {...defaultFormValue, ...row.data};
    }
    setTestOrder(row);
    toggleViewModal();
  }
 
  return (
    <div>
        <Alert color='danger' isOpen={showErrorMsg} toggle={onDismiss}>
            {errorMsg}
        </Alert>
        <DataTable
            columns={columns(openResultPage)}
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
      <ViewResultPage toggleModal={toggleViewModal} showModal={showViewModal}  formData={testOrder}/>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    previousTests: state.patients.previousRadiologyOrders
  }
}

const mapActionToProps = {
  fetchPatientTestOrder: fetchPatientRadiologyTestOrder,
}

export default connect(mapStateToProps, mapActionToProps)(PreviousRadiologyTestOrder)