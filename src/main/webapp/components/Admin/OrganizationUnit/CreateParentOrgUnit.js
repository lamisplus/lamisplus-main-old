import React, { useState, useEffect }   from 'react';
import { Modal, ModalHeader, ModalBody,Row,Col,FormGroup,Input,FormFeedback,Label,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import CreateParentOrgUnitByUpload from "./CreateParentOrgUnitByUpload";
import axios from "axios";
import {url} from '../../../api'

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
    const defaultValues = {name:"",id:"" }
    const [formData, setFormData] = useState(defaultValues)
    const [errors, setErrors] = useState({});
    const [modal3, setModal3] = useState(false) //
    const toggleModal3 = () => setModal3(!modal3)
    const [pcrOptions, setOptionPcr] = useState([]);
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

useEffect(() => {
    async function getCharacters() {
        try {
            const response = await axios(
                url + "organisation-units"
            );
            const body = response.data && response.data !==null ? response.data : {};
            
            setOptionPcr(
                 body.map(({ name, id }) => ({ title: name, value: id }))
             );
        } catch (error) {
        }
    }
    getCharacters();
}, []);

const handleInputChange = e => {
    setFormData ({ ...formData, [e.target.name]: e.target.value});
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
                                
                                </Col>
                              </Row>
                                <Row>
                                <Col md={6}>
                                          <FormGroup>
                                              <Label for="">Organisation  Unit</Label>

                                              <Input type="select" name="moduleId" id="moduleId" 
                                                    vaule={formData.id}
                                                    onChange={handleInputChange}
                                                    
                                                  >
                                                        <option> </option>
                                                        {pcrOptions.map(({ title, value }) => (
                                                            
                                                            <option key={value} value={value}>
                                                                {title}
                                                            </option>
                                                        ))}
                                                  </Input>
                                          </FormGroup>
                                      </Col>
                                     
                                  <Col md={6}>
                                    <FormGroup>
                                        <Label for=""> Name</Label>
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
                                  <Col md={6}>
                                    <FormGroup>
                                        <Label for="">Description</Label>
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
