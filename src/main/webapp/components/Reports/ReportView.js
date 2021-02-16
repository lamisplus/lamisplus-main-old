import React, {useRef, useEffect, useState} from 'react';
import {Form } from 'react-formio';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {fetchService} from '../../actions/formBuilder'
import {fetchAll, generateReport} from '../../actions/report';
import _ from 'lodash';
import {
    Card,
    CardBody
} from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom';
import {toast, ToastContainer} from "react-toastify";

const useStyles = makeStyles(theme => ({
    root2: {
        width: '100%',
        height: 100,
        overflow: 'auto',
    }
}));

const GenerateReport = props => {
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
    const [form2, setform2] = React.useState();
    const [reportId, setreportId] = React.useState();
    const classes = useStyles();
    let myform;

    const row = props.location.state;


    useEffect (() => {
        setformCode(row.code);
        console.log(row);
        setform2(row)

          }, [])

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
        newdata2['parameters']=formattedData;
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
                        <Form form={row.parameterResourceObject}
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


