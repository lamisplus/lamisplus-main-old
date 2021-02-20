import React from 'react'
import {Card, CardBody,CardHeader,Col,Row} from 'reactstrap'
//import { useState , useEffect} from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom';
import MatButton from '@material-ui/core/Button'
import { TiArrowBack} from 'react-icons/ti';
import 'react-widgets/dist/css/react-widgets.css'
//Date Picker
import Page from '../../Page'
import { Alert, AlertTitle } from '@material-ui/lab';
import { DropzoneArea } from 'material-ui-dropzone';
import {MdCompareArrows} from "react-icons/md";


const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})



  const CollectSample = (props) => {

  const classes = useStyles()
   

return (
    <Page >
      
        <Row>
            <Col>
              <h1>Update Module - HST Service Module
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
                    <CardHeader>
                        
                  </CardHeader>
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
                  <Row>
                  <Col sm={12}>
                        <MatButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          startIcon={<MdCompareArrows />}
                        >
                          Upload
                        </MatButton>
                      </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
        </Row>
      
    </Page>
  )
  
}


export default CollectSample