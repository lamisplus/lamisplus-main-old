import React from "react";
import {  Form } from "react-formio";
import { connect } from "react-redux";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { Card, Alert, CardBody, Spinner } from "reactstrap";
import { formRendererService } from "_services/form-renderer";
import { authHeader } from '_helpers/auth-header';
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
    if( (props.formCode === '4ab293ff-6837-41e8-aa85-14f25ce59ef0' || props.formCode === '87cb9bc7-ea0d-4c83-a70d-b57a5fb7769e' )){
      const d = {orders : formData.map(item => {
          return item.data;
        })};
      console.log(d);
      return d;
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
    if(!props.encounterId){
      // if encounterId does not exist then the form data object was passed as a submission, if not throw an error
      if(!props.submission){
        setErrorMsg("No encounter information passed");
        setShowErrorMsg(true);
      }
        return;
    }
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
              {form && form.name &&  form.resourceObject ?
              <>
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
               </>
                : 
               
                <>
                <Alert color="danger" isOpen={showErrorMsg} toggle={onDismiss}>
                  {errorMsg}
                </Alert>
                </>
              }
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
