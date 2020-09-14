import React, {useRef, useEffect, useState} from 'react';
import Page from 'components/Page';
import {  Errors, Form, FormBuilder } from 'react-formio';
import {Card,CardContent,} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {fetchService, fetchById, updateForm} from '../../actions/formBuilder'
import {fetchByHospitalNumber} from '../../actions/patients'
import MatButton from '@material-ui/core/Button';
import { TiArrowBack } from "react-icons/ti";
import { authHeader } from '_helpers/auth-header';
import {
    FormGroup,
    Input,
    Label,
    Col,
    Row,
    Button
} from 'reactstrap';
import {Link} from 'react-router-dom';

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
    const [formCode, setformCode] = React.useState();
    const [form2, setform2] = React.useState();
    const classes = useStyles();
    let myform;
    const submission = props.patient;
    const textAreaRef = useRef(null);

    const row = props.location.row;

    useEffect (() => {
        setformCode(row.code);
        console.log(row);

        setform2(row)

        props.fetchPatientByHospitalNumber('6768595', null, null)
    }, [])

    const handleSubmit = () => {
        props.updateForm(form2.id, form2);
    }

    return (
        <Page title="Form Renderer" >
            <Card >
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
                    <h4>View Form</h4>
                    <hr />
                    <Errors errors={props.errors} />
                    {/*{!res ? "" :*/}
                    {/*    <Form*/}
                    {/*        form={JSON.parse(res)}*/}
                    {/*        ref={form => myform = form}*/}
                    {/*        submission={{data : {patient: props.patient}}}*/}
                    {/*        //src={url}*/}
                    {/*        hideComponents={props.hideComponents}*/}
                    {/*        //onSubmit={props.onSubmit}*/}
                    {/*        onSubmit={(submission) => {*/}
                    {/*            console.log(submission);*/}
                    {/*            return fetch('https://lp-base-app.herokuapp.com/api/', {*/}
                    {/*                body: JSON.stringify(submission),*/}
                    {/*                headers: {*/}
                    {/*                    'content-type': 'application/json'*/}
                    {/*                },*/}
                    {/*                method: 'POST',*/}
                    {/*                mode: 'cors',*/}
                    {/*            }).then(res => {*/}
                    {/*                console.log(res);*/}
                    {/*                myform.emit('submitDone', submission);*/}
                    {/*            })}}*/}
                    {/*    />*/}
                    {/*}*/}
                    {!res ? "" : 
                    <Form
                        form={JSON.parse(res)}
                        ref={form => myform = form}
                        submission={{data : {patient: props.patient, authHeader: authHeader()}}}
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

                        <Col md={2}> <FormGroup>
                            <label class="sr-only" ></label>
                            <button type="button"  class="form-control btn btn-primary mt-4" onClick={() => handleSubmit()}>Update Form</button>
                        </FormGroup></Col>
                    </Row>
                    { form2 ?
                        <FormBuilder form={row.resourceObject} {...props} onChange={(schema) => {
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
    return {
        patient: state.patients.patient,
        formList: state.formReducers.form,
    }}

const mapActionsToProps = ({
    fetchById: fetchById,
    updateForm: updateForm,
    fetchPatientByHospitalNumber: fetchByHospitalNumber,
})

export default connect(mapStateToProps, mapActionsToProps)(Update)


