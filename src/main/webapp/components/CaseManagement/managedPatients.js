import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import axios from "axios";
import { url as baseUrl } from "../../api";
import { url } from "../../api";
import { forwardRef } from 'react';
import AssignCaseManager from './AssignCaseManager';
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
import {Col,FormGroup,Label,Input,Row} from 'reactstrap';

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


const CaseManagerSearch = (props) => {
  const tableRef = React.createRef();
  const [modal3, setModal3] = useState(false)//
  const togglemodal3 = () => setModal3(!modal3)
  const [collectmodal, setcollectmodal] = useState([])//

  const [programCode, setProgramCode] = useState("")
  const [programs, setPrograms] = useState([]);


  useEffect(() => {
    async function getPrograms() {
        try {
            const response = await axios(
                url + "programs"
            );
            const body = response.data && response.data !==null ? response.data : {};
            setPrograms(
                 body.map(({ name, code }) => ({ title: name, value: code }))
             );
        } catch (error) {
        }
    }
    getPrograms();
}, []);

 
    const calculate_age = dob => {
        var today = new Date();
        var dateParts = dob.split("-");
        var dateObject = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
        var birthDate = new Date(dateObject); // create a date object directlyfrom`dob1`argument
        var age_now = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age_now--;
            }
            if (age_now === 0) {
                    return m + " month(s)";
                }
                return age_now + " year(s)";
    };

    function getCaseManager (evt, data){
        setcollectmodal({...collectmodal, ...data});
        setModal3(!modal3)
        //tableRef.current && tableRef.current.onQueryChange()
     }
    
  const refreshTable = () => {
    tableRef.current && tableRef.current.onQueryChange()
  }

  const getProgramCode = e => {
    const getValue =e.target.value;
    setProgramCode(getValue)
    refreshTable()
  };

  const codes= programCode==''?'0d31f6ee-571c-45b8-80d5-3f7e1d5377b7?size' : programCode;

  return (
    <div>
    <Row>
       <Col md={6}>
            <FormGroup>
                <Label for="occupation">Facility Case Manager </Label>

                    <Input
                      type="select"
                      name="program"
                      id="program"
                      onChange={getProgramCode}
                    >
                        <option> </option>
                        {programs.map(({ title, value }) => (
                            
                            <option key={value} value={value}>
                                {title}
                            </option>
                        ))}
                        
                  </Input>
            </FormGroup>
        </Col>
        <Col md={6}>
            <FormGroup>
                <Label for="occupation">Age Group </Label>

                    <Input
                      type="select"
                      name="program"
                      id="program"
                      onChange={getProgramCode}
                    >
                        <option> </option>
                        {programs.map(({ title, value }) => (
                            
                            <option key={value} value={value}>
                                {title}
                            </option>
                        ))}
                        
                  </Input>
            </FormGroup>
        </Col>
        <Col md={6}>
            <FormGroup>
                <Label for="occupation">Gender </Label>

                    <Input
                      type="select"
                      name="program"
                      id="program"
                      onChange={getProgramCode}
                    >
                        <option> </option>
                        {programs.map(({ title, value }) => (
                            
                            <option key={value} value={value}>
                                {title}
                            </option>
                        ))}
                        
                  </Input>
            </FormGroup>
        </Col>
        <Col md={6}>
            <FormGroup>
                <Label for="occupation">Prrgnancy Status </Label>

                    <Input
                      type="select"
                      name="program"
                      id="program"
                      onChange={getProgramCode}
                    >
                        <option> </option>
                        {programs.map(({ title, value }) => (
                            
                            <option key={value} value={value}>
                                {title}
                            </option>
                        ))}
                        
                  </Input>
            </FormGroup>
        </Col>
        <Col md={6}>
            <FormGroup>
                <Label for="occupation">LGA of Residence </Label>

                    <Input
                      type="select"
                      name="program"
                      id="program"
                      onChange={getProgramCode}
                    >
                        <option> </option>
                        {programs.map(({ title, value }) => (
                            
                            <option key={value} value={value}>
                                {title}
                            </option>
                        ))}
                        
                  </Input>
            </FormGroup>
        </Col>
        <Col md={6}>
            <FormGroup>
                <Label for="occupation">State of Residence </Label>

                    <Input
                      type="select"
                      name="program"
                      id="program"
                      onChange={getProgramCode}
                    >
                        <option> </option>
                        {programs.map(({ title, value }) => (
                            
                            <option key={value} value={value}>
                                {title}
                            </option>
                        ))}
                        
                  </Input>
            </FormGroup>
        </Col>
        
      </Row>  
      <MaterialTable
       icons={tableIcons}
        title="List of Managed Patients"
        tableRef={tableRef}
        columns={[
          { title: " ID", field: "patientId" },
          {
            title: "Name",
            field: "name",
          },
          { title: "Gender", field: "gender", filtering: false },
          { title: "Age", field: "age", filtering: false },
          { title: "Disease Area", field: "area", filtering: false },
          { title: "User Assigned", field: "user", filtering: false },
          { title: "Status", field: "status", filtering: false, },
        ]}

        data={query =>
                  new Promise((resolve, reject) =>
                      axios.get(`${baseUrl}patients/managed/${codes}?size=${query.pageSize}&page=${query.page}&search=${query.search}`)
                          .then(response => response)
                          .then(result => {

                              console.log( result.headers['x-total-count']);
                              resolve({
                                  data: result.data.map((row) => ({
                                    patientId: row.patientId + "(" + row.hospitalNumber + ")" ,
                                    name: row.firstName + " " + row.lastName,
                                    gender: row.details && row.details.gender && row.details.gender.display ? row.details.gender.display : 'N/A',
                                    age: (row.dob === 0 ||
                                      row.dob === undefined ||
                                      row.dob === null ||
                                      row.dob === "" )
                                      ? 0
                                      : calculate_age(row.details && row.details.dob ? row.details.dob : row.dob),
                                    address: row.street || '',
                                    area: "HIV",
                                    user: "John Snow",
                                    status: "Active",
                                    
                                      
                                  })),
                                  page: query.page,
                                  totalCount: result.headers['x-total-count'],
                              })
                          })
                  )}
       
            options={{
                    selection: true,
                    headerStyle: {
                        backgroundColor: "#9F9FA5",
                        color: "#000",
                    },
                    searchFieldStyle: {
                        width : '300%',
                        margingLeft: '250px',
                    },
                    filtering: false,
                    exportButton: false,
                    searchFieldAlignment: 'left',
                    pageSizeOptions:[10,20,100],
                    pageSize:10,
                    debounceInterval: 400
                }}
              actions={[        
                    {
                    tooltip: 'Assign Case Manager',
                    icon: 'add' ,
                    label: 'Assign Case Manager ',
                    onClick: (evt, data) => getCaseManager(evt, data)
                    }
        ]} 
      />

      <AssignCaseManager modalstatus={modal3} togglestatus={togglemodal3} totalPatients={collectmodal} loadPatients={refreshTable}/>

    </div>
  );
}

export default CaseManagerSearch;


