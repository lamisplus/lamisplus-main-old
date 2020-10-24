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
        html: 'Total Appointment , Attendance and Emergencies',
        style: {
            left: '50px',
            top: '2px',
            color: ( // theme
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color
            ) || 'black'
        }
    }]
},
series: [{
    type: 'column',
    name: 'Appointment',
    data: [3, 2, 1, 3, 4]
}, {
    type: 'column',
    name: 'Attendance',
    data: [2, 3, 5, 7, 6]
}, {
    type: 'column',
    name: 'Emergencies',
    data: [4, 3, 3, 9, 0]
}, ]
};
