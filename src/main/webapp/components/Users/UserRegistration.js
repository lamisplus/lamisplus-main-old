import Page from "components/Page";
import React, { useState, useEffect } from "react";
import MatButton from "@material-ui/core/Button";
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Alert,
  FormFeedback,
} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { connect } from "react-redux";
// React Notification
import Title from "components/Title/CardTitle";
import { register } from "../../actions/user";
import { initialfieldState_userRegistration } from "../../_helpers/initialFieldState_UserRegistration";
import useForm from "../Functions/UseForm";
import { Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { FaArrowLeft } from "react-icons/fa";
import { DateTimePicker } from "react-widgets";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";

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
    width: 300,
  },
  button: {
    margin: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.default,
  },
  inline: {
    display: "inline",
  },
}));

const UserRegistration = (props) => {
  const classes = useStyles();
  const { values, setValues, handleInputChange, resetForm } = useForm(
    initialfieldState_userRegistration
  );
  const [gender, setGender] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [confirm, setConfirm] = useState("");
  const [matchingPassword, setMatchingPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [matchingPasswordClass, setMatchingPasswordClass] = useState("");
  const [validPasswordClass, setValidPasswordClass] = useState("");
  const [saving, setSaving] = useState(false);

  /* Get list of gender parameter from the endpoint */
  useEffect(() => {
    async function getCharacters() {
      try {
        const response = await fetch(
          "http://lamisplus.org/base-module/api/application-codesets/codesetGroup?codesetGroup=GENDER"
        );
        const body = await response.json();
        setGender(
          body.map(({ display, id }) => ({ label: display, value: id }))
        );
      } catch (error) {
        console.log(error);
      }
    }
    getCharacters();
  }, []);

  /* TODO Brian: Change from occupation endpoint to designation endpoint. Not yet implemented in the back end */
  /* Get list of Designation parameter from the endpoint */
  useEffect(() => {
    async function getCharacters() {
      try {
        const response = await fetch(
          "http://lamisplus.org/base-module/api/application-codesets/codesetGroup?codesetGroup=OCCUPATION"
        );
        const body = await response.json();
        setDesignation(
          body.map(({ display, id }) => ({ label: display, value: id }))
        );
      } catch (error) {
        console.log(error);
      }
    }
    getCharacters();
  }, []);

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
    const dateOfBirth = moment(values.dateOfBirth).format("DD-MM-YYYY");
    values["dob"] = dateOfBirth;
    setSaving(true);
    const onSuccess = () => {
      setSaving(false);
      toast.success("Registration Successful");
      resetForm();
    };
    const onError = () => {
      setSaving(false);
    };
    props.register(values, onSuccess, onError);
  };

  return (
    <Page title="User Registration">
      <Title>
        <Link to="/users">
          <Button
            variant="contained"
            color="primary"
            className=" float-right mr-1"
            startIcon={<FaArrowLeft />}
          >
            <span style={{ textTransform: "capitalize" }}>Back </span>
          </Button>
        </Link>
        <br />
      </Title>
      <br />
      <ToastContainer autoClose={3000} hideProgressBar />
      <Alert color="primary">
        All Information with Asterisks(*) are compulsory
      </Alert>

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
                    <Label for="username">Username *</Label>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      onChange={handleInputChange}
                      value={values.username}
                      required
                    />
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
                    <Label for="phone">Phone Number *</Label>
                    <Input
                      type="text"
                      name="phone"
                      id="phone"
                      onChange={handleInputChange}
                      value={values.phone}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="designationId">Designation *</Label>
                    <Input
                      type="select"
                      name="designationId"
                      id="designationId"
                      value={values.designationId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value=""> </option>
                      {designation.map(({ label, value }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="genderId">Gender *</Label>
                    <Input
                      type="select"
                      name="genderId"
                      id="genderId"
                      value={values.genderId}
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
                    <Label>Date of Birth *</Label>
                    <DateTimePicker
                      time={false}
                      name="dob"
                      value={values.dob}
                      onChange={(value1) =>
                        setValues({ ...values, dob: value1 })
                      }
                      defaultValue={new Date()}
                      max={new Date()}
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
                onClick={resetForm}
              >
                <span style={{ textTransform: "capitalize" }}>Cancel</span>
              </MatButton>
            </CardContent>
          </Card>
        </Col>
      </Form>
    </Page>
  );
};

const mapStateToProps = (state) => ({
  status: state.users.status,
});

export default connect(mapStateToProps, { register })(UserRegistration);
