import React, {useRef, useEffect, useState} from 'react';
import Page from 'components/Page';
import { connect } from 'react-redux';
import {Card,CardContent,} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {fetchService, createForm} from '../../actions/formBuilder'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
    FormGroup,
    Input,
    Label,
    Col,
    Row,
    Form
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { TiArrowBack } from "react-icons/ti";

const Create = props => {
    const datanew = {
        resourceObject: "",
        programCode: "",
    }
    const [newdata2] = React.useState(datanew);
    const [programCode, setprogramCode] = React.useState("");
    const [name, setname] = React.useState();
    const [usageCode, setusageCode] = React.useState("");
    const [usageOrder, setusageOrder] = React.useState("");

    let myform;


    useEffect (() => {
        props.fetchService()
    }, [])

// const handleSetModule = (e) => {
//   props.fetchService(e.target.value)
// }

    const handleSubmit = e => {
        newdata2['programCode']=programCode;
        // newdata2['resourceObject']=res;
        newdata2['name']=name;
        // newdata2['version']=version;
        newdata2['usageCode']=usageCode;
        newdata2['usageOrder']=usageOrder;

        e.preventDefault()
        props.createForm(newdata2);
    }
    return (
        <Page title="Service Report" >

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
                    <h4>View Service Report</h4>
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
                                <Label class="sr-only">Report</Label>
                                <Input type="select"  id="usageOrder" value={usageOrder} onChange={e => setusageOrder(e.target.value)}>
                                    <option></option>
                                    <option value="0">First</option>
                                    <option value="1">Second</option>
                                    <option value="2">Third</option>
                                    <option value="3">Fourth</option>
                                    <option value="3">Fifth</option>
                                </Input>
                            </FormGroup></Col>
                            <Col md={2}> <FormGroup>
                                <label class="sr-only"></label>
                                <button type="submit"  class="form-control btn btn-primary mt-4" >Load Report</button>
                            </FormGroup></Col>
                        </Row>
                    </Form>
                    <br></br>
                </CardContent>
            </Card>
        </Page>
    );

}
const mapStateToProps = (state) => {
    console.log(state.forms)
    return {
        // modules: state.forms.modules,
        services: state.formReducers.services
    }}

const mapActionsToProps = ({
    // fetchModules: fetchModules,
    fetchService: fetchService,
    createForm: createForm
})

export default connect(mapStateToProps, mapActionsToProps)(Create)
