import React, {useState, useEffect} from 'react';
import {  Modal, ModalHeader, ModalBody,
Card, CardBody
} from 'reactstrap';
import {
    updatePrescriptionStatus,
} from "../../actions/pharmacy";
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import './modal.css';
import { url } from "../../api";
import axios from "axios";
import * as CODES from "../../api/codes";
import FormRenderer from "components/FormManager/FormRenderer";


Moment.locale('en');
momentLocalizer();
const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    input: {
        display: 'none'
    }
}))


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
const DispenseModal = (props) => {

    const { buttonLabel, className } = props;
    const toggle = props.toggle
    const modal = props.isOpen
    const closeBtn = props.close

    const formData = props.formData ? props.formData : {}

    console.log(props.formData)
    


    const handleDispense = (e) => {
        e.data.prescription_status = 1
        formData.data=e.data
        console.log(formData.data)
        props.updatePrescriptionStatus(formData.id, e);
        toggle()
        window.location.reload(true);
    };



    return (
        <div>
            <Card>
                <CardBody>
                    <ToastContainer autoClose={3000} hideProgressBar />
                    <Modal
                        isOpen={modal}
                        toggle={toggle}
                        className={className}
                        size="lg"
                    >
                        <ModalHeader toggle={toggle} close={closeBtn}>
                            Dispensing 
                        </ModalHeader>
                        <ModalBody>
                        <FormRenderer
                            formCode={props.formData.data.type !=0 ? currentForm.code : currentFormForRegimen.code }
                            programCode={currentForm.programCode}
                            options={props.formData.data}
                            onSubmit={handleDispense}
                            submission={props.formData}
                        />
                        </ModalBody>
                    </Modal>
                </CardBody>
            </Card>
        </div>
    );
}


export default connect(null, {updatePrescriptionStatus})(DispenseModal);

