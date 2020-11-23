import React, { useState }   from 'react';
import { Form,Modal, ModalHeader, ModalBody,Row,Col,FormGroup,Input,FormFeedback,Label,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import CreatOrgUnitByUpload from "./CreatOrgUnitByUpload";
import {createOrganisationUnit} from './../../../actions/organizationalUnit'
import { connect } from "react-redux";


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



const CreateOrgUnit = (props) => {
    const classes = useStyles()
    const [otherfields, setOtherFields] = useState({name:""});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [modal3, setModal3] = useState(false) //
    const toggleModal3 = () => setModal3(!modal3)
    const handleOtherFieldInputChange = e => {
      setOtherFields ({ ...otherfields, [e.target.name]: e.target.value });
      //console.log(otherfields)
  }
  const validate = () => {
      let temp = { ...errors }
      temp.name = otherfields.name ? "" : "This field is required"
      setErrors({
          ...temp
          })    
      return Object.values(temp).every(x => x == "")
}

const createUploadBatch = () => {
    console.log('code get here good')
    props.togglestatus();
    setModal3(!modal3)
}
const saveOrgName = (e) => {
    e.preventDefault();
    if (validate()) {
        setLoading(true);        
        const onSuccess = () => {
            setLoading(false);
            props.togglestatus();
        };
        const onError = () => {
            setLoading(false);
            props.togglestatus();
        };
       
        props.createOrganisationUnit(otherfields.name, onSuccess, onError);
    }
};

  return (      
      <div >
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
              <Form onSubmit={saveOrgName}> 
                  <ModalHeader toggle={props.togglestatus}>Create Organization Unit</ModalHeader>
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
                                        <Label for="">Parent name</Label>
                                              <Input
                                                  type="text"
                                                  name="name"
                                                  id="name"
                                                  
                                                  value={otherfields.name}
                                                  onChange={handleOtherFieldInputChange}
                                                  {...(errors.name && { invalid: true})}
                                                  
                                              />
                                                <FormFeedback>{errors.name}</FormFeedback>
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
          </Form>
      </Modal>
      <CreatOrgUnitByUpload modalstatus={modal3} togglestatus={toggleModal3}  />
 
    </div>
  );
}
export default connect(null, { createOrganisationUnit })(
    CreateOrgUnit
);

