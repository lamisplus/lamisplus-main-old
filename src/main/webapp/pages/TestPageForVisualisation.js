import React, { useState } from 'react';
import { Dropdown, Icon, Menu, Button, Breadcrumb} from 'semantic-ui-react';
import {Form,Row,Col,FormGroup,Label,Input} from 'reactstrap';
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {basicColumn} from '../components/Highcharts/BasicColumn';
import {columnDrillDown} from './../components/Highcharts/ColumnDrillDown';
import {columnPlacement} from './../components/Highcharts/ColumnPlacement';
import {pieChart} from './../components/Highcharts/PieChart';
import {pieChartWithLegend} from './../components/Highcharts/PieChartWithLegend';
import {dualAxisLineColumn} from './../components/Highcharts/DualAxisLineColumn'
import {barColumnDualAxis} from './../components/Highcharts/BarColumnDualAxis'

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

  return (
    <div  spacing={5} style={{ padding: 20 }} >



      <Menu icon='labeled'>
        <Menu.Item
          name='gamepad'
          active={activeItem === 'gamepad'}
          onClick={handleItemClick}
          key='dashboard'
        >
          <Icon name='upload' />
         Dashboard
        </Menu.Item>

        <Menu.Item  key='chart'>

            {/* <SettingsIcon fontSize="large" className={'text-center'}/> */}
            <Icon name='chart bar' />
            <span >Generate Charts</span>


        </Menu.Item>

        <Menu.Item  key='list'>

            {/* <SettingsIcon fontSize="large" className={'text-center'}/> */}
            <Icon name='chart bar outline' />
            <span >Charts List</span>
       
        </Menu.Item>

      </Menu>
      <Card >
      <CardContent>
      <Row style={{ marginTop: '20px'}}>

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
                <Label>Data Type </Label>
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
                <Label>Period </Label>
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
                <Label>Org. Level </Label>
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
        <Col md="3">
            <FormGroup>
                <Label>Chart Type </Label>
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
          <Button icon labelPosition='right' color='blue' >
              Generate
          <Icon name='right arrow' />
          </Button>
        </Col>
      </Row>

      <br/>

      {chartValue !=='' && chartValue==='bar' ?
        (
          <div>
            <HighchartsReact options={basicColumn} />
          </div>
        )
       : ""
      }
      {chartValue !=='' && chartValue==='bar' ?
        (
        <div>
          <HighchartsReact options={columnDrillDown} />
        </div>
        )
      : ""
     }

    {chartValue !=='' && chartValue==='pie' ?
        (
        <div>
          <HighchartsReact options={pieChart} />
        </div>
       )
       : ""
    }

    {chartValue !=='' && chartValue==='area' ?
        (
        <div>
          <HighchartsReact options={dualAxisLineColumn} />
        </div>
      )
      : ""
    }
     {chartValue !=='' && chartValue==='line' ?
        (
      <div>
        <HighchartsReact options={barColumnDualAxis} />
      </div>

      )
       : ""
    }
      </CardContent>
      </Card>

    </div>
  );
}

export default Example;
