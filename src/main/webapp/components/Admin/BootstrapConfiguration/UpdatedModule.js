import React from 'react'
import { useState , useEffect} from 'react'
import {Card, CardBody,CardHeader,Col,Row} from 'reactstrap'
//import { useState , useEffect} from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom';
import  LinkRef from '@material-ui/core/Link';
import MatButton from '@material-ui/core/Button'
import { TiArrowBack} from 'react-icons/ti';
import 'react-widgets/dist/css/react-widgets.css'
//Date Picker
import Page from '../../Page'
import { Alert, AlertTitle } from '@material-ui/lab';
import { DropzoneArea } from 'material-ui-dropzone';
import StartModuleModal from './StartModuleModal'
import { Badge } from 'reactstrap';
//Stepper 
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Table } from 'reactstrap';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  container: {
    maxHeight: 440
},
td: { borderBottom :'#fff'}
}));


function getSteps() {
  return ['Select File to upload', 'Load Module', 'Start Module'];
}






const UpdateModule = (props) => {

    const classes = useStyles()
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  const [modal, setModal] = useState(false)//modal to View Result
  const toggleModal = () => setModal(!modal)
  const [collectModal, setcollectModal] = useState([])//

  const startModule = (e) => {  
    console.log('is getting here')
    setcollectModal({...collectModal, ...e});
    setModal(!modal) 
  }


  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          
                  <Card className="mb-12">  
                    <CardBody>                   
                      <br />
                      <Row>
                          <Col>
                              
                                <Alert severity="info">
                                  <AlertTitle>Instructions to add new module</AlertTitle>
                                    <ul>
                                      <li>1. Add file  <strong>(only *.jar)</strong></li>
                                      <li>2. Click proceed</li>
                                    </ul>
                                    <br/>
                                    <strong>NOTE:</strong> Adding, or uploading a module will restart the application, therefore all scheduled task and background processes will be interrupted. 
                                </Alert>
                             
  
                          </Col>
                    
                    </Row>
                    <Row>
                      <Col sm={12}>
                          <DropzoneArea
                            onChange={(files) => console.log('Files:', files)}
                            showFileNames="true"
                            acceptedFiles={['pdf']}
  
                          />
                      </Col>  
                    </Row>
                    
                  </CardBody>
                </Card>
              
        );
      case 1:
        return (
          <>
          <Row>
              <Col>                  
                <Alert severity="info">
                  <AlertTitle>Instructions to add new module</AlertTitle>
                    
                    <br/>
                    <strong>NOTE:</strong> This wizard will lead you step by step through the installation of your module.
                    <br/>
                    <strong>Click Next to continue, or Cancel to exit Setup.</strong> 
                    <br/>
                </Alert>
              </Col>
                  
          </Row>
          <Card className="mb-12">  
          <CardBody>                   
            <br />
            <Row>
                <Col>
                  <Table striped>
                    <thead style={{  backgroundColor:'#9F9FA5' }}>
                    <tr>
                      
                      <th>Module Name</th>
                      <th>Description</th>
                      <th>Author</th>
                      <th>Version</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      
                      <td>HIV</td>
                      <td>HIV</td>
                      <td>Dorcas</td>
                      <td>1.1</td>
                      <td><Badge  color="primary">Loaded</Badge></td>
                      <td></td>
                    </tr>
                    <tr>
                      
                      <td>HTS</td>
                      <td>HTS</td>
                      <td>Debora</td>
                      <td>1.1</td>
                      <td><Badge  color="warning">Unloaded</Badge></td>
                      <td>Load Module</td>
                    </tr>
                    
                  </tbody>
                </Table>
  
                </Col>  
              </Row>
              </CardBody>
            </Card>
          </>
        );
      case 2:
        return (
          <>
            <Alert color="info">
              <Typography className={classes.instructions}>
                <span style={{ fontWeight: 'bold'}}>Starting this module wil restart the application and all scheduled tasked
                and background processes will be interupted. <br/>Do you want to Proceed?</span> 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {/* < MatButton
                    type='submit'
                    variant='contained'
                    //variant="outlined"
                    color="secondary"
                    className={classes.button}   
                    >
                    <FaPowerOff/>{" "} Restart
                </MatButton>  */}
                <br/>
              </Typography>
            </Alert>
              <br/>
              <br/>
          </>
        );
      default:
        return 'Unknown';
    }
  }

return (
    <Page >
      
    
        <Row>
            <Col>
              <h1>Update Module
                <Link 
                  to ={{ 
                  pathname: "/admin-bootstrap-configuration",
                  activetab: 1
                  }} 
                >
                < MatButton
                      type='submit'
                      variant='contained'
                      //variant="outlined"
                      color="default"
                      className={classes.button}                        
                      className=" float-right mr-1"
                  >
                    <TiArrowBack/>{" "} Back
                </MatButton>
                </Link>
                </h1>
                <Card className="mb-12">
                 
                <CardBody>
                   
                <br />
                  
                <div className={classes.root}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    <div>
                      {activeStep === steps.length ? (
                        <div>
                          <Alert color="info">
                          <Typography className={classes.instructions}>All steps completed</Typography>
                          </Alert>
                          <br/>
                          <br/>
                          <Button variant="contained" onClick={handleReset} color="secondary">Reset/Canacel</Button>
                        </div>
                      ) : (
                        <div>
                          <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                          <div>
                            <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              className={classes.backButton}
                              variant="contained"
                            >
                              Previous
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext}>
                              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                </CardBody>
              </Card>
            </Col>
        </Row>
        <StartModuleModal modalstatus={modal} togglestatus={toggleModal} data={collectModal} />
     
    </Page>
  )
  
}


export default UpdateModule