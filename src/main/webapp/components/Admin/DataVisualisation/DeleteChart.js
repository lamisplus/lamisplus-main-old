import React, {useState, useEffect} from 'react';
import { Modal, ModalHeader, ModalBody,Form,
Row,Col, Card,CardBody} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { Alert } from 'reactstrap';
import { Spinner } from 'reactstrap';




const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    input: {
        display: 'none'
    } 
}))


const DeleteChart = (props) => {
    const [loading, setLoading] = useState(false);
    const classes = useStyles()
    const manifestSamples = props.manifestSamples && props.manifestSamples !==null ? props.manifestSamples : {};


    const saveSample = e => {
      e.preventDefault()

           
  }


      
  return (      
      <div >
         
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
              <Form onSubmit={saveSample}>
            <ModalHeader toggle={props.togglestatus}>Delete Chart</ModalHeader>
                <ModalBody>
                    
                        <Card >
                            <CardBody>
                                <Row >
                                    <Col md={12} >
                                        <Alert color="dark" style={{backgroundColor:'#9F9FA5', color:"#000" , fontWeight: 'bolder', fontSize:'14px'}}>
                                            <p style={{marginTop: '.7rem' }}>
                                               Are you Sure, you want to delete Chart :  &nbsp;&nbsp;&nbsp;<span style={{ fontWeight: 'bolder'}}>Chart Title</span>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                               
                                            </p>

                                        </Alert>
                                    </Col>
                                    

                                      
                                                        
                                  </Row>
                                      <br/>
                                      {loading ? <Spinner /> : ""}
                                      <br/>
                                      
                                          <MatButton
                                              type='submit'
                                              variant='contained'
                                              color='primary'
                                              className={classes.button}
                                              startIcon={<SaveIcon />}
                                              disabled={loading}
                                          >   
                                              Yes
                                          </MatButton>
                                           
                                          <MatButton
                                              variant='contained'
                                              color='default'
                                              onClick={props.togglestatus}
                                              className={classes.button}
                                              startIcon={<CancelIcon />}
                                          >
                                              No
                                          </MatButton>
                            </CardBody>
                        </Card> 
                    </ModalBody>
        
                </Form>
      </Modal>
    </div>
  );
}

export default DeleteChart;
