
import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import {Col, Input, FormGroup, Label, CardBody, Card} from "reactstrap";
import { fetchAllLabTestOrder } from "../../../../actions/laboratory";
import "../casemanager.css";
import {GiFiles} from 'react-icons/gi'; 
import { Badge } from 'reactstrap';
import Button from "@material-ui/core/Button";
import AddPatientModal from './AddPatientModal';
import {authentication} from '../../../../_services/authentication';
import Page from '../../../Page';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

const CaseManagerPatientList = (props) => {
    const row = props.location.state
  const [loading, setLoading] = useState('')
  const [modal3, setModal3] = useState(false)//modal to View Result
  const togglemodal3 = () => setModal3(!modal3)
  
  const [collectmodal, setcollectmodal] = useState([])//to collect array of datas into the modal and pass it as props
            
useEffect(() => {
  
    setLoading('true');
  const onSuccess = () => {
     setLoading(false)
  }
  const onError = () => {
      setLoading(false)     
  }
      props.fetchAllLabTestOrderToday(onSuccess, onError);
    }, []); //componentDidMount
   
    const labTestType = [];    
    
    props.testOrder.forEach(function(value, index, array) {
          const getList = value['formDataObj'].find(x => { 
            
            if(x.data && x.data!==null && x.data.lab_test_order_status===2 && x.data.manifest_status==null){
              x['hospitalNumber'] = value.hospitalNumber;
              x['firstName'] = value.firstName ;
              x['lastName'] = value.lastName;
              labTestType.push(x);
            }
          
          })         
     });

     function getDispatch (evt, data){
        setcollectmodal({...collectmodal, ...data});
        setModal3(!modal3) 
     }
     
         //This is function to check for the status of each collection to display on the tablist below 
    const sampleStatus = e =>{
      if(e===1){
          return (<p><Badge  color="light">Sample Collected</Badge></p>)
      }else if(e===2){
          return (<p><Badge  color="light">Sample Transfered</Badge></p>)
      }else if(e==="3"){
          return (<p><Badge  color="light">Sample Verified</Badge></p>)
      }else if(e==="4"){
          return (<p><Badge  color="light">Sample Rejected</Badge></p>)
      }else if(e===5){
          return (<p><Badge  color="light">Result Available</Badge></p>)
      }else{
          return (<p>{" "}</p>)
      }
  }

  return (
      <Card>
          <CardBody>
      <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to={{pathname: "/admin"}} >
          Case Managers
          </Link>
          <Typography color="textPrimary">Assign/Reassign Client to Case Manager - {row.firstName +  ' ' + row.lastName || ''} </Typography>
      </Breadcrumbs>
      <br/>
      <Link to="/patients-managed-case">
        {/* <Link to="/dispatched-sample"> */}
            <Button
              color="primary"
              variant="contained"
              className=" float-right mr-1"
              size="large">
              {<GiFiles />} &nbsp;&nbsp;
              <span style={{textTransform: 'capitalize'}}>List of Case Manger  </span>
                  &nbsp;&nbsp;
              <span style={{textTransform: 'capitalize'}}> Patients </span>              
            </Button>
      </Link>
      <Link to="/switch-patients">
            <Button
              color="primary"
              variant="contained"
              className=" float-right mr-1"
              size="large">
              {<GiFiles />} &nbsp;&nbsp;
              <span style={{textTransform: 'capitalize'}}>Re-assign</span>
                  &nbsp;&nbsp;
              <span style={{textTransform: 'capitalize'}}> Patients </span>              
            </Button>
      </Link>
        <br/>
        <br/>
        <br/>
        <br/>
      <MaterialTable
        title="List of Patients to assign and reassign "
        columns={[
          {
              title: "Patient Name",
              field: "row.firstName +  ' ' + row.lastName ",
          },

          {
            title: "Patient ID",
            field: "patientId",
          },
          { 
            title: "Age",
            field: "age",
              filtering: false
          },
          { 
            title: "Address",
            field: "address",
            filtering: false
          },
        ]}
        isLoading={loading}
        data={labTestType.map((row) => ({
            formDataObj:row,
            sampleType: row.data.sample_type,
            dateSampleOrdered: row.data.date_sample_ordered,
            timeSampleOrdered: row.data.time_sample_collected,
            dateSampleCollected: row.data.date_sample_collected,
            timeSampleCollected: row.data.time_sample_collected,
            sampleOrderedBy: row.data.sample_ordered_by,
            sampleTransferredBy: row.data.sample_transfered_by,
            dateSampleTransferred : row.data.date_sample_transfered,
            sampleCollectedBy: row.data.sample_collected_by,
            }))}
        options={{
            search: false,
            selection: true,
            pageSizeOptions: [5,10,50,100,150,200],
            headerStyle: {
                backgroundColor: "#9F9FA5",
                color: "#000",
                margin: "auto"
            },
         
        }}
        actions={[         
            {
              tooltip: 'Dispatch All Selected Sample',
              disabled: !authentication.userHasRole(["laboratory_write"]),
              icon: 'add' ,
              label: 'Add Manifest',
              onClick: (evt, data) =>
                //alert('You want to dispatch ' + evt + data),
                getDispatch(evt, data)   
            
            }
        ]}       
      />
      <AddPatientModal modalstatus={modal3} togglestatus={togglemodal3} manifestSamples={collectmodal} />
          </CardBody>
      </Card>
  );
}



const mapStateToProps = state => {
    return {
        testOrder: state.laboratory.list
    };
  };
  
  const mapActionToProps = {
      fetchAllLabTestOrderToday: fetchAllLabTestOrder
  };
  
export default connect(mapStateToProps, mapActionToProps)(CaseManagerPatientList);