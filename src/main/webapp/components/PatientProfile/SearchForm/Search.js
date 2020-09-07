import React from 'react';
import { Form, Input } from 'reactstrap';
import {Card, CardContent} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})(props => <Checkbox color="default" {...props} />);

const SearchInput = () => {
  const [state, setState] = React.useState({
    checkedG: false,
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };


  return (

    <Form  className="cr-search-form" onSubmit={e => e.preventDefault()} >
        <Card>
            <CardContent>
                  <Input
                    type="search"
                    placeholder="Search by Patient Name, Hospital Number "
                    className="cr-search-form__input pull-right"
                  />
                  <FormControlLabel
                    control={
                      <GreenCheckbox
                        checked={state.checkedG}
                        onChange={handleChange('checkedG')}
                        value="checkedG"
                      />
                    }
                    label="Only Referred Patients"
                  />
            </CardContent>
        </Card>
    </Form>


  );
};

export default SearchInput;