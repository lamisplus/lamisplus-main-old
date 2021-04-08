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
            props.fetchById(onSuccess, onError);
    }, []); //componentDidMount

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
                  { title: "ID", field: "id" },
                  {title: "name", field: "name",},
                  {title: "Action", field: "actions", filtering: false,},
              ]}
              isLoading={loading}
              data={props.list.map((row) => ({
                  Id: row.id,
                  name: row.firstName +  ' ' + row.lastName,
                  count: row.formDataObj.length,
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
        list: state.caseManager.list
    };
};
const mapActionToProps = {
    fetchById: fetchById
};


export default connect(mapStateToProps, mapActionToProps)(CaseManager);