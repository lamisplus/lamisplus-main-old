
import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import {Col,Input,FormGroup,Label} from "reactstrap";
import { fetchAllLabTestOrder } from "../../../../actions/laboratory";
import "../casemanager.css";
import {GiFiles} from 'react-icons/gi'; 
import { Badge } from 'reactstrap';
import Button from "@material-ui/core/Button";
import SwitchPatientModal from './SwitchPatientModal';
import {authentication} from '../../../../_services/authentication';
import Page from '../../../Page';

const CaseManagerPatientList = (props) => {
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
    
    <Page title='Re-Assign Patients'>
        <br/>
        <br/>
      <>
        <Col md={3}>
          <FormGroup>
              <Label for="">Program Type </Label>

              <Input
                  type="select"
                  name="sample_collected_by"
                  id="sample_collected_by"
                  vaule=""
                  className=" float-left mr-1"
              >
                  <option value=""> </option>
                  <option value="eid"> Hiv </option>
                  <option value="viral Load"> Tb </option>
                 
              </Input>
              
          </FormGroup>
      </Col>
       </>            
      <Link to="/patients-managed-case">
        {/* <Link to="/dispatched-sample"> */}
            <Button
              color="primary"
              variant="contained"
              className=" float-right mr-1"
              size="large"
            >
              {<GiFiles />} &nbsp;&nbsp;
              <span style={{textTransform: 'capitalize'}}>Back </span>
                  &nbsp;&nbsp;
                          
            </Button>
      </Link>
      
        <br/>
        <br/>
        <br/>
      <MaterialTable
        title="List of Samples to Dispatch "
        columns={[
        
          { title: "FormDataObj ", 
            field: "formDataObj",
            hidden: true
          },
          
          {
              title: "Sample Type",
              field: "sampleType",
          },

          {
            title: "Date Sample Ordered ",
            field: "dateSampleOrdered",
          },
          { 
            title: "Time Sample Ordered", 
            field: "timeSampleOrdered"
          },
          { 
            title: "Date Sample Collected", 
            field: "dateSampleCollected", 
            type: "date" , 
            filtering: false
          },
          {
            title: "Time Sample Collected",
            field: "timeSampleCollected",
          },
          { 
            title: "Sample Ordered By", 
            field: "sampleOrderedBy"
          },   
          { 
            title: "Sample Transferred By", 
            field: "sampleTransferredBy",            
          },    
          { 
            title: "Date Sample Transferred", 
            field: "dateSampleTransferred",hidden: true             
          },
          
          {
            title: "Date Sample Transfered",
            field: "dateSampleTransferred",  hidden: true          
          },
          {
            title: "Sample Collected By",
            field: "sampleCollectedBy",  hidden: true 
          }, 
          {
            title: "Sample Transfered By",
            field: "sampleTransferredBy",  hidden: true           
          },      
          {
              title: "Viral Load Indication",
              field: "viralLoadIndication", hidden: true  
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
      <SwitchPatientModal modalstatus={modal3} togglestatus={togglemodal3} manifestSamples={collectmodal} />

    </Page>
    
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