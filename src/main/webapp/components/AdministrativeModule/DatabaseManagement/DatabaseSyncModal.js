import React, { useState }   from 'react';
import { Modal, ModalHeader, ModalBody,Row,Col,FormGroup,Input,FormFeedback,Label,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import { DropzoneArea } from 'material-ui-dropzone';
import { Alert, AlertTitle } from '@material-ui/lab';

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



const BackupDatabase = (props) => {
    const classes = useStyles()
    const datasample = props.datasample ? props.datasample : {};
    const [otherfields, setOtherFields] = useState({fileName:""});
    const [errors, setErrors] = useState({});
    const handleOtherFieldInputChange = e => {
      setOtherFields ({ ...otherfields, [e.target.name]: e.target.value });
      //console.log(otherfields)
  }
  const validate = () => {
      let temp = { ...errors }
      temp.fileName = otherfields.fileName ? "" : "This field is required"
      setErrors({
          ...temp
          })    
      return Object.values(temp).every(x => x == "")
}


  return (      
      <div >
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                  <ModalHeader toggle={props.togglestatus}>Sync Database : LamisPlus</ModalHeader>
                      <ModalBody>
                          <Card>
                            <CardBody>
                                <Row style={{ marginTop: '20px'}}>
                                    <Col sm={12}>
                                      <ul>
                                        <li><strong>Total Unsynced Objects : 156 </strong></li>
                                        <li><strong>Estimated Sync Time 20min.</strong></li>
                                      </ul>
                                      <br/>
                                      <p><strong>Are you sure you want to proceed with Sync?</strong></p>
                                    </Col>

                                </Row>
                                <br/><br/><br/>
                                <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="">Server :</Label>
                                        <Input
                                                    type="select"
                                                    name="fileName"
                                                    id="fileName"
                                                    vaule={otherfields.fileName}
                                                    onChange={handleOtherFieldInputChange}
                                                    {...(errors.fileName && { invalid: true})} 
                                                >
                                                      <option value="">Select Server</option>
                                                      <option value="Server 1"> Server 1 </option>
                                                      <option value="Server 2"> Server 2 </option>
                                                      
                                                </Input>
                                                <FormFeedback>{errors.fileName}</FormFeedback>
                                    </FormGroup>
                                </Col>
                                
                                </Row>
                            <br/>
                            <Row>
                                <Col sm={12}>
                                    <MatButton
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        className={classes.button}
                                        
                                        className=" float-right mr-1"
                                        
                                    >
                                        Save 
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
                            </Col>
                            </Row>
                      </CardBody>
                </Card>
          </ModalBody>
      </Modal>
    </div>
  );
}

export default BackupDatabase;
