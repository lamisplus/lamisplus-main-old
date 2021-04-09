import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { fetchById } from "../../../actions/caseManager";
import "./casemanager.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import {Card, CardBody} from "reactstrap";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import { APPLICATION_CODESET_GENDER } from "../../../actions/types";
import { fetchApplicationCodeSet } from "../../../actions/applicationCodeset";


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
            props.fetchById(598, onSuccess, onError);
    }, []); //componentDidMount

    React.useEffect(() => {
        if(props.genderList.length === 0){
            props.fetchApplicationCodeSet("GENDER", APPLICATION_CODESET_GENDER);
        }
    }, [props.genderList]);

    function getGenderById(id) {
        return id ? ( props.genderList.find((x) => x.id == id) ? props.genderList.find((x) => x.id == id).display : "" ) : "";
    }
    console.log(props.list)
  return (
      <Card>
          <CardBody>
              <Breadcrumbs aria-label="breadcrumb">
                  <Link color="inherit" to={{pathname: "/admin"}} >
                      Admin
                  </Link>
                  <Typography color="textPrimary">Case Managers List</Typography>
              </Breadcrumbs>
              <br/>
          <MaterialTable
              title="Case Managers"
              columns={[
                  {title: "name", field: "name",},
                  { title: "Gender", field: "gender", filtering: false },
                  {title: "Role", field: "roles",},
                  {title: "Action", field: "actions", filtering: false,},
              ]}
              isLoading={loading}
              data={props.list.map((row) => ({
                  name: row.firstName +  ' ' + row.lastName,
                  gender: getGenderById(row.genderId),
                  roles: row.roles,
                  actions:<Link to ={{pathname: "/case-manager", state: row}}
                                  style={{ cursor: "pointer", color: "blue", fontStyle: "bold"}}>
                                <Tooltip title="assign client">
                                    <IconButton aria-label="Assign client" >
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
          </CardBody>
      </Card>
  );
}

const mapStateToProps = state => {
    return {
        genderList: state.applicationCodesets.genderList,
        list: state.caseManager.list
    };
};
const mapActionToProps = {
    fetchById: fetchById,
    fetchApplicationCodeSet: fetchApplicationCodeSet
};


export default connect(mapStateToProps, mapActionToProps)(CaseManager);