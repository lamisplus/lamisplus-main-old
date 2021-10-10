
import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { fetchAllRadiologyTestOrder } from "./../../../actions/laboratory";
import "./../laboratory.css";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
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
      icons={tableIcons}
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
          actions:<Link to ={{pathname: "/radiology",
              state: {encId: row.encounterId, hospitalNumber:row.hospitalNumber}}}
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


