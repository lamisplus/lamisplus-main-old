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
        name: 'Result Available',
        data: [4, 3, 3, 9, 0]
    }, ]
}
