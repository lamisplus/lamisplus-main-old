import React, { useState } from 'react';

import { Col, Form,CardBody, FormGroup, Input, Label, Row, Alert, FormFeedback, FormText,CardTitle, CardText,
  CardDeck,  CardGroup,CardSubtitle } from "reactstrap";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";

// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);


const ITEM_HEIGHT = 48;

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

var options = {
  chart: {
    renderTo: 'container',
    type: 'column'
},
title: {
    text: 'Restaurants Complaints'
},
tooltip: {
    shared: true
},
xAxis: {
    categories: [
        'Overpriced',
        'Small portions',
        'Wait time',
        'Food is tasteless',
        'No atmosphere',
        'Not clean',
        'Too noisy',
        'Unfriendly staff'
    ],
    crosshair: true
},
yAxis: [{
    title: {
        text: ''
    }
}, {
    title: {
        text: ''
    },
    minPadding: 0,
    maxPadding: 0,
    max: 100,
    min: 0,
    opposite: true,
    labels: {
        format: "{value}%"
    }
}],
series: [{
    type: 'pareto',
    name: 'Pareto',
    yAxis: 1,
    zIndex: 10,
    baseSeries: 1,
    tooltip: {
        valueDecimals: 2,
        valueSuffix: '%'
    }
}, {
    name: 'Complaints',
    type: 'column',
    zIndex: 2,
    data: [755, 222, 151, 86, 72, 51, 36, 10]
}]
}


const Example = (props) => {
  const classes = useStyles();



  return (
    <div  spacing={5} style={{ padding: 20 }} >
      <Row>
      <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to ={{
                pathname: "/admin",
                activetab: 1
            }}  >
                Admin
            </Link>
            <Typography color="textPrimary">Sync Visualisation</Typography>
        </Breadcrumbs>

              <br/><br/>

        <Col md={12}>
          {/* The second Column Card Layout  */}
              <Row>
              <Col  lg={4} md={6} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#7DC2AF', color: '#fff'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                           94%
                        </CardTitle>
                        <CardText>
                          <h3>Completed Sync</h3>
                          
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>
              <Col  lg={4} md={6} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#05396B', color: '#fff'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                           49%
                        </CardTitle>
                        <CardText>
                        <h3>Pending Sync</h3>
                         
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col  lg={4} md={6} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#FFBF43'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                           56%
                        </CardTitle>
                        <CardText>
                        <h3>Processing Sync</h3>
                          
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>

               
            <Col  lg={12} md={12} sm={12} xs={12} className="mb-4">
                <Card><CardBody>
                    <barColumnDualAxis />
                    <barchart />
                </CardBody></Card>
            </Col>
                 
            <barColumnDualAxis />
              </Row>
              
           
        </Col>
      </Row>

      

      

    </div>
  );
}

export default Example;
