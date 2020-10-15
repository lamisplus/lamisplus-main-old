//import React from 'react';
import Highcharts from 'highcharts';
//import HighchartsReact from 'highcharts-react-official';


export const lamisChart = {
  
    title: {
        text: 'Combination chart'
    },
    xAxis: {
        categories: ['Jan.', 'Feb.', 'March.', 'May', 'June']
    },
    labels: {
        items: [{
            html: '',
            style: {
                left: '50px',
                top: '18px',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'black'
            }
        }]
    },
    series: [{
        type: 'column',
        name: 'Samples Rejected',
        data: [3, 2, 1, 3, 4]
    }, {
        type: 'column',
        name: 'Samples Dispatched',
        data: [2, 3, 5, 7, 6]
    }, {
        type: 'column',
        name: 'Samples Result ',
        data: [4, 3, 3, 9, 0]
    }, {
        type: 'spline',
        name: 'Average',
        data: [3, 2.67, 3, 6.33, 3.33],
        marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[3],
            fillColor: 'white'
        }
    }, {
        type: 'pie',
        name: 'Total consumption',
        data: [{
            name: 'Samples Rejected',
            y: 13,
            color: Highcharts.getOptions().colors[0] // Jane's color
        }, {
            name: 'Samples Dispatched',
            y: 23,
            color: Highcharts.getOptions().colors[1] // John's color
        }, {
            name: 'Samples Result',
            y: 19,
            color: Highcharts.getOptions().colors[2] // Joe's color
        }],
        center: [100, 80],
        size: 100,
        showInLegend: false,
        dataLabels: {
            enabled: false
        }
    }]
}
