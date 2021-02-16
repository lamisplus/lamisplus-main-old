import React, {useState, useEffect} from 'react';
import {  Modal, ModalHeader, ModalBody,
    Form,
    Row,
    Col,Input,
    FormGroup,
    Label,Card, CardBody
} from 'reactstrap';
import {
    updatePrescriptionStatus,
} from "../../actions/pharmacy";
import { makeStyles } from '@material-ui/core/styles'

import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import moment from "moment";
import { Spinner } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import './modal.css';
import { url } from "./../../api";
import axios from "axios";
import * as CODES from "./../../api/codes";
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
    code: CODES.PHARMARCY_DRUG_DISPENSE_REGIMEN,
    programCode: CODES.GENERAL_SERVICE,
    formName: "Regimen Drug Dispensing",
    options:{
        hideHeader: true
    },
};
const DispenseModal = (props) => {
    const { buttonLabel, className } = props;
    const toggle = props.toggle
    const modal = props.isOpen
    const closeBtn = props.close
    const classes = useStyles();
    const [optionsample, setOptionsample] = useState([]);
    const formData = props.formData ? props.formData : {}
    const [formValues, setFormValues] = useState({})
    console.log(props.formData)
    const handleInputChange = (e) => {
        setFormValues ({ ...formValues, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios(
                    url + "drugs"
                );
                const body = response.data;
                console.log(body)
                setOptionsample(
                    body.map(({ genericName, id }) => ({ title: genericName, value: id }))
                );
            } catch (error) {
            }
        }
        getCharacters();
    }, []);

    const handleDispense = (e) => {
      
        const date_dispensed = moment(e.data.date_dispensed).format(
            "DD-MM-YYYY"
        );
        formData.data.brand_name_dispensed = e.data.brandName
        formData.data.quantity_dispensed = e.data.quantity_dispensed
        formData.data.prescription_status = 1
        formData.data.date_dispensed = date_dispensed
        formData.data.comment = e.data.comment
        const data = { ...formData };
        props.updatePrescriptionStatus(formData.id, data);

        toggle()
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
                                        formCode={currentForm.code}
                                        programCode={currentForm.programCode}
                                        onSubmit={handleDispense}
                                    />
                        </ModalBody>
                    </Modal>
                </CardBody>
            </Card>
        </div>
    );
}


export default connect(null, {updatePrescriptionStatus})(DispenseModal);

