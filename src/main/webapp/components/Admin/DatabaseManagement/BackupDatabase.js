import React, { useState }   from 'react';
import { Modal, ModalHeader, ModalBody,Row,Col,FormGroup,Input,FormFeedback,Label,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import BackupIcon from '@material-ui/icons/Backup';
import Progress from './Progress';

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
    const [uploadPercentage, setUploadPercentage] = useState(0);

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
                  <ModalHeader toggle={props.togglestatus}>Backup Database : LamisPlus</ModalHeader>
                      <ModalBody>
                          <Card>
                            <CardBody>
                                <Row style={{ marginTop: '20px'}}>
                                    <Col sm={12}>
                                        <Alert severity="info">
                                            <AlertTitle>Instructions to Backup Database</AlertTitle>
                                            
                                            <br/>
                                            <strong>NOTE:</strong> The following format is allow  .zip  
                                        </Alert>
                                    </Col>

                                </Row>
                                <br/><br/><br/>
                                <Row>
                                <Col md={12}>
                                    <Button
                                        variant="contained"
                                        color="default"
                                        className={classes.button}
                                        startIcon={<BackupIcon />}
                                        size= "large"
                                        className=" float-right mr-1"
                                    >
                                        Backup
                                    </Button>
                                </Col>
                                <br/>
                                <Col sm={12}>
                                    <Progress percentage={uploadPercentage} />
                                    <br/>
                                    {/* <strong>{installationMessage}</strong> */}
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
                                        hidden='true'
                                        className=" float-right mr-1"
                                        
                                    >
                                        Save 
                                    </MatButton>
                                    <MatButton
                                        variant='contained'
                                        color='default'
                                        onClick={props.togglestatus}
                                        className={classes.button}
                                        hidden='true'
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
