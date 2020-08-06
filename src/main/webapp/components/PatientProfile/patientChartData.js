import { getColor } from '../../utils/colors';
import { randomNum } from '../../utils/demos';

const MONTHS = ['January', 'February', 'March', 'April'];

export const ViralLoad = ( data = [], otherOptions = {}) => {
  return {
    labels: MONTHS,
    datasets: [
      {
        label: 'Viral Load',
        backgroundColor: getColor('primary'),
        borderColor: getColor('primary'),
        borderWidth: 1,
        data: [
          randomNum(),
          randomNum(),
          randomNum(),
          randomNum(),

        ],
        ...otherOptions,
      }
    ],
  };
  
};



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

export const Weight = (labels = [], data = [], otherOptions = {}) => {
    return {
      labels: labels,
      datasets: [
        {
          label: 'Weight',
          backgroundColor: getColor('primary'),
          borderColor: getColor('primary'),
          borderWidth: 1,
          data: data,
          ...otherOptions,
        }
      ],
    };
    
  };

  
  export const BloodPressure = (labels = [],systolic=[], diastolic=[], systolicOptions = {}, diastolicOptions = {}) => {
    return {
      labels: labels,
      datasets: [
        {
          label: 'Systolic(mmHg)',
          backgroundColor: getColor('primary'),
          borderColor: getColor('primary'),
          borderWidth: 1,
          data: systolic,
          ...systolicOptions,
        }, {
            label: 'Diastolic(mmHg)',
            backgroundColor: getColor('secondary'),
            borderColor: getColor('secondary'),
            borderWidth: 1,
            data: diastolic,
            ...diastolicOptions,
          },
      ],
    };
    
  };