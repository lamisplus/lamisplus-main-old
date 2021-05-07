import React, { useState }   from 'react';
import { Modal, ModalHeader, ModalBody,Row,Col,FormGroup,Label,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { deActivateBootstrapModule } from '../../../actions/bootstrapModule';
import { connect, useDispatch } from 'react-redux';


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



const DeleteModule = (props) => {
    const classes = useStyles()
    const datasample = props.datasample ? props.datasample : {};


    const deActiveModule = () => {
        const onError = () => {
        }
        const onSuccess = () => {

        }
        datasample['status'] =3
        props.datasample['status'] =3
        props.deActivateBootstrapModule(datasample.id, onSuccess, onError);
        props.togglestatus()
        //props.history.push(`/admin-bootstrap-configuration`)
    }

    console.log(datasample)

  return (      
      <div >
          {/* <ModalViewResult ref={componentRef} /> */}
          
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                  <ModalHeader toggle={props.togglestatus}>Deactivate Module</ModalHeader>
                      <ModalBody>
                          <Card>
                            <CardBody>
                                <Row style={{ marginTop: '20px'}}>
                                    <Col xs="12">
                                        <span style={{ fontWeight: 'bold'}}>Are you sure you want to Deactivate the {datasample.description } module</span>
                                        <br/>
                                    </Col>
                                    <br/>
                                    
                                    <br/>
                                </Row>
                            <br/>
                            <MatButton
                                type='submit'
                                variant='contained'
                                color='primary'
                                className={classes.button}
                                onClick={()=> deActiveModule()}
                                className=" float-right mr-1"
                                
                            >
                                Deactivate 
                            </MatButton>
                            <MatButton
                              variant='contained'
                              color='default'
                              onClick={props.togglestatus}
                              className={classes.button}
                             
                              className=" float-right mr-1"
                            >
                              Cancel
                            </MatButton>
                      </CardBody>
                </Card>
          </ModalBody>
      </Modal>
    </div>
  );
}

const mapStateToProps = state => {
    return {
        moduleLists: state.boostrapmodule.moduleList
    };
  }; 
  
  export default connect(mapStateToProps, {deActivateBootstrapModule })(DeleteModule);
  