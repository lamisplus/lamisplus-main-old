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


Moment.locale('en')
momentLocalizer()

const FormRenderer = props => {
  const [form, setForm] = React.useState();
  const [formData, setFormData] = React.useState();
  const [errorMsg, setErrorMsg] = React.useState('')
  const [showErrorMsg, setShowErrorMsg] = React.useState(false)
  const [showLoading, setShowLoading] = React.useState(false)
  const [showLoadingEncounter, setShowLoadingEncounter] = React.useState(false)
  const [submission, setSubmission] = React.useState({...props.submission, ...{ data: { patient: props.patient }}})
  const [showLoadingForm, setShowLoadingForm] = React.useState(true)
  const onDismiss = () => setShowErrorMsg(false)
  const options = {}
 
  //extract the formData as an obj (if form data length is one) or an array
  const extractFormData = (formData) => {
    if(!formData){
        return null;
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
      .fetchFormByFormCode(props.formCode).then((response) => {
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

      // props.updateFormData(formData.id, data, 
      //   props.onSuccess ? props.onSuccess : onSuccess, 
      //   props.onError ? props.onError : onError);
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
          submission={submission}
          options={options}
          hideComponents={props.hideComponents}
          onSubmit={(submission) => {
              if(props.onSubmit){
                  return props.onSubmit(submission);
              }

            return submitForm (submission);
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

