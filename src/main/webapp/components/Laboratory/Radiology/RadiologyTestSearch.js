
import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { fetchAllRadiologyTestOrder } from "./../../../actions/laboratory";
import "./../laboratory.css";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const RadiologyTestSearch = (props) => {
  const [loading, setLoading] = useState('')
  useEffect(() => {
    setLoading('true');
    const onSuccess = () => {
      setLoading(false)
    }
    const onError = () => {
      setLoading(false)     
    }
        props.fetchAllTestOrder(onSuccess, onError);
      }, []); //componentDidMount
      
      function totalResultCollected (test){
        const  maxVal = []
       
        for(var i=0; i<test.length; i++){
          for (var key in test[i]) {
            if (test[i][key]!==null && test[i][key].lab_test_order_status=== 5)
              maxVal.push(test[i][key])
          }
         
        }
        return maxVal.length;
        //return 2
      }
 
  return (
    <div>
      <MaterialTable
        title="Radiology Test Results"
        columns={[
          { title: "Patient ID", field: "Id" },
          {
            title: "Patient Name",
            field: "name",
          },
          { title: "Date Ordered", field: "date", type: "date" , filtering: false},
          {
            title: "Total Test ",
            field: "count",
            filtering: false
          },
          {
            title: "Total Result ",
            field: "resultCount",
            filtering: false
          },
          {
            title: "Action",
            field: "actions",
            filtering: false,
          },
        ]}
        isLoading={loading}
        data={props.patientsTestOrderList.map((row) => ({
          Id: row.hospitalNumber,
          name: row.firstName +  ' ' + row.lastName,
          date: row.dateEncounter,
          count: row.formDataObj.length,
          resultCount: row.formDataObj.filter(x => x.data && x.data.files && x.data.files.length > 0).length,
          actions: <Link to ={"/radiology?encId="+row.encounterId+"&hospitalNumber="+row.hospitalNumber}
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
      patientsTestOrderList: state.laboratory.radiologySearchList
    };
  };
  
  const mapActionToProps = {
    fetchAllTestOrder: fetchAllRadiologyTestOrder
  };
  
export default connect(mapStateToProps, mapActionToProps)(RadiologyTestSearch);


