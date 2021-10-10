import Highcharts from 'highcharts';

export const ViralLoadCascade = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Number of Adults and Children in the Viral Load Cascade'
    },
    xAxis: {
        categories: [
            'Eligible',
            'Tested',
            'Suppresed',

        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Number of Individuals'
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
        name: 'Viral Load Cascade',
        data: [49.9, 71.5, 106.4,]

    }]
};