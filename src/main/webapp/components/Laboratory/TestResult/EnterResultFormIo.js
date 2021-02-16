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
    createCollectedSample,
    fetchFormById,
} from "../../../actions/laboratory";
import * as CODES from "./../../../api/codes";
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
    const date_sample_collected = datasample.data ? datasample.data.date_sample_collected : null ;
    const lab_test_group = datasample.data ? datasample.data.lab_test_group : null ;
    const description = datasample.data ? datasample.data.description : null ;
    //const lab_number = datasample.data.lab_number  ? datasample.data.lab_number : null;
   
    const labId = datasample.id
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    //This is to get SAMPLE TYPE from application Codeset

    const currentForm = {
          code: CODES.LAB_SAMPLE_RESULT_CODE_FORM,
          programCode: CODES.GENERAL_SERVICE,
          formName: "Laboratory Sample Collection",
          options:{
              hideHeader: true
          },
      };


    const saveSample = (e) => {
        const newData = e.data 

        if(newData.date_result_reported){
          newData['date_result_reported'] = moment(newData.date_result_reported).format(
            "DD-MM-YYYY"
          );
        }
        if(newData.date_asseyed){
          newData['date_asseyed'] = moment(newData.date_asseyed).format(
            "DD-MM-YYYY"
          );
        }
        if(newData.time_result_reported){
          newData['time_result_reported'] = moment(newData.time_result_reported, "hh:mm").format('LT')
        }
            datasample.data.lab_test_order_status = 5;
           
            if(datasample.data.hasOwnProperty('reported_result')){
                datasample.data.reported_result.push(newData);
            }else{
                datasample.data['reported_result'] =[newData]
            }
            Object.assign(datasample.data, newData)

            setLoading(true);

            /* end of the process */
            const onSuccess = () => {
                setLoading(false);
                props.togglestatus();
            };
            const onError = () => {
                setLoading(false);
                props.togglestatus();
            };
           
            props.createCollectedSample(datasample, labId, onSuccess, onError);
        
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
                                    <Col md={12} >
                                        <Alert color="dark" style={{backgroundColor:'#9F9FA5', color:"#000" , fontWeight: 'bolder', }}>
                                            <p style={{marginTop: '.7rem' }}>Test Group : <span style={{ fontWeight: 'bolder'}}>{lab_test_group}</span> 
                                                &nbsp;&nbsp;&nbsp;&nbsp;Test Ordered : 
                                                <span style={{ fontWeight: 'bolder'}}>{" "}{description}</span>
                                                        &nbsp;&nbsp;&nbsp;&nbsp; Date Ordered :        
                                                <span style={{ fontWeight: 'bolder'}}>{" "}{date_sample_collected}</span>
                                            </p>
                                        
                                        </Alert>
                                    </Col>
                                    <FormRenderer
                                        formCode={currentForm.code}
                                        programCode={currentForm.programCode}
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

export default connect(null, { createCollectedSample, fetchFormById })(
    ModalSample
);
