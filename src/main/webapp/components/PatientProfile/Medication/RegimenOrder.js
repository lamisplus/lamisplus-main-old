import React, { useState } from "react";
import {create} from "actions/encounter";
import * as CODES from "api/codes";
import {connect} from "react-redux";
import FormRenderer from "components/FormManager/FormRenderer";
import moment from "moment";
import {ToastContainer, toast} from "react-toastify";
import {fetchPatientLatestMedicationOrder} from "actions/patients";


const DrugOrder = (props) => {
    const [showForm, setShowForm] = useState(true);
    const currentForm = {
        code: CODES.REGIMEN_PRESCRIPTION_FORM,
        programCode: CODES.GENERAL_SERVICE,
        formName: "Drug Prescription",
        options:{
            hideHeader: true
        },
    };
    const PatientID = props.patientId;
    const visitId = props.visitId;

    const saveDrugOrders = (submission) => {
        const defaults = {
            patient_id: PatientID,
            prescription_status: 0,
            quantity_dispensed: 0,
            type: 0,
            user_id: 0,
        };
        const prescriptions = {
                ...submission.data,
                ...defaults,
            }

        const data = {
            data: [prescriptions],
            patientId: PatientID,
            visitId: visitId,
            formCode: CODES.DRUG_PRESCRIPTION_FORM,
            programCode: CODES.GENERAL_SERVICE,
            dateEncounter: moment(new Date()).format("DD-MM-YYYY"),
        };
        const onSuccess = () => {
            try{
            toast.success("Drug Order Successfully Saved!");
            props.fetchPatientMedicationOrder(  props.patientId);
            reloadForm();
<<<<<<< HEAD
=======
            }catch(e){
                console.log(e)
            }
>>>>>>> mathew
        };
        const onError = (errstatus) => {
            toast.error("Something went wrong, please contact administration");
        };
        props.create(data, onSuccess, onError);
    };

    // to reload form
    const reloadForm = () => {
        setShowForm(false);
        setShowForm(true);
    }
    return (
        <React.Fragment>
            <ToastContainer />
            {showForm && <FormRenderer
                patientId={props.patient.patientId}
                formCode={currentForm.code}
                programCode={currentForm.programCode}
                visitId={props.patient.visitId}
                onSubmit={saveDrugOrders}
            />}
            </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        patient: state.patients.patient,
        previousMedicationList: state.patients.previousMedications,
    };
};

const mapActionToProps = {
    create: create,
    fetchPatientMedicationOrder: fetchPatientLatestMedicationOrder
};

export default connect(mapStateToProps, mapActionToProps)(DrugOrder);
