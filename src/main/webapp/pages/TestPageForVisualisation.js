import React from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';

// const cubejsApi = cubejs(
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NzQwOTY4MTF9.wwiM9Ea3hBcJfyaWLDXYlLIbL7gZUwNeX3nBnIZ-9q4',
//   { apiUrl: 'https://react-dashboard-demo.cubecloudapp.dev/cubejs-api/v1' },
// );

const API_URL = 'https://react-dashboard.cubecloudapp.dev';
const CUBEJS_TOKEN =
  '52fcb0bc21fe4de49e600892a275305d7aaf4f20ae929ce3011aa64e33f8a372f934d8935c787be114bf5726e905dc807d6fd7afb6180d87289411e20b1dd9f7';

const cubejsApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: `${API_URL}/cubejs-api/v1`,
});


export default () => {
  return (
    <QueryRenderer
      query={{
        measures: ['Stories.count'],
        dimensions: ['Stories.time.month']
      }}
      cubejsApi={cubejsApi}
      render={({ resultSet }) => {
        if (!resultSet) {
          return 'Loading...';
        }

        return (
          <LineChart data={resultSet.rawData()}>
            <XAxis dataKey="Stories.time"/>
            <YAxis/>
            <Line type="monotone" dataKey="Stories.count" stroke="#8884d8"/>
          </LineChart>
        );
      }}
    />
  )
}