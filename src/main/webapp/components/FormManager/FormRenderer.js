import React from "react";
import Page from "components/Page";
import { SubmissionGrid, Form } from "react-formio";
import * as actions from "actions/formManager";
import { connect } from "react-redux";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { toast } from "react-toastify";
import { Card, Alert, CardBody, Spinner } from "reactstrap";
import { fetchLastEncounter } from '_services/form-renderer';
import { url } from "api";
import axios from "axios";
import { formRendererService } from "_services/form-renderer";

Moment.locale("en");
momentLocalizer();

const FormRenderer = (props) => {
  const [form, setForm] = React.useState({});
  const [errorMsg, setErrorMsg] = React.useState("");
  const [showErrorMsg, setShowErrorMsg] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const [showLoadingForm, setShowLoadingForm] = React.useState(true);
  const [showLoadingEncounter, setShowLoadingEncounter] = React.useState(false)
  const [formId, setFormId] = React.useState()
  const [submission, setSubmission] = React.useState({...props.submission, ...{ data: { patient: props.patient }}});
  const onDismiss = () => setShowErrorMsg(false);
  const options = {
    noAlerts: true,
  };

 //fetch form by form code
 React.useEffect(() => {
  formRendererService
    .fetchFormByFormCode(props.formCode).then((response) => {
      setShowLoadingForm(false);
      if (!response.data.resourceObject) {
        setErrorMsg("Form resource not found, please contact adminstration.");
        setShowErrorMsg(true);
        return;
      }
      //for forms with usage code 0, check if an encounter exists for this patient
      if(response.data && response.data.usageCode == 0){
        console.log("fetching encounter")
          fetchEncounter();
      }
      setForm(response.data);
    }) .catch((error) => {
      setErrorMsg("Error loading form, something went wrong");
    setShowErrorMsg(true);
    setShowLoadingForm(false);
    });
}, []);


  //Add patient info to the submission object. This make patient data accessible within the form
  async function fetchEncounter(){
    setShowLoadingEncounter(true);
    await axios.get(`${url}patients/${props.patientId}/encounters/${props.formCode}`, {})
    .then(response => {
      //get encounter form data and store it in submission object
     
        if( response.data.length > 0 ){
          const lastEncounter = response.data[0]
          setFormId(lastEncounter.formDataId);
          const e = {
            ...submission, ...{...submission.data, ...{data: lastEncounter}}
             };
          setSubmission(e);
    };
    setShowLoadingEncounter(false);
  }) .catch((error) => {
    setErrorMsg("Error loading encounter, something went wrong");
  setShowErrorMsg(true);
  setShowLoadingEncounter(false);
  });
  
  ;
      
  }

  // Submit form to server
  const submitForm = (submission) => {
    const onSuccess = () => {
      setShowLoading(false);
      toast.success("Form saved successfully!", { appearance: "success" });
    };
    const onError = (errstatus) => {
      setErrorMsg(
        "Something went wrong, request failed! Please contact admin."
      );
      setShowErrorMsg(true);
      setShowLoading(false);
    };
    if(formId){
      updateForm(onSuccess, onError);
    }else{
      saveForm(onSuccess, onError);
    }
  };

  const saveForm = (onSuccess, onError) => {

    const encounterDate = submission["dateEncounter"]
      ? submission["dateEncounter"]
      : new Date();
    const formatedDate = Moment(encounterDate).format("DD-MM-YYYY");
    let data = {
      data: [submission.data],
      patientId: props.patientId,
      formCode: props.formCode,
      programCode: form.programCode,
      dateEncounter: formatedDate,
      visitId: props.visitId,
    };
    //if the typePatient is changed
    if (props.typePatient) {
      data["typePatient"] = props.typePatient;
    }

    props.saveEncounter(
      data,
      props.onSuccess ? props.onSuccess : onSuccess,
      props.onError ? props.onError : onError
    );
  }

  const updateForm = (onSuccess, onError) => {
    const data = {
      data: submission.data,
  }

  formRendererService.updateFormData(formId, data)
  .then((response) => {
    props.onSuccess ? props.onSuccess() : onSuccess();
  })
  .catch((error) => {
    props.onError ? props.onError() : onError()
  });
  }
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
            { props.options && props.hideHeader &&
            <>
            <h4 class="text-capitalize">
              {"New: "}
              {props.title || form.name}
            </h4>
            <hr />
            </>
}
            {/* <Errors errors={props.errors} /> */}
            <Alert color="danger" isOpen={showErrorMsg} toggle={onDismiss}>
              {errorMsg}
            </Alert>

            <Form
              form={form.resourceObject}
              submission={submission}
              hideComponents={props.hideComponents}
              options={options}
              onSubmit={(submission) => {
                if (props.onSubmit) {
                  return props.onSubmit(submission);
                }
                return submitForm(submission);
              }}
            />
          </CardBody>
        </Card>
    </React.Fragment>
  );
};

const mapStateToProps = (state = { form: {} }) => {
  return {
    patient: state.patients.patient,
    form: state.formManager.form,
    formEncounter: state.formManager.formEncounter,
    errors: state.formManager.errors,
  };
};

const mapActionToProps = {
  fetchForm: actions.fetchById,
  saveEncounter: actions.saveEncounter,
};

export default connect(mapStateToProps, mapActionToProps)(FormRenderer);
