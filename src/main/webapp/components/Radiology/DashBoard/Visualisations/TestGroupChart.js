export const testGroup = {

  chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
  },
  title: {
      text: 'LABORATORY TEST GROUP ANALYSIS'
  },
  tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  accessibility: {
      point: {
          valueSuffix: '%'
      }
  },
  plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: false
          },
          showInLegend: true
      }
  },
  series: [{
      name: 'Test Group',
      colorByPoint: true,
      data: [{
          name: 'Chemistry',
          y: 61.41
      }, {
          name: 'Biochemistry',
          y: 11.84
      }, {
          name: 'Haematology',
          y: 10.85
      }, {
          name: 'Microbiology',
          y: 4.67
      }, {
          name: 'Virology',
          y: 4.18
      }, {
          name: 'Other',
          y: 7.05
      }]
  }]
 
}