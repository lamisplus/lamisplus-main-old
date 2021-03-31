import React  from "react";
import {Modal,ModalHeader, ModalBody,Card,CardBody,} from "reactstrap";
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
    const datasample = props.datasample && props.datasample!==null ? props.datasample : {};
    console.log(datasample) 
    const DrugId = datasample.id

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
       // datasample.data.prescription_status = 1
        //datasample.data = e.data
        const onSuccess = () => {
            props.togglestatus();
            props.updateFormData(datasample);
        };
        const onError = () => {
            props.togglestatus();
        };
        const newData =  {...datasample.data, ... e.data}
        datasample.data = newData
        datasample.data['prescription_status'] = 1
        console.log(datasample);
       props.updatePrescriptionStatus(DrugId, datasample, onSuccess, onError);

       props.togglestatus();
        
    };


    return (
        <div >
            <Card >
                <CardBody>
                    <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                      
                            <ModalHeader toggle={props.togglestatus}>Drug Dispensing </ModalHeader>
                            <ModalBody>
                            <Card >
              <CardBody>

                        <FormRenderer
                            formCode={datasample.data && datasample.data.type !=0 ? currentForm.code : currentFormForRegimen.code}
                            programCode={currentForm.programCode}
                            submission={datasample}
                            onSubmit={saveSample}
                        />
                    </CardBody>
                </Card>
                                
                 </ModalBody>
                  
                    </Modal>
                </CardBody>
            </Card>
        </div>
    );
};

export default connect(null, { updatePrescriptionStatus })(
    ModalSample
);
