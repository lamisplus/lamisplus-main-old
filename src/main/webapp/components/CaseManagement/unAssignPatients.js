import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import axios from "axios";
import { url as baseUrl } from "../../api";
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
import {Col,FormGroup,Label,Input, Row, Card} from 'reactstrap';
import {url} from '../../api';
import {  toast } from "react-toastify";
import Button from "@material-ui/core/Button";

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
  const [otherDetails, setOtherDetails] = useState({state: "", lga: "", gender: "", pregnant:"", to: "", from: ""});
  const [provinces, setProvinces] = useState([]);
  const [gender, setGender] = useState([]);
  const [lgaDetail, setLgaDetail] = useState();
  const [stateDetail, setStateDetail] = useState();
  const [states, setStates] = useState([]);
  const [matchingAgeGroupClass, setMatchingAgeGroupClass] = useState("");
  //Query Parameter
  const [toValue, setToValue] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [lgaValue, setLgaValue] = useState([]);
  const [genderValue, setGenderValue] = useState("");
  const [pregnantValue, setPregnantValue] = useState("");
  /* Get list of gender parameter from the endpoint */
  useEffect(() => {
    async function getGender() {
      axios
        .get(`${url}application-codesets/codesetGroup?codesetGroup=GENDER`)
        .then((response) => {
          console.log(Object.entries(response.data));
          setGender(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.display,
              value: value.display,
            }))
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getGender();
    setStateByCountryId()
  }, []);



//Get States from selected country
const  setStateByCountryId=() =>{
    async function getStateByCountryId() {
        const response = await axios.get(url + 'organisation-units/hierarchy/1/2')
        const stateList = response.data;
        console.log(stateList)
        setStates(stateList);
    }
    getStateByCountryId();
}

//fetch province
const getProvinces = e => {
  setOtherDetails({ ...otherDetails, [e.target.name]: e.target.value });
        const stateId = e.target.value;
          if(stateId =="" || stateId==null){
            setLgaDetail("")
          }else{
            async function getCharacters() {
                const response = await axios.get(`${url}organisation-units/hierarchy/`+stateId+"/3");
                const newStates = states.filter(state => state.id == stateId)
                setStateDetail(newStates)
                setOtherDetails({...otherDetails, state:stateId})
                setProvinces(response.data);

            }
            getCharacters();
          }
};
const getlgaObj = e => {

    const newlga = provinces.filter(lga => lga.id == e.target.value)
    setLgaDetail(newlga)
    setOtherDetails({...otherDetails, lga:e.target.value})
}
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

    const handleInputChange = e => {
      const { name, value } = e.target
      const fieldValue = { [name]: value }
      setOtherDetails({
          ...otherDetails,
          ...fieldValue
      })

  }

    function getCaseManager (evt, data){
        setcollectmodal({...collectmodal, ...data});
        setModal3(!modal3)
        //tableRef.current && tableRef.current.onQueryChange()
     }
    
  const refreshTable = () => {
    tableRef.current && tableRef.current.onQueryChange()
  }


  const dismissAll = () =>  toast.dismiss();
  const handleAgeGroup = (e) => {
    setOtherDetails({...otherDetails, from:e.target.value})
    handleInputChange(e);
    if(otherDetails.from > otherDetails.to){
     // toast.error("Age Group From cannot be greater than Age Group TO")
      setMatchingAgeGroupClass("is-invalid");
      } else {
        dismissAll();
        setMatchingAgeGroupClass("");
      }

  }

  const FilterQuery = () => {
    if(otherDetails.from > otherDetails.to){
       toast.error("Age Group From cannot be greater than Age Group To")
       setMatchingAgeGroupClass("is-invalid");
       }
      setToValue(otherDetails.to)
      setFromValue(otherDetails.from);
      setStateValue(stateDetail && stateDetail.length>0 ? stateDetail[0].name : "");
      setLgaValue(otherDetails.lga);
      setPregnantValue(otherDetails.pregnant);
      setGenderValue(otherDetails.gender);
      //alert("testing")
      refreshTable();
      console.log(stateDetail)
      console.log(otherDetails)
    }
    const codes= programCode==''?'0d31f6ee-571c-45b8-80d5-3f7e1d5377b7' : programCode;

  return (
    <div>
    <Card className=" pr-5  pl-5 pt-5 pb-5">

        
        <Row>
        <Col md={6}>
            <FormGroup>
                <Label for="AgeGroup">Age Group (From) </Label>

                    <Input
                      type="number"
                      name="from"
                      id="from"
                      value={otherDetails.from}
                      onChange={handleInputChange}
                    />
                       
                  
            </FormGroup>
        </Col>
        <Col md={6}>
            <FormGroup>
                <Label for="AgeGroup">Age Group (To) </Label>

                    <Input
                      type="number"
                      name="to"
                      id="to"
                      value={otherDetails.to}
                      onChange={handleAgeGroup}
                      //className={matchingAgeGroupClass}
                   />
                  
            </FormGroup>
        </Col>
      
        </Row>


        <Row>
        <Col md={6} style={{margingTop: "10px !important"}}>
            <FormGroup className="pt-10" >
                <Label for="occupation" >Gender </Label>

                    <Input
                      type="select"
                      name="gender"
                      id="gender"
                      value={otherDetails.gender}
                      onChange={handleInputChange}
                      
                      >
                      <option value=""> </option>
                      {gender.map(({ label, value }) => (
                          <option key={label} value={value}>
                          {label}
                          </option>
                      ))}
                  </Input>
            </FormGroup>
        </Col>
        <Col md={6}>
            <FormGroup>
                <Label >Pregnancy Status </Label>

                    <Input
                      type="select"
                      name="pregnant"
                      id="pregnant"
                      value={otherDetails.pregnant}
                      onChange={handleInputChange}
                    >
                        <option> </option>
                        <option value="true"> True</option>
                        <option value="false"> False</option>
                  </Input>
            </FormGroup>
        </Col>
        </Row>
        <Row>
        <Col md={6}>
            <FormGroup>
                <Label for="occupation">State of Residence </Label>

                    <Input
                      type="select"
                      name="state"
                      id="state"
                      value={otherDetails.stateId}
                          onChange={getProvinces}
                      >
                          <option >Please Select State</option>
                          {states.map((row) => (
                              <option key={row.id} value={row.id}>
                                  {row.name}
                              </option>
                          ))}
                        
                  </Input>
            </FormGroup>
        </Col>
        
        <Col md={6}>
            <FormGroup>
                <Label for="occupation">Local Government Area of Residence </Label>

                    <Input
                      type="select"
                      name="lga"
                      id="lga"
                      value={otherDetails.lga}
                      onChange={getlgaObj}
                      >
                          {provinces.length > 0 ? (
                            <>
                            <option>Please Select LGA</option>
                              {provinces.map((row) => (
                                  <option key={row.name} value={row.name}>
                                      {row.name}
                                  </option>
                              ))
                              }
                            </>
                          ) : (
                              <option key="" value="">
                                  {" "}
                                      No Record Found
                              </option>
                          )}
                  </Input>
            </FormGroup>
        </Col>
  
        <Row>
        <Col md={6}></Col>
        <Col md={6}>
        <br/>
          <Button
              variant="contained"
              color="primary"
              className=" float-right ml-100"
              startIcon={<FilterList />}
              onClick={() =>FilterQuery()}
            >
              <span style={{ textTransform: "capitalize" }}>Filter</span>
          </Button>
        </Col>
        </Row>
      </Row> 
      </Card>  
      <br/>
      <MaterialTable
       icons={tableIcons}
        title="Unassign Patients List"
        tableRef={tableRef}
        columns={[
          { title: "Patient ID", field: "patientId" },
          {title:"Hospital Number", field: "hospitalNumber"},
          {
            title: "Name",
            field: "name",
          },
          { title: "Gender", field: "gender", filtering: false },
          { title: "Age", field: "age", filtering: false },
          { title: "Phone Number", field: "phone", filtering: false },
          { title: "State", field: "state", filtering: false, },
          { title: "lga", field: "lga", filtering: false, },
          { title: "address", field: "address", filtering: false, },
        ]}

        data={query =>
                  new Promise((resolve, reject) =>
                      axios.get(`${baseUrl}patients/${codes}/false/programs?gender=${genderValue}&state=${stateValue}&lga=${lgaValue}&ageFrom=${fromValue}&ageTo=${toValue}&pregnant=${pregnantValue}&size=${query.pageSize}&page=${query.page}`)
                          .then(response => response)
                          .then(result => {

                              console.log( result.headers['x-total-count']);
                              resolve({
                                  data: result.data.map((row) => ({
                                    patientId: row.patientId,
                                    hospitalNumber: row.hospitalNumber,
                                    name: row.firstName + " " + row.lastName,
                                    gender: row.details && row.details.gender && row.details.gender.display ? row.details.gender.display : 'N/A',
                                    age: (row.dob === 0 ||
                                      row.dob === undefined ||
                                      row.dob === null ||
                                      row.dob === "" )
                                      ? 0
                                      : calculate_age(row.details && row.details.dob ? row.details.dob : row.dob),
                                    phone: row.mobilePhoneNumber,
                                    state: row.details!==null && row.details.state ? row.details.state.name : "",
                                    lga: row.details!==null && row.details.province ? row.details.province.name : "",
                                    address: row.street || '',
                                    
                                      
                                  })),
                                  page: query.page,
                                  totalCount: result.headers['x-total-count'],
                              })
                          })
                  )}
       
            options={{
                    selection: true,
                    search: false,
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


