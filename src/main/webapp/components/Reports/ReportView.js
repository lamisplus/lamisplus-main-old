import React, {useRef, useEffect, useState} from 'react';
import Page from 'components/Page';
import {Errors, Form } from 'react-formio';
import {Card,CardContent,} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {fetchService} from '../../actions/formBuilder'
import {fetchAll, generateReport} from '../../actions/report';
import MatButton from '@material-ui/core/Button';
import { TiArrowBack } from "react-icons/ti";
import {
    FormGroup,
    Input,
    Label,
    Col,
    Row,
} from 'reactstrap';
import {Link} from 'react-router-dom';
import _ from 'lodash';

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
    const [newdata2] = React.useState(datanew);
    const [res, setRes] = React.useState("");
    const [formCode, setformCode] = React.useState();
    const [form2, setform2] = React.useState();
    const [reportId, setreportId] = React.useState();
    const classes = useStyles();
    let myform;

    const row = props.location.row;


    useEffect (() => {
        setformCode(row.code);
        console.log(row);

        setform2(row)

          }, [])

    const submitForm = (submission) => {
        console.log('submitting');
        const data = submission.data;
        let formattedData = [];
        _.forOwn(data, function(value, key) {
            if(key !== "submit") {
                formattedData.push({name: key, value: value})
            }
        } );
        newdata2['reportId']=form2.id;
        newdata2['parameters']=formattedData;
        props.generateReport(newdata2);
        return;
    }

    return (
        <Page title="Query Parameter Form" >
            <Card >
                <CardContent>
                    <Link to="/report">
                        <MatButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            className=" float-right mr-1">
                            <TiArrowBack /> &nbsp; back
                        </MatButton>
                    </Link>
                    <h4>Query Parameter Form</h4>
                    { form2 ?
                        <Form form={row.parameterResourceObject} {...props} onSubmit={(submission) => {
                            return submitForm(submission);
                        }} />
                        : ""
                    }
                </CardContent>
            </Card>
        </Page>
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


