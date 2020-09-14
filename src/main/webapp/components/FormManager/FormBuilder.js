import React, {useState, useEffect} from 'react';
import Page from 'components/Page';
import { connect } from 'react-redux';
import { saveForm, selectError, FormEdit, Errors, FormBuilder } from 'react-formio';
import {Card,CardContent,} from '@material-ui/core';

const Create = props => {
  const [res, setRes] = React.useState([]);
  return (
    <Page title="Form Builder" >
   <Card >
      <CardContent>
      <h4>Create Form</h4>
      <hr />
      <Errors errors={props.errors} />
      <FormBuilder form={{display: 'form'}} saveText={'Create Form'} onChange={(schema) => {
        console.log(JSON.stringify(schema));
        setRes(JSON.stringify(schema));
        }} />
      <br></br>
      <div>
  <h4>Json Form</h4>
      
        
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

