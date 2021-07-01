import React, { useState } from 'react';

import { Col, Form,CardBody,  Row,CardTitle, CardText,
   } from "reactstrap";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Highcharts from 'highcharts';
 import HighchartsReact from 'highcharts-react-official';
import {NewlyEnrolledArtBySex} from './Highcharts/NewlyEnrolledArtBySex';
import {NewlyEnrolledArtByAge} from './Highcharts/NewlyEnrolledArtByAge';
import {ReceivingArtByAge}  from './Highcharts/ReceivingArtByAge';
import {ReceivingArtBySex} from './Highcharts/ReceivingArtBySex';
import { Progress } from 'reactstrap';


// Load Highcharts modules
//require("highcharts/modules/exporting")(Highcharts);

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: 200,
    },
},
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const SummaryView = (props) => {
  const classes = useStyles();
  const [chartValue, setChartValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const [state, setState] = useState({ activeItem: 'gamepad' })

  const handleItemClick = (e, { name }) => setState({ activeItem: name })
  const { activeItem } = state
  const chartPage  = e => {

    setChartValue(e)
  }

  //Menu Icon 
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  return (
    <div  spacing={5} style={{ padding: 20 }} >
      <Row>
        <Col md={12}>
          {/* The second Column Card Layout  */}
        <Row>
                
                <Col  lg={4} md={6} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#7DC2AF', color: '#fff'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                        <h2>13,000.00</h2>
                        </CardTitle>
                        <CardText> 
                          <p>
                            Active Patients Based on 28 days definition of Lost To Follow Up
                          </p>
                          <Row>
                          <Col  md={10} >
                            <Progress animated color="warning" value={75} ></Progress>
                          </Col>
                          <Col  md={1} style={{marginLeft: -25}}>
                            <b >55%</b>
                          </Col>
                          </Row>
                        </CardText>
                      </CardBody>
                      
                    </Card>
                    
                   
                  </Col>

                  <Col  lg={4} md={6} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#05396B', color: '#fff'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                        <h2>12,000.00</h2>
                        </CardTitle>
                        <CardText>
                        
                          <p>
                            Active Patients Based on 90 days definition of Lost To Follow Up
                          </p>
                          <Row>
                          <Col  md={10} >
                            <Progress animated color="black" value={65} ></Progress>
                          </Col>
                          <Col  md={1} style={{marginLeft: -25}}>
                            <b >45%</b>
                          </Col>
                          </Row>
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col  lg={4} md={6} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#FFBF43'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                          <h3>Reporting Period</h3>
                        </CardTitle>
                        <CardText>
                          <p>
                            Jan. 1 2021 to Mar. 31 2021
                            Snapshots are taken in 3-month intervals.
                            The next snapshot will be taken Jun. 30 2021
                            Facilities Reported
                            1938 of 2318
                          </p>
                          
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col  lg={6} md={6} sm={12} xs={12} className="mb-4">
                    <Card><CardBody>
                    {/* <Bar /> */}
                    <HighchartsReact options={NewlyEnrolledArtBySex} />
                   
                    </CardBody></Card>
                  </Col>
                  <Col  lg={6} md={6} sm={12} xs={12} className="mb-4">
                    <Card><CardBody>
                    {/* <Bar /> */}
                    <HighchartsReact options={NewlyEnrolledArtByAge} />
                   
                    </CardBody></Card>
                  </Col>
                  <br/>
                  <br/>
                  
                  <Col  lg={6} md={6} sm={12} xs={12} className="mb-4">
                  <Card><CardBody>
                    <HighchartsReact options={ReceivingArtBySex} />
                  </CardBody></Card>
                  </Col>
                  <Col  lg={6} md={6} sm={12} xs={12} className="mb-4">
                  <Card><CardBody>
                    <HighchartsReact options={ReceivingArtByAge} />
                  </CardBody></Card>
                  </Col>
              </Row>

           
        </Col>
      </Row>

      

      

    </div>
  );
}

export default SummaryView;
