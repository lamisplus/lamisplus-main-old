import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Row,
  FormGroup,
    Button,
} from 'reactstrap';
import {
  MdRadioButtonChecked,
  MdSearch
} from 'react-icons/md';
import "react-datepicker/dist/react-datepicker.css";
import DateMaterial from 'components/DateTime/Date'
import Page from 'components/Page';
import SearchInput from 'components/SearchBox/SearchInput';
import DataTableList from 'components/DataTable/DataTable';


export default function Appointment(){
  return (
    <Page title="Appoinment">
        <Row >
          <Col>
            <Card className="mb-12">
              <CardHeader>View Appointment
                <Button color="primary" className=" float-right mr-1" >
                        <MdRadioButtonChecked/>  Create Appointment 
                </Button>
              </CardHeader>
              <CardBody>
                    <Form>
                        <Row form >
                            <Col md={3}>
                            <FormGroup>
                                <DateMaterial />
                            </FormGroup>
                            </Col>
                            <Col md={3}>
                            <FormGroup>

                                <DateMaterial />
                            </FormGroup>
                            </Col>
                            <Col md={4} style={{ marginTop: '33px'}}>
                            <FormGroup>
                                <SearchInput />
                            </FormGroup>
                          
                            </Col>
                            <Col md={2} style={{ marginTop: '33px'}}>
                            <FormGroup>
                            <Button color="primary" className=" float-right mr-1" >
                                    <MdSearch/>  Filter Result
                            </Button>
                            </FormGroup>
                            </Col>
                        </Row>
                     </Form>
                      <br/>
                        <Row>
                          <Col>
                            <Card body>
                                <DataTableList />
                            </Card>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
    </Page>
  )
}

