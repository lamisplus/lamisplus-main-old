import React, { useState } from 'react';

import { Col, Form,CardBody, FormGroup, Input, Label, Row, Alert, FormFeedback, FormText,CardTitle, CardText,
  CardDeck,  CardGroup,CardSubtitle } from "reactstrap";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {basicColumn} from '../components/Highcharts/BasicColumn';
import {columnDrillDown} from './../components/Highcharts/ColumnDrillDown';
import {pieChart} from './../components/Highcharts/PieChart';

import {dualAxisLineColumn} from './../components/Highcharts/DualAxisLineColumn'
import {barColumnDualAxis} from './../components/Highcharts/BarColumnDualAxis'
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import MatButton from "@material-ui/core/Button";
import ListAltIcon from '@material-ui/icons/ListAlt';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import ApartmentIcon from '@material-ui/icons/Apartment';
import BusinessIcon from '@material-ui/icons/Business';
import {
  MdPersonPin,
  MdPeople,
  MdShowChart,
  MdDelete
} from 'react-icons/md';
import { IconWidget } from 'components/Widget';
import Bar from './../pages/DashBoardVisualisation/BarNegativeChart'
import LineChart from './../pages/DashBoardVisualisation/BarDrilldown'
import Pie from './../pages/DashBoardVisualisation/Pie'
import Pie2 from './../pages/DashBoardVisualisation/Pie2'
import CustomHighMap from './map';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

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
        <Col md={3}>
          <Card>
            <CardContent>
              <h4>Apply Filter Below to Load Data</h4>
              <br/>
            <FormGroup>
                <Label for="maritalStatus"><ListAltIcon />Select MER Indicator</Label>
                    <Input
                        type="select"
                        name="genderId"
                        id="genderId"                        
                    >
                      <option  value=""> Treatment New</option>
                      <option  value=""> Treatment Current</option> 
                      <option  value=""> Treatment PVLS</option>
                      <option  value=""> Treatment HTS,TST</option>  
                    </Input>
            </FormGroup>                                    
            <FormGroup>
                <Label for="maritalStatus"><AcUnitIcon />{" "}Implementing Partners</Label>
                    <Input
                        type="select"
                        name="genderId"
                        id="genderId"                        
                    >
                      <option  value=""> Abuja</option>
                      <option  value="">Uyo</option> 
                      <option  value="">Lagos</option>
                      <option  value="">Kano</option>  
                    </Input>
            </FormGroup>
            <FormGroup>
                <Label for="maritalStatus"><ApartmentIcon /> {" "}States (Select one or more states)</Label>
                    <Input
                        type="select"
                        name="genderId"
                        id="genderId"                        
                    >
                      <option  value=""> Abuja</option>
                      <option  value="">Uyo</option> 
                      <option  value="">Lagos</option>
                      <option  value="">Kano</option>  
                    </Input>
            </FormGroup>    
            <FormGroup>
                <Label for="maritalStatus"><ApartmentIcon /> {" "}LGA's (Select one or more Lga's)</Label>
                    <Input
                        type="select"
                        name="genderId"
                        id="genderId"                        
                    >
                      <option  value=""> Abuja</option>
                      <option  value="">Uyo</option> 
                      <option  value="">Lagos</option>
                      <option  value="">Kano</option>  
                    </Input>
            </FormGroup>
            <FormGroup>
                <Label for="maritalStatus"><BusinessIcon /> {" "}Facilities (Select one or more states)</Label>
                    <Input
                        type="select"
                        name="genderId"
                        id="genderId"                        
                    >
                      <option  value=""> Abuja</option>
                      <option  value="">Uyo</option> 
                      <option  value="">Lagos</option>
                      <option  value="">Kano</option>  
                    </Input>
            </FormGroup>
            <MatButton
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<SaveIcon />}
               
            >
                <span style={{textTransform: 'capitalize'}}>Load Data</span>
            </MatButton>
             {" "}
            <MatButton
                variant="contained"
                className={classes.button}
                startIcon={<CancelIcon />}
                // onClick={resetForm}
            >
                <span style={{textTransform: 'capitalize'}}>Cancel</span>
            </MatButton>
            </CardContent>
          </Card>
        </Col>

        <Col md={9}>
          {/* The second Column Card Layout  */}
              <Row>
              <Col  lg={12} md={12} sm={12} xs={12} className="mb-12">
              <CardGroup style={{ marginBottom: '1rem' }}>
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdDelete}
            title="50"
            subtitle="Patients"
          />
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdPersonPin}
            title="10"
            subtitle="States"
          />
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdPeople}
            title="20"
            subtitle="Facilities"
          />
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdShowChart}
            title="20"
            subtitle="IP"
          />
        </CardGroup>
        </Col>

          <Col  lg={6} md={6} sm={6} xs={12} className="mb-4">
            <Card>
            <div >
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                      },
                    }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </div> 
              <CardBody>
               
                <Pie />
              </CardBody>
            </Card>
            </Col>
            <Col  lg={6} md={6} sm={6} xs={12} className="mb-4">
            <Card>
              
              <CardBody>
              <div >
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                      },
                    }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </div> 

                <Pie2 />
            </CardBody>
            </Card>
          </Col>
                
                <Col  lg={4} md={6} sm={6} xs={12} className="mb-4">
                    <Card   style={{backgroundColor: '#7DC2AF', color: '#fff'}}>
                      <CardBody>
                        <CardTitle className="text-capitalize">
                           94%
                        </CardTitle>
                        <CardText>
                          <h3>Patient's</h3>
                          <p>
                            Viral Load test last 12 Months and viral suppressed
                          </p>
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
                        <h3>Female</h3>
                          <p>
                            Viral Load test last 12 Months and viral suppressed
                          </p>
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
                        <h3>Male</h3>
                          <p>
                            Viral Load test last 12 Months and viral suppressed
                          </p>
                        </CardText>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col  lg={12} md={12} sm={12} xs={12} className="mb-4">
                    <Card><CardBody>
                    <Bar />
                    </CardBody></Card>
                  </Col>
                  <br/>
                  <br/>
                  
                  <Col  lg={12} md={12} sm={12} xs={12} className="mb-4">
                  <Card><CardBody>
                     <LineChart />
                  </CardBody></Card>
                  </Col>
                  <Col  lg={12} md={12} sm={12} xs={12} className="mb-4">
                  <Card><CardBody>
                     <CustomHighMap />
                  </CardBody></Card>
                  </Col>
              </Row>

           
        </Col>
      </Row>

      

      

    </div>
  );
}

export default Example;
