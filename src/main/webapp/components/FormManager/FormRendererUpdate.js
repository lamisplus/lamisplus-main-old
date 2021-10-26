import React from 'react';
import Page from 'components/Page';
import { Errors, Form } from 'react-formio';
import * as actions from "actions/formManager";
import {connect} from 'react-redux';
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import { toast } from 'react-toastify'
import { Card, Alert, CardBody, Spinner } from 'reactstrap'
import { formRendererService } from "_services/form-renderer";
import _ from "lodash";
import { url } from "api";
import { authHeader } from '_helpers/auth-header';

Moment.locale('en')
momentLocalizer()

const FormRenderer = props => {
  const [form, setForm] = React.useState();
  const [formData, setFormData] = React.useState();
  const [errorMsg, setErrorMsg] = React.useState('')
  const [showErrorMsg, setShowErrorMsg] = React.useState(false)
  const [showLoading, setShowLoading] = React.useState(false)
  const [showLoadingEncounter, setShowLoadingEncounter] = React.useState(false)
  const [submission, setSubmission] = React.useState(JSON.stringify(_.merge(props.submission, { data: { patient: props.patient,authHeader: authHeader(), baseUrl: url }})));

  const [showLoadingForm, setShowLoadingForm] = React.useState(true)
  const onDismiss = () => setShowErrorMsg(false)
  const options = {}

  //extract the formData as an obj (if form data length is one) or an array
  const extractFormData = (formData) => {
    if(!formData){
        return null;
    }

      if( (props.formCode === '4ab293ff-6837-41e8-aa85-14f25ce59ef0' || props.formCode === '87cb9bc7-ea0d-4c83-a70d-b57a5fb7769e'  || props.formCode === 'f0bec8e4-f8d9-4daa-93c0-fa04af82533b')){
          const d = {orders : formData.map(item => {
                  return item.data;
              })};
          console.log(d);
          return d;
      }

    if(formData.length === 1){
        setFormData(formData[0]);
      return formData[0].data;
    }

    setFormData(formData);
    return formData.map(item => {
      return item.data;
    })
  }

  //fetch form by form code
  React.useEffect(() => {
    formRendererService
      .fetchFormByFormCode(props.formCode, props.formType)
        .then((response) => {
        setForm(response.data);
        setShowLoadingForm(false);
      }) .catch((error) => {
        setErrorMsg("Error loading form, something went wrong");
      setShowErrorMsg(true);
      setShowLoadingForm(false);
      });
  }, []);

  //fetch encounter by encounter id
  React.useEffect(() => {
      setShowLoadingEncounter(true);
      if(!props.encounterId){
          // if encounterId does not exist then the form data object was passed as a submission, if not throw an error
          if(!props.submission){
              setErrorMsg("No encounter information passed");
              setShowErrorMsg(true);
          }
          setShowLoadingEncounter(false);
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
        const submissionJson = JSON.stringify(_.merge({ data: extractedData }, JSON.parse(submission)));
        console.log(submissionJson);
        setSubmission(submissionJson);

      })
      .catch((error) => {
        setErrorMsg("Could not load encounter information");
        setShowErrorMsg(true);
        setShowLoadingEncounter(false);
      });
  }, []);

  const submitEncounter = (submission) => {
      const onSuccess = () => {
          setShowLoading(false)
          toast.success('Form saved successfully!', { appearance: 'success' })
      }
      const onError = errstatus => {
          setErrorMsg('Something went wrong, request failed! Please contact admin.')
          setShowErrorMsg(true)
          setShowLoading(false)
      }

      const keys = Object.keys(submission.data);

      // remove the base
      if(keys.includes('orders') && _.isArray(submission.data['orders'])){
          submission.data = submission.data['orders'];
      }

      const data = {
          data: submission.data,
          encounterId: props.encounterId,
          visitId: props.visitId,
          patientId: props.patientId,
          dateEncounter: props.dateEncounter,
          timeCreated: props.timeCreated,
          organisationUnitId: props.organisationUnitId,
          formCode: props.formCode,
          programCode: props.programCode
      }


      formRendererService.updateEncounter(props.encounterId, data)
          .then((response) => {
              props.onSuccess ? props.onSuccess() : onSuccess();
          })
          .catch((error) => {
              props.onError ? props.onError() : onError()
          });
  }
  const submitForm = ( submission) => {
   // e.preventDefault()
   
      const onSuccess = () => {
        setShowLoading(false)
        toast.success('Form saved successfully!', { appearance: 'success' })
      }
      const onError = errstatus => {
        setErrorMsg('Something went wrong, request failed! Please contact admin.')
        setShowErrorMsg(true)
        setShowLoading(false)
      }

      const data = {
          data: submission.data,
      }


      formRendererService.updateFormData(formData.id, data)
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

  const onSave = (submission) => {
      delete submission.data.patient;
      delete submission.data.authHeader;
      delete submission.data.submit;
      delete submission.data.baseUrl;
      if(props.onSubmit){
          return props.onSubmit(submission);
      }

      let isEncounter = false;
      // check if data has orders in it, if yes then its retrospective then save as encounter
      const keys = Object.keys(submission.data);
      if(keys.includes('orders') && _.isArray(submission.data['orders'])){
           isEncounter = true;
      }



      console.log( isEncounter);
      if(isEncounter){
          return submitEncounter(submission)
      }
      return submitForm (submission);
  }
  return (
    <React.Fragment>
   <Card >
      <CardBody>
  <h4 class="text-capitalize">{'Edit: '}{props.title || form.name}</h4>
      <hr />
      {/* <Errors errors={props.errors} /> */}
      <Alert color='danger' isOpen={showErrorMsg} toggle={onDismiss}>
            {errorMsg}
          </Alert>

      <Form
          form={form.resourceObject}
          submission={JSON.parse(submission)}
          options={options}
          hideComponents={props.hideComponents}
          onCustomEvent={(submission) => {
              console.log('is submit2')
              if(submission.type === 'onSubmitOrderButtonClicked'){
                  console.log('is onSubmitOrderButtonClicked');
                  onSave(submission, true);
              }
          }}
          onSubmit={(submission) => {
              console.log('is submit')

              onSave(submission)
            }}
        />
    </CardBody>
    </Card>
    </React.Fragment>
  );
}

const mapStateToProps = (state = {formManager: {}}) => {
  return {
    patient: state.patients.patient,
    form: state.formManager.form,
    formEncounter: state.formManager.formEncounter,
    errors: state.formManager.errors,
    encounter: state.encounter.encounter
  }
}


const mapActionToProps = {
  fetchForm: actions.fetchById,
  updateFormData: actions.updateFormData
}

export default connect(mapStateToProps, mapActionToProps)(FormRenderer)

