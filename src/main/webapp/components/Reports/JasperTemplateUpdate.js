import React, {useEffect, useState, useRef} from 'react';
import Page from 'components/Page';
import { connect } from 'react-redux';
import {Card,CardContent,} from '@material-ui/core';
import {FormBuilder } from 'react-formio';
import {fetchService} from '../../actions/formBuilder'
import {update, fetchAll} from '../../actions/report'
import {FormGroup, Input, Label, Col, Row, Form} from 'reactstrap';
import {Link} from 'react-router-dom';
import MatButton from '@material-ui/core/Button';
import { TiArrowBack } from "react-icons/ti";
import {toast, ToastContainer} from 'react-toastify';

const UpdateReports = (props) => {

    const [loading, setLoading] = useState(false)
    const defaultValues = {programName: "", template: "", name: "", description: "", format: "", form2 : ""}
    const [formData, setFormData] = useState(props.location.row)
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
        props.update(formData.id, formData, onSuccess, onError)
    }

        return (
            <div >
                <ToastContainer />
                <Page title="Jasper Template Upload ">
                    <Card style={{width: '80rem'}}>
                        <Form onSubmit={handleSubmit}>
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

                                <Row>
                                    <Col md={4}> <FormGroup>
                                        <Label class="sr-only">Program Name</Label>
                                        <Input
                                            type='text'
                                            name='programCode'
                                            id='programCode'
                                            value={formData.programName}
                                            onChange={handleInputChange}
                                            required/>
                                           </FormGroup></Col>

                                       <Col md={4}> <FormGroup>
                                        <Label class="sr-only">Report Name</Label>
                                        <Input
                                            type='text'
                                            name='name'
                                            id='name'
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required/>

                                    </FormGroup> </Col>
                                    <Col md={4}> <FormGroup>
                                        <Label class="sr-only">Description</Label>
                                        <Input
                                            type='text'
                                            name='description'
                                            id='description'
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required/>
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
                                        <Input
                                            rows={10} cols={10}
                                            type='textarea'
                                            name='description'
                                            id='description'
                                            value={formData.template}
                                            onChange={handleInputChange}
                                            required/>
                                    </FormGroup></Col>
                                </Row>


                        </CardContent>
                        </Form>
                    </Card>
                    <hr></hr>
                    <Card>
                            <CardContent>
                                <h4>Build Query Parameter Form</h4>
                                { form2 ?
                                    <FormBuilder form={row.resourceObject} {...props} onChange={(schema) => {
                                        setRes(JSON.stringify(schema));
                                    }} />
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


const mapStateToProps = (state = {  reportList:[], form:{}}) => {
    return {
        services: state.formReducers.services,
        reportList: state.reportReducer.reportList
    }}

const mapActionsToProps = ({
    fetchService: fetchService,
    update: update,
    fetchAll:fetchAll
})

export default connect(mapStateToProps, mapActionsToProps)(UpdateReports)

