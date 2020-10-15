//import React from 'react';
import Highcharts from 'highcharts';

export const combineChart = {
  title: {
    text: 'Combination chart'
},
xAxis: {
    categories: ['Jan.', 'Feb.', 'March', 'April', 'May']
},
labels: {
    items: [{
        html: 'Total Checked In, Checked Out and Emergency Patient',
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
    name: 'Checkin',
    data: [3, 2, 1, 3, 4]
}, {
    type: 'column',
    name: 'Checkout',
    data: [2, 3, 5, 7, 6]
}, {
    type: 'column',
    name: 'Emergency',
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
    name: 'Total Checked In, Checked Out and Emergency Patient',
    data: [{
        name: 'Checkin',
        y: 13,
        color: Highcharts.getOptions().colors[0] // Jane's color
    }, {
        name: 'Checkout',
        y: 23,
        color: Highcharts.getOptions().colors[1] // John's color
    }, {
        name: 'Emergency',
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
};
