
import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { fetchAllLabTestOrder } from "./../../../actions/laboratory";
import "./../laboratory.css";
import {GiFiles} from 'react-icons/gi'; 
import { Badge } from 'reactstrap';
import Button from "@material-ui/core/Button";
import DispatchedModal from './DispatchedModal';


const PatientSearch = (props) => {
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
              console.log(x)
              labTestType.push(x);
            }
           // return console.log(x)
          
          })         
     });

     function getDispatch (evt, data){
        console.log( data)
        setcollectmodal({...collectmodal, ...data});
        setModal3(!modal3) 
     }
     
         //This is function to check for the status of each collection to display on the tablist below 
    const sampleStatus = e =>{
      console.log(e)
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
  //console.log(labTestType)

  return (
    <div>
      <br/>
      <Link to={{ 
                  pathname: "/",  
                  name: "testing"
              }}>
        <Button
          variant="contained"
          color="primary"
          className=" float-right mr-1"
          size="large"
        >
          {<GiFiles />} { " "}
          <span style={{textTransform: 'capitalize'}}>Print Manifest  </span>
                          
        </Button>
      </Link>
      <Link to="/dispatched-sample">
        {/* <Link to="/dispatched-sample"> */}
            <Button
              color="primary"
              variant="contained"
              className=" float-right mr-1"
              size="large"
            >
              {<GiFiles />} &nbsp;&nbsp;
              <span style={{textTransform: 'capitalize'}}>Dispatched  </span>
                  &nbsp;&nbsp;
              <span style={{textTransform: 'capitalize'}}>Samples </span>              
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
              field: "sample_type",
          },

          {
            title: "Date Sample Ordered ",
            field: "date_sample_ordered",
          },
          { 
            title: "Time Sample Ordered", 
            field: "time_sample_ordered"
          },
          { 
            title: "Date Sample Collected", 
            field: "date_sample_collected", 
            type: "date" , 
            filtering: false
          },
          {
            title: "Time Sample Collected",
            field: "time_sample_collected",
          },

          { 
            title: "Sample Ordered By", 
            field: "sample_ordered_by"
          },   
          { 
            title: "Sample Transferred By", 
            field: "sample_transferred_by",
            hidden: true
          },    
          { 
            title: "Date Sample Transferred", 
            field: "date_sample_transferred",
            hidden: true
          },
           
          { 
            title: "Time Sample Transferred", 
            field: "time_sample_transferred",
            hidden: true
          }, 
          { 
            title: "Vira Load Indication", 
            field: "viral_load_indication",
            hidden: true
          },
          { 
            title: "Lab Order Priority", 
            field: "lab_order_priority",
            hidden: true
          },
                  
          {
              title: "Viral Load Indication",
              field: "viralLoadIndication",
              hidden: true
          },
          
        ]}
        isLoading={loading}
        data={labTestType.map((row) => ({
            formDataObj:row,
            sample_type: row.data.sample_type,
            lab_order_priority: row.data.order_priority,
            date_sample_ordered: row.data.date_sample_ordered,
            time_sample_ordered: row.data.time_sample_collected,
            date_sample_collected: row.data.date_sample_collected,
            time_sample_collected: row.data.time_sample_collected,
            sample_ordered_by: row.data.sample_collected_by,
            viralLoadIndication: row.data.viralLoadIndication,
            }))}
        options={{
            search: false,
            selection: true,
            headerStyle: {
                backgroundColor: "#9F9FA5",
                color: "#000",
                margin: "auto"
            },
         
        }}
        actions={[         
            {
              tooltip: 'Dispatch All Selected Sample',
              icon: 'add',
              onClick: (evt, data) =>
                //alert('You want to dispatch ' + evt + data),
                getDispatch(evt, data)
                
            
            }
        ]}
      />
      <DispatchedModal modalstatus={modal3} togglestatus={togglemodal3} manifestSamples={collectmodal} />

    </div>
    
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
  
export default connect(mapStateToProps, mapActionToProps)(PatientSearch);