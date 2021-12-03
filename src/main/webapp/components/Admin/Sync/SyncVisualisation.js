import React, { useState } from 'react';

import { Col, Form,CardBody, FormGroup, Input, Label, Row, Alert, FormFeedback, FormText,CardTitle, CardText,
  CardDeck,  CardGroup,CardSubtitle } from "reactstrap";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Bar from './../../../pages/DashBoardVisualisation/BarNegativeChart2'
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom'
import MaterialTable from 'material-table';

// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);

const options = [
  'Change to Bar Chart',
  
];

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

const Example = (props) => {
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
      <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to ={{
                pathname: "/admin",
                activetab: 1
            }}  >
                <h4>Admin</h4>
            </Link>
            <Typography color="textPrimary"><h4>Sync Visualisation</h4></Typography>
        </Breadcrumbs>

              <br/>
          {/* The second Column Card Layout  */}
              <Row>
              <Col  lg={3} md={4} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#7DC2AF', color: '#fff'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                           <h3>94 Facilities </h3>
                        </CardTitle>
                        <CardText>
                         
                          <h2>
                            Expected
                          </h2>
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>
              <Col  lg={3} md={4} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#05396B', color: '#fff'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                        <h3>60  Facilities</h3>
                        </CardTitle>
                        <CardText>
                       
                          <h2>
                            Queue 
                          </h2>
                        </CardText>
                      </CardBody>
                    </Card>
                </Col>
                <Col  lg={3} md={4} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#000', color: '#fff'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                           <h3>10 Facilities</h3>
                        </CardTitle>
                        <CardText>
                       
                          <h2>
                             Processing 
                          </h2>
                        </CardText>
                      </CardBody>
                    </Card>
                </Col>
                <Col  lg={3} md={4} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#FFBF43'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                          <h3>20 Facilities</h3>
                        </CardTitle>
                        <CardText>
                      
                          <h2>
                             Completed 
                          </h2>
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>

              </Row>
  
        </Col>
        <Col md={12}>
          {/* The second Column Card Layout  */}
              <Row>
             
                <Col  lg={12} md={12} sm={12} xs={12} className="mb-4">
                  <Card>
                    <CardBody>
                      <Bar />
                    </CardBody>
                    </Card>
                  </Col>
                  <Col  lg={12} md={12} sm={12} xs={12} className="mb-4">
                  <Card>
                    <CardBody>
                    <MaterialTable
                        title="Sync History Weekly "
                        columns={[
                          { title: 'Implementing Partners', field: 'name' },
                          { title: 'Facility', field: 'surname' },
                          { title: 'Date', field: 'date' },
                          { title: 'Status', field: 'birthYear' },
                         
                        ]}
                        data={[
                          { name: 'HAN', surname: 'Turning Point Hosiptal', date:'11/02/2021',  birthYear: 'completed', },
                          { name: 'FHI360', surname: 'Abuja Hospital',date:'11/02/2021',  birthYear: 'Processing',  },
                        ]} 
                        options={{
                            headerStyle: {
                              backgroundColor: "#9F9FA5",
                              color: "#000",
                            },
                            searchFieldStyle: {
                              width: "200%",
                              margingLeft: "250px",
                            },
                            filtering: true,
                            
                            searchFieldAlignment: "left",
                            exportButton: true
                          }}       
                        
                      />
                    </CardBody>
                  </Card>
                  </Col>
              </Row>  
        </Col>
      </Row>

      

      

    </div>
  );
}

export default Example;
