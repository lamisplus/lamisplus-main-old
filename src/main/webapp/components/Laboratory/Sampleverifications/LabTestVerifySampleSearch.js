
import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { fetchAllLabTestOrder } from "./../../../actions/laboratory";
import "./../laboratory.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
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
 
    function totalSampleVerified (test){
      const  maxVal = []
      for(var i=0; i<test.length; i++){
        for (var key in test[i]) {
          if (test[i][key]!==null && test[i][key].lab_test_order_status >2 )
            maxVal.push(test[i][key])
        }
        
      }
          return maxVal.length;
    }



  return (
    <div>
      <MaterialTable
          title="Laboratory Sample Verification"
          columns={[
            { title: "Patient ID", field: "Id" },
            {
                title: "Patient Name",
                field: "name",
            },
          
            { title: "Date Order", field: "date", type: "date", filtering: false },
            {
                title: "Total Sample ",
                field: "count",
                filtering: false
            },
            {
                title: "Total Verified ",
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
        data={props.patientsTestOrderList.map((row) => ({
            Id: row.patientId,
            name: row.firstName +  ' ' + row.lastName,
            date: row.dateEncounter,
            count: row.formDataObj.length,
            samplecount: totalSampleVerified(row.formDataObj),
            actions: <Link to ={{ 
                                    pathname: "/sample-verification",  
                                    state: row
                                }}  
                                    style={{ cursor: "pointer", color: "blue", fontStyle: "bold" 
                                }}
                      >
                                <Tooltip title="Sample Verification">
                                    <IconButton aria-label="Sample Verification" >
                                        <VisibilityIcon color="primary"/>
                                    </IconButton>
                                </Tooltip>
                      </Link>

            })
        )}
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
        patientsTestOrderList: state.laboratory.list
    };
  };
  
  const mapActionToProps = {
      fetchAllLabTestOrderToday: fetchAllLabTestOrder
  };
  
export default connect(mapStateToProps, mapActionToProps)(PatientSearch);


