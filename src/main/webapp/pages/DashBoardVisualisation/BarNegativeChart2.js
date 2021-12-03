import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);
// Age categories


//var Highcharts  = Highcharts

var options = {
    title: {
        text: 'Total facilities upload weekly'
    },
    xAxis: {
        categories: ['HAN', 'JHPIEGO', 'FHI360', 'CHEMONICS TO1', 'CHEMONICS TO3', 'FHI360-EPIC']
    },
    
    series: [{
        type: 'column',
        name: 'Expected',
        data: [3, 2, 1, 3, 4,6]
    }, {
        type: 'column',
        name: 'Queue',
        data: [2, 3, 5, 7, 6,6]
    }, {
        type: 'column',
        name: 'Processing',
        data: [4, 3, 3, 9, 5,6]
    },
    {
        type: 'column',
        name: 'Completed',
        data: [4, 3, 3, 9, 3,5]
    }]
}


 const Bar = () => {
return (

    <div>
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    </div>
)
}

export default Bar;