import React, {useState, useEffect} from 'react';
import { Modal, ModalHeader, ModalBody,Form,FormFeedback,
Row,Col,FormGroup,Label,Input, Card,CardBody} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { DateTimePicker } from 'react-widgets';
import "react-widgets/dist/css/react-widgets.css";
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import moment from "moment";
import {url} from './../../api'
import { Alert } from 'reactstrap';
import { Spinner } from 'reactstrap';
import axios from "axios";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import Title from "components/Title/CardTitle";
import {CardContent } from "@material-ui/core";
import { initialfieldState_userRegistration } from "../../_helpers/initialFieldState_UserRegistration";
import useForm from "../Functions/UseForm";

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
Moment.locale('en');
momentLocalizer();


const AddCaseManager = (props) => {
    const classes = useStyles()
    const { values, setValues, handleInputChange, resetForm } = useForm(
        initialfieldState_userRegistration
      );
      const [gender, setGender] = useState([]);
      const [role, setRole] = useState([]);
      const [confirm, setConfirm] = useState("");
      const [matchingPassword, setMatchingPassword] = useState(false);
      const [validPassword, setValidPassword] = useState(false);
      const [matchingPasswordClass, setMatchingPasswordClass] = useState("");
      const [validPasswordClass, setValidPasswordClass] = useState("");
      const [saving, setSaving] = useState(false);
      const [states, setStates] = useState([]);
      const [lgaDetail, setLgaDetail] = useState();
      const [stateDetail, setStateDetail] = useState();
      const [otherDetails, setOtherDetails] = useState({state: "", lga: "", address: ""});
      const [provinces, setProvinces] = useState([]);

      const apistate = url + "countries/";
      /* Get list of gender parameter from the endpoint */
      useEffect(() => {
        async function getGender() {
          axios
            .get(`${url}application-codesets/codesetGroup?codesetGroup=GENDER`)
            .then((response) => {
              console.log(Object.entries(response.data));
              setGender(
                Object.entries(response.data).map(([key, value]) => ({
                  label: value.display,
                  value: value.display,
                }))
              );
            })
            .catch((error) => {
              console.log(error);
            });
        }
        getGender();
      }, []);
    
      /* Get list of Role parameter from the endpoint */
      useEffect(() => {
        async function getRoles() {
          axios
            .get(`${url}roles`)
            .then((response) => {
              console.log(Object.entries(response.data));
              setRole(
                Object.entries(response.data).map(([key, value]) => ({
                  label: value.name,
                  value: value.name,
                }))
              );
            })
            .catch((error) => {
              console.log(error);
            });
        }
        getRoles();
        setStateByCountryId();
      }, []);

       //Get States from selected country


    const  setStateByCountryId=() =>{
        async function getStateByCountryId() {
            const response = await axios.get(url + 'organisation-units/hierarchy/1/2')
            const stateList = response.data;
                setStates(response.data);
        }
        getStateByCountryId();
    }

    //fetch province
    const getProvinces = e => {
        setValues({ ...values, [e.target.name]: e.target.value });
            const stateId = e.target.value;
            
                async function getCharacters() {
                    const response = await axios.get(`${url}organisation-units/hierarchy/`+stateId+"/3");
                    const newStates = states.filter(state => state.id == stateId)
                    setStateDetail(newStates)
                    setOtherDetails({...otherDetails, state:newStates})
                    setProvinces(response.data);

                }
                getCharacters();
    };
    const getlgaObj = e => {

        const newlga = provinces.filter(lga => lga.id == e.target.value)
        setLgaDetail(newlga)
        setOtherDetails({...otherDetails, lga:newlga})
    }
    const handleAddress = e => {
         setOtherDetails({...otherDetails, address:e.target.value})
    }
    
      // check if password and confirm password match
      const handleConfirmPassword = (e, setConfirmPassword = true) => {
        if (setConfirmPassword) setConfirm(e.target.value);
        if (e.target.value === values.password || e.target.value === confirm) {
          setMatchingPassword(true);
          setMatchingPasswordClass("is-valid");
        } else {
          setMatchingPassword(false);
          setMatchingPasswordClass("is-invalid");
        }
      };
    
      const handlePassword = (e) => {
        handleInputChange(e);
        // validate password
        if (e.target.value.length > 5) {
          setValidPassword(true);
          setValidPasswordClass("is-valid");
        } else {
          setValidPassword(false);
          setValidPasswordClass("is-invalid");
        }
        // check if password and confirm password match
        handleConfirmPassword(e, false);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        values["roles"] = ["Case Manager"];
        values["details"] = otherDetails;
        
        setSaving(true);
        axios.post(`${url}register`, values)
                    .then(response => {
                        setSaving(false);
                        toast.success("Registration Successful");
                        resetForm();
                        props.loadCaseManagers();
                         //Closing of the modal 
                        props.togglestatus();
                    })
                    .catch(error => {
                        setSaving(false);
                        toast.error("Something went wrong");
                    });
      };


      
  return (      
      <div >
            <Modal isOpen={props.modalstatus} toggle={props.togglestatus}  size="lg">
            
            <ModalHeader toggle={props.togglestatus}>Create Case Manager</ModalHeader>
                <ModalBody>
                  
                        <Form onSubmit={handleSubmit}>
                            <Col xl={12} lg={12} md={12}>
                            <Card className={classes.cardBottom}>
                                <CardContent>
                                <Title>User Information</Title>
                                <br />
                                <Row form>
                                    <Col md={6}>
                                    <FormGroup>
                                        <Label for="firstName">First Name *</Label>
                                        <Input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        value={values.firstName}
                                        onChange={handleInputChange}
                                        required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="lastName">Last Name * </Label>
                                        <Input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        onChange={handleInputChange}
                                        value={values.lastName}
                                        required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="userName">Username *</Label>
                                        <Input
                                        type="text"
                                        name="userName"
                                        id="userName"
                                        onChange={handleInputChange}
                                        value={values.userName}
                                        required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="password">Password *</Label>
                                        <Input
                                        type="password"
                                        name="password"
                                        id="password"
                                        onChange={handlePassword}
                                        value={values.password}
                                        required
                                        className={validPasswordClass}
                                        />
                                        <FormFeedback>
                                        Password must be atleast 6 characters
                                        </FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="email">Email *</Label>
                                        <Input
                                        type="email"
                                        name="email"
                                        id="email"
                                        onChange={handleInputChange}
                                        value={values.email}
                                        required
                                        />
                                    </FormGroup>
                                    
                                    <FormGroup>
                                        <Label for="email">Address *</Label>
                                        <Input
                                        type="texarea"
                                        name="address"
                                        id="address"
                                        onChange={handleAddress}
                                        value={otherDetails.address}
                                        required
                                        />
                                    </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                    <FormGroup>
                                        <Label for="gender">State *</Label>
                                        <Input
                                            type="select"
                                            name="stateId"
                                            id="stateId"
                                            
                                            value={values.stateId}
                                            onChange={getProvinces}
                                        >
                                            <option >Please Select State</option>
                                            {states.map((row) => (
                                                <option key={row.id} value={row.id}>
                                                    {row.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="gender">LGA *</Label>
                                            <Input
                                                type="select"
                                                name="lga"
                                                id="lga"
                                                onChange={getlgaObj}
                                            >
                                                {provinces.length > 0 ? (
                                                    provinces.map((row) => (
                                                        <option key={row.name} value={row.id}>
                                                            {row.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option key="" value="">
                                                        {" "}
                                                            No Record Found
                                                    </option>
                                                )}
                                            </Input>
                                    </FormGroup>
                                    <FormGroup>
                                    <Label for="gender">Gender </Label>
                                        <Input
                                        type="select"
                                        name="gender"
                                        id="gender"
                                        value={values.gender}
                                        onChange={handleInputChange}
                                        required
                                        >
                                        <option value=""> </option>
                                        {gender.map(({ label, value }) => (
                                            <option key={value} value={value}>
                                            {label}
                                            </option>
                                        ))}
                                        </Input>
                                     
                                    </FormGroup>
                                    
                                    <FormGroup>
                                        <Label for="confirm">Confirm Password *</Label>
                                        <Input
                                        type="password"
                                        name="confirm"
                                        id="confirm"
                                        onChange={handleConfirmPassword}
                                        value={confirm}
                                        required
                                        className={matchingPasswordClass}
                                        />
                                        <FormFeedback>Passwords do not match</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="phoneNumber">Phone Number *</Label>
                                        <Input
                                        type="number"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        onChange={handleInputChange}
                                        value={values.phoneNumber}
                                        required
                                        />
                                    </FormGroup>
                                    </Col>
                                </Row>
                                {saving ? <Spinner /> : ""}
                                <br />
                                <MatButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    disabled={saving || !(validPassword && matchingPassword)}
                                >
                                    {!saving ? (
                                    <span style={{ textTransform: "capitalize" }}>Save</span>
                                    ) : (
                                    <span style={{ textTransform: "capitalize" }}>Saving...</span>
                                    )}
                                </MatButton>

                                <MatButton
                                    variant="contained"
                                    className={classes.button}
                                    startIcon={<CancelIcon />}
                                    onClick={props.togglestatus}
                                   
                                >
                                    <span style={{ textTransform: "capitalize" }}>Cancel</span>
                                </MatButton>
                                </CardContent>
                            </Card>
                            </Col>
                        </Form>
                      
             </ModalBody>
      </Modal>
    </div>
  );
}

export default AddCaseManager;
