import React, { useState } from "react";
import {Card,CardBody,} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import {  Icon, Button, Breadcrumb} from 'semantic-ui-react';
import {Form,Row,Col,FormGroup,Label,Input, FormFeedback} from 'reactstrap';
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import {
    createCollectedSample,
} from "../../../actions/laboratory";
import * as CODES from "./../../../api/codes";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { DateTimePicker } from 'react-widgets';

Moment.locale('en');
momentLocalizer();

const GenerateCharts = (props) => {
   // const datasample = datasample.data && datasample.data.order_priority && datasample.data.order_priority.display   ? datasample.data.order_priority.display : null;
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    //This is to get SAMPLE TYPE from application Codeset

    const currentForm = {
          code: CODES.DATA_VISUALIZATION,
          programCode: CODES.GENERAL_SERVICE,
          formName: "Data Visualisation",
          options:{
              hideHeader: true
          },
      };

    const saveSample = (e) => {
        const newData = e.data    
    };
    const basicColumn  = {"plotOptions":{"pointPadding":0.2,"borderWidth":0.0},"xAxis":[{"name":"1-4","y":125.0},{"name":"5-9","y":30.0},{"name":"10-15","y":250.0}],"series":{"name":"Chart Title","type":"column","data":[{"name":"1-4","y":125.0},{"name":"5-9","y":30.0},{"name":"10-15","y":250.0}]},"subtitle":{"text":""},"tooltip":{"headerFormat":"\u003chtml\u003e\n \u003chead\u003e\u003c/head\u003e\n \u003cbody\u003e\n  \u003cspan style\u003d\"font-size:10px\"\u003e{point.key}\u003c/span\u003e\n  \u003ctable\u003e\u003c/table\u003e\n \u003c/body\u003e\n\u003c/html\u003e","pointFormat":"\u003chtml\u003e\n \u003chead\u003e\u003c/head\u003e\n \u003cbody\u003e\n  {series.name}:  \u003cb\u003e{point.y}\u003c/b\u003e\n \u003c/body\u003e\n\u003c/html\u003e","footerFormat":"\u003chtml\u003e\n \u003chead\u003e\u003c/head\u003e\n \u003cbody\u003e\u003c/body\u003e\n\u003c/html\u003e","shared":true,"useHTML":true},"title":{"text":"Chart Title","align":"center"},"chart":{"type":"column"}}
    const options = {
        chart: {
          type: 'spline'
        },
        title: {
          text: 'My chart'
        },
        series: [
          {
            data: [1, 2, 1, 4, 3, 6]
          }
        ]
      };

const generatechart = () =>  () => {
    alert('generate Chart')
}
  return (
    <div >
        <Card >
         <CardBody>
            
                {/* <FormRenderer
                    formCode={currentForm.code }
                    programCode={currentForm.programCode}
                    //submission={datasample}
                    onSubmit={saveSample}
                /> */}
                 <Row style={{ marginTop: '20px'}}>
                 <Col md="3">
                     <FormGroup>
                            <Label for="exampleSelect">Title</Label>
                                <Input type="text" name="receivingLabName" id="receivingLabName"  >
                                    
                                </Input>
                                    <FormFeedback></FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>Data Category </Label>
                            <Input
                                type="select"
                                name="result_reported_by"
                                id="result_reported_by"

                            >
                                <option value=""></option>
                                <option value="Dorcas"> Data 1 </option>
                                <option value="Jeph"> Data </option>
                                <option value="Debora"> Data </option>
                            </Input>

                    </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>Chart Type </Label>
                            <Input
                                type="select"
                                name="result_reported_by"
                                id="result_reported_by"

                            >
                                <option value=""></option>
                                <option value="Dorcas"> Data 1 </option>
                                <option value="Jeph"> Data </option>
                                <option value="Debora"> Data </option>
                            </Input>

                    </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>Gender </Label>
                            <Input
                                type="select"
                                name="result_reported_by"
                                id="result_reported_by"
                            >
                                <option value=""></option>
                                <option value="Dorcas">Male </option>
                                <option value="Jeph"> Female </option>
                               
                            </Input>

                    </FormGroup>
                    </Col>
                    <Col md="3">
                     <FormGroup>
                            <Label for="exampleSelect">Age Disaggregation</Label>
                                <Input type="text" name="receivingLabName" id="receivingLabName"  >
                                    
                                </Input>
                                    <FormFeedback></FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>Date Element </Label>
                            <Input
                                type="select"
                                name="result_reported_by"
                                id="result_reported_by"
                            >
                                <option value=""></option>
                                <option value="Dorcas">Male </option>
                                <option value="Jeph"> Female </option>
                               
                            </Input>

                    </FormGroup>
                    </Col>

                    <Col md="3">
                    <FormGroup>
                        <Label>Start Date </Label>
                        <DateTimePicker
                            time={false}
                            name="date_sample_transfered"
                            id="date_sample_transfered"
                            required
                        /> 
                    </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>End Date </Label>
                        <DateTimePicker
                            time={false}
                            name="date_sample_transfered"
                            id="date_sample_transfered"
                            required
                        /> 

                    </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>Facility </Label>
                            <Input
                                type="select"
                                name="result_reported_by"
                                id="result_reported_by"
                            >
                                <option value=""></option>
                                <option value="Dorcas"> Indicator 1 </option>
                                <option value="Jeph"> Indicator </option>
                                <option value="Debora"> Indicator </option>
                            </Input>

                    </FormGroup>
                    </Col>
                    <Col style={{ marginTop: '20px'}}>
                    <Button icon labelPosition='right' color='blue' onClick={generatechart()}>
                        Generate
                    <Icon name='right arrow' />
                    </Button>
                    </Col>
                    </Row>

            <HighchartsReact highcharts={Highcharts}  options={options} />
            </CardBody>
        </Card>
    </div>
  );
}

export default GenerateCharts;


