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

      <MaterialTable
          icons={tableIcons}
          components={{
            Container: props => <Paper {...props} elevation={0}/>
          }}
          isLoading={loading}
          title=""
          columns={[
            { title: 'Test', field: 'description' },
            { title: 'Test Status', field: 'test_order_status', render: row =>  <span><Badge  color="primary">{RADIOLOGY_ORDER_STATUS.find(x => x.id == row.test_order_status) ? RADIOLOGY_ORDER_STATUS.find(x => x.id == row.test_order_status).name : ''}</Badge></span> },
            { title: 'Date Ordered', field: 'order_date'},
            { title: 'Test Result', field: 'prescription_status', render: row =>  <Tooltip title="View Result" >
                <IconButton aria-label="Enter Result" onClick={(e) => {
                  const data = {data: row}
                  openResultPage(e, data)
                }}>
                  <FaRegEye color="primary"/>
                </IconButton>
              </Tooltip>},
          ]}
          data={data}
          options={{
            padding: 'dense',
            header: true,
            showTitle: false,
            pageSize: 5,
            search: false
          }}
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