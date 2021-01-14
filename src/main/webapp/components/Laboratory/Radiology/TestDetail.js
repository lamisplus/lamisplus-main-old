import React, {useEffect, useState} from 'react';
import { connect } from "react-redux";
import {fetchByHospitalNumber} from "actions/patients";
import {fetchRadiologyTestOrdersByEncounterID, updateRadiologyByFormId} from "actions/laboratory"
import { TiArrowBack } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import PatientDetailCard from "../../PatientProfile/PatientDetailCard";
import {getQueryParams} from "components/Utils/PageUtils"
import {Card, CardBody, Spinner ,CardHeader,Table} from 'reactstrap'
import {Menu, MenuButton, MenuItem, MenuList} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import {FaPlusSquare, FaRegEye} from 'react-icons/fa';
import Moment from "moment";
import moment from "moment";
import momentLocalizer from "react-widgets-moment";
import UploadResultPage from "./UploadResultPage";
import ViewResultPage from "./ViewResultPage";
import {authentication} from '../../../_services/authentication';
//Dtate Picker package
Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    td: { borderBottom :'#fff'},
    previewChip: {
        minWidth: 160,
        maxWidth: 210
    },
}))
const GlobalVariableSearch = (props) => {
    const patientId = getQueryParams("hospitalNumber", props.location.search);
    const encounterId = getQueryParams("encId", props.location.search);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [showViewModal, setShowViewModal] = React.useState(false);

    const [testOrder, setTestOrder] = React.useState(null);
    const toggleViewModal = () => setShowViewModal(!showViewModal)
    const toggleModal = () => setShowModal(!showModal)
    const classes = useStyles()
    const loadSearch = () => {

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
        loadSearch()
    }, [encounterId]); //componentDidMount

    useEffect(() => {
        props.fetchPatientByHospitalNumber(patientId)
    }, [patientId]); //componentDidMount

    const openResultPage = (row) => {
        if(row.data.files) {
            const files  = row.data.files.map(x => {
                x.file["name"] = x.file.path;
                return x
            })
            row.data["files"] = files;
        } else {
            //row["data"] = {...defaultFormValue, ...row.data};
        }
        setTestOrder(row);
        toggleViewModal();
    }

    const uploadResultPage = (row) => {
        if(row.data.files) {
            const files  = row.data.files.map(x => {
                x.file["name"] = x.file.path;
                return x
            })
            row.data["files"] = files;
        } else {
           // row["data"] =  row.data;
        }
        setTestOrder(row);
        toggleModal();
    }


    return (
        <React.Fragment>

            <PatientDetailCard />
            <br />

        <Card>
            <CardHeader>Test Order Details
                <Link
                    to={{pathname: "/laboratory?tab=radiology" }}>

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
                        <th>Date Ordered</th>
                        <th>Results Uploaded</th>
                        <th>Date Result Uploaded</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>

                    {!loading ? props.list.length === 0 ? "" : props.list.formDataObj.map((row) => (
                            <tr key={row.id} style={{ borderBottomColor: '#fff' }}>
                                <th className={classes.td}>{row.data.description ? row.data.description : ""}</th>
                                <td className={classes.td}>{row.data.order_date ? row.data.order_date : ""} {" "}{row.data.order_time ? row.data.order_time : ""}  </td>
                                <td className={classes.td}>{row.data.files ? row.data.files.length : "0"}</td>
                                <td className={classes.td}>{row.data.result_date ? row.data.result_date : ""} {" "}{row.data.result_time ? row.data.result_time : ""}  </td>
                                <td className={classes.td} > <Menu>
                                    <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px"}}>
                                        Action <span aria-hidden>▾</span>
                                    </MenuButton>
                                    <MenuList style={{hover:"#eee"}}>

                                        <MenuItem onSelect={() => uploadResultPage(row)} hidden={!authentication.userHasRole(["laboratory_write"])} ><FaPlusSquare size="15" style={{color: '#3F51B5'}}/>{" "}Upload Result</MenuItem>
                                        {row.data && row.data.files && row.data.files.length > 0 &&  <MenuItem onSelect={() => openResultPage(row)}><FaRegEye size="15" style={{color: '#3F51B5'}}/>{" "}View Result</MenuItem>}

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
          <UploadResultPage toggleModal={toggleModal} showModal={showModal} loadSearch={loadSearch} formData={testOrder}/>
            <ViewResultPage toggleModal={toggleViewModal} showModal={showViewModal}  formData={testOrder}/>
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
    fetchPatientByHospitalNumber: fetchByHospitalNumber,
    updateRadiologyByFormId: updateRadiologyByFormId
};

export default connect(mapStateToProps, mapActionToProps)(GlobalVariableSearch);