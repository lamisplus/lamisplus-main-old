import React, {useState} from 'react';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardContent,
}
    from '@material-ui/core';
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
  } from 'reactstrap';
import Title from 'components/Title/CardTitle';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import Spinner from 'react-bootstrap/Spinner';
// React Notification
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from 'axios';  
import {url} from 'axios/url';



const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height:45,
        width: 350,
    },
    button: {
        margin: theme.spacing(1),
    },

    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
}));
 
export default function AssignClinician(props) {
    const classes = useStyles();
    
    //Save Assign Clinician 
        const [clinician, setclinician] = useState({ 
            clinicianId: '', 
                patientId: props.patientdetail.patientId, 
                visitId:props.patientdetail.checkInId,
                appCodesetId:''  
            }); 
        //    console.log(clinician);
        const [showLoading, setShowLoading] = useState(false);  
        const apiUrl = url+"encounters/assign-clinican";  
        const SaveAssignClinician = (e) => { 
        e.preventDefault();  

        const data = { 
            clinicianId: clinician.clinicianId, 
            patientId: props.patientdetail.patientId, 
            visitId:props.patientdetail.checkInId, 
            appCodesetId:clinician.appCodesetId
        }; 
        
        console.log(data);
        axios.post(apiUrl, data)
            .then((result) => { 
                toast.success(" Successful!");         
                setShowLoading(false);
                props.history.push('/checkedin-patients')
               
            }).catch((error) => {
                toast.info(" Processing Please wait!"); 
                console.log(error);
                setShowLoading(false);
                setclinician(false);

            }
            ); 
        };

    const onChange = (e) => {
        e.persist();     
        setclinician({...clinician, [e.target.name]: e.target.value});
        } 


    return (
        
            <form className={classes.form} onSubmit={SaveAssignClinician}>
                <ToastContainer autoClose={2000} />
                <Card className={classes.cardBottom}>
                    <CardContent>
                        <Title >Assign Clinician  --- {props.patientdetail.checkInId}
                        </Title>
                        <br/>

                        <Row form>
                              
                        <Col md={6}>
                            <FormGroup>
                                <Label for="middleName">Next POC </Label>
                                
                                <Input type="select" name="appCodesetId" id="appCodesetId" value={clinician.appCodesetId}
                                    onChange={onChange}>
                                    <option value="1">General Clinic </option>
                                    <option value="2">X-ray</option>
                                    <option value="3">Private Clinic</option>
                                </Input>
                            </FormGroup>
                            </Col>
                            
                            <Col md={6}>
                            <FormGroup>
                                <Label for="middleName">Available Clinician</Label>
                                
                                <Input type="select" name="clinicianId" id="clinicianId" value={clinician.clinicianId}
                                    onChange={onChange}>
                                    <option value="6">Dr. Duadua</option>
                                    <option value="6">Dr. Emeka</option>
                                    <option value="6">Dr. Duadua</option>
                                    <option value="1">Dr. Evans</option>
                                    <option value="2">Dr. Dorcas</option>
                                    <option value="3">Dr. Debora</option>
                                </Input>
                            </FormGroup>
                            </Col>
                            
                        </Row>
                        
                        <Row>
                            <Col md={12}>
                            {showLoading && 
                                
                                <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                                </Spinner> 
                            } 
                            </Col> 
                        </Row>
                        <br/>
                        <MatButton  
                                type="submit" 
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<SaveIcon />}
                             >
                                Assign Clinician
                        </MatButton>
                        <MatButton
                            variant="contained"
                            color="default"
                            className={classes.button}
                            startIcon={<CancelIcon />}>
                            Cancel
                        </MatButton>
                    </CardContent>
                </Card>
            </form>
    );
}