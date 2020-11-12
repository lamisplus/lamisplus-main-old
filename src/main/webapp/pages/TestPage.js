import Page from 'components/Page';
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {basicColumn} from '../components/Highcharts/BasicColumn';
import {columnDrillDown} from './../components/Highcharts/ColumnDrillDown';
import {columnPlacement} from './../components/Highcharts/ColumnPlacement';
import {pieChart} from './../components/Highcharts/PieChart';
import {pieChartWithLegend} from './../components/Highcharts/PieChartWithLegend';
import {dualAxisLineColumn} from './../components/Highcharts/DualAxisLineColumn'
import {barColumnDualAxis} from './../components/Highcharts/BarColumnDualAxis'
import {NigeriaMaps} from './../components/Highcharts/CountryMaps';
import CustomHighMap from './map'

const cardStyle = {
  borderColor: '#fff',
};

const options = {
  title: {
    text: 'My chart'
  },
  series: [{
    data: [1, 10, 3, 10]
  }]
}


var config = {
  chart: {
      type: 'column'
  },
  title: {
      text: 'World\'s largest cities per 2014'
  },
  subtitle: {
      text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
  },
  xAxis: {
      type: 'category',
      labels: {
          rotation: -45,
          style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
          }
      }
  },
  yAxis: {
      min: 0,
      title: {
          text: 'Population (millions)'
      }
  },
  legend: {
      enabled: false
  },
  tooltip: {
      pointFormat: 'Population in 2008: <b>{point.y:.1f} millions</b>'
  },
  series: [{
      name: 'Population',
      data: [
          ['Shanghai', 23.7],
          ['Lagos', 16.1],
          ['Istanbul', 14.2],
          ['Karachi', 14.0],
          ['Mumbai', 12.5],
          ['Moscow', 12.1],
          ['São Paulo', 11.8],
          ['Beijing', 11.7],
          ['Guangzhou', 11.1],
          ['Delhi', 11.1],
          ['Shenzhen', 10.5],
          ['Seoul', 10.4],
          ['Jakarta', 10.0],
          ['Kinshasa', 9.3],
          ['Tianjin', 9.3],
          ['Tokyo', 9.0],
          ['Cairo', 8.9],
          ['Dhaka', 8.9],
          ['Mexico City', 8.9],
          ['Lima', 8.9]
      ],
     
  }]
};

var stackBar = {

  chart: {
      type: 'column'
  },

  title: {
      text: 'Test Orders'
  },

  xAxis: {
      categories: ['Jan.', 'Feburary', 'March', 'April', 'May', 'June']
  },

  yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
          text: 'Tests Ordered'
      }
  },

  tooltip: {
      formatter: function () {
          return '<b>' + this.x + '</b><br/>' +
              this.series.name + ': ' + this.y + '<br/>' +
              'Total: ' + this.point.stackTotal;
      }
  },

  plotOptions: {
      column: {
          stacking: 'normal'
      }
  },

  series: [{
      name: 'Test Ordered',
      data: [5, 3, 4, 7, 2,6],
      stack: 'test'
  }, {
      name: 'Result Avilable',
      data: [3, 4, 4, 2, 5,5],
      stack: 'test'
  }, {
      name: 'Radiology Test Orders',
      data: [2, 5, 6, 2, 1,7],
      stack: 'result'
  }, {
      name: 'Radiology Result Avialable',
      data: [3, 0, 4, 4, 3,8],
      stack: 'result'
  }]

};

class DashboardPage extends React.Component {
  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
  }

  render() {

    return (
      <Page
        className="DashboardPage p-5"
        title="Visualization Page "
      > 

      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
      <div>
        <HighchartsReact options={config} />
      </div>
      <div>
        <HighchartsReact options={stackBar} />
      </div>
      <div>
        <HighchartsReact options={basicColumn} />
      </div>
      <div>
        <HighchartsReact options={columnDrillDown} />
      </div>
      <div>
        <HighchartsReact options={columnPlacement} />
      </div>
      <div>
        <HighchartsReact options={pieChart} />
      </div>
      <div>
        <HighchartsReact options={pieChartWithLegend} />
      </div>
      <div>
        <HighchartsReact options={dualAxisLineColumn} />
      </div>
      <div>
        <HighchartsReact options={barColumnDualAxis} />
      </div>
     
      <div>
        <HighchartsReact options={NigeriaMaps} />
      </div>
      <>
      <CustomHighMap />
      </>
      
      </Page>
    );
  }
}
export default DashboardPage;
