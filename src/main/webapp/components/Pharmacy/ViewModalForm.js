import React, { useState } from "react";
import {Modal,ModalHeader, ModalBody,Form,Card,CardBody,} from "reactstrap";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";

import {
    updatePrescriptionStatus,
} from "../../actions/pharmacy";
import * as CODES from "./../../api/codes";
import FormRendererView from "components/FormManager/FormRendererView";

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
    const datasample = props.datasample && props.datasample!==null ? props.datasample : {};
    console.log(datasample)
   
    const DrugId = datasample.id
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    //This is to get SAMPLE TYPE from application Codeset

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
        const newData = e.data 
        datasample.data.prescription_status = 1
        const onSuccess = () => {
            props.togglestatus();
        };
        const onError = () => {
            props.togglestatus();
        };
       
        props.updatePrescriptionStatus(datasample.id, e, onSuccess, onError);
      
        
    };
if(datasample !== null){

    return (
        <div >
            <Card >
                <CardBody>
                    <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                      
                            <ModalHeader toggle={props.togglestatus}>Drug Dispensing </ModalHeader>
                            <ModalBody>
                            <Card >
              <CardBody>
                 
                        <FormRendererView
                            formCode={datasample.data && datasample.data.type !=0 ? currentForm.code : currentFormForRegimen.code}
                            programCode={currentForm.programCode}                          
                            submission={datasample}
                        />
                    </CardBody>
                </Card>
                                
                 </ModalBody>
                  
                    </Modal>
                </CardBody>
            </Card>
        </div>
    );
}else {}
};

export default  ModalSample ;

