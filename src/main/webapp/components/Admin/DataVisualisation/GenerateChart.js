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
import SaveIcon from '@material-ui/icons/Save';
import MatButton from '@material-ui/core/Button';

Moment.locale('en');
momentLocalizer();
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
    },
    error:{
        color: '#f85032',
        fontSize: '12.8px'
    }
}))

const GenerateCharts = (props) => {
    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const [visibleChart, setvisibleChart] = useState(0);
    //const onDismiss = () => setVisible(false);
    const [otherfields, setOtherFields] = useState({start_date:"",end_date:"",facility:"",title:"",category:"",
    chart_type:"", age_disaggregation:"" , gender:"", data_element:""});



      const handleOtherFieldInputChange = e => {
        setOtherFields ({ ...otherfields, [e.target.name]: e.target.value });
    }


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

const generatechart =  () => () => {
    setvisibleChart(1)
    console.log(visibleChart)
}
const saveChart = (e) => {
    e.preventDefault()
    const newData = e 
    alert ('saving chart')
    setvisibleChart(0) 
    console.log(otherfields) 
};

  return (
    <div >
        <Card >
         <CardBody>

                 <Row style={{ marginTop: '20px'}}>
                 <Col md="3">
                     <FormGroup>
                            <Label for="exampleSelect">Title</Label>
                                <Input type="text" name="title" id="title" onChange={handleOtherFieldInputChange} >
                                    
                                </Input>
                                    <FormFeedback></FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>Data Category </Label>
                            <Input
                                type="select"
                                name="category"
                                id="category"
                                onChange={handleOtherFieldInputChange}
                            >
                                <option value=""></option>
                                <option value="indicator"> Indicator </option>

                            </Input>

                    </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>Chart Type </Label>
                            <Input
                                type="select"
                                name="chart_type"
                                id="chart_type"
                                onChange={handleOtherFieldInputChange}
                            >
                                <option value=""></option>
                                <option value="column"> Pie Chart</option>
                                <option value="column"> Bar Chart</option>
                                <option value="column"> Column Chart </option>
                                <option value="column"> Line Chart</option>
                                <option value="column"> Area Chart </option>
                            </Input>

                    </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>Gender </Label>
                            <Input
                                type="select"
                                name="gender"
                                id="gender"
                                onChange={handleOtherFieldInputChange}
                            >
                                <option value=""></option>
                                <option value="Male">Male </option>
                                <option value="Female"> Female </option>
                               
                            </Input>

                    </FormGroup>
                    </Col>
                    <Col md="3">
                     <FormGroup>
                            <Label for="exampleSelect">Age Disaggregation</Label>
                                <Input type="text" name="age_disaggregation" id="age_disaggregation"  onChange={handleOtherFieldInputChange}>
                                    
                                </Input>
                                    <FormFeedback></FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>Data Element </Label>
                            <Input
                                type="select"
                                name="data_element"
                                id="data_element"
                                onChange={handleOtherFieldInputChange}
                            >

                                <option value=""></option>
                                <option value="TX_CURR">TX_CURR </option>
                                <option value="TX_NEW">TX_NEW </option>
                                <option value="PVLS_D">PVLS_D </option>
                                <option value="PVLS_N">PVLS_N </option>
                                <option value="HTS_POS">HTS_POS </option>
                                <option value="HTS">HTS </option>

                            </Input>

                    </FormGroup>
                    </Col>

                    <Col md="3">
                    <FormGroup>
                        <Label>Start Date </Label>
                        <DateTimePicker
                            time={false}
                            name="start_date"
                            id="start_date"
                            onChange={start_date =>
                                setOtherFields({ ...otherfields, start_date: start_date })
                              }
                            required
                        /> 
                    </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>End Date </Label>
                        <DateTimePicker
                            time={false}
                            name="end_date"
                            id="end_date"
                            onChange={end_date =>
                                setOtherFields({ ...otherfields, end_date: end_date })
                              }
                            required
                        /> 

                    </FormGroup>
                    </Col>
                    <Col md="3">
                    <FormGroup>
                        <Label>Facility </Label>
                            <Input
                                type="select"
                                name="facility"
                                id="facility"
                                onChange={handleOtherFieldInputChange}
                            >
                                <option value=""></option>
                                <option value="1132"> Uyo </option>
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
                {visibleChart ===1 ? (
                    <>
                    <br/><br/>
                        <MatButton
                            type='submit'
                            variant='contained'
                            color='primary'
                            className={classes.button}                        
                            className=" float-right mr-1"
                            size='large'
                            onClick={ () =>saveChart()}
                            
                        >
                            <SaveIcon />{" "} Save chart
                        </MatButton>
                    <HighchartsReact highcharts={Highcharts}  options={options} />
                    </>
                    ) : ( "")
                
                }
                 
            </CardBody>
        </Card>
    </div>
  );
}

export default GenerateCharts;


