import React from 'react'
import {Card, CardBody,CardHeader,Col,Row,Alert,Table, Form,FormGroup,Label,Input} from 'reactstrap'
import { useState , useEffect} from 'react'
import { TiPrinter,TiArrowBack, TiPlusOutline } from 'react-icons/ti'
import MatButton from '@material-ui/core/Button'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import 'react-widgets/dist/css/react-widgets.css'
//Date Picker
import Page from './../../Page'
import {  samplesManifestById } from '../../../actions/laboratory'
import { useSelector, useDispatch } from 'react-redux';
import LabManifestDetails from 'components/Functions/LabManifestDetails';
import { Spinner } from 'reactstrap';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import AddSample from "./AddSample";
import {authentication} from '../../../_services/authentication';



const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})


  const ViewPrintManifest = (props) => {
    const samplesDispatched = props.location.state  ? props.location.state : {};
    const manifestId = samplesDispatched.manifestId ? samplesDispatched.manifestId : null ;
    const sampleManifestList = useSelector(state => state.laboratory.samplesmanifest);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [collectManifest, setcollectManifest] = useState([])
    const [modal2, setModal2] = useState(false) //Modal  
    const toggleModal2 = () => setModal2(!modal2)

    const classes = useStyles()

    useEffect(() => {        
        if(manifestId){         
                setLoading(true);
                    const onSuccess = () => {
                        setLoading(false)
                        
                    }
                    const onError = () => {
                        setLoading(false)     
                    }
                dispatch(samplesManifestById(manifestId,onSuccess,onError));
           
        }
    }, []); //componentDidMount 

    //This is function to check for the status of each collection to display on the tablist below 
    const sampleStatus = e =>{
         if(e===null || e===""){
            return <p><Badge  color="light">Pending </Badge></p>
        }else if(e==="3"){
        return <p><Badge  color="light">{e}</Badge></p>
        }else{
            return <p>{" "}</p>
        }
    }
  
      const AddSampleToManifest = (samplesDispatched) => { 
        setcollectManifest({...collectManifest, ...samplesDispatched}); 
        setModal2(!modal2) 
      }


return (
    <Page title='Samples Manifest'>
        <Row>
          <Col>
            
              <Link 
                to ={{ 
                pathname: "/dispatched-sample",  
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
                
          </Col>
        </Row>
        <div>
        <Row>
            <Col>
            
                <div >
                   
                        <LabManifestDetails manifestDetail={ samplesDispatched }/>  
                    
                </div>
                <br/>
                <Card className="mb-12">
                  <CardHeader>  
                        
                  </CardHeader>
                <CardBody>
                 
                    <Row>
                        <Col>
                        <Row>
                          <Col sm={12} className=" float-right mr-1">
                            <Link
                                // to={{
                                //   pathname: "/print-dispatched-manifest",
                                //   ManifestDetail: {samplesDispatched}
                                // }}
                                to ={"/print-dispatched-manifest?maniFest="+manifestId}
                            >
                              <MatButton
                                type='submit'
                                variant='contained'
                                color='primary'
                                className={classes.button}                        
                                className=" float-right mr-1"
                                
                                >
                                  <TiPrinter/>{" "} Print
                              </MatButton>
                            </Link>
                            
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            < MatButton
                                  type='submit'
                                  variant='contained'
                                  //variant="outlined"
                                  color="primary"         
                                  className=" float-right mr-1"
                                  onClick={() => AddSampleToManifest(samplesDispatched)}
                                  disabled={!authentication.userHasRole(["laboratory_write"])}
                              >
                                <TiPlusOutline/>{" "} Add Sample
                            </MatButton>
                            </Col>
                            </Row>
                            <Card body>
                                
                                    <Form >
                                        <Table  striped responsive>
                                            <thead style={{  backgroundColor:'#9F9FA5' }}>
                                                <tr>
                                                    <th>Hospital Number</th>
                                                    <th>Patient Name </th>
                                                    <th>Sample Type</th>
                                                    <th>Date Dispatched</th>
                                                    <th>Lab Order Priority</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {console.log(sampleManifestList)}
                                                {!loading ? sampleManifestList.map((row) => (
                                                    row!==null?
                                                    <tr key={row.id} style={{ borderBottomColor: '#fff' }}>
                                                      <th className={classes.td}>{row.manifestId !==null && row.clientId !=='' ? row.clientId : ''}</th>
                                                      <td className={classes.td}> {row.firstName!==null && row.surname!=null ? row.firstName + " " + row.surname : ""} </td>
                                                      <th className={classes.td}>{row.sampleType===""?" ":row.sampleType}</th>
                                                      <td className={classes.td}>{row.dateSampleDispatched==="" ? " ":row.dateSampleDispatched}</td>
                                                      <td className={classes.td}> {row.labOrderPriority} </td>
                                                      <td className={classes.td}>{sampleStatus(row.testResult)}  </td>
                                                      <td className={classes.td}> {} </td>
                                                    </tr>
                                                    :
                                                    <tr></tr>
                                                  ))
                                                  :<p> <Spinner color="primary" /> Loading Please Wait</p>
                                                } 
                                            </tbody>
                                        </Table>
                                        <br />
                                  
                                    </Form>
                                
                              </Card>
                        </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
        </Row>
        <AddSample modalstatus={modal2} togglestatus={toggleModal2} manifestSamples={collectManifest}/>
        </div>
        
    </Page>
  )
  
}


export default ViewPrintManifest