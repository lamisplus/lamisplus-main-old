import React, { useState } from "react";
import {Alert, Spinner} from "reactstrap";
import { connect } from "react-redux";
import * as CODES from "api/codes";
import Button from "@material-ui/core/Button";
import FormRenderer from "components/FormManager/FormRenderer";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import {update} from "../../actions/patients";
import moment from "moment";
import _ from 'lodash';
import {fetchByHospitalNumber} from "actions/patients";

function EditPatientFormio(props) {
    const [errorMsg, setErrorMsg] = React.useState("");
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const onDismiss = () => setShowErrorMsg(false);
    const [successMsg, setSuccessMsg] = React.useState("");
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const [submission, setSubmission] = React.useState({});
    const onDismissSuccess = () => setShowSuccessMsg(false);
    const [showLoadingPatientInfo , setShowLoadingPatientInfo] = React.useState(true);

    const patientHospitalNumber2 = props.location.state;

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

    //fetch patient by patient hospital number
    // React.useEffect(() => {
    //     const onError = () => {
    //         toast.error("An error occurred, could not load patient information");
    //     }
    //
    //     if(patientHospitalNumber) {
    //         console.log(patientHospitalNumber);
    //         props.fetchByHospitalNumber(patientHospitalNumber, () => setShowLoadingPatientInfo(false), onError);
    //     }
    // }, [patientHospitalNumber]);

        const onPSuccess = () => {
            setShowLoadingPatientInfo(false);
        };
        const onPError = () => {
            setShowLoadingPatientInfo(false);
        };
        props.fetchByHospitalNumber(patientHospitalNumber2, onPSuccess, onPError);


    //Add patient data to submission
    React.useEffect(() => {
        setSubmission(_.merge(submission, { data:  props.patient}));
    }, [props.patient]);


    const registerPatient = (formData) => {
        const data = formData.data;
        data['authHeader'] = null;
        if(data.dateOfRegistration) {
            data['dateRegistration'] = moment(data.dateOfRegistration).format("DD-MM-YYYY");
        }
        if(data.dateOfBirth) {
            data['dob'] = moment(data.dateOfBirth).format("DD-MM-YYYY");
        }
        const onSuccess = () => {
            toast.success("Patient saved successfully!");
            setTimeout(() => {
                props.history.push(`/patients`)
            }, 1000)
        }
        const onError = () => {
            toast.error("An error occurred, could not save patient information");
        }
        props.update(data, props.patientHospitalNumber, onSuccess, onError);

    }

    if(showLoadingPatientInfo){
        return (<span className="text-center">
    <Spinner style={{ width: "3rem", height: "3rem" }} type="grow" />{" "}
            Loading patient information...
  </span>);
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
                submission={submission}
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

export default connect(mapStateToProps, { update , fetchByHospitalNumber})(EditPatientFormio);
