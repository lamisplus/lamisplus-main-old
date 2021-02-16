
import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { fetchAllLabTestOrder } from "./../../../actions/laboratory";
import "./../laboratory.css";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const PatientSearch = (props) => {
  const [loading, setLoading] = useState('')
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
    const collectedSamples = []
    props.patientsTestOrderList.forEach(function(value, index, array) {
        const dataSamples = value.formDataObj 
        for(var i=0; i<dataSamples.length; i++){
            for (var key in dataSamples[i]) {
              if (dataSamples[i][key]!==null && dataSamples[i][key].lab_test_order_status >= 3 )
                collectedSamples.push(value)
            }            
          }
    });
      function totalResultCollected (test){
        const  maxVal = []      
        for(var i=0; i<test.length; i++){
          for (var key in test[i]) {
            if (test[i][key]!==null && test[i][key].lab_test_order_status ===5)
              maxVal.push(test[i][key])
          }
         
        }
        return maxVal.length;
        //return 2
      }

  return (
    <div>
      <MaterialTable
        title="Laboratory Test Results"
        columns={[
          { title: "Patient ID", field: "Id" },
          {
            title: "Patient Name",
            field: "name",
          },
          { title: "Date Order", field: "date", type: "date" , filtering: false},          
          {
            title: "Total Sample ",
            field: "count",
            filtering: false
          },
          {
            title: "Total Result ",
            field: "samplecount",
            filtering: false
          },
          {
            title: "Action",
            field: "actions",
            filtering: false,
          },
        ]}
        isLoading={loading}
        data={collectedSamples.map((row) => ({
          Id: row.hospitalNumber,
          name: row.firstName +  ' ' + row.lastName,
          
          date: row.dateEncounter,
          count: row.formDataObj.length,
          samplecount: totalResultCollected(row.formDataObj),
          actions: <Link to ={{ 
                        pathname: "/collect-result",  
                        state: row
                      }} 
                        style={{ cursor: "pointer", color: "blue", 
                        fontStyle: "bold" }}>
                          <Tooltip title="Enter Result">
                            <IconButton aria-label="Enter Result" >
                            <NoteAddIcon color="primary"/>
                          </IconButton>
                          </Tooltip>
                        </Link>

            }))}
        options={{
          pageSizeOptions: [5,10,50,100,150,200],
          headerStyle: {
            backgroundColor: "#9F9FA5",
            color: "#000",
            margin: "auto"
          },
          filtering: true,
          searchFieldStyle: {
            width : '300%',
            margingLeft: '250px',
          },
          
          exportButton: true,
          searchFieldAlignment: 'left',
          
        }}

      />
    </div>
  );
}

const mapStateToProps = state => {

    return {
      patientsTestOrderList: state.laboratory.list
    };
  };
  
  const mapActionToProps = {
    fetchAllLabTestOrderToday: fetchAllLabTestOrder
  };
  
export default connect(mapStateToProps, mapActionToProps)(PatientSearch);


