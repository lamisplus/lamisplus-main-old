import React, {useEffect, useState, useRef} from 'react';
import { connect } from 'react-redux';
import {Card} from '@material-ui/core';
import {FormBuilder } from 'react-formio';
import {fetchService} from '../../actions/formBuilder'
import {update} from '../../actions/report'
import {FormGroup, Input, Label, Col, Row, Form, CardBody} from 'reactstrap';
import {Link} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import {url} from '../../api';
import LinearProgress from "@material-ui/core/LinearProgress";



const UpdateReports = (props) => {
    const [loading, setLoading] = useState(false)
    const defaultValues = {programName: "", template: "", name: "", description: "", format: "", form2 : ""}
    const [formData, setFormData] = useState(props.location.row)
    const [res, setRes] = React.useState("");
    const [form2, setform2] = React.useState();
    const [programCode, setprogramCode] = React.useState("");
    const textAreaRef = useRef(null);
    const [pcrOptions, setOptionPcr] = useState([]);

    const row = props.location.row;

    // useEffect(() => {
    //     setform2(row);
    // }, [])

    useEffect(() => {
        async function fetchById() {
            axios
                .get(`${url}reports/${row.id}/`)
                .then(response => {
                    const newFormData = response.data;
                    newFormData["template"] = formData.template;
                    setFormData(newFormData);
                    //setprogramCode(newFormData.programCode);
                    setLoading(false);
                })
                .catch(error => {
                    toast.error('Could not load form resource, please contact admin.')
                    setLoading(false);
                })
        }
        fetchById();
    }, []);

    const handleInputChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = e => {
        e.preventDefault()
        console.log(e)
        setLoading(true);
        const onSuccess = () => {
            // setLoading(false);
            toast.success("Report Updated successfully!")

        }

        const onError = () => {
            setLoading(false);
            toast.error("Something went wrong, please contact administration");

        }
        formData['resourceObject'] = JSON.parse(res);
        props.update(formData.id, formData, onSuccess, onError, setLoading)
    }

        return (
            <div >
                <ToastContainer />
                <Card>
                    <CardBody>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" to={{pathname: "/admin",
                                state: 'report-builder'}} >
                                Admin
                            </Link>
                            <Typography color="textPrimary">Report Builder Update </Typography>
                        </Breadcrumbs>
                        <br/>
                        <Form onSubmit={handleSubmit}>
                            <Card >
                                <CardBody>
                                <Row>
                                    <Col md={4}> <FormGroup>
                                        <Label class="sr-only">Program Name</Label>
                                        <Input type='text' name='programCode' id='programCode' value={formData.programName} onChange={handleInputChange} required/>
                                    </FormGroup></Col>

                                       <Col md={4}> <FormGroup>
                                        <Label class="sr-only">Report Name</Label>
                                        <Input type='text' name='name' id='name' value={formData.name} onChange={handleInputChange} required/>

                                    </FormGroup> </Col>
                                    <Col md={4}> <FormGroup>
                                        <Label class="sr-only">Description</Label>
                                        <Input type='text' name='description' id='description' value={formData.description} onChange={handleInputChange} required/>
                                    </FormGroup></Col>
                                </Row>

                                <Row>
                                    <Col md={2}> <FormGroup>
                                        <label class="sr-only"></label>
                                        <button type="submit"  class="form-control btn btn-primary mt-4" >Save Form</button>
                                    </FormGroup></Col>
                                </Row>

                                <Row>
                                    <Col md={12}> <FormGroup>
                                        <Label class="sr-only">Template(Paste XML or JSON Template)</Label>
                                        <Input rows={10} cols={10} type='textarea' name='template' id='template' value={formData.template} onChange={handleInputChange} required/>
                                    </FormGroup></Col>
                                </Row>

                                </CardBody>
                            </Card>
                        </Form>
                    </CardBody>
                </Card>
                <hr></hr>
                <Card >
                    <CardBody>
                                <h4>Build Query Parameter Form</h4>
                                { formData.resourceObject ?
                                    <FormBuilder form={formData.resourceObject} {...props} onChange={(schema) => {
                                        setRes(JSON.stringify(schema));
                                    }} />
                                    : ""
                                }
                    </CardBody>
                </Card>
                <hr></hr>
                    <Card>
                        <CardBody>
                            <h4>Json Form</h4>
                            <div>
                                <textarea cols="50" ref={textAreaRef} value={res}/>
                            </div>
                        </CardBody>
                    </Card>
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
    update: update,
    // fetchAll:fetchAll
})

export default connect(mapStateToProps, mapActionsToProps)(UpdateReports)

