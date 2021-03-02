export const testOrders =  {

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
        name: 'Result Avialable',
        data: [3, 4, 4, 2, 5,5],
        stack: 'result'
    }, {
        name: 'Radiology Test Orders',
        data: [2, 5, 6, 2, 1,7],
        stack: 'test'
    }, {
        name: 'Radiology Result Avialable',
        data: [3, 0, 4, 4, 3,8],
        stack: 'result'
    }]
  
  };
