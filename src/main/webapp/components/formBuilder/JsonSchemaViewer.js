import React, {useEffect, useState} from 'react';
import { Form} from 'react-formio';
import {Col, Row} from "reactstrap";
import { Alert } from '@material-ui/lab';

const JsonSchemaViewer = props => {
    const [jsonSchema, setJsonSchema] = useState();
    const [showForm, setShowForm] = useState(true);

    useEffect(() => {

    }, [props.formObject]);

    if(true){
        return (<></>);
    }
    return (
        <>
            <Row>
                <Col md={12}>
            <div>
                <h4>Json Schema</h4>
                <textarea cols="100"
                          value={jsonSchema}/>
            </div>
                </Col>

<Col md={12}>
    <br/>
    <hr></hr>
            <Form
                form={props.formObject ? JSON.parse(props.formObject.replace('"hidden":true', '"hidden":false')) : {}}
                hideComponents={false}
                onChange={(ch) => {
                    setJsonSchema(JSON.stringify(ch.data));
                    console.log(ch);
                }
                }
            />
</Col>
            </Row>
        </>
    )
}

export default JsonSchemaViewer;