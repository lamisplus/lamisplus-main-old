import React, {useState} from 'react';
import MaterialTable from 'material-table';
import { useSelector} from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteChart from './DeleteChart';

const PatientSearch = (props) => {
  const prescriptions = useSelector(state => state.pharmacy.allPrescriptions)
  const [modal3, setModal3] = useState(false)//modal to View Result
  const togglemodal3 = () => setModal3(!modal3)
  const [collectmodal, setcollectmodal] = useState([])

const deleteButton = (data) =>{
        setcollectmodal({...collectmodal, ...data});
        setModal3(!modal3)
}
 
  return (
    <div>
      <MaterialTable
      
        title="User Charts List"
        columns={[
          { title: "ID", field: "Id" },
          {
            title: "Chart Name",
            field: "name",
          },
          { title: " Date Created", field: "date", type: "date" },
          {
            title: "Chart Title",
            field: "chartTitle",
            filtering: false,
          },
          {
            title: "Chart Type",
            field: "chartType",
            filtering: false,
          },
         
          {
            title: "Action",
            field: "actions",
            filtering: false,
          },
        ]}
        data={ prescriptions.map((prescription) => ({
          Id: prescription.hospitalNumber,
          name: 'Sample Types',
          date: prescription.dateEncounter,
          chartTitle: 'Laboratory',
          chartType: 'Bar Chart',
          actions: (

              <Tooltip title="View Prescription">
                <IconButton aria-label="View Prescription" onClick= {()=>deleteButton()}>
                  <DeleteIcon color="primary" />
                </IconButton>
              </Tooltip>

          ),
        }))}
        options={{
          pageSizeOptions: [50,100,150,200],
          actionsColumnIndex: -1,
          headerStyle: {
            backgroundColor: "#9F9FA5",
            color: "#000",
            margin: "auto",
          },
          filtering: true,

          searchFieldStyle: {
            width: "300%",
            margingLeft: "250px",
          },

          exportButton: true,
          searchFieldAlignment: "left",
        }}
      />
       <DeleteChart modalstatus={modal3} togglestatus={togglemodal3} manifestSamples={collectmodal} />
    </div>
  );
}

export default PatientSearch;


