import React, {useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import {
    Card,
    CardBody
} from 'reactstrap';
import {FormBuilder } from 'react-formio';
import {fetchService, createForm} from '../../actions/formBuilder'
import {creatReport} from '../../actions/report'
import {
    FormGroup,
    Input,
    Label,
    Col,
    Row,
    Form
} from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom';

const CreateReports = props => {
    const datanew = {
        resourceObject: "",
        programCode: "",
    }
    let fileReader;
  
    const handleFileRead = (e) => {
      const content = fileReader.result;
      settemplate(content)
      console.log(content)
      // … do something with the 'content' …
    };
    
    const handleFileChosen = (file) => {
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(file);
    };
    const [newdata2] = React.useState(datanew);
    const [programCode, setprogramCode] = React.useState("");
    const [name, setname] = React.useState();
    const [description, setdescription] = React.useState("");
    const [dataSource, setdataSource] = React.useState("");
    const [template, settemplate] = React.useState("");
    const [res, setRes] = React.useState("");
    const textAreaRef = useRef(null);
    const [displayType, setDisplayType] = React.useState("")

    useEffect (() => {
        props.fetchService()
    }, [])

    const handleSubmit = e => {
        newdata2['programCode']=programCode;
        newdata2['resourceObject']=res;
        newdata2['name']=name;
        newdata2['description']=description;
        newdata2['dataSource']=dataSource;
        newdata2['template']=template;

        e.preventDefault()

        props.creatReport(newdata2);
    }

    return (
        <Card>
            <CardBody>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to={{pathname: "/admin",
                    state: 'report-builder'}} >
                    Admin
                </Link>
                <Typography color="textPrimary">Report Builder </Typography>
            </Breadcrumbs>
            <br/>

                <Card >
                    <CardBody>

                        <h4>Build Report</h4>
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

                                <Col md={4}><FormGroup>
                                    <Label class="sr-only">Report Name</Label>
                                    <Input type="text" class="form-control" id="name" name="name" value={name}   onChange={e => setname(e.target.value)} required/>
                                </FormGroup> </Col>

                                <Col md={4}> <FormGroup>
                                    <Label class="sr-only">Description</Label>
                                    <Input type="text" class="form-control" id="description" name="description" value={description}   onChange={e => setdescription(e.target.value)} required/>
                                </FormGroup></Col>
                            </Row>
                                    <Row>
                                        <Col md={2}> <FormGroup>
                                            <button type="submit"  class="form-control btn btn-primary mt-4" >Save Template</button>
                                        </FormGroup></Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}> <FormGroup>
                                            <Label class="sr-only">Template(Paste XML or JSON Template) OR { '  '}{ '  '}{ '  '}</Label>
                                             
                                            <input
                                                type='file'
                                                id='file'
                                                className='input-file'
                                                accept='.rptdesign'
                                                onChange={e => handleFileChosen(e.target.files[0])}
                                                style={{paddingLeft:'10px'}}
                                            />
                                            <Input type="textarea" name="text" id="template" value={template} rows="10" onChange={e => settemplate(e.target.value)}/>
                                        </FormGroup></Col>
                                    </Row>
                        </Form>
                    </CardBody>
                </Card>
                <hr></hr>
                <Card >
                    <CardBody>
                        <h4>Build Query Parameter Form</h4>
                        <FormBuilder form={{display: displayType}} saveText={'Create Form'} onChange={(schema) => {
                            setRes(JSON.stringify(schema));

                        }} />
                    </CardBody>
                        </Card>

            </CardBody>
        </Card>

    )
}

    const mapStateToProps = (state) => {
        return {
            services: state.formReducers.services
        }}

    const mapActionsToProps = ({
        // fetchModules: fetchModules,
        fetchService: fetchService,
        creatReport: creatReport,
        createForm: createForm
    })

export default connect(mapStateToProps, mapActionsToProps)(CreateReports)
