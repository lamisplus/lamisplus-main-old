import React, { useState } from 'react';
import { Dropdown, Icon, Menu } from 'semantic-ui-react'
import {Form,FormFeedback,Row,Col,FormGroup,Label,Input} from 'reactstrap';
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
    <div className={classes.root}>

   
      
      <Menu icon='labeled'>
        <Menu.Item
          name='gamepad'
          active={activeItem === 'gamepad'}
          onClick={handleItemClick}
        >
          <Icon name='upload' />
          Export
        </Menu.Item>

        <Menu.Item>
        
            {/* <SettingsIcon fontSize="large" className={'text-center'}/> */}
            <Icon name='chart bar' />
            <span >Charts</span>
        <Dropdown   >  
                
        <Dropdown.Menu >
            <Dropdown.Item icon='pie chart' text='Pie Chart '  onClick={() => chartPage('pie')} />
            <Dropdown.Item icon='chart bar outline' text='Bar Chart' onClick={() => chartPage('bar')}  />
            <Dropdown.Item icon='chart line' text='Line Chart' onClick={() => chartPage('line')}  />
            <Dropdown.Item icon='area chart' text='Area Chart' onClick={() => chartPage('area')} />
            <Dropdown.Item icon='columns' text='Column Chart' onClick={() => chartPage('column')} />
          </Dropdown.Menu>
        </Dropdown>
        </Menu.Item>

        <Menu.Item>
        
            {/* <SettingsIcon fontSize="large" className={'text-center'}/> */}
            <Icon name='chart bar outline' />
            <span >Other Visuals</span>
        <Dropdown   >  
                
        <Dropdown.Menu >
            <Dropdown.Item icon='chart line' text='Tableu ' />
            <Dropdown.Item icon='globe' text='Power BI ' />
            
          </Dropdown.Menu>
        </Dropdown>
        </Menu.Item>

      </Menu>
      <Card >
      <CardContent>
      <Row style={{ marginTop: '20px'}}>                         
                                    
          <Col md="4">
            <FormGroup>
                <Label>Parameters </Label>
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
      
          <Col md="4">
            <FormGroup>
                <Label>Indicators</Label>
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