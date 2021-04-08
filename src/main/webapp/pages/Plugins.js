import React from 'react'
import { Button, Card, Header, Icon, Breadcrumb } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import {Col,Row,} from 'reactstrap';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
          margin: theme.spacing(2),
          width: 200,
      },
  },
  Paper: {
      margin: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }));
const Plugins = (props) => {
    const classes = useStyles();

return (
   
    <div spacing={5} style={{ padding: 20 }} >
    <Breadcrumb>
    <Breadcrumb.Section link>Home</Breadcrumb.Section>
    <Breadcrumb.Divider />
    <Breadcrumb.Section link>Plugins</Breadcrumb.Section>
    </Breadcrumb>
    <br/><br/><br/>
    <Grid container >
    
    <br/>
    <Row>
        <Col >
        <Card.Group>
            <Card>
            <Card.Content>
                <Icon
                size='big'
                floated='right'
                name='exchange'
                />
                <Card.Header>
                <Header as='h2' >
                    LIMS
                </Header>
                </Card.Header>
               
                <Card.Description>
                <strong>National EID/VL Laboratory Information System </strong>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Link 
                    to ={{ 
                        pathname: "/sample-list", 
                    }} 
                >
                <Button icon labelPosition='right' color='blue'>
                    Next
                <Icon name='right arrow' />
                </Button>
                </Link>
            </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                <Icon
                    size='big'
                    floated='right'
                    name='exchange'
                    />
                    <Card.Header>
                        <Header as='h2' >
                            NIMS
                        </Header>
                    </Card.Header>
                    
                    <Card.Description>
                    <strong>NiSRN Information Management System</strong>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                <Link 
                    to ={{ 
                        pathname: "/nims-sample-list", 
                    }} 
                >
                    <Button icon labelPosition='right' color='blue'>
                                Next
                            <Icon name='right arrow' />
                    </Button>
                </Link>
                </Card.Content>
                </Card>
                <Card>
                <Card.Content>
                <Icon
                    size='big'
                    floated='right'
                    name='servicestack'
                    />
                    <Card.Header>
                        <Header as='h2' >
                            APPR
                        </Header>
                    </Card.Header>
                    
                    <Card.Description>
                    <strong>APPR Information Management System</strong>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                <Button icon labelPosition='right' color='blue'>
                            Next
                        <Icon name='right arrow' />
                </Button>
                </Card.Content>
                </Card>
                
            </Card.Group>
        </Col>
    </Row>
  </Grid>

  </div>

)
}
export default Plugins