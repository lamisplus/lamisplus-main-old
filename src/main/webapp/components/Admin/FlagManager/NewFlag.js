import React, {useState, useEffect} from 'react';
import {  Modal, ModalHeader, ModalBody, Form,Row,Col,FormGroup,Label,Input,Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { createWard, updateWard } from 'actions/applicationCodeset';
import { Spinner } from 'reactstrap';
import Select from "react-select/creatable/dist/react-select.esm";
import axios from "axios";
import {url} from "../../../api";


const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

const ModalSample = (props) => {
    const [loading, setLoading] = useState(false);
    const [formList, setFormList] = useState([]);
    const [formFieldList, setFormFieldList] = useState([]);
    const [applicationCodesetList, setApplicationCodesetList] = useState([]);
    const [showAppCodeset, setShowAppCodeset] = useState(false);
    const [applicableForm, setApplicableForm] = useState([]);
    const [associatedForm, setAssociatedForm] = useState({});
    const [operandList, setOperandList] = useState([{label:"Equals to (=)", value:"="},{label:"Greater than (>)", value:">"},{label:"Less than (<)", value:"<"},{label:"Greater than or equals to>=", value:">="},{label:"Less than or equals to <=", value:"<="}]);
    const [formTypeList, setFormTypeList] = useState([{label:"String", value:"0"},{label:"Integer", value:"2"}]);
    const defaultValues = {fieldName:"", fieldValue:"", name:"", operand:"", datatype:0};
    const [formData, setFormData] = useState( defaultValues)
    const classes = useStyles()

    useEffect(() => {
        //for application codeset edit, load form data
        setFormData(props.formData ? props.formData : defaultValues);
        fetchForms();
    }, [props.formData]);

    const fetchForms = () => {
        axios
            .get(`${url}forms`)
            .then((response) => {
                const formListSelect = response.data.map((x) => ({...x, label:x.name +' - '+x.programName, value:x.code}));
                setFormList(formListSelect);
            })
            .catch((error) => {
                setFormList([]);
            });
    }

    const toggleApplicationCodeset = () => {
        setShowAppCodeset(!showAppCodeset);
        if(applicationCodesetList.length == 0){
            fetchApplicationCodeset();
        }
    }
    const fetchApplicationCodeset = () => {
        axios
            .get(`${url}application-codesets`)
            .then((response) => {
                const aSelect = response.data.map((x) => ({...x, label:x.display + ' - ' +x.codesetGroup, value:x.display}));
                setApplicationCodesetList(aSelect);
            })
            .catch((error) => {
                setApplicationCodesetList([]);
            });
    }

    const fetchFormFields = (formCode) => {
        axios
            .get(`${url}forms/${formCode}/fieldNames`)
            .then((response) => {
                const formFieldListSelect = response.data.map((x) => ({label:x, value:x}));
                setFormFieldList(formFieldListSelect);
            })
            .catch((error) => {
                setFormFieldList([]);
            });
    }
    const handleInputChange = e => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
    }


const createFlag = (data) => {
        let flagList = applicableForm.map((x) =>
            ({formCode: x.value, status: 1}));
        flagList.push({code: associatedForm.code, status:0});
        const body = {flag: data, formFlagDTOS: flagList};
        //console.log(body);
        axios
        .post(`${url}form-flags`, body)
        .then((response) => {
            console.log(response);
            toast.success("Flag saved successfully!");
            setLoading(false);
            props.loadFlag();
            props.toggleModal();
        })
        .catch((error) => {
            toast.error("An error occurred, could not save patient's biometrics.");
            setLoading(false);
        });

}

    const create = e => {
        e.preventDefault()
            setLoading(true);
            if(formData.id){
                props.updateWard(formData.id, formData)
                return
            }
            createFlag(formData)

    }
    return (

        <div >
            <ToastContainer />
            <Modal isOpen={props.showModal} toggle={props.toggleModal} size="xl">

                <Form onSubmit={create}>
                    <ModalHeader toggle={props.toggleModal}> {props.formData && props.formData.id ? 'Edit' : 'New'} Flag </ModalHeader>
                    <ModalBody>
                        <Card >
                            <CardBody>
                                <Row >
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Name</Label>
                                            <Input
                                                type='text'
                                                name='name'
                                                id='name'
                                                placeholder=' '
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Select Form (This flag will be generated from the selected form)</Label>
                                            <Select
                                                required
                                                name="form"
                                                id="form"
                                                isMulti={false}
                                                isLoading={false}
                                                options={formList}
                                                onChange={(x) => {
                                                    setAssociatedForm(x);
                                                   // fetchFormFields(x.value);
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Select Form Field (This flag will be generated from the value of this field)</Label>
                                            <Input
                                                type='text'
                                                name='fieldName'
                                                id='fieldName'
                                                placeholder=' '
                                                value={formData.fieldName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Select Operator</Label>
                                            <Select
                                                required
                                                name="operand"
                                                id="operand"
                                                isMulti={false}
                                                isLoading={false}
                                                value={operandList.find((x) => x.value === formData.operand) ? operandList.find((x) => x.value === formData.operand) : ""}
                                                options={operandList}
                                                onChange={(x) => {
                                                    setFormData({...formData, operand:x.value})
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>

                                </Row>
                                <h6 className={"mt-2"}><b>Value Information</b></h6>
                                <hr></hr>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup check>
                                            <Label check><Input
                                                type='checkbox'
                                                name='ac'
                                                id='ac'
                                                placeholder='Is Application Codeset'
                                                onChange={toggleApplicationCodeset}

                                            /> Is Form Value Application Codeset?

                                            </Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup check>
                                            <Label check>  <Input
                                                type='checkbox'
                                                name='cv'
                                                id='cv'
                                                placeholder='Is Continuous Variable'
                                                onChange={(e) => setFormData({...formData, isContinousVariable: e.target.checked})}

                                            />Is Form Value a Continuous Variable?

                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <br></br>
                                    {showAppCodeset ?
                                        <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Select Application Codeset</Label>
                                            <Select
                                                required
                                                name="applicationCodeset"
                                                id="applicationCodeset"
                                                isMulti={false}
                                                isLoading={false}
                                                options={applicationCodesetList}
                                                value={applicationCodesetList.find((x) => x.value === formData.fieldValue) ? applicationCodesetList.find((x) => x.value === formData.fieldValue) : ""}
                                                onChange={(x) => {
                                                    setFormData({...formData, fieldValue:x.value, datatype:1});
                                                }}
                                            />
                                        </FormGroup>
                                    </Col></Row>
                                            :
                                        <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Value (This is the value that determines flag)</Label>
                                            <Input
                                                type='text'
                                                name='fieldValue'
                                                id='fieldValue'
                                                placeholder=' '
                                                value={formData.fieldValue}
                                                onChange={handleInputChange}

                                            />
                                        </FormGroup>
                                    </Col>
                                    {/*<Col md={6}>*/}
                                    {/*    <FormGroup>*/}
                                    {/*        <Label>Select Form Value Datatype</Label>*/}
                                    {/*        <Select*/}
                                    {/*            required*/}
                                    {/*            name="formType"*/}
                                    {/*            id="formType"*/}
                                    {/*            isMulti={false}*/}
                                    {/*            isLoading={false}*/}
                                    {/*            options={formTypeList}*/}
                                    {/*            value={formTypeList.find((x) => x.value === formData.datatype) ? formTypeList.find((x) => x.value === formData.datatype) : ""}*/}
                                    {/*            onChange={(x) => {*/}
                                    {/*            setFormData({...formData, datatype:x.value})*/}
                                    {/*        }}*/}
                                    {/*        />*/}
                                    {/*    </FormGroup>*/}
                                    {/*</Col>*/}
                                </Row>
                                        }
                                <hr></hr>
                                <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Select Applicable Forms (Select a list of forms that will use this flag)</Label>
                                        <Select
                                            required
                                            name="applicableForms"
                                            id="applicableForms"
                                            isMulti={true}
                                            isLoading={false}
                                            options={formList}
                                            onChange={(x) => setApplicableForm(x)}
                                        />
                                    </FormGroup>
                                </Col>
                                </Row>
                                <MatButton
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                >
                                    Save  {loading ? <Spinner /> : ""}
                                </MatButton>
                                <MatButton
                                    variant='contained'
                                    color='default'
                                    onClick={props.toggleModal}
                                    startIcon={<CancelIcon />}
                                >
                                    Cancel
                                </MatButton>

                            </CardBody>
                        </Card>
                    </ModalBody>

                </Form>
            </Modal>
        </div>
    );
}



export default connect(null, { createWard , updateWard})(ModalSample);
