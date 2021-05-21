export const basicColumn = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Facilities Syncing vs Expected Daily'
        
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [
            'Abia',
            'Akwa Ibom',
            'Sokoto',
            'Cross Rive',
            'Lagos',
            
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Expected',
        data: []
  
    }, {
        name: 'Sync',
        data: []
  
    },  ]
  };
  