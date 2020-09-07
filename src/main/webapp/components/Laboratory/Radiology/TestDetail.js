import React, {useEffect, useState} from 'react';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import { connect } from "react-redux";
import { fetchAll, deleteGlobalVariable} from "actions/globalVariable";
import {fetchByHospitalNumber} from "actions/patients";
import {fetchRadiologyTestOrdersByEncounterID} from "actions/laboratory"
import { TiArrowBack } from 'react-icons/ti';
import Link from '@material-ui/core/Link';
import Button from "@material-ui/core/Button";
import {toast} from "react-toastify";
import SaveIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import PatientDetailCard from "../../Functions/PatientDetailCard";
import {getQueryParams} from "components/Utils/PageUtils"
import {Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader, Spinner
    ,CardHeader,Col,Row,Alert,Table, Form,FormGroup,Label,Input} from 'reactstrap'
import {Menu, MenuButton, MenuItem, MenuList} from "@reach/menu-button";
import {FaPlusSquare, FaRegEye} from 'react-icons/fa';
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";
import { AttachFile, Audiotrack, Description, PictureAsPdf, Theaters } from '@material-ui/icons';
import Moment from "moment";
import moment from "moment";
import momentLocalizer from "react-widgets-moment";

//Dtate Picker package
Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    td: { borderBottom :'#fff'}
}))
const GlobalVariableSearch = (props) => {
    const patientId = getQueryParams("hospitalNumber", props.location.search);
    const encounterId = getQueryParams("encId", props.location.search);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentGlobalVariable, setCurrentGlobalVariable] = React.useState(null);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const defaultFormValue = {
        result_date: moment(new Date()).format("DD-MM-YYYY"),
        result_time: moment(new Date()).format("LT")
    };
    const [testOrder, setTestOrder] = React.useState(defaultFormValue);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal)
    const toggleModal = () => setShowModal(!showModal)
    const classes = useStyles()
    const loadGlobalVariable = () => {

        const onSuccess = () => {
            setLoading(false);
        };
        const onError = () => {
            setLoading(false);
        };
        if(encounterId) {
            props.fetchAll(encounterId, onSuccess, onError);
        }
    }
    useEffect(() => {
        loadGlobalVariable()
    }, [encounterId]); //componentDidMount

    useEffect(() => {
        props.fetchPatientByHospitalNumber(patientId)
    }, [patientId]); //componentDidMount

    const openGlobalVariable = (row) => {
        setCurrentGlobalVariable(row);
        toggleModal();
    }

    const deleteGlobalVariable = (row) => {
        setCurrentGlobalVariable(row);
        toggleDeleteModal();
    }

    const processDelete = (id) => {
        setDeleting(true);
        const onSuccess = () => {
            setDeleting(false);
            toggleDeleteModal();
            toast.success("Global variable deleted successfully!");
            loadGlobalVariable();
        };
        const onError = () => {
            setDeleting(false);
            toast.error("Something went wrong, please contact administration");
        };
        props.delete(id, onSuccess, onError);
    }

    const handlePreviewIcon = (fileObject, classes) => {
        const {type} = fileObject.file
        const {name} = fileObject.file
        const iconProps = {
            className : classes.image,
        }

        if (type.startsWith("video/")) return <><Theaters {...iconProps} /><p>{name}</p></>
        if (type.startsWith("audio/")) return <><Audiotrack {...iconProps} /><p>{name}</p></>

        switch (type) {
            case "application/msword":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return <><Description {...iconProps} fontSize="small"/> <p>{name}</p></>
            case "application/pdf":
                return <><PictureAsPdf fontSize="small"/> <p>{name}</p></>
            default:
                return <><AttachFile {...iconProps} /> <p>{name}</p></>
        }
    }

    const [fileObjects, setFileObjects] = useState([]);
    return (
        <React.Fragment>

            <PatientDetailCard />
            <br />

        <Card>
            <CardHeader>Test Order Details
                <Link
                    to ={{
                        pathname: "/laboratory",
                        activetab: 1
                    }} >

                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        className={classes.button}
                        className=" float-right mr-1"
                    >
                        <TiArrowBack/>{" "} Back
                    </Button>

                </Link>
            </CardHeader>
            <CardBody>

                <Table  striped responsive>
                    <thead style={{  backgroundColor:'#9F9FA5' }}>
                    <tr>
                        <th>Test</th>
                        <th>Sample Type</th>
                        <th>Date Requested</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>

                    {!loading ? props.list.length === 0 ? "" : props.list.formDataObj.map((row) => (
                            <tr key={row.id} style={{ borderBottomColor: '#fff' }}>
                                <th className={classes.td}>{row.data.description===""?" ":row.data.description}</th>
                                <td className={classes.td}>{row.data.sample_type==="" ? " ":row.data.sample_type}</td>
                                <td className={classes.td}>  </td>
                                <td className={classes.td}> </td>
                                <td className={classes.td}> <Menu>
                                    <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px"}}>
                                        Action <span aria-hidden>▾</span>
                                    </MenuButton>
                                    <MenuList style={{hover:"#eee"}}>

                                            <MenuItem onSelect={() => toggleDeleteModal(row)}><FaPlusSquare size="15" style={{color: '#3F51B5'}}/>{" "}Upload Result</MenuItem>
                                        <MenuItem onSelect={() => toggleDeleteModal()}><FaRegEye size="15" style={{color: '#3F51B5'}}/>{" "}View Result</MenuItem>

                                    </MenuList>
                                </Menu></td>
                            </tr>
                        ))
                        :<p> <Spinner color="primary" /> Loading Please Wait</p>
                    }
                    </tbody>
                </Table>
            </CardBody>

            {/*<NewGlobalVariable toggleModal={toggleModal} showModal={showModal} loadGlobalVariable={loadGlobalVariable} formData={currentGlobalVariable}/>*/}
            <Modal isOpen={showDeleteModal} toggle={toggleDeleteModal} size="lg">
                <Form onSubmit={() => console.log("submitting")}>
                <ModalHeader toggle={toggleDeleteModal}> Upload Result </ModalHeader>
                <ModalBody>

                    <Row style={{ marginTop: '20px'}}>
                        <Col md="12" >
                            <Alert color="dark" style={{backgroundColor:'#9F9FA5', color:"#000"}}>
                                <Row>
                                    <Col md={6}>
                                        Test Area: <b></b>
                                    </Col>
                                    <Col md={6}>
                                        Test: <b></b>
                                    </Col>
                                    <Col md={6}>
                                       Date Ordered : <b></b>
                                    </Col>
                                    <Col md={6}>
                                        Ordered By : <b></b>
                                    </Col>
                                </Row>

                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <DropzoneAreaBase
                                fileObjects={fileObjects}
                                onAdd={newFileObjs => {
                                    console.log('onAdd', newFileObjs);
                                    setFileObjects([].concat(fileObjects, newFileObjs));
                                }}
                                onDelete={deleteFileObj => {

                                    setFileObjects(fileObjects.splice(fileObjects.indexOf(x => x.file.name === deleteFileObj.file.name), 1));
                                    console.log('onDelete', deleteFileObj);
                                }}
                                showPreviews={true}
                                getPreviewIcon={handlePreviewIcon}
                                onAlert={(message, variant) => console.log(`${variant}: ${message}`)}
                            />
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="encounterDate">Upload Date & Time*</Label>
                                <DateTimePicker
                                    name="encounterDate"
                                    id="encounterDate"
                                    defaultValue={new Date()}
                                    max={new Date()}
                                    required
                                    onChange={(e) =>
                                        setTestOrder({
                                            ...testOrder,
                                            ...{
                                                result_date: e ? Moment(e).format(
                                                    "DD-MM-YYYY"
                                                ) : null,
                                                result_time: e ? Moment(e).format("LT") : null,
                                            },
                                        })
                                    }

                                />
                            </FormGroup>
                        </Col>
                    </Row>

                </ModalBody>
                <ModalFooter>
                    <Button
                        type='button'
                        variant='contained'
                        color='primary'
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        disabled={deleting}
                        onClick={() => processDelete(currentGlobalVariable.id)}
                    >
                        Upload  {deleting ? <Spinner /> : ""}
                    </Button>
                    <Button
                        variant='contained'
                        color='default'
                        onClick={toggleDeleteModal}
                        startIcon={<CancelIcon />}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Form>
            </Modal>
        </Card>
        </React.Fragment>
    );
}

const mapStateToProps = state => {

    return {
        list: state.laboratory.radiologyTests,
        patient: state.patients.patient,
    };
};

const mapActionToProps = {
    fetchAll: fetchRadiologyTestOrdersByEncounterID,
    delete: deleteGlobalVariable,
    fetchPatientByHospitalNumber: fetchByHospitalNumber,
};

export default connect(mapStateToProps, mapActionToProps)(GlobalVariableSearch);