import React, { useState, useEffect } from "react";
import axios from 'axios';
import Page from "components/Page";
import MatButton from "@material-ui/core/Button";
import "./Patient.css";
import { Col, Form, FormGroup, Input, Label, Row, Alert, FormFeedback, FormText } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { FaPlusSquare } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { connect } from "react-redux";
import "react-widgets/dist/css/react-widgets.css";
import { DateTimePicker } from "react-widgets";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import Title from "components/Title/CardTitle";
import { url } from "../../api";
import { update } from "../../actions/patients";
import { initialfieldState_patientRegistration } from "./InitialFieldState";
import useForm from "../Functions/UseForm";
import { Spinner } from 'reactstrap';
import EditIcon from '@material-ui/icons/Edit';
import {initialRelative} from './InitialRealative';

//Dtate Picker package
Moment.locale("en");
momentLocalizer();


const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: "100%", // Fix IE 11 issue.
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
        width: 300
    },
    button: {
        margin: theme.spacing(1)
    },
    root: {
        flexGrow: 1,
        maxWidth: 752
    },
    demo: {
        backgroundColor: theme.palette.background.default
    },
    inline: {
        display: "inline"
    }
}));




const PatientRegistration = props => {
    if(props.location.currentId){
        const intialRelativesValues = props.location.currentId.personRelativeDTOs !== null ? props.location.currentId.personRelativeDTOs : []
        const currentId = props.location.currentId!=='' ? props.location.currentId : {} 
        const classes = useStyles();
        const apicountries = url + "countries";
        const apistate = url + "countries/";
        const { values, setValues, handleInputChange, resetForm,setErrors, errors } = useForm(currentId);
        const [countries, setCountries] = useState([]);
        const [states, setStates] = useState([]);
        const [gender, setGender] = useState([]);
        const [occupation, setOccupation] = useState([]);
        const [qualification, setQualification] = useState([]);
        const [maritalStatus, setMaterialStatus] = useState([]);
        const [provinces, setProvinces] = useState([]);
        const [relatives, setRelatives] = useState(intialRelativesValues);
        const [relative, setRelative] = useState([initialRelative]);
        const [relativeButton, setRelativeButton] = useState(false) ;
        const [relationshipTypes, setRelationshipTypes] = useState([]);
        const [saving, setSaving] = useState(false);
        const [display, setDisplay] = useState(false);


    //Get countries
    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(apicountries);
                const body = response.data;
                setCountries(body.map(({ name, id }) => ({ label: name, value: id })));
                const defaultCountryId = body.find(x => x.name === "Nigeria").id;
                setValues({ ...values, countryId: defaultCountryId });
                setStateByCountryId(defaultCountryId);
            } catch (error) {}
            }
        getCharacters();
    }, []); 
    /*# Get list of RelationshipTypes parameter from the endpoint #*/
    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(url + 'application-codesets/codesetGroup?codesetGroup=RELATIONSHIP');
                    const body = response.data;
                    
                        setRelationshipTypes(body.map(({ display, id }) => ({ name: display, id: id })));            
            } catch (error) {}
          }
        getCharacters();
    }, []);             
    /* ##### End of RelationshipTypes parameter from the endpoint ##########*/
    /*# Get list of gender parameter from the endpoint #*/
    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(url + 'application-codesets/codesetGroup?codesetGroup=GENDER');
                    const body = response.data;
                        setGender(body.map(({ display, id }) => ({ label: display, value: id })));
            } catch (error) {}
          }
        getCharacters();
    }, []);
    /* ##### End of gender parameter from the endpoint ##########*/
    /*# Get list of OCUUPATION parameter from the endpoint #*/
    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(url +'application-codesets/codesetGroup?codesetGroup=OCCUPATION');
                  const body =  response.data;
                        setOccupation(body.map(({ display, id }) => ({ label: display, value: id })));
            } catch (error) {}
          }
        getCharacters();
    }, []);

    /*# Get list of EDUCATION parameter from the endpoint #*/
    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios.get(url + 'application-codesets/codesetGroup?codesetGroup=EDUCATION');
                    const body =  response.data;
                        setQualification(body.map(({ display, id }) => ({ label: display, value: id })));
            } catch (error) {}
        }
        getCharacters();
    }, []);
    /* ##### End of gender parameter from the endpoint ##########*/

    /*# Get list of MARITAL STATUS parameter from the endpoint #*/
    useEffect(() => {
      async function getCharacters() {
        try {
            const response = await axios.get(url+'application-codesets/codesetGroup?codesetGroup=MARITAL_STATUS');
                const body =  response.data;
                    setMaterialStatus(body.map(({ display, id }) => ({ label: display, value: id })));
        } catch (error) {}
      }
      getCharacters();
    }, []);
    /**
     * Estimates the dob of an individual given
     */
    const estimatedob = age => {
        const newage = (values["age"] = age);
            var d = new Date();
            var year = d.getFullYear();
            var c = new Date(year - newage, 6, 15);
            return c;
    };
    /**
     * Handles UI behaviour on Age Input change
     */
    const onAgeInputChange = e => {
        setDisplay(true);
            setValues({ ...values, dobEstimated: 1 });
                if (e.target.value === "" || e.target.value === null) {
                    setDisplay(false);
                }
            handleEstimation();
    }
  /**
   * Handles UI behaviour on check of Estimation box
   */
    const handleEstimation = () => {
        if (display) {
            const actualAge = document.getElementById("age").value;                
                const dateOfBirth = moment(estimatedob(actualAge)).format("MM/DD/YYYY");
                    document.getElementById("dob").value = dateOfBirth;
                    //convert to the date format and setDob
                        const newdobdate = moment(dateOfBirth).format("MM-DD-YYYY");
                            setValues({ ...values, dob: newdobdate });
            }
    };

    //Get States from selected country
    const getStates = e => {
        const getCountryId =e.target.value;
            setStateByCountryId(getCountryId); 
            setValues({ ...values, countryId: getCountryId });
    };

    function setStateByCountryId(getCountryId) {
        async function getCharacters() {
            const response = await axios.get(apistate + getCountryId+"/states")
            const stateList = response.data;
            setStates(stateList.map(({ name, id }) => ({ label: name, value: id })));
        }
        getCharacters();
    }

    //fetch province
    const getProvinces = e => {
        setValues({ ...values, [e.target.name]: e.target.value });
            const stateId = e.target.value;
                async function getCharacters() {
                    const response = await axios.get(`${url}state/` + stateId+"/provinces");
                        //const provinceList =  response.data;
                           const provinceList = {};
                            setProvinces(provinceList);
                }
                getCharacters();
    };

    const  getRelationshipName = (id) => {
        if(id){
            const newId = parseInt(id) 
            const objectArray = Object.values(relationshipTypes);
            const objRelatives = objectArray.find(x => x.id === newId)
                if (objRelatives === undefined || objRelatives === null) { 
                    return null;
                }else{
                    return objRelatives.name
                }
        }    
    }
    /* Add Relative function **/
    const addRelative = value => {
        const allRelatives = [...relatives, value];
            setRelatives(allRelatives);
                setRelativeButton(false)
    };

    /* Remove Relative function **/
    const removeRelative = index => {
        relatives.splice(index, 1);
            setRelative({...relative});
                setRelativeButton(false)       
    };

    /* Edit Relative function **/
    const editRelative = index => {
        const allRelatives = [...relatives];
            setRelative(allRelatives[index])
                relatives.splice(index, 1); 
                    setRelativeButton(true) 
    };

  const handleAddRelative = e => {
      e.preventDefault();
      //if (!relative) return;
          if((Object.entries(relative).length >0  && relative.constructor === Object)){
              addRelative(relative);
              setRelative(initialRelative); 
          }else{
              toast.error("Relative fields cannot be empty");
          }
  };

  const onRelativeChange = e => {
      setRelative({ ...relative, [e.target.name]: e.target.value });
  };
/****
 *  Validation 
 */
const validate = () => {
    console.log(values)
    let temp = { ...errors }
    temp.firstName = values.firstName ? "" : "First Name is required"
    temp.hospitalNumber = values.hospitalNumber ? "" : "Patient Id is required."
    temp.mobilePhoneNumber = values.mobilePhoneNumber ? "" : "Mobile numner is required."
    temp.lastName = values.lastName ? "" : "Last Name  is required."
    temp.genderId = values.genderId ? "" : "Gender is required." 
        setErrors({
            ...temp
        })
            return Object.values(temp).every(x => x == "")
}

    /***
    * Submit Button Processing 
    */
    const handleSubmit = e => {
        e.preventDefault();
          
            if(validate()){
                console.log(relatives)
                console.log(relative)
                const newRegistrationDate = moment(values.dateRegistration).format("DD-MM-YYYY");
                const newDateOfBirth = moment(values.dob).format("DD-MM-YYYY");
                //values["dateRegistration"] = newRegistrationDate;
                values["personRelativeDTOs"] = relatives;
                //values["dob"] = newDateOfBirth;
                
                setSaving(true);
                    const onSuccess = () => {
                        setSaving(false);
                        resetForm() 
                        removeRelative()
                        setTimeout(() => {
                            props.history.push(`/patients`)
                        }, 1000) 
                        
                    }
                    const onError = () => {
                        setSaving(false);        
                    }
                        props.update(values, currentId.patientId,onSuccess, onError);
                    //toast.success("Registration Successful")
            }else{
                toast.error("Please fill all compulsory fields");
            }
    };


  return (
    <Page title="Patient Update">
        <ToastContainer autoClose={3000} hideProgressBar />
            {errors ?
                (<Alert color="primary">
                  All Information with Asterisks(*) are compulsory
                </Alert>)
            :
                (<Alert color="danger">
                  All Fields are requires
                </Alert>)
            }
                <Form onSubmit={handleSubmit}>
                    {/* First  row form entry */}
                    <Row>
                        <Col xl={12} lg={12} md={12}>
                            <Card className={classes.cardBottom}>
                                <CardContent>
                                    <Title>
                                        Basic Information <br />
                                    </Title>
                                        <br />
                                        <Row form>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="hospitalNumber">Patient Id *</Label>
                                                        <Input
                                                            type="text"
                                                            name="hospitalNumber"
                                                            id="hospitalNumber"
                                                            
                                                            value={values.hospitalNumber}
                                                            onChange={handleInputChange}
                                                            {...(errors.hospitalNumber && { invalid: true})}
                                                        />
                                                            <FormFeedback>{errors.hospitalNumber}</FormFeedback>
                                                  </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="middleName">Date Of Registration * </Label>
                                                        <DateTimePicker
                                                            time={false}
                                                            name="dateRegistration"
                                                            id="dateRegistration"
                                                            value={values.regDate}
                                                            onChange={value1 =>
                                                                setValues({ ...values, dateRegistration: moment(value1).format("DD-MM-YYYY") })
                                                            }
                                                            defaultValue={new Date(new Date(moment(values.dateRegistration, "DD-MM-YYYY").format("MM/DD/YYYY") ))}
                                                            max={new Date()}
                                                        />
                                                  </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="firstName">First Name *</Label>
                                                        <Input
                                                            type="text"
                                                            name="firstName"
                                                            id="firstName"
                                                            
                                                            value={values.firstName}
                                                            onChange={handleInputChange}
                                                            {...(errors.firstName && { invalid: true})}
                                                        />
                                                            <FormFeedback>{errors.firstName}</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="middleName">Other Name(s)</Label>
                                                        <Input
                                                            type="text"
                                                            name="otherNames"
                                                            id="otherNames"
                                                            onChange={handleInputChange}
                                                            value={values.otherNames}
                                                        />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="lastName">Last Name * </Label>
                                                        <Input
                                                            type="text"
                                                            name="lastName"
                                                            id="lastName"
                                                            onChange={handleInputChange}
                                                            value={values.lastName}
                                                            {...(errors.lastName && { invalid: true})}
                                                        />
                                                            <FormFeedback>{errors.lastName}</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="maritalStatus">Gender *</Label>
                                                        <Input
                                                            type="select"
                                                            name="genderId"
                                                            id="genderId"
                                                            value={values.genderId}
                                                            onChange={handleInputChange}
                                                            {...(errors.genderId && { invalid: true})}
                                                        >
                                                          <option  value=""> </option>
                                                              {gender.map(({ label, value }) => (
                                                                  <option key={value} value={value}>{label}</option>
                                                              ))}
                                                        </Input>
                                                            <FormFeedback>{errors.genderId}</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="occupation">Occupation *</Label>
                                                        <Input
                                                            type="select"
                                                            name="occupationId"
                                                            id="occupationId"
                                                            value={values.occupationId}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option  value=""> </option>
                                                            {occupation.map(({ label, value }) => (
                                                                <option key={value} value={value}>
                                                                    {label}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="qualification">Hightest Qualification *</Label>
                                                        <Input
                                                            type="select"
                                                            name="educationId"
                                                            value={values.educationId}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option  value=""> </option>
                                                            {qualification.map(({ label, value }) => (
                                                                <option key={value} value={value}>
                                                                  {label}
                                                                </option>
                                                              ))}
                                                        </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="maritalStatus">Marital Status *</Label>
                                                        <Input
                                                            type="select"
                                                            name="maritalStatusId"
                                                            id="maritalStatusId"
                                                            value={values.maritalStatusId}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option  value=""> </option>
                                                            {maritalStatus.map(({ label, value }) => (
                                                                <option key={value} value={value}>
                                                                  {label}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                {!display ? (
                                                    <FormGroup>
                                                        <Label>Date OF Birth *</Label>
                                                            <DateTimePicker
                                                                time={false}
                                                                name="dob"
                                                                dropUp
                                                                value={values.regDate}
                                                                onChange={value1 =>
                                                                    setValues({ ...values, dob: moment(value1).format("DD-MM-YYYY")  })
                                                                }
                                                                defaultValue={new Date(moment(values.dob, "DD-MM-YYYY").format("MM/DD/YYYY") )}
                                                                max={new Date()}
                                                                {...(errors.dob && { invalid: true})}
                                                            />
                                                                <FormFeedback>{errors.dob}</FormFeedback>
                                                    </FormGroup>
                                                ) : (
                                                    <FormGroup>
                                                        <Label>Date OF Birth</Label>
                                                            <Input 
                                                                type="text" 
                                                                id="dob" 
                                                                disabled 
                                                                value={values.dob}
                                                                onChange={value1 =>
                                                                  setValues({ ...values, dob: value1 })
                                                                }
                                                            />
                                                                <FormText ><span style={{color:"blue", fontWeight:"bolder"}}>Estimated Date of Birth </span></FormText>
                                                    </FormGroup>

                                                )}
                                            </Col>
                                            <Col md={4}>
                                                {/* Estimate Date of birth in a row  */}
                                                <Row form>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <Label for="year">Age</Label>
                                                                <Input
                                                                    id="age"
                                                                    type="text"
                                                                    name="age"
                                                                    
                                                                    onChange={onAgeInputChange}
                                                                />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={4}></Col>
                                        </Row>
                                </CardContent>
                            </Card>
                        </Col>
                    </Row>
                    {/* Second row form entry  for contact details*/}
                    <Row>
                        <Col xl={12} lg={12} md={12}>
                            <Card className={classes.cardBottom}>
                                <CardContent>
                                    <Title>
                                      Contact Details <br />
                                    </Title>
                                        <Row>
                                            <Col xl={12} lg={12} md={12}>
                                                <Card className={classes.cardBottom}>
                                                    <CardContent>
                                                        <Title>
                                                            {" "}Address 
                                                            <br />
                                                        </Title>
                                                            <Row form>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <Label for="phoneNumber">Phone Number *</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="mobilePhoneNumber"
                                                                                id="mobilePhoneNumber"
                                                                              
                                                                                value={values.mobilePhoneNumber}
                                                                                onChange={handleInputChange}
                                                                                {...(errors.mobilePhoneNumber && { invalid: true})}
                                                                                
                                                                            />
                                                                                <FormFeedback>{errors.mobilePhoneNumber}</FormFeedback>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <Label for="altPhoneNumber">Alt. Phone Number</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="alternatePhoneNumber"
                                                                                id="alternatePhoneNumber"
                                                                              
                                                                                value={values.alternatePhoneNumber}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <Label for="emailAddress">Email Address</Label>
                                                                            <Input
                                                                                type="email"
                                                                                name="email"
                                                                                id="email"
                                                                              
                                                                                value={values.email}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row form>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <Label for="country">Country *</Label>
                                                                            <Input
                                                                                type="select"
                                                                                name="countryId"
                                                                                id="countryId"
                                                                                value={values.countryId}
                                                                                onChange={getStates}
                                                                            >
                                                                                {countries.map(({ label, value }) => (
                                                                                    <option key={value} value={value}>
                                                                                        {label}
                                                                                    </option>
                                                                                ))}
                                                                            </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <Label for="stressAddress">State *</Label>
                                                                            <Input
                                                                                type="select"
                                                                                name="stateId"
                                                                                id="stateId"
                                                                                
                                                                                value={values.stateId}
                                                                                onChange={getProvinces}
                                                                            >
                                                                                {states.map(({ label, value }) => (
                                                                                    <option key={value} value={value}>
                                                                                      {label}
                                                                                    </option>
                                                                                ))}
                                                                            </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <Label for="lga">Province/District/LGA *</Label>
                                                                            <Input
                                                                                type="select"
                                                                                name="provinceId"
                                                                                id="provinceId"
                                                                                value={values.provinceId}
                                                                            >
                                                                                {provinces.length > 0 ? (
                                                                                    provinces.map(({ id, name }) => (
                                                                                        <option key={name} value={id}>
                                                                                          {name}
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
                                                                </Col>
                                                            </Row>

                                                            <Row form>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <Label for="city">Street Address</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="city"
                                                                                id="city"
                                                                              
                                                                                value={values.city}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <Label for="landMark">Land Mark</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="landmark"
                                                                                id="landmark"
                                                                              
                                                                                value={values.landmark}
                                                                                onChange={handleInputChange}
                                                                            />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <Label for="landMark">National ID/Security No.</Label>
                                                                            <Input
                                                                                type="text"
                                                                                name="landmark"
                                                                                id="landmark"
                                                                            
                                                                            />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                      </CardContent>
                                                  </Card>
                                              </Col>
                                          </Row>
                                      </CardContent>
                                  </Card>
                              </Col>
                        </Row>
                        {/* Third  row form entry  for Contact Address*/}

                        {/* fourth  row form entry  for Relatives*/}
                        <Row>
                            <Col xl={12} lg={12} md={12}>
                                <Card className={classes.cardBottom}>
                                    <CardContent>
                                        <Title>
                                            Relatives / Next of Kin
                                              <MatButton
                                                variant="contained"
                                                color="primary"
                                                className=" float-right mr-1"
                                                startIcon={<FaPlusSquare />}
                                                onClick={handleAddRelative}
                                                autoCapitalize = 'none'
                                              >
                                                  {!relativeButton ? 
                                                      (
                                                          <>
                                                              <span style={{textTransform: 'capitalize'}}>Add </span>
                                                              &nbsp;&nbsp;
                                                              <span style={{textTransform: 'lowercase'}}>Relative </span>
                                                          </>
                                                      )
                                                      :
                                                          <>
                                                              <span style={{textTransform: 'capitalize'}}>Update </span>
                                                              &nbsp;&nbsp;
                                                              <span style={{textTransform: 'lowercase'}}>Relative </span>
                                                          </>
                                                  }

                                              </MatButton>
                                          </Title>
                                          <br />
                                        <Row form>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="occupation">Relationship Type</Label>
                                                      <Input
                                                        type="select"
                                                        name="relationshipTypeId"
                                                        id="relationshipTypeId"
                                                        value={relative.relationshipTypeId}
                                                        onChange={onRelativeChange}
                                                      >
                                                          <option  value=""> </option>
                                                          <option value="">
                                                            Select Relative Relationship Type 
                                                          </option>
                                                          {relationshipTypes.map(({ name, id }) => (
                                                            <option key={id} value={id}>
                                                              {name}
                                                            </option>
                                                          ))}
                                                      </Input>
                                                  </FormGroup>
                                              </Col>
                                              <Col md={3}>
                                                  <FormGroup>
                                                      <Label for="firstName">First Name</Label>
                                                      <Input
                                                        type="text"
                                                        name="firstName"
                                                        id="firstName"
                                                        value={relative.firstName}                       
                                                        onChange={onRelativeChange}
                                                        />    
                                                  </FormGroup>
                                              </Col>
                                              <Col md={3}>
                                                  <FormGroup>
                                                      <Label for="middleName">Middle Name</Label>
                                                      <Input
                                                          type="text"
                                                          name="otherNames"
                                                          id="otherNames"
                                                        
                                                          value={relative.otherNames}
                                                          onChange={onRelativeChange}
                                                      />
                                                  </FormGroup>
                                              </Col>
                                              <Col md={3}>
                                                  <FormGroup>
                                                      <Label for="lastName">Last Name </Label>
                                                      <Input
                                                          type="text"
                                                          name="lastName"
                                                          id="lastName"
                                                        
                                                          value={relative.lastName}
                                                          onChange={onRelativeChange}
                                                      
                                                        />
                                                      
                                                  </FormGroup>
                                              </Col>
                                        </Row>

                                        <Row form>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="relativePhoneNumber">Phone No.</Label>
                                                    <Input
                                                        type="text"
                                                        name="relativePhoneNumber"
                                                        id="relativePhoneNumber"
                                                        value={relative.mobilePhoneNumber}
                                                        onChange={e =>
                                                            setRelative({
                                                              ...relative,
                                                              mobilePhoneNumber: e.target.value
                                                            })
                                                        }
                                                    />
                                                
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label for="email">Email Address</Label>
                                                    <Input
                                                        type="text"
                                                        name="email"
                                                        id="email"
                                                        
                                                        value={relative.email}
                                                        onChange={onRelativeChange}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="address">Address</Label>
                                                    <Input
                                                        type="text"
                                                        name="address"
                                                        id="address"
                                                      
                                                        onChange={onRelativeChange}
                                                        value={relative.address}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                  <div className={classes.demo}>
                                                      <List>
                                                        
                                                          {relatives.map((relative, index) => (
                                                              <RelativeList
                                                                  key={index}
                                                                  index={index}
                                                                  relative={relative}
                                                                  removeRelative={removeRelative}
                                                                  editRelative={editRelative}
                                                                  relationshipTypeName={getRelationshipName(
                                                                  relative.relationshipTypeId
                                                                  )}
                                                              />
                                                          ))}
                                                      </List>
                                                  </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}></Col>
                                        </Row>
                                            {saving ? <Spinner /> : ""}
                                                <br/>
                                                <MatButton
                                                  type="submit"
                                                  variant="contained"
                                                  color="primary"
                                                  className={classes.button}
                                                  startIcon={<SaveIcon />}
                                                  disabled={saving}
                                                >
                                                    {!saving ?
                                                    <span style={{textTransform: 'capitalize'}}>Update</span>
                                                    : <span style={{textTransform: 'capitalize'}}>Saving...</span>}
                                                </MatButton>
                                      
                                                <MatButton
                                                  variant="contained"
                                                  className={classes.button}
                                                  startIcon={<CancelIcon />}
                                                  onClick={resetForm}
                                                >
                                                    <span style={{textTransform: 'capitalize'}}>Cancel</span>
                                                </MatButton>
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </Page>
      );
    }else{
      return ( 
          <Page >
              <h2>Please Slelect a patient</h2>
                {setTimeout(() => {
                        props.history.push(`/patients`)
                }, 1000) }
          </Page>
       
    );
    }
};


function RelativeList({
  relative,
  index,
  removeRelative,
  relationshipTypeName,
  editRelative
}) {
  return (
      <ListItem>
          <ListItemText
              primary={
                  <React.Fragment>
                    {console.log(relationshipTypeName)}
                    {relationshipTypeName}, {relative.firstName} {relative.otherNames}{" "}
                    {relative.lastName}
                  </React.Fragment>
              }
              secondary={
                  <React.Fragment>
                      <Typography component="span" variant="body2" color="textPrimary">
                        {relative.mobilePhoneNumber} {relative.email} <br></br>
                      </Typography>
                          {relative.address}
                  </React.Fragment>
              }
      />

      <ListItemSecondaryAction >
          <IconButton edge="end" aria-label="delete" onClick={() => removeRelative(index)}>
              <DeleteIcon />
          </IconButton>
          <IconButton edge="end" aria-label="edit" onClick={() => editRelative(index)}>
              <EditIcon />
          </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const mapStateToProps = state => ({
    patientDetail: state.patients.list
  
});


export default connect(mapStateToProps, { update })(PatientRegistration);
