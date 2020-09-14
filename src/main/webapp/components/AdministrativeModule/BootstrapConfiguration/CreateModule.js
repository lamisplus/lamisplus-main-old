import React from 'react'
import { useState , useEffect} from 'react'
import {Card, CardBody,Col,Row, Form} from 'reactstrap'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom';
import MatButton from '@material-ui/core/Button'
import { TiArrowBack} from 'react-icons/ti';
import 'react-widgets/dist/css/react-widgets.css'
import { connect } from 'react-redux';
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
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import {  MdDelete, MdModeEdit } from "react-icons/md";
import { createBootstrapModule } from '../../../actions/bootstrapModule';
import { installBootstrapModule } from '../../../actions/bootstrapModule';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";

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
  return ['Upload module', 'Install module', 'Start module'];
}






const CreateModule = (props) => {

    const classes = useStyles()
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [fileToUpload, setFileToUpload] = useState({})
    const [uploadResponse, setUploadResponse] = React.useState({})
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [disableNextButtonProcess, setDisableNextButtonProcess] = React.useState(false);
    const [installationMessage, setInstallationMessage] = useState();
    const [installationOverlay, setInstallationOverlay] = useState(false)
    
    const handleNext = async e => {
    //setActiveStep((prevActiveStep) => prevActiveStep + 1);

    if(fileToUpload.length && steps['0']==='Upload module'){
      setDisableNextButtonProcess(true)
      setInstallationMessage('Processing, please wait...')     
      const form_Data = new FormData();
      form_Data.append('file1', fileToUpload[0]); 
      const token ='eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhYmNAbWFpbC5jb20iLCJhdXRoIjoiUk9MRV9BRE1JTiIsImV4cCI6MTYwMDEyNzY5Mn0.a-SMbK3ucT15Kyk9nM_NU1gJveSWnn3OzC4iaVzT8UdKIh6rMvrFuMxdfbGLR5arCCikOCi-PXfdjF5pjQ11Mg'
       
      try {
        const res = await axios.post('https://lp-base.herokuapp.com/api/modules/upload', form_Data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` 
          },
          
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });
      
      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
      setUploadResponse(res.data)
      
      setDisableNextButtonProcess(false) //Enable the next process button for the next stage 
      setInstallationMessage('')
      console.log(uploadResponse)
      setActiveStep((prevActiveStep) => prevActiveStep + 1); //auotmatically move to the next phase of installation in the wizard
    } catch (err) {
      console.log(err)
      // if (err.status === 500) {
      //   setMessage('There was a problem with the server');
      // } else {
      //   setMessage(err);
      // }
    }
    setDisableNextButtonProcess(false)
  }
    
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
    setcollectModal({...collectModal, ...e});
    setModal(!modal) 
  }

  const installModule = (id) => {
    setInstallationOverlay(true)
    setDisableNextButtonProcess(true)
    const onSuccess = () => {
      setInstallationOverlay(false) 
      setDisableNextButtonProcess(false)
    }
    const onError = () => {
      setInstallationOverlay(false)
      setDisableNextButtonProcess(false) 
    }
    props.installBootstrapModule(id, onSuccess, onError);

  }

  const sampleAction = (id) =>{

    return (
      <Menu>
      <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
        Actions <span aria-hidden>▾</span>
      </MenuButton>
          <MenuList style={{ color:"#000 !important"}} >
              <MenuItem  style={{ color:"#000 !important"}} >                      
                
                      <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}} onClick={() => installModule(id)}>Install Module</span>
                                          
                </MenuItem>
                
                <MenuItem style={{ color:"#000 !important"}}>
                      <Link
                          to={{
                            pathname: "/updated-module",
                            currentId: {}
                          }}
                      >
                      <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Update Module </span>                   
                    </Link>
                </MenuItem> 
                <MenuItem  style={{ color:"#000 !important"}} >                      
                
                      <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}}>Deactivate Module</span>
                                          
                </MenuItem>
                <MenuItem  style={{ color:"#000 !important"}} >                      
                
                      <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}}>Delete Module</span>
                                          
                </MenuItem>                                     
                
        </MenuList>
    </Menu>
      )
}

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
                  <Form enctype="multipart/form-data">
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
                        {message ? <Message msg={message} /> : null}
                          <DropzoneArea
                            //onChange={(files) => console.log('Files:', files)}
                            onChange = {(file1) => setFileToUpload(file1)}
                            showFileNames="true"
                            //acceptedFiles={['jar']}
                            maxFileSize ={'100000000'}
  
                          />
                      </Col>  
                      
                    </Row>
                    <Row>
                      <Col sm={12}>
                          <Progress percentage={uploadPercentage} />
                          <br/>
                          <strong>{installationMessage}</strong>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Form> 
        );
      case 1:
        return (
          <>
          <ToastContainer autoClose={3000} hideProgressBar />
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
                <OverlayLoader 
                  color={'red'} // default is white
                  loader="ScaleLoader" // check below for more loaders
                  text="Installing... please wait!" 
                  active={installationOverlay} 
                  backgroundColor={'black'} // default is black
                  opacity=".4" // default is .9  
                >
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
                  {uploadResponse.map((row) => (
                    <tr key={row.id}>
                      <td>{row.name===""?" ":row.name}</td>
                      <td>{row.description===""?" ":row.description}</td>
                      <td>{row.basePackage===""?" ":row.basePackage}</td>
                      <td>{row.version===""?" ":row.version}</td>
                      <td><Badge  color="primary">{row.status===2 ? "Uploaded":"Unploaded"}</Badge></td>
                      <td>{sampleAction(row.id)}</td>
                    </tr>

                  ))
                }
                    
                  </tbody>
                </Table>
              </OverlayLoader>
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
              <h1>New Module
                <Link 
                  to ={{ 
                  pathname: "/bootstrap-configuration",  
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
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={handleNext}
                              disabled= {disableNextButtonProcess }
                              >
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


export default connect(null, { createBootstrapModule, installBootstrapModule })(CreateModule);
