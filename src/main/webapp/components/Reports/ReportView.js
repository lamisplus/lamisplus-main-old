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
    const [displayType, setDisplayType] = React.useState("");
    const [formCode, setformCode] = React.useState();
    const [form2, setform2] = React.useState();
    const [reportId, setreportId] = React.useState();
    const classes = useStyles();
    let myform;

    const row = props.location.row;

    useEffect (() => {
        props.fetchService();
        props.fetchAll();

    }, [])

    useEffect (() => {
        setformCode(row.code);
        console.log(row);

        setform2(row)

          }, [])


    const handleSubmit = () => {
        setreportId(form2.id);
        let parameters = new Array(2);

        // parameters.fill({'month':form2.id});
        // parameters.fill({'month':form2.id});
        console.log(parameters);
        newdata2['reportId']=4;
        newdata2['parameters']=parameters;
        props.generateReport(newdata2);
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
                    <Row>
                        <Col md={4}> <FormGroup>
                            <Label class="sr-only">Display Type</Label>
                            <Input type="select"  id="displayType" value={displayType} onChange={e => setDisplayType(e.target.value)}>
                                <option value="form">Form</option>
                                <option value="wizard">Wizard</option></Input>
                        </FormGroup></Col>
                        <Col md={2}> <FormGroup>
                            <label class="sr-only" ></label>
                            <button type="button"  class="form-control btn btn-primary mt-4" onClick={() => handleSubmit()}>Ok</button>
                        </FormGroup></Col>
                    </Row>
                    { form2 ?
                        <Form form={row.parameterResourceObject} {...props} onChange={(schema) => {
                            setRes(JSON.stringify(schema));
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


