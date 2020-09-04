import React, {useRef, useEffect, useState} from 'react';
import Page from 'components/Page';
import {  Errors, Form, FormBuilder } from 'react-formio';
import {Card,CardContent,} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {url} from '../../api'
import {fetchService, fetchById, updateForm, fetchForms} from '../../actions/formBuilder'
import {fetchByHospitalNumber} from '../../actions/patients'

import {
    FormGroup,
    Input,
    Label,
    Col,
    Row,
    Button
} from 'reactstrap';

const useStyles = makeStyles(theme => ({
    root2: {
        width: '100%',
        height: 100,
        overflow: 'auto',
    }
}));

const Update = props => {
    const [res, setRes] = React.useState("");
    const [displayType, setDisplayType] = React.useState("");
    const [programId, setprogramId] = React.useState("");
    const [formCode, setformCode] = React.useState();
    const [form2, setform2] = React.useState();
    const classes = useStyles();
    let myform;
    const submission = props.patient;
    const textAreaRef = useRef(null);

    useEffect (() => {
        props.fetchService();
        props.fetchForms();
    }, [])
    useEffect (() => {
         //props.fetchById()
        props.fetchPatientByHospitalNumber('6768595', null, null)
    }, [])

    const handleProgramChange = (e) => {
        setprogramId(e.target.value)
        props.fetchById(e.target.value)
    }

    const handleSubmit = () => {
        props.updateForm(form2.id, form2);
    }

    const loadForm = (e) => {
        console.log(JSON.parse(e.target.value));
        const v = JSON.parse(e.target.value);
        
        setformCode(v.code);
        
        setform2(v)
        //setRes(form.resourceObject);
    }
    return (
        <Page title="Form Renderer" >
            <Card >
                <CardContent>
                    <h4>View Form</h4>
                    <hr />
                    <Errors errors={props.errors} />
    
                    {!res ? "" : 
                    <Form
                        form={JSON.parse(res)}
                        ref={form => myform = form}
                        submission={{data : {patient: props.patient}}}
                        //src={url}
                        hideComponents={props.hideComponents}
                        //onSubmit={props.onSubmit}
                        onSubmit={(submission) => {
                            console.log(submission);
                            return fetch('https://lp-base-app.herokuapp.com/api/', {
                                body: JSON.stringify(submission),
                                headers: {
                                    'content-type': 'application/json'
                                },
                                method: 'POST',
                                mode: 'cors',
                            }).then(res => {
                                console.log(res);
                                myform.emit('submitDone', submission);
                            })}}
                    />
                        }
                    <br></br>
                </CardContent>
            </Card>
            <hr></hr>
            <Card >
                <CardContent>
                    <h4>Edit Form</h4>
                    <Row>
                        <Col md={4}> <FormGroup>
                            <Label class="sr-only">Display Type</Label>
                            <Input type="select"  id="displayType" value={displayType} onChange={e => setDisplayType(e.target.value)}>
                                <option value="form">Form</option>
                                <option value="wizard">Wizard</option></Input>
                        </FormGroup></Col>

                        <Col md={4}> <FormGroup>
                            <Label class="sr-only">Program Area</Label>
                            {props.services.length && props.services.length > 0 ?
                                <Input type="select" class="form-control" id="programId" required value={programId}  onChange={e => handleProgramChange(e) }>
                                    {props.services.map(program => (<option key={program.id} value={program.id} >{program.name}</option>))}
                                </Input>:  <Input type="select" class="form-control" id="programId" required value={programId} onChange={e => setprogramId(e.target.value)}>
                                    <option>No programs found</option>
                                </Input>}
                        </FormGroup></Col>

                        <Col md={4}> <FormGroup>
                            <Label class="sr-only">Form Name</Label>
                            {props.formList.length && props.formList.length > 0 ?
                                <Input type="select" class="form-control" id="formCode" required value={formCode}  onChange={e => loadForm(e) }>
                                    <option value="">Select One</option>
                                    {props.formList.map(form => (<option value={JSON.stringify(form)}>{form.name}</option>))}
                                </Input>:  <Input type="select" class="form-control" id="formCode" required value={formCode} onChange={e => setformCode(e.target.value)}>
                                </Input>}
                        </FormGroup></Col>
                    </Row>
                    <Row>
                        <Col md={2}> <FormGroup>
                            <label class="sr-only"></label>
                            <Button color="primary" className=" mt-4" onClick={() => loadForm()}>Load Form</Button>
                        </FormGroup></Col>

                        <Col md={2}> <FormGroup>
                            <label class="sr-only"></label>
                            <button type="button"  class="form-control btn btn-primary mt-4" onClick={() => handleSubmit()}>Update Form</button>
                        </FormGroup></Col>
                    </Row>
                    { form2 ? 
                    <FormBuilder form={form2.resourceObject} {...props} onChange={(schema) => {
                       // console.log(JSON.stringify(schema));
                        setRes(JSON.stringify(schema));
                    }} />
: ""
                }
                    <br></br>
                </CardContent>
            </Card>
            <hr></hr>
            <Card >
                <CardContent>
                    <h4>Json Form</h4>
                    <div >
                    <textarea cols="100"
                              ref={textAreaRef}
                              value={res}/>
                    </div>
                </CardContent>
            </Card>
        </Page>
    );
}

const mapStateToProps =  (state = { form:{}}) => {
    console.log(state.forms)
    return {
        patient: state.patients.patient,
        services: state.formReducers.services,
        formList: state.formReducers.form,
    }}

const mapActionsToProps = ({
    fetchService: fetchService,
    fetchById: fetchById,
    updateForm: updateForm,
    fetchPatientByHospitalNumber: fetchByHospitalNumber,
    fetchForms:fetchForms
})

export default connect(mapStateToProps, mapActionsToProps)(Update)


