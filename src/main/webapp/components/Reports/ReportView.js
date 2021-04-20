import React, {useRef, useEffect, useState} from 'react';
import {Form } from 'react-formio';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {fetchService} from '../../actions/formBuilder'
import {fetchAll, generateReport} from '../../actions/report';
import { authHeader } from '_helpers/auth-header';
import _ from 'lodash';
import {Card, CardBody, Col} from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom';
import {toast, ToastContainer} from "react-toastify";
import axios from 'axios';
import {url} from '../../api';


const useStyles = makeStyles(theme => ({
    root2: {
        width: '100%',
        height: 100,
        overflow: 'auto',
    }
}));

const GenerateReport = props => {
    const [submission, setSubmission] = React.useState({ data: { authHeader: authHeader(), baseUrl: url }});
    const datanew = {
        reportId: "",
        parameters: "",
    }
    const options = {
        noAlerts: true,
    };
    const [newdata2] = React.useState(datanew);
    const [res, setRes] = React.useState("");
    const [formCode, setformCode] = React.useState();
    const [loading, setLoading] = React.useState(true);
    const [form2, setform2] = React.useState();
    const [reportId, setreportId] = React.useState();
    const classes = useStyles();
    let myform;

    const row = props.location.state;


    // useEffect (() => {
    //     setformCode(row.code);
    //     console.log(row);
    //     setform2(row)
    //
    //       }, [])

    useEffect(() => {
        async function fetchById() {
            axios
                .get(`${url}reports/${row.id}/`)
                .then(response => {
                    setform2(response.data);
                    console.log(response.data)
                    setLoading(false);
                })
                .catch(error => {
                    toast.error('Could not load form resource, please contact admin.')
                    setLoading(false);
                })
        }
        fetchById();
    }, []);

    const submitForm = (submission) => {
       const onError = () => {
           toast.error('An error occurred, please contact Admin')
       }
        const data = submission.data;
        let formattedData = [];
        _.forOwn(data, function(value, key) {
            if(key !== "submit") {
                if(key == "reportFormat") {
                    newdata2['reportFormat']=value;
                }
                formattedData.push({name: key, value: value})
            }
        } );
        newdata2['reportId']=form2.id;
        newdata2['parameters']=data ;
        props.generateReport(newdata2, onError);
        return;
    }

    return (
        <Card>
            <ToastContainer />
            <CardBody>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to={{pathname: "/report"}} >
                        Reports
                    </Link>
                    <Typography color="textPrimary">Generate Report - {row.name || ''} </Typography>
                </Breadcrumbs>
                <br/>
                <Card>
                    <CardBody>
                    { form2 ?
                        <Form form={row.resourceObject}
                              submission={submission}
                              options={options}
                              {...props} onSubmit={(submission) => {
                            return submitForm(submission);
                        }} />
                        : ""
                    }
                    </CardBody>
                </Card>
                </CardBody>
            </Card>

    );
}

const mapStateToProps =  (state = {  reportList:[], form:{}}) => {
    return {
        services: state.formReducers.services,
        reportList: state.reportReducer.reportList,
    }}

const mapActionsToProps = ({
    fetchService: fetchService,
    fetchAll:fetchAll,
    generateReport: generateReport
})

export default connect(mapStateToProps, mapActionsToProps)(GenerateReport)


