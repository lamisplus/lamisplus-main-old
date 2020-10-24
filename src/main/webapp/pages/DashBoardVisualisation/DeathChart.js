//import React from 'react';
import Highcharts from 'highcharts';

export  const deathChart = {
  chart: {
    type: 'spline'
},
title: {
    text: 'Death Rate In 6 Month'
},
subtitle: {
    text: ''
},
xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'
        ]
},
yAxis: {
    title: {
        text: 'Death Rate'
    },
    labels: {
        // formatter: function () {
        //     return this.value + '°';
        // }
    }
},
tooltip: {
    crosshairs: true,
    shared: true
},
plotOptions: {
    spline: {
        // marker: {
        //     radius: 4,
        //     lineColor: '#666666',
        //     lineWidth: 1
        // }
    }
},
series: [{
    name: 'Death',
    // marker: {
    //     symbol: 'square'
    // },
    data: [ 14.5, 18.2, 21.5, 25.2, 6, 18.3]

}]
};
