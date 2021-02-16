import React, { useState } from "react";
import {Alert, Spinner} from "reactstrap";
import { connect } from "react-redux";
import * as CODES from "api/codes";
import Button from "@material-ui/core/Button";
import FormRendererUpdate from "components/FormManager/FormRendererUpdate";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import _ from 'lodash';
import {fetchByHospitalNumber, update} from "actions/patients";
import axios from "axios";
import {url as baseUrl} from "../../api";

const EditPatientFormio = (props) => {
    const [errorMsg, setErrorMsg] = React.useState("");
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const onDismiss = () => setShowErrorMsg(false);
    const [successMsg, setSuccessMsg] = React.useState("");
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const [submission, setSubmission] = React.useState();
    const onDismissSuccess = () => setShowSuccessMsg(false);
    const [showLoadingPatientInfo , setShowLoadingPatientInfo] = React.useState(false);

    const patientHospitalNumber = props.location.state;
    let patientId;
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


   // fetch patient by patient hospital number
    React.useEffect(() => {
        async function fetchPatient() {
            let requestOptions = {
                headers: { 'Content-Type': 'application/json' }
            };
            setShowLoadingPatientInfo(true);
            axios
                .get(`${baseUrl}patients/${patientHospitalNumber}`, requestOptions)
                .then(response => {
                    try {
                        const patientObj = response.data;
                        patientId = response.data.patientId;
                       setSubmission({data: patientObj});
                        setShowLoadingPatientInfo(false);
                    } catch(c){
                        console.log(c);
                    }
                })
                .catch(error => {
                        setShowLoadingPatientInfo(false);
                    }
                );
        }
        fetchPatient();
    }, [patientHospitalNumber]);

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
        props.update(data, submission.data.patientId, onSuccess, onError);

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
            <FormRendererUpdate
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

    };
};

const mapActionToProps = {
    fetchPatientByHospitalNumber: fetchByHospitalNumber,
    update: update
};

export default connect(mapStateToProps,mapActionToProps)(EditPatientFormio);
