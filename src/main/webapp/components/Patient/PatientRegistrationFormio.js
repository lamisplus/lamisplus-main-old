import React, { useState } from "react";
import {Alert} from "reactstrap";
import { connect } from "react-redux";
import * as CODES from "api/codes";
import Button from "@material-ui/core/Button";
import FormRenderer from "components/FormManager/FormRenderer";
import { FaArrowLeft } from "react-icons/fa";
//import "./consultation.css"
import { ToastContainer, toast } from "react-toastify";
import {create} from "../../actions/patients";
import moment from "moment";
import {initialRelative} from "./InitialRealative";

function PatientRegistrationFormio(props) {
    const [errorMsg, setErrorMsg] = React.useState("");
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const onDismiss = () => setShowErrorMsg(false);
    const [successMsg, setSuccessMsg] = React.useState("");
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const onDismissSuccess = () => setShowSuccessMsg(false);
    const currentForm = {
        code: CODES.PATIENT_REGISTRATION_FORM,
        programCode: CODES.GENERAL_SERVICE,
        formName: "PATIENT CONSULTATION",
        options:{
            hideHeader: true
        },
    };
    const onSuccess = () => {
        setShowSuccessMsg(true);
        setSuccessMsg("Patient saved successfully!");
        window.scrollTo(0, 0);
    };

    const registerPatient = (formData) => {
        const data = formData.data;
        const onSuccess = () => {
            toast.success("Patient saved successfully!");
            setTimeout(() => {
                props.history.push(`/patients`)
            }, 1000)
        }
        const onError = () => {
            toast.error("An error occurred, could not save patient information");
        }
        props.create(data, onSuccess, onError);

    }
    return (
        <React.Fragment>
            <ToastContainer />
            <Alert color="danger" isOpen={showErrorMsg} toggle={onDismiss}>
                {errorMsg}
            </Alert>
            <Alert color="success" isOpen={showSuccessMsg} toggle={onDismissSuccess}>
                {successMsg}
            </Alert>
            <div>
                <Button
                    color="primary"
                    variant="contained"
                    className=" float-right mr-1"
                    onClick={props.history.goBack}
                    startIcon={<FaArrowLeft />}
                >
                    Go Back
                </Button>
            </div>
            <FormRenderer
                formCode={currentForm.code}
                programCode={currentForm.programCode}
                onSubmit={registerPatient}
            />
        </React.Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        patient: state.patients.patient
    };
};

const mapActionToProps = {
};

export default connect(mapStateToProps, { create })(PatientRegistrationFormio);
