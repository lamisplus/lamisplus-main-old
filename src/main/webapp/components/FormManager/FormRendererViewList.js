import React from 'react';
import axios from "axios";
import { SubmissionGrid } from 'react-formio';
import * as actions from "actions/formManager";
import {connect} from 'react-redux';
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import { Card, Alert, CardBody, Spinner } from 'reactstrap'
import { url as baseUrl } from "api/index";


Moment.locale('en')
momentLocalizer()

const FormRenderer = props => {
  const [form, setForm] = React.useState();
  const [errorMsg, setErrorMsg] = React.useState('')
  const [showErrorMsg, setShowErrorMsg] = React.useState(false)
  const [showLoading, setShowLoading] = React.useState(false)
  const [showLoadingEncounter, setShowLoadingEncounter] = React.useState(false)
  const [submissions, setSubmissions] = React.useState([])
  const [showLoadingForm, setShowLoadingForm] = React.useState(true)
  const onDismiss = () => setShowErrorMsg(false)
  const options = {
    readOnly: true,
    
    }
   
  //extract the formData as an obj (if form data length is one) or an array
  const extractFormData = (formData) => {
    if(!formData){
        return null;
    }
    if(formData.length === 1){
      return formData[0].data;
    }
    return formData.map(item => {
      return item.data;
    })
  }
  React.useEffect(() => {
    const onSuccess = () => {
      setShowLoadingForm(false)
      }
      const onError = errstatus => {
        setErrorMsg('Error loading form, something went wrong')
        setShowErrorMsg(true)
        setShowLoadingForm(false)
      }
    props.fetchForm(props.formCode, onSuccess, onError);
  }, [props.formCode]);

  React.useEffect(() => {
      setForm(props.form);
  },[props.form]);

  React.useEffect(() => {
      setShowLoadingEncounter(true);
      async function fetchEncounters() {
        try{
          const response = await fetch(`${baseUrl}patients/${props.patientId}/encounters/${props.formCode}?limit=5`);
          const body = await response.json();
          setSubmissions(body.map(element => {
            return {data: element}
          }));
          setShowLoadingEncounter(false);
        } catch (error) {
          console.log(error);
          setErrorMsg('Could not load form list');
          setShowErrorMsg(true);
          setShowLoadingEncounter(false);
        }
      }
      // axios
      //    .get(``, {limit: 5, sortField: "dateEncounter", sortOrder: "desc"} )
      //    .then(response => {
      //     setSubmissions(response);
      //     console.log(response)
      //     console.log(submissions)
      //     setShowLoadingEncounter(false);
      //    })
      //    .catch(error => {
      //     setErrorMsg('Could not load form list');
      //     setShowErrorMsg(true);
      //     setShowLoadingEncounter(false);
      //     return;
      //    })
      //   }
        fetchEncounters();
  }, []);
  
  if(showLoadingForm){
    return (
      <span className="text-center"><Spinner style={{ width: '3rem', height: '3rem' }} type="grow" /> Loading form...</span>
    )
  }

  if (showLoadingEncounter){
      return (
        <span className="text-center"><Spinner style={{ width: '3rem', height: '3rem' }} type="grow" /> Loading encounter information...</span>
      )
  }
  return (
    <React.Fragment>
   <Card >
      <CardBody>
  <h4 class="text-capitalize">{'View All: '}{props.title || props.form.name}</h4>
      <hr />
      {/* <Errors errors={props.errors} /> */}
      <Alert color='danger' isOpen={showErrorMsg} toggle={onDismiss}>
            {errorMsg}
          </Alert>

    <SubmissionGrid 
        submissions={{pagination: {
          page: 1,
          numPages: 1,
          total: submissions.length,
        },submissions: submissions}}
        form={props.form.resourceObject}
        onAction={()=>{}}
        operations={[]}
  //      columns={[{key:"data.day", title:"Day"}, {key:"data.symptoms_present.display", title:"Contact Has Symptoms"}]}
        />

    </CardBody>
    </Card>
    </React.Fragment>
  );
}

const mapStateToProps = (state = {formManager: {}}) => {
  return {
    form: state.formManager.form,
    formEncounter: state.formManager.formEncounter,
    errors: state.formManager.errors,
    encounter: state.encounter.encounter
  }
}


const mapActionToProps = {
  fetchForm: actions.fetchById,
}

export default connect(mapStateToProps, mapActionToProps)(FormRenderer)

