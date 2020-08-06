import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  CardBody,
  CardHeader,
  Col,
  Row,
  Card,
  FormGroup,
  Label,
  Input,
  Form,
  Alert,
} from "reactstrap";
import MatButton from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import Button from '@material-ui/core/Button';
import SaveIcon from "@material-ui/icons/Save";
import "react-widgets/dist/css/react-widgets.css";
import { DateTimePicker } from "react-widgets";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";
import * as encounterAction from "actions/encounter";
import * as actions from "actions/medication";
import * as patientActions from "actions/patients";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";
import { v1 as uuidv1 } from "uuid";
import * as CODES from "api/codes";
import PreviousMedication from "./PreviousMedication";
import CheckedInValidation from "components/Utils/CheckedInValidation";

//Dtate Picker package
Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles((theme) => ({
  root2: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    margin: theme.spacing(7),
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 12,
    },
    pos: {
      fontSize: 11,
    },
    cardContent: {
      padding: 2,
    },
    cardroot: {
      margin: theme.spacing(1),
      height: 250 + "px !important",
    },
  },
  alertmsge: {
    marginTop: theme.spacing(2),
  },
  rootaccordia: {
    width: "100%",
  },
  accordiaheading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  allergiesroot: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },

  checkboxroot: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },

  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },

  formroot: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  inforoot: {
    width: "95%",
    margin: 20,
    backgroundColor: "#eee",
  },
}));
const cardStyle = {
  borbderColor: "#fff",
  marginBottom: 10,
};

function MedicationPage(props) {
  const [drugOrder, setDrugOrder] = React.useState([]);
  const [successMsg, setSuccessMsg] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState();
  const [fetchingDrugs, setFetchingDrugs] = React.useState(false);
  const classes = useStyles();
  const PatientID = props.patientId;
  const visitId = props.visitId;
  const [medis, setmedis] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  const saveDrugOrders = (e) => {
    e.preventDefault();
    if (showLoading) {
      return;
    }

    setSuccessMsg("");

    const defaults = {
      patient_id: PatientID,
      //drug_presription_id: uuidv1(),
      prescription_status: 0,
      quantity_dispensed: 0,
      user_id: 0,
    };
    const prescriptions = medis.map((x) => {
      return {
        ...{
          duration: x.duration,
          drug_id: x.drug_order,
          generic_name: getDrugName(x.drug_order),
          duration_unit: x.duration_unit,
          date_prescribed: x.drug_order_date,
          time_prescribed: x.drug_order_time,
          start_date: moment(x.start_date).format("DD-MM-YYYY"),
          dosage: x.dose,
          dosage_frequency: x.dose_frequency,
          comment: x.comment,
          brand_name_dispensed: x.brand_name_dispensed,
        },
        ...defaults,
      };
    });

    const data = {
      data: prescriptions,
      patientId: PatientID,
      visitId: visitId,
      formCode: CODES.DRUG_PRESCRIPTION_FORM,
      programCode: CODES.GENERAL_SERVICE,
      dateEncounter: moment(new Date()).format("DD-MM-YYYY"),
    };
    setShowLoading(true);
    const onSuccess = () => {
      setShowLoading(false);
      toast.success("Drug Order Successfully Saved!");
      setmedis([]);
      try {
        props.fetchPatientMedicationOrder(
          props.patientId,
          () => {},
          () => {}
        );
      } catch (err) {}
    };
    const onError = (errstatus) => {
      setShowLoading(false);
      toast.error("Something went wrong, please contact administration");
    };
    props.createMedication(data, onSuccess, onError);
  };

  const addDrugs = (value) => {
    const allmedis = [...medis, value];
    setmedis(allmedis);
  };

  const removeDrug = (index) => {
    const allMedis = [...medis];
    allMedis.splice(index, 1);
    setmedis(allMedis);
  };

  React.useEffect(() => {
    if (props.drugList.length === 0) {
      setErrorMsg();
      setFetchingDrugs(true);
      const onSuccess = () => {
        setFetchingDrugs(false);
      };
      const onError = (errstatus) => {
        setErrorMsg("Could not fetch drugs at the moment, try again later");
        setFetchingDrugs(false);
      };
      props.fetchDrugs(onSuccess, onError);
    }
  }, [props.medication]);

  React.useEffect(() => {
    setDrugOrder(
      props.drugList.map(({ genericName, id, strength }) => ({
        label: genericName + " (" + strength + ")",
        value: id,
      }))
    );
  }, [props.drugList]);

  function getDrugName(id) {
    return drugOrder.find((x) => x.value === id).label;
  }
  return (
    <Row>
      <ToastContainer />
      <Col lg={5}>
        <Card>
          <CardHeader>Drug Order</CardHeader>
          <CardBody>
            {successMsg ? <Alert color="success">{successMsg}</Alert> : ""}
            {errorMsg ? <Alert color="info">{errorMsg}</Alert> : ""}
            <NewDrugOrderForm
              addDrugs={addDrugs}
              drugOrder={drugOrder}
              fetchingDrugs={fetchingDrugs}
              visitId={props.patient.visitId}
            />
          </CardBody>
        </Card>
      </Col>

      <Col lg={7}>
        {medis.length > 0 ? (
          <Row>
            <Col lg={12}>
              <Card style={cardStyle}>
                <CardHeader>Current Drug Order</CardHeader>
                <CardBody>
                  <Col md={12}>
                    <div className={classes.demo}>
                      <List>
                        {medis.map((medi, index) => (
                          <CurrentDrugOrders
                            key={index}
                            index={index}
                            medi={medi}
                            removeDrug={removeDrug}
                            drugTypeName={getDrugName(medi.drug_order)}
                          />
                        ))}
                      </List>
                    </div>
                  </Col>
                </CardBody>
              </Card>
            </Col>
            <Col lg={12}>
              <CheckedInValidation
                actionButton={
                  <MatButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    onClick={saveDrugOrders}
                  >
                    Save &nbsp;
                    {showLoading ? (
                      <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    ) : (
                      ""
                    )}
                  </MatButton>
                }
                visitId={props.patient.visitId}
              />
              <br></br>
              <br></br>
            </Col>
            <hr></hr>
          </Row>
        ) : (
          ""
        )}

        <Row>
          <Col lg={12}>
            <Card style={cardStyle}>
              <CardHeader>Previous Drug Order</CardHeader>
              <PreviousMedication patientId={props.patient.patientId} />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function NewDrugOrderForm({ addDrugs, drugOrder, fetchingDrugs, visitId }) {
  const classes = useStyles();
  const [medi, setmedi] = useState({
    start_date: new Date(),
    drug_order_date: moment(new Date()).format("DD-MM-YYYY"),
    drug_order_time: moment(new Date()).format("LT"),
  });
  const [errorMsg, setErrorMsg] = useState("");
  const onChange = (e) => {
    e.persist();
    setmedi({ ...medi, [e.target.name]: e.target.value });
  };

  const handleAddDrugs = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!medi) return;
    //
    if (
      !(
        medi.start_date &&
        medi.duration_unit &&
        medi.duration &&
        medi.dose &&
        medi.dose_frequency &&
        medi.drug_order &&
        medi.drug_order_date &&
        medi.drug_order_time
      )
    ) {
      window.scrollTo(0, 0);
      setErrorMsg("Fill all required fields");
      return;
    }
    addDrugs(medi);
    setmedi({
      start_date: new Date(),
      duration_unit: "",
      comment: "",
      duration: "",
      dose: "",
      drug_order: "",
      generic_name: "",
      dose_frequency: "",
      brand_name_dispensed: "",
      drug_order_date: moment(new Date()).format("DD-MM-YYYY"),
      drug_order_time: moment(new Date()).format("LT"),
    });
  };

  const handleChange = (newValue, actionMeta) => {
    setmedi({ ...medi, drug_order: newValue.value });
  };
  const handleBrandNameChange = (newValue, actionMeta) => {
    setmedi({ ...medi, brand_name_dispensed: newValue.value });
  };

  return (
    <Form className={classes.formroot} onSubmit={handleAddDrugs}>
      {errorMsg ? <Alert color="danger">{errorMsg}</Alert> : ""}
      <Col md={12}>
        <FormGroup>
          <Label for="encounterDate">Encounter Date & Time*</Label>
          <DateTimePicker
            name="encounterDate"
            id="encounterDate"
            defaultValue={new Date()}
            max={new Date()}
            onChange={(e) =>
              setmedi({
                ...medi,
                ...{
                  drug_order_date: e ? Moment(e).format("DD-MM-YYYY") : null,
                  drug_order_time: e ? Moment(e).format("LT") : null,
                },
              })
            }
          />
        </FormGroup>
      </Col>
      <Col md={12}>
        <FormGroup>
          <Label for="hospitalNumber">Drug Generic Name* </Label>
          <Select
            required
            isMulti={false}
            onChange={handleChange}
            options={drugOrder}
            isLoading={fetchingDrugs}
          />
        </FormGroup>
      </Col>
      <Col md={12}>
        <FormGroup>
          <Label for="brandName">
            Drug Brand Name <small>(Optional)</small>
          </Label>
          <Input
            type="text"
            name="brand_name_dispensed"
            id="brand_name_dispensed"
            placeholder="Brand Name To Dispense"
            value={medi.brand_name_dispensed}
            onChange={onChange}
          />
        </FormGroup>
      </Col>
      <Col md={12}>
        <FormGroup>
          <Label for="dose">
            Dose* <small>(Amount of medication taken at one time)</small>
          </Label>
          <Input
            type="number"
            name="dose"
            id="dose"
            placeholder="Dose"
            required
            min="0"
            step="1"
            oninput="validity.valid||(value='');"
            value={medi.dose}
            onChange={onChange}
          />
        </FormGroup>
      </Col>
      <Col md={12}>
        <FormGroup>
          <Label for="dose_frequency">
            Dose Frequency* <small>(Frequency of dose per day)</small>
          </Label>
          <Input
            type="number"
            name="dose_frequency"
            id="dose_fequency"
            placeholder="Dose Frequency"
            required
            min="0"
            step="1"
            oninput="validity.valid||(value='');"
            value={medi.dose_frequency}
            onChange={onChange}
          />
        </FormGroup>
      </Col>
      <Col md={12}>
        <Label for="start_date">Start Date*</Label>

        <DateTimePicker
          time={false}
          name="start_date"
          id="start_date"
          value={medi.start_date}
          onChange={(value1) => setmedi({ ...medi, start_date: value1 })}
          defaultValue={new Date()}
          format="D/M/Y"
          required
        />
      </Col>
      <Col md={12}>
        <FormGroup>
          <Label for="duration">Duration*</Label>
          <Input
            type="number"
            name="duration"
            id="duration"
            placeholder="Duration"
            required
            min="0"
            step="1"
            oninput="validity.valid||(value='');"
            value={medi.duration}
            onChange={onChange}
            required
          />
        </FormGroup>
      </Col>
      <Col md={12}>
        <FormGroup>
          <Label for="duration_unit">Duration Unit*</Label>
          <Input
            type="select"
            name="duration_unit"
            id="duration_unit"
            value={medi.duration_unit}
            required
            onChange={onChange}
          >
            <option value="">Select a duration unit</option>
            <option value="Days">Days</option>
            <option value="Weeks">Weeks</option>
            <option value="Months">Months</option>
          </Input>
        </FormGroup>
      </Col>
      <Col md={12}>
        <FormGroup>
          <Label for="comment">Enter Instruction</Label>
          <Input
            type="text"
            name="comment"
            id="comment"
            placeholder="Enter Instruction"
            value={medi.comment}
            onChange={onChange}
          />
        </FormGroup>
      </Col>
      <br />
      <CheckedInValidation
        actionButton={
          <MatButton
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<SaveIcon />}
          >
            Add
          </MatButton>
        }
        visitId={visitId}
      />
    </Form>
  );
}

function CurrentDrugOrders({ medi, index, removeDrug, drugTypeName }) {
  return (
    <ListItem>
      <ListItemText
        primary={
          <React.Fragment>
            <b>{drugTypeName} - {medi.brand_name_dispensed}, {medi.dose}</b> unit(s) to
            be taken <b>{medi.dose_frequency}</b> time(s) a day
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body2" color="textPrimary">
              Start at <b>{medi.start_date.toLocaleDateString()}</b> for{" "}
              <b>{medi.duration} {medi.duration_unit} </b><br></br>
              Instruction: {medi.comment}
              <br></br> Date Ordered:{" "}
              <b>
                {moment(medi.drug_order_date, "DD-MM-YYYY").format(
                  "MMM DD, YYYY"
                )}{" "}
                {medi.drug_order_time}
              </b>
            </Typography>
          </React.Fragment>
        }
      />

      <ListItemSecondaryAction onClick={() => removeDrug(index)}>
        <IconButton edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
    drugList: state.medication.medicationList,
    previousMedicationList: state.patients.previousMedications,
  };
};

const mapActionToProps = {
  fetchDrugs: actions.fetchAll,
  createMedication: encounterAction.create,
  fetchPatientMedicationOrder: patientActions.fetchPatientLatestMedicationOrder,
};

export default connect(mapStateToProps, mapActionToProps)(MedicationPage);
