import React, { useState }   from 'react';
import { Modal, ModalHeader, ModalBody,Row,Col,FormGroup,Input,FormFeedback,Label,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import CreateParentOrgUnitByUpload from "./CreateParentOrgUnitByUpload";

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



const CreateParentOrgUnit = (props) => {
    const classes = useStyles()
    const datasample = props.datasample ? props.datasample : {};
    const [otherfields, setOtherFields] = useState({fileName:""});
    const [errors, setErrors] = useState({});
    const [modal3, setModal3] = useState(false) //
    const toggleModal3 = () => setModal3(!modal3)
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

const createUploadBatch = () => {
    props.togglestatus();
    setModal3(!modal3)
}

  return (      
      <div >
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                  <ModalHeader toggle={props.togglestatus}>Create Parent Organization Unit</ModalHeader>
                      <ModalBody>
                          <Card>
                            <CardBody>
                              <br />
                              <Row>
                                  <Col>
                                  <Alert severity="info">
                                    <AlertTitle>Instructions to Batch in more than one record please click the link below</AlertTitle>
                                      <ul>
                                       <a style={{ cursor: 'pointer'}}><li onClick={() => createUploadBatch()}>* Download the template and upload  <strong>(only *.csv)</strong></li></a> 
                                       
                                      </ul>
                                      
                                  </Alert>
                                </Col>
                              </Row>
                                <Row>
                                <Col md={6}>
                                          <FormGroup>
                                              <Label for="">Organisation  Unit</Label>

                                                <Input
                                                    type="select"
                                                    name="sample_transfered_by"
                                                    id="sample_transfered_by"
                                                    vaule={otherfields.sample_transfered_by}
                                                    onChange={handleOtherFieldInputChange}
                                                    {...(errors.sample_transfered_by && { invalid: true})} 
                                                >
                                                      <option value=""></option>
                                                      <option value="Dorcas"> Dorcas </option>
                                                      <option value="Jeph"> Jeph </option>
                                                      <option value="Debora"> Debora </option>
                                                </Input>
                                                    <FormFeedback>{errors.sample_transfered_by}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <Label for="">Organisation  Parent Unit</Label>

                                                <Input
                                                    type="select"
                                                    name="sample_transfered_by"
                                                    id="sample_transfered_by"
                                                    vaule={otherfields.sample_transfered_by}
                                                    onChange={handleOtherFieldInputChange}
                                                    {...(errors.sample_transfered_by && { invalid: true})} 
                                                >
                                                      <option value=""></option>
                                                      <option value=""> Nigeria </option>
                                                      <option value=""> Facilities </option>
                                                      <option value=""> Community </option>
                                                </Input>
                                                    <FormFeedback>{errors.sample_transfered_by}</FormFeedback>
                                          </FormGroup>
                                      </Col>
                                  <Col md={6}>
                                    <FormGroup>
                                        <Label for="">Parent name</Label>
                                              <Input
                                                  type="text"
                                                  name="fileName"
                                                  id="fileName"
                                                  
                                                  value={otherfields.fileName}
                                                  onChange={handleOtherFieldInputChange}
                                                  {...(errors.fileName && { invalid: true})}
                                                  
                                              />
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
      <CreateParentOrgUnitByUpload modalstatus={modal3} togglestatus={toggleModal3}  />
 
    </div>
  );
}

export default CreateParentOrgUnit;
