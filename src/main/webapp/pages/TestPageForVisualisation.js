import React from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';

// const cubejsApi = cubejs(
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NzQwOTY4MTF9.wwiM9Ea3hBcJfyaWLDXYlLIbL7gZUwNeX3nBnIZ-9q4',
//   { apiUrl: 'https://react-dashboard-demo.cubecloudapp.dev/cubejs-api/v1' },
// );

// const API_URL = 'http://localhost:4000';
// const CUBEJS_TOKEN =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc1MDU1MTIsImV4cCI6MTYwNzU5MTkxMn0.qKLZbJUwVqPBvBGDlDNQt5Lf3MZz_KZEQUMwJMMNfuc';

// const cubejsApi = cubejs(CUBEJS_TOKEN, {
//   apiUrl: `${API_URL}/cubejs-api/v1`,
// });
const cubejsApi = cubejs(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc1MDU1MTIsImV4cCI6MTYwNzU5MTkxMn0.qKLZbJUwVqPBvBGDlDNQt5Lf3MZz_KZEQUMwJMMNfuc`);

export default () => {
  return (
    <QueryRenderer
      query={{
        measures: ['Orders.count'],
        dimensions: ['Orders.time.month']
      }}
      cubejsApi={cubejsApi}
      render={({ resultSet }) => {
        console.log(resultSet)
        if (!resultSet) {
          return 'Loading...';
        }

        return (
          <LineChart data={resultSet.rawData()}>
            <XAxis dataKey="Orders.time"/>
            <YAxis/>
            <Line type="monotone" dataKey="Orders.count" stroke="#8884d8"/>
          </LineChart>
        );
      }}
    />
    
  )
}

