import React from 'react';
import Page from 'components/Page';
import { data } from './form-json';
import { saveForm, selectError, Errors, Form, FormBuilder } from 'react-formio';
import {Card,CardContent,} from '@material-ui/core';
import FormRenderer from 'components/FormManager/FormRenderer';

const Create = props => {

   
  const [res, setRes] = React.useState("sad");
  const submission = "";
  const url = "https://www.lmamisplsus.org";
  return (
    <Page title="Form Builder" >
   <Card >
      <CardContent>
      <h4>Create Form</h4>
      <hr />
      <Errors errors={props.errors} />
      <Form
          form={data}
          submission={submission}
          src={url}
          options={{...{template: 'bootstrap3', iconset: 'fa'},  ...props.options}}
          hideComponents={props.hideComponents}
          //onSubmit={props.onSubmit}
          onSubmit={(submission) => {
              console.log(submission);
      return fetch('https://lamisplus.org/demo', {
          body: JSON.stringify(submission),
          headers: {
            'content-type': 'application/json'
          },
          method: 'POST',
          mode: 'cors',
        })}}
        />
        <br></br>
        <h4>Edit Form</h4>
        <FormBuilder form={data} {...props} onChange={(schema) => {
        console.log(JSON.stringify(schema));
        }} />

      <br></br>
      <div>
  <h4>Json Form</h4>
        {res}
      </div>
    </CardContent>
    </Card>
    </Page>
  );
}

const mapStateToProps = (state) => {
  return {
    form: {display: 'form'},
    saveText: 'Create Form',
    errors: selectError('form', state),
    response: 'res'
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveForm: (form) => {
      const newForm = {
        ...form,
        tags: ['common'],
      };
      dispatch(saveForm('form', newForm, (err, form) => {
        console.log('stroing form');
        console.log(newForm); 
      }))
    }
  }
}

export default Create

