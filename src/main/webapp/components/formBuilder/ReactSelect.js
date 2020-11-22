import React, {useRef, useEffect, useState} from 'react';
import Page from 'components/Page';
import { connect } from 'react-redux';
import {  Errors, FormBuilder } from 'react-formio';
import {Card,CardContent,} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {fetchService, createForm, fetchAllForms} from '../../actions/formBuilder'
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
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import axios from 'axios';
import {url} from '../../api';
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";

const Create = props => {
    const datanew = {
        resourceObject: "",
        programCode: "",
    }

    const [newdata2] = React.useState(datanew);
    const [res, setRes] = React.useState("");
    const [displayType, setDisplayType] = React.useState("");
    const [programCode, setprogramCode] = React.useState("");
    const [name, setname] = React.useState();
    const [usageCode, setusageCode] = React.useState("");
    const [usageOrder, setusageOrder] = React.useState("");
    const [version, setversion] = React.useState();
    const textAreaRef = useRef(null);
    const [form, setform] = useState([{title: 'Loading', value: ''}]);
    const [useFor, setuseFor] = useState([{title: 'Loading', value: ''}]);
    const [disabledCheckBox, setdisabledCheckBox] = useState(true)
    const [formPrecedence, setformPrecedence] = useState({});
    const [queryOption, setqueryOption] = useState({});

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;


    let myform;

    useEffect(() => {
        async function getCharacters() {
            try {

                const response = await axios(
                    url + "forms"
                );
                const body = response.data;


                setform(
                    body.map(({ name, code }) => ({ title: name, value: code }))
                );
                body !==null ? setdisabledCheckBox(false) : setdisabledCheckBox(true)

                console.log(response)
            } catch (error) {
            }
        }
        getCharacters();
    }, []);

    useEffect(() => {
        async function getCharacters() {
            try {

                const response = await axios(
                    url + "application-codesets/codesetGroup?codesetGroup=USE_FOR"
                );
                const body = response.data;


                setuseFor(
                    body.map(({ display, id }) => ({ title: display, value: id }))
                );
                body !==null ? setdisabledCheckBox(false) : setdisabledCheckBox(true)

                console.log(response)
            } catch (error) {
            }
        }
        getCharacters();
    }, []);

    useEffect (() => {
        props.fetchService();
        props.fetchAllForms();
    }, [])


    const handleSubmit = e => {

        newdata2['programCode']=programCode;
        newdata2['resourceObject']=res;
        newdata2['name']=name;
        newdata2['version']=version;
        newdata2['usageCode']=usageCode;
        newdata2['usageOrder']=usageOrder;
        newdata2['formPrecedence']=formPrecedence;
        newdata2['queryOption']=queryOption;
        // console.log('formPrecedence'+JSON.stringify(formPrecedence));
        //
        // if (formPrecedence.code.length > 0) {
        //     const arr = [];
        //     formPrecedence.code.forEach(function (code, index, array) {
        //         arr.push(value["code"]);
        //     });
        //     const formPrecedenceString = arr.toString();
        //     newdata2['formPrecedence']=formPrecedenceString;
        //
        // } else {
        //     //datasample.data.sample_type = datasample.data.sample_type;
        // }

        e.preventDefault()
        props.createForm(newdata2);
    }

    return (
        <Page title="Form Builder" >
            <ToastContainer autoClose={3000} hideProgressBar />
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
                    <h4>Create Form</h4>
                    <hr />
                    <Errors errors={props.errors} />
                    <Form onSubmit={handleSubmit} >
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
                                    <Input type="select" class="form-control" id="programCode" required value={programCode} onChange={e => setprogramCode(e.target.value)}>
                                        {props.services.map(service => (<option key={service.name} value={service.code}>{service.name}</option>))}
                                    </Input>:  <Input type="select" class="form-control" id="programCode" required value={programCode} onChange={e => setprogramCode(e.target.value)}>
                                        <option>No Programs Found</option>
                                    </Input>}
                            </FormGroup></Col>

                            <Col md={4}> <FormGroup>
                                <Label class="sr-only">Form Name</Label>
                                <Input type="text" class="form-control" id="name" name="name" value={name}   onChange={e => setname(e.target.value)} required/>
                            </FormGroup> </Col>
                        </Row>
                        <Row>
                            <Col md={4}> <FormGroup>
                                <Label class="sr-only">Version</Label>
                                <Input type="text" class="form-control" id="version" name="version" value={version}   onChange={e => setversion(e.target.value)} required/>
                            </FormGroup> </Col>

                            <Col md={4}> <FormGroup>
                                <Label class="sr-only">Frequency of Usage</Label>
                                <Input type="select"  id="usageCode" value={usageCode} onChange={e => setusageCode(e.target.value)}>
                                    <option></option>
                                    <option value="0">Once per Patient</option>
                                    <option value="1">Periodically</option></Input>
                            </FormGroup></Col>

                            <Col md={4}> <FormGroup>
                                <Label for="queryOption">Use For</Label>
                                <Autocomplete
                                    multiple
                                    id="useFor"
                                    size="small"
                                    options={useFor !==null ? useFor : "LOADING"}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.title}
                                    onChange={(e, i) => {
                                        setqueryOption({ ...queryOption, id: i });
                                    }}
                                    renderOption={(option, { selected }) => (
                                        <React.Fragment>
                                            { disabledCheckBox===false ?
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{marginRight: 8}}
                                                    checked={selected}
                                                />
                                                : ""
                                            }
                                            {option.title}
                                        </React.Fragment>
                                    )}
                                    style={{ width: "auto"}}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" label="Use For" placeholder="Use For" />
                                    )}
                                />
                            </FormGroup></Col>

                        </Row>

                            <Row>
                            <Col md={4}> <FormGroup>
                                <Label for="formPrecedence">Form Precedence</Label>
                                <Autocomplete
                                    multiple
                                    id="formCode"
                                    size="small"
                                    options={form !==null ? form : "LOADING"}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.title}
                                    onChange={(e, i) => {
                                        setformPrecedence({ ...formPrecedence, code: i });
                                    }}
                                    renderOption={(option, { selected }) => (
                                        <React.Fragment>
                                            { disabledCheckBox===false ?
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{marginRight: 8}}
                                                    checked={selected}
                                                />
                                                : ""
                                            }
                                            {option.title}
                                        </React.Fragment>
                                    )}
                                    style={{ width: "auto"}}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" label="Form Order" placeholder="form order" />
                                    )}
                                />
                            </FormGroup></Col>

                            <Col md={2}> <FormGroup>
                                <label class="sr-only"></label>
                                <button type="submit"  class="form-control btn btn-primary mt-4" >Save Form</button>
                            </FormGroup></Col>
                        </Row>

                    </Form>
                    <FormBuilder form={{display: displayType}} saveText={'Create Form'} onChange={(schema) => {
                        setRes(JSON.stringify(schema));
                        console.log(res)
                    }} />
                    <br></br>
                    <div>
                        <h4>Json Form</h4>
                        <textarea cols="50" ref={textAreaRef} value={res}/>
                    </div>
                </CardContent>
            </Card>
        </Page>
    );

}
const mapStateToProps =  (state = { form:{}}) => {
    return {
        services: state.formReducers.services,
        formList: state.formReducers.form,
    }}

const mapActionsToProps = ({
    fetchService: fetchService,
    createForm: createForm,
    fetchAllForms: fetchAllForms,
})

export default connect(mapStateToProps, mapActionsToProps)(Create)
