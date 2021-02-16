import React, {useEffect, useState, useRef} from 'react';
import Page from 'components/Page';
import { connect } from 'react-redux';
import {Card,CardContent,} from '@material-ui/core';
import {FormBuilder } from 'react-formio';
import {fetchService} from '../../actions/formBuilder'
import {creatReport, update, fetchAll} from '../../actions/report'
import useForm from "../Functions/UseForm";

import {
    FormGroup,
    Input,
    Label,
    Col,
    Row,
    Form
} from 'reactstrap';
import {Link} from 'react-router-dom';
import MatButton from '@material-ui/core/Button';
import { TiArrowBack } from "react-icons/ti";
import axios from 'axios';
import {url} from '../../api';

const UpdateReports = props => {
    // const [newData] = React.useState(formData);
    const [programCode, setprogramCode] = React.useState("");
    const [name, setname] = React.useState();
    const [description, setdescription] = React.useState("");
    const [dataSource, setdataSource] = React.useState("");
    const [template, settemplate] = React.useState("");
    const [res, setRes] = React.useState("");
    const [form2, setform2] = React.useState();
    const textAreaRef = useRef(null);
    const [formCode, setformCode] = React.useState();
    const [displayType, setDisplayType] = React.useState("")

    const row = props.location.row;

    useEffect (() => {
        props.fetchService()
        props.fetchAll();
    }, [])

    useEffect (() => {
        setform2(row);
    }, [])

    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(url +'jasper-reports');
                const body =  response.data;
                settemplate(body.map(({ display, id }) => ({ label: display, value: id })));
            } catch (error) {}
        }
        getCharacters();
    }, []);

    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(url +'jasper-reports');
                const body =  response.data;
                setdescription(body.map(({ display, id }) => ({ label: display, value: id })));
            } catch (error) {}
        }
        getCharacters();
    }, []);

    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(url +'jasper-reports');
                const body =  response.data;
                setname(body.map(({ display, id }) => ({ label: display, value: id })));
            } catch (error) {}
        }
        getCharacters();
    }, []);

    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(url +'jasper-reports');
                const body =  response.data;
                setprogramCode(body.map(({ display, id }) => ({ label: display, value: id })));
            } catch (error) {}
        }
        getCharacters();
    }, []);

    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(url +'jasper-reports');
                const body =  response.data;
                setDisplayType(body.map(({ display, id }) => ({ label: display, value: id })));
            } catch (error) {}
        }
        getCharacters();
    }, []);

    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(url +'jasper-reports');
                const body =  response.data;
                setdataSource(body.map(({ display, id }) => ({ label: display, value: id })));
            } catch (error) {}
        }
        getCharacters();
    }, []);

    const handleSubmit = e => {

        e.preventDefault();
        props.update(form2.id, form2);
    }

    return (
        <div className="PivotTable">
            <Page title="Jasper Template Upload " >
                <Card style={{ width: '80rem' }} >
                    <CardContent>
                        <Link to="/admin">
                            <MatButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                className=" float-right mr-1">
                                <TiArrowBack /> &nbsp; back
                            </MatButton>
                        </Link>
                        <h4>Paste XML or JSON Template</h4>
                        <hr />
                        <Form onSubmit={handleSubmit} >
                            <Row>
                                <Col md={4}> <FormGroup>
                                    <Label class="sr-only">Program Area</Label>
                                    {props.services.length && props.services.length > 0 ?
                                        <Input type="select" class="form-control" id="programCode" required value={programCode} onChange={e => setprogramCode(e.target.value)}>
                                            {props.services.map(service => (<option key={service.name} value={service.code}>{service.name}</option>))}
                                        </Input>:  <Input type="select" class="form-control" id="programCode" required value={programCode} onChange={e => setprogramCode(e.target.value)}>
                                            <option>No Programs Found</option>
                                        </Input>}
                                </FormGroup></Col>

                                <Col md={4}> <FormGroup>
                                    <Label class="sr-only">Report Name</Label>
                                    <Input type="text" class="form-control"
                                           id="name"
                                           name="name"
                                           value={name}
                                           onChange={e => setname(e.target.value)}/>
                                </FormGroup> </Col>

                                <Col md={4}> <FormGroup>
                                    <Label class="sr-only">Description</Label>
                                    <Input type="text" class="form-control"
                                           id="description"
                                           name="description" value={description}
                                           onChange={e => setdescription(e.target.value)}/>
                                </FormGroup></Col>
                            </Row>

                            <Row>
                                <Col md={4}> <FormGroup>
                                    <Label class="sr-only">Date Source</Label>
                                    <Input type="select"  id="dataSource"
                                           value={dataSource} onChange={e => setdataSource(e.target.value)}>
                                        <option></option>
                                        <option value="0">XML</option>
                                        <option value="1">JSON</option></Input>
                                </FormGroup></Col>

                                <Col md={4}> <FormGroup>
                                    <Label class="sr-only">Display Type</Label>
                                    <Input type="select"  id="displayType" value={displayType} onChange={e => setDisplayType(e.target.value)}>
                                        <option value="form">Form</option>
                                        <option value="wizard">Wizard</option></Input>
                                </FormGroup></Col>

                                <Col md={2}> <FormGroup>
                                    <button type="submit"  class="form-control btn btn-primary mt-4" >Update Report</button>
                                </FormGroup></Col>
                            </Row>
                            <Row>
                                <Col md={12}> <FormGroup>
                                    <Label class="sr-only">Template(Paste XML or JSON Template)</Label>
                                    <Input type="textarea" name="text"
                                           id="template" value={template}
                                           rows="10" oonChange={e => settemplate(e.target.value)}/>
                                </FormGroup></Col>
                            </Row>
                        </Form>
                    </CardContent>
                </Card>
                <hr></hr>
                <Card >
                    <CardContent>
                        <h4>Build Query Parameter Form</h4>
                        { form2 ?
                            <FormBuilder form={row.parameterResourceObject} {...props} onChange={(schema) => {
                                setRes(JSON.stringify(schema));
                            }} />
                            : ""
                        }
                    </CardContent>
                </Card>
                <hr></hr>
                <Card >
                    <CardContent>
                        <h4>Json Form</h4>
                        <div >
                            <textarea cols="50" ref={textAreaRef} value={res}/>
                        </div>
                    </CardContent>
                </Card>
            </Page>
        </div>
    )
}

const mapStateToProps = (state = {  reportList:[], form:{}}) => {
    return {
        services: state.formReducers.services,
        reportList: state.reportReducer.reportList
    }}

const mapActionsToProps = ({
    fetchService: fetchService,
    creatReport: creatReport,
    update: update,
    fetchAll:fetchAll
})

export default connect(mapStateToProps, mapActionsToProps)(UpdateReports)

