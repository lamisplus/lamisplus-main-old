
import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { fetchAllLabTestOrder } from "../../../../actions/laboratory";
import "../casemanager.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Page from '../../../Page';

const CaseManager = (props) => {
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
        if(value.formDataObj.data!==null) {
        for(var i=0; i<dataSamples.length; i++){
            for (var key in dataSamples[i]) {
              if (dataSamples[i][key]!==null && dataSamples[i][key].lab_test_order_status < 1 )
                collectedSamples.push(value)
            }            
          }
        }
    });

    function totalSampleConllected (test){
        const  maxVal = []
          for(var i=0; i<test.length; i++){
              for (var key in test[i]) {
                  if ( test[i][key]!==null && test[i][key].lab_test_order_status)
                        if(test[i][key].lab_test_order_status >=1)
                            maxVal.push(test[i][key])
              }
          }
        return maxVal.length;
    }
    
  return (
    <Page title='Case Manager Patients'>
      
        <br/>
         
        <br/>
          <MaterialTable
              title="Patient List"
              columns={[
                  { title: "Name", field: "Id" },
                  {
                    title: "Programm",
                    field: "name",
                  },
                  { title: "Date", field: "date", type: "date" , filtering: false},          
                  {
                    title: "Total Patients ",
                    field: "count",
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
                  
                  actions:  <Link to ={{ 
                                  pathname: "/case-manager",  
                                  state: row
                              }} 
                                  style={{ cursor: "pointer", color: "blue", fontStyle: "bold"}}
                            >
                                <Tooltip title="Collect Sample">
                                    <IconButton aria-label="Collect Sample" >
                                        <VisibilityIcon color="primary"/>
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
    </Page>
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
  
export default connect(mapStateToProps, mapActionToProps)(CaseManager);