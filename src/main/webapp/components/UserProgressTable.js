import React from 'react';
import PropTypes from 'utils/propTypes';
import { Table, Badge } from 'reactstrap';



const UserProgressTable = ({ headers, usersData, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize ">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.map(({ name}, index) => (
          <tr key={index}>
            
            
            <td className="text-primary">{name}</td>
            <td className="align-middle text-center">
              <Badge color="success"></Badge>
            </td>

          </tr>
        ))}
      </tbody>
    </Table>
  );
};

UserProgressTable.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
};

UserProgressTable.defaultProps = {
  headers: [],
  usersData: [],
};

export default UserProgressTable;
