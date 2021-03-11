import React, { useState, useEffect } from "react";
import {Modal,ModalHeader, ModalBody,Form,FormFeedback,Row,Alert,Col,Input,FormGroup,Label,Card,CardBody,} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import {
    updatePrescriptionStatus,
} from "../../actions/pharmacy";
import * as CODES from "./../../api/codes";
import FormRenderer from "components/FormManager/FormRenderer";

Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    cardBottom: {
        marginBottom: 20,
    },
    Select: {
        height: 45,
        width: 350,
    },
    button: {
        margin: theme.spacing(1),
    },
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: "none",
    },
    error: {
        color: "#f85032",
        fontSize: "12.8px",
    },
}));

const ModalSample = (props) => {
    const classes = useStyles()
    const formData = props.formData && props.formData!==null ? props.formData : {};
    console.log(formData)

    const currentForm = {
        code: CODES.PHARMARCY_DRUG_DISPENSE,
        programCode: CODES.GENERAL_SERVICE,
        formName: "Pharmacy Drug Dispensing",
        options:{
            hideHeader: true
        },
    };
    
    const currentFormForRegimen = {
        code: CODES.PHARMARCY_DRUG_DISPENSE_REGIMEN,
        programCode: CODES.GENERAL_SERVICE,
        formName: "Pharmacy Drug Dispensing Regimen" ,
        options:{
            hideHeader: true
        },
    
    };


    const saveSample = (e) => {
        e.data.prescription_status = 1
        formData.data=e.data
        console.log(formData.data)
        props.updatePrescriptionStatus(formData.id, e);
        props.togglestatus()
        window.location.reload(true);

        
        
    };


    return (
        <div >
            <Card >
                <CardBody>
                    <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                        <Form onSubmit={saveSample}>
                            <ModalHeader toggle={props.togglestatus}>Result Reporting</ModalHeader>
                            <ModalBody>
                            <Card >
                                <CardBody>
                                   
                                    <FormRenderer
                                        formCode={props.formData.data && props.formData.data.type !=0 ? currentForm.code : currentFormForRegimen.code }
                                        programCode={currentForm.programCode}
                                        options={props.formData.data}
                                        onSubmit={saveSample}
                                    />
                                </CardBody>
                            </Card>
                                
                            </ModalBody>
                        </Form>
                    </Modal>
                </CardBody>
            </Card>
        </div>
    );
};

export default connect(null, { updatePrescriptionStatus })(
    ModalSample
);
