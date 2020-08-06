import React from "react";
import {  Form } from "react-formio";
import { connect } from "react-redux";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { Card, Alert, CardBody, Spinner } from "reactstrap";
import { formRendererService } from "_services/form-renderer";

Moment.locale("en");
momentLocalizer();

const FormRenderer = (props) => {
  const [form, setForm] = React.useState();
  const [errorMsg, setErrorMsg] = React.useState("");
  const [showErrorMsg, setShowErrorMsg] = React.useState(false);
  const [showLoadingEncounter, setShowLoadingEncounter] = React.useState(false);
  const [submission, setSubmission] = React.useState(props.submission);
  const [showLoadingForm, setShowLoadingForm] = React.useState(true);
  const onDismiss = () => setShowErrorMsg(false);
  const options = {
    readOnly: true,
  };
  //extract the formData as an obj (if form data length is one) or an array
  const extractFormData = (formData) => {
    if (!formData) {
      return null;
    }
    if (formData.length === 1) {
      return formData[0].data;
    }
    return formData.map((item) => {
      return item.data;
    });
  };

  React.useEffect(() => {
    formRendererService
      .fetchFormByFormCode(props.formCode).then((response) => {
        setForm(response.data);
        setShowLoadingForm(false);
      }) .catch((error) => {
        setErrorMsg("Error loading form, something went wrong");
      setShowErrorMsg(true);
      setShowLoadingForm(false);
      });
  }, []);

  React.useEffect(() => {
    formRendererService
      .fetchEncounterById(props.encounterId)
      .then((response) => {
        setShowLoadingEncounter(false);
        const extractedData = extractFormData(response.data.formDataObj);
        if (!extractedData) {
          setErrorMsg("Could not load encounter information");
          setShowErrorMsg(true);
        }
        setSubmission({ data: extractedData });
      })
      .catch((error) => {
        setErrorMsg("Could not load encounter information");
        setShowErrorMsg(true);
        setShowLoadingEncounter(false);
      });
  }, []);

  if(showLoadingForm){
    return (<span className="text-center">
    <Spinner style={{ width: "3rem", height: "3rem" }} type="grow" />{" "}
    Loading form...
  </span>);
  }

  if(showLoadingEncounter){
    return (<span className="text-center">
    <Spinner style={{ width: "3rem", height: "3rem" }} type="grow" />{" "}
    Loading encounter information...
  </span>);
  }

  return (
    <React.Fragment>
            <Card>
              <CardBody>
                <h4 class="text-capitalize">
                  {"View: "}
                  {props.title || form.name}
                </h4>
                <hr />
                <Alert color="danger" isOpen={showErrorMsg} toggle={onDismiss}>
                  {errorMsg}
                </Alert>
                <Form
                  form={form.resourceObject}
                  submission={submission}
                  options={options}
                  hideComponents={props.hideComponents}
                />
              </CardBody>
            </Card>
    </React.Fragment>
  );
};

const mapStateToProps = (state = { formManager: {} }) => {
  return {
    form: state.formManager.form,
    formEncounter: state.formManager.formEncounter,
    errors: state.formManager.errors,
    encounter: state.encounter.encounter,
  };
};

const mapActionToProps = {
};

export default connect(mapStateToProps, mapActionToProps)(FormRenderer);
