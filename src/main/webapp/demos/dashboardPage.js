import { getColor } from '../utils/colors';
import { randomNum } from '../utils/demos';

const MONTHS = ['January', 'February', 'March', 'April'];

export const genLineData = (moreData = {}, moreData2 = {}) => {
  return {
    labels: MONTHS,
    datasets: [
      {
        label: 'Male',
        backgroundColor: getColor('primary'),
        borderColor: getColor('primary'),
        borderWidth: 1,
        data: [
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),

        ],
        ...moreData,
      },
      {
        label: 'Female',
        backgroundColor: getColor('secondary'),
        borderColor: getColor('secondary'),
        borderWidth: 1,
        data: [
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),
        ],
        ...moreData2,
      },
    ],
  };
  
};

console.log(genLineData);


export const userProgressTableData = [
  {

    name: 'Tom Suliman'

  },
  {
    name: 'Jenny Alex'
  },
  {
    name: 'Simi Adedeji'
  },
  {
    
    name: 'Christine Ada'
  }
  
];

export const chartjs = {

  line: {
    data: {
      labels: ['January', 'February', 'March', 'April'],
      datasets: [
        {
          label: 'Number of Female for the month',
          borderColor: '#6a82fb',
          backgroundColor: '#6a82fb',
          data: [0, 1300, 2200, 3400],
        },

        {
          label: 'Number of Male for the month',
          borderColor: '#fc5c7d',
          backgroundColor: '#fc5c7d',
          data: [0, 1300, 2200, 3400],
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'Total Number of Registered Patients- last 4 months',
      },
      tooltips: {
        intersect: false,
        mode: 'nearest',
      },
      hover: {
        mode: 'index',
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: false,
              labelString: 'Month',
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            stacked: true,
            scaleLabel: {
              display: false,
              labelString: 'Value',
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
  },
};
