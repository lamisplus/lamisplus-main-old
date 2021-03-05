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
import {makeStyles} from '@material-ui/core/styles';
import {toast} from 'react-toastify';

const UpdateReports = (props) => {

    const [loading, setLoading] = useState(false)
    const defaultValues = {programCode: "", template: "", name: "", description: "", format: "", setform2: ""}
    const [formData, setFormData] = useState(defaultValues)
    const [res, setRes] = React.useState("");
    const [form2, setform2] = React.useState();
    const textAreaRef = useRef(null);

    const row = props.location.row;

    useEffect (() => {
        props.fetchService()
        props.fetchAll();
    }, [])

    useEffect(() => {
        setform2(row);
    }, [])

    useEffect(() => {
        setFormData(props.formData ? props.formData : defaultValues);
    }, [props.formData]);

    const handleInputChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleDescriptiontChange = e => {
        setFormData({...formData, [e.target.description]: e.target.value});
    }

    const handleNameInputChange = e => {

        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleProgramInputChange = e => {

        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = e => {

        e.preventDefault()

        setLoading(true);

        const onSuccess = () => {
            setLoading(false);
            toast.success("Form variable saved successfully!")
            props.update(formData.id, formData, onSuccess, onError)
        }
        const onError = () => {
            setLoading(false);
            toast.error("Something went wrong, please contact administration");
        }

        //     if(formData.id) {
        //         props.update(formData.id, formData, onSuccess, onError)
        //         return
        //     }
        // }


        // const handleSubmit = e => {
        //
        //     e.preventDefault();
        //     props.update(form2.id, form2);
        // }

        return (
            <div className="PivotTable">
                <Page title="Jasper Template Upload ">
                    <Card style={{width: '80rem'}}>
                        <CardContent>
                            <Link to="/admin">
                                <MatButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className=" float-right mr-1">
                                    <TiArrowBack/> &nbsp; back
                                </MatButton>
                            </Link>
                            <h4>Paste XML or JSON Template</h4>
                            <hr/>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={4}> <FormGroup>
                                        <Input
                                            type='text'
                                            name='name'
                                            id='name'
                                            placeholder=' '
                                            value={formData.programCode}
                                            onChange={handleProgramInputChange}
                                            required
                                        />
                                    </FormGroup></Col>

                                    <Col md={4}> <FormGroup>
                                        <Label class="sr-only">Report Name</Label>
                                        <Input
                                            type='text'
                                            name='name'
                                            id='name'
                                            value={formData.name}
                                            onChange={handleNameInputChange}
                                            required/>
                                    </FormGroup> </Col>

                                    <Col md={4}> <FormGroup>
                                        <Label class="sr-only">Description</Label>
                                        <Input
                                            type='textarea'
                                            name='description'
                                            id='description'
                                            value={formData.description}
                                            onChange={handleDescriptiontChange}
                                            required
                                        />
                                    </FormGroup></Col>
                                </Row>
                                <Row>
                                    <Col md={2}> <FormGroup>
                                        <button type="submit" class="form-control btn btn-primary mt-4">Update Report
                                        </button>
                                    </FormGroup></Col>
                                </Row>
                                <Row>
                                    <Col md={12}> <FormGroup>
                                        <Label class="sr-only">Template(Paste XML or JSON Template)</Label>
                                        <Input
                                            type='textarea'
                                            name='description'
                                            id='description'
                                            value={formData.template}
                                            onChange={handleInputChange}
                                            required/>
                                    </FormGroup></Col>
                                </Row>
                            </Form>
                        </CardContent>
                    </Card>
                    <hr></hr>
                    <Card>
                        <CardContent>
                            <h4>Build Query Parameter Form</h4>
                            {form2 ?
                                <FormBuilder form={row.resourceObject} {...props} onChange={(schema) => {
                                    setRes(JSON.stringify(schema));
                                }}/>
                                : ""
                            }
                        </CardContent>
                    </Card>
                    <hr></hr>
                    <Card>
                        <CardContent>
                            <h4>Json Form</h4>
                            <div>
                                <textarea cols="50" ref={textAreaRef} value={res}/>
                            </div>
                        </CardContent>
                    </Card>
                </Page>
            </div>
        )
    }
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

