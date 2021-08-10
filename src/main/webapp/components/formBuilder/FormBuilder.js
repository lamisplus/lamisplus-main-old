import React, {useRef, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import {  Errors, FormBuilder, Form as FormV } from 'react-formio';
import { Link } from 'react-router-dom';
import {fetchService, createForm, fetchAllForms} from '../../actions/formBuilder'
import {
    FormGroup,
    Input,
    Label,
    Col,
    Row,
    Form,Card, CardBody
} from 'reactstrap';
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
import { Alert } from '@material-ui/lab';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import JsonSchemaViewer from "./JsonSchemaViewer";

const Create = props => {
    const [res, setRes] = React.useState("");
    const [formData, setFormData] = React.useState({resourceObject: null, programCode: "", display: ""});
    const textAreaRef = useRef(null);
    const [form, setform] = useState([{title: 'Loading', value: ''}]);
    const [useFor, setuseFor] = useState([{title: 'Loading', value: ''}]);
    const [disabledCheckBox, setdisabledCheckBox] = useState(true)
    const [showFileImport, setShowFileImport] = useState(true);
    const toggleShowFileImport = () => setShowFileImport(!showFileImport);
    const [jsonSchema, setJsonSchema] = React.useState();
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    let fileReader;

    const handleFileRead = (e) => {
        const content = fileReader.result;
        setFormData(JSON.parse(content));
        setRes(content.resourceObject);
    }

    const handleFileChosen = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

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
        formData['resourceObject']=res;
        formData['id'] = "";
        e.preventDefault()
        props.createForm(formData);
    }

    return (
        <>
        <Card>
            <ToastContainer />
            <CardBody>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to={{  pathname: "/admin",
                        state: 'form-builder'}} >
                        Form Manager
                    </Link>
                    <Typography color="textPrimary">Create Form</Typography>
                </Breadcrumbs>
                <br/>
                    <Errors errors={props.errors} />
                    {/*<Alert color="info" icon={false} className={"mb-3"}>*/}
                    {/*<h4>To create a form </h4>*/}
                    {/*    <p onClick={toggleShowFileImport} style={{cursor:"pointer"}}>- Click to <b>import</b> form from a <b>.json</b> file OR </p>*/}
                    {/*    <p>- <b>Fill</b> the form below</p>*/}
                    {/*</Alert>*/}
                    {showFileImport && <>
                    <Alert onClose={toggleShowFileImport} icon={false} className={"mb-3"}>
                        <h4>Import Form from a <b>(.json)</b> file</h4>
                    <input type="file" id="file" className="input-file mb-4" accept='.json'
                           onChange={e => handleFileChosen(e.target.files[0])}/>

                    </Alert>
                    </>
                    }

                    <Form onSubmit={handleSubmit} >
                        <Row>
                            <Col md={4}> <FormGroup>
                                <Label class="sr-only">Display Type</Label>
                                <Input type="select"  id="display" value={formData.display} onChange={e => setFormData({...formData, display:e.target.value})}>
                                    <option value="form">Form</option>
                                    <option value="wizard">Wizard</option></Input>
                            </FormGroup></Col>

                            <Col md={4}> <FormGroup>
                                <Label class="sr-only">Program Area</Label>
                                {props.services.length && props.services.length > 0 ?
                                    <Input type="select" class="form-control" id="programCode" required value={formData.programCode} onChange={e => setFormData({...formData, programCode:e.target.value})}>
                                        {props.services.map(service => (<option key={service.name} value={service.code}>{service.name}</option>))}
                                    </Input>:  <Input type="select" class="form-control" id="programCode" required >
                                        <option>No Programs Found</option>
                                    </Input>}
                            </FormGroup></Col>

                            <Col md={4}> <FormGroup>
                                <Label class="sr-only">Form Name</Label>
                                <Input type="text" class="form-control" id="name" name="name" value={formData.name}   onChange={e => setFormData({...formData, name:e.target.value})} required/>
                            </FormGroup> </Col>
                        </Row>
                        <Row>
                            <Col md={4}> <FormGroup>
                                <Label class="sr-only">Version</Label>
                                <Input type="text" class="form-control" id="version" name="version" value={formData.version}   onChange={e => setFormData({...formData, version:e.target.value})} required/>
                            </FormGroup> </Col>

                            <Col md={4}> <FormGroup>
                                <Label class="sr-only">Frequency of Usage</Label>
                                <Input type="select"  id="usageCode" value={formData.usageCode} onChange={e => setFormData({...formData, usageCode:e.target.value})}>
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
                                    defaultValue={formData.queryOption}
                                    onChange={(e, i) => {
                                        setFormData({...formData, queryOption: i});
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
                                        setFormData({...formData, formPrecedence: i});
                                        }}
                                    defaultValue={formData.queryOption}
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
                    {/*display the resource object if the form is imported else display the default formData object*/}
                    <FormBuilder form={formData.resourceObject || formData}
                                 submission={{data :{baseUrl:url}}}
                                 saveText={'Create Form'} onChange={(schema) => {
                        setRes(JSON.stringify(schema));

                    }} />
                    <br></br>
                    <div>
                        <h4>Json Form</h4>
                        <textarea cols="50" ref={textAreaRef} value={res}/>
                    </div>
               <JsonSchemaViewer formObject={res}/>
            </CardBody>
            </Card>

    </>
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
