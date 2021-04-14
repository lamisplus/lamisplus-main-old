import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import {CardBody, Card} from "reactstrap";
import { fetchAll } from "../../../../actions/patients";
import "../casemanager.css";
import {GiFiles} from 'react-icons/gi';
import Button from "@material-ui/core/Button";
import AddPatientModal from './AddPatientModal';
import {authentication} from '../../../../_services/authentication';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import { APPLICATION_CODESET_GENDER } from "../../../../actions/types";
import { fetchApplicationCodeSet } from "../../../../actions/applicationCodeset";

const CaseManagerPatientList = (props) => {
    const row = props.location.state
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
        props.fetchAllPatients(onSuccess, onError);
    }, []); //componentDidMount

    const calculate_age = dob => {
        var today = new Date();
        var dateParts = dob.split("-");
        var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
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

    React.useEffect(() => {
        if(props.genderList.length === 0){
            props.fetchApplicationCodeSet("GENDER", APPLICATION_CODESET_GENDER);
        }
    }, [props.genderList]);

    function getGenderById(id) {
        return id ? ( props.genderList.find((x) => x.id == id) ? props.genderList.find((x) => x.id == id).display : "" ) : "";
    }

     function getDispatch (evt, data){
        setcollectmodal({...collectmodal, ...data});
        setModal3(!modal3)
     }

  return (
      <Card>
          <CardBody>
      <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to={{pathname: "/admin"}} >
          Case Managers
          </Link>
          <Typography color="textPrimary">Assign Clients to Case Manager - {row.firstName +  ' ' + row.lastName || ''} </Typography>
      </Breadcrumbs>
      <br/>
      <Link to="/patients-managed-case">
            <Button
              color="primary"
              variant="contained"
              className=" float-right mr-1"
              size="large">
              {<GiFiles />} &nbsp;&nbsp;
              <span style={{textTransform: 'capitalize'}}>list of case manger  </span>
                  &nbsp;
              <span style={{textTransform: 'capitalize'}}>Patients</span>
            </Button>
      </Link>
        <br/>
        <br/>
        <br/>
        <br/>
      <MaterialTable
        title="List of Patients to assign"
        columns={[
            {title: "Patient Name", field: "name",},
            { title: "Patient ID", field: "id" },
            { title: "Gender", field: "gender", filtering: false },
            { title: "Age", field: "age", filtering: false },
          {title: "Address", field: "address", filtering: false},
        ]}
        isLoading={loading}
        data={props.patientsList.map((row) => ({
                    name: row.firstName +  ' ' + row.lastName,
                     id: row.hospitalNumber,
                    gender: getGenderById(row.genderId),
                    age: (row.dob === 0 ||
                        row.dob === undefined ||
                        row.dob === null ||
                        row.dob === "" )
                        ? 0
                        : calculate_age(row.dob),
                    address: row.street || '',
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

                getDispatch(evt, data)
            }
        ]}       
      />
      <AddPatientModal modalstatus={modal3} togglestatus={togglemodal3} listOfPatient={collectmodal} userId={row.id}/>
          </CardBody>
      </Card>
  );
}

const mapStateToProps = state => {
    return {
        genderList: state.applicationCodesets.genderList,
        patientsList: state.patients.list,
    };
  };
  
  const mapActionToProps = {
      fetchAllPatients: fetchAll,
      fetchApplicationCodeSet: fetchApplicationCodeSet
  };
  
export default connect(mapStateToProps, mapActionToProps)(CaseManagerPatientList);