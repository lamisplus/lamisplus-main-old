import React, { useState }   from 'react';
import {
    Modal, ModalHeader, ModalBody, Row, Col, FormGroup, Label, Card, CardBody, Alert
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
//import PrintIcon from '@material-ui/icons/Print';
import ReactHtmlParser from 'react-html-parser'
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    input: {
        display: 'none'
    } 
}))



const ModalViewResult = (props) => {
    const classes = useStyles()
    const datasample = props.datasample ? props.datasample : {};
    const lab_test_group = datasample.data ? datasample.data.lab_test_group : null ;
    const description = datasample.data ? datasample.data.description : null ;
    const unit_measurement = datasample.data ? datasample.data.unit_measurement : null ;
    const date_result_reported = datasample.data ? datasample.data.date_result_reported : null ;
    const test_result = datasample.data ? datasample.data.comment_sample_reported : null ;
    const result_detail = datasample.data && datasample.data.reported_result ?  datasample.data.reported_result : null


  return (      
      <div >
          {/* <ModalViewResult ref={componentRef} /> */}
          
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                  <ModalHeader toggle={props.togglestatus}>Lab Test Order Detail</ModalHeader>
                      <ModalBody>
                          <Card>
                            <CardBody>
                                <Row style={{ marginTop: '20px'}}>
                                    <Col xs="12">
                                    <Alert color="dark" style={{backgroundColor:'#9F9FA5', color:"#000" , fontWeight: 'bolder', }}>
                                        <Row >
                                    <Col xs="6">
                                        <span style={{ fontWeight: 'bold'}}>Lab Test Group</span> : {lab_test_group}
                                        <br/>
                                    </Col>
                                    <br/>
                                    <Col xs="6">
                                        <span style={{ fontWeight: 'bold'}}>Lab Test Ordered</span> : {description}
                                        <br/>
                                                      
                                    </Col>
                                        </Row>
                                    </Alert>
                                    </Col>
                                    <Col xs="12">
                                        <h4>Results: </h4>
                                        <hr/>
                                    {
                                        !result_detail ? "" :
                                        result_detail.map(x => {
                                            return (
                                                <Row >
                                        <Col xs="6">
                                        <span style={{ fontWeight: 'bold'}}>Date Assayed </span>: {x.date_result_reported}
                                        <br/>
                                    </Col>
                                    <br/>
                                    <Col xs="6">
                                        <span style={{ fontWeight: 'bold'}}>Date Reported </span>: {x.date_result_reported}
                                        <br/>    
                                    </Col>
                                   
                                    <Col xs="6">
                                        <span style={{ fontWeight: 'bold'}}> Result </span>: {ReactHtmlParser(x.result_reported)}
                                    </Col>
                                                    <Col xs="6">
                                                        <span style={{ fontWeight: 'bold'}}> Unit Measurement </span>: {unit_measurement}
                                                    </Col>
                                    <Col xs="12">
                                        <span style={{ fontWeight: 'bold'}}> Notes </span>: {ReactHtmlParser(x.comment_sample_reported && x.comment_sample_reported!==undefined ? x.comment_sample_reported : "")}
                                        <Divider  />
                                    </Col>  
                                    </Row>)
                                   
                                        })
                                        
                                    }
                                </Col>
                    
                                </Row>
                            <br/>
                          
                            <MatButton
                              variant='contained'
                              color='default'
                              onClick={props.togglestatus}
                              className={classes.button}
                              startIcon={<CancelIcon />}
                            >
                              Cancel
                            </MatButton>
                      </CardBody>
                </Card>
          </ModalBody>
      </Modal>
    </div>
  );
}

export default ModalViewResult;
