export const Sms =   {

chart: {
    type: 'line'
},
title: {
    text: 'No of SMS'
},
subtitle: {
    text: ''
},
xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
},
yAxis: {
    title: {
        text: ''
    }
},
plotOptions: {
    line: {
        dataLabels: {
            enabled: false
        },
        enableMouseTracking: false
    }
},
series: [{
    name: 'SMS',
    data: []
},]
}  