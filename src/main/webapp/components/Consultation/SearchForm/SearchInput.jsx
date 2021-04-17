import React from 'react';
import { Form, Input } from 'reactstrap';
import {Card, CardContent} from '@material-ui/core';

const SearchInput = () => {
  return (

    <Form  className="cr-search-form" onSubmit={e => e.preventDefault()} >
        <Card>
            <CardContent>
                  <Input
                    type="search"
                    placeholder="Search by Patient Name, Hospital Number "
                    className="cr-search-form__input pull-right"
                  />
            </CardContent>
        </Card>
    </Form>


  );
};

export default SearchInput;