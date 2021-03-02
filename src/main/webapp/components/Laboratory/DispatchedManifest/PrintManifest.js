import React from 'react'
import {Card, CardBody,CardHeader,Col,Row,Alert,Table, Form,FormGroup,Label,Input} from 'reactstrap'
import { useState , useEffect} from 'react'
import { TiPrinter } from 'react-icons/ti'
import MatButton from '@material-ui/core/Button'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Dialog } from '@material-ui/core';
import 'react-widgets/dist/css/react-widgets.css'
//Date Picker
import Page from './../../Page'
import {  fetchAllLabTestOrder, samplesManifestById } from '../../../actions/laboratory'
import { useSelector, useDispatch } from 'react-redux';
import LabManifestDetails from 'components/Functions/LabManifestDetails';
import { Spinner } from 'reactstrap';
import { Badge } from 'reactstrap';
import {getQueryParams} from "components/Utils/PageUtils";


const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})


  const PrintManiFest = (props) => {
    const manifestId = getQueryParams("maniFest", props.location.search);
    console.log(props);
    const sampleCollections = props.location.state && props.location.state.formDataObj  ? props.location.state.formDataObj : {};
    const encounterDate = props.location.state && props.location.state.dateEncounter ? props.location.state.dateEncounter : null ;
    const hospitalNumber = props.location.state && props.location.state.hospitalNumber ? props.location.state.hospitalNumber: null;
    
    const testOrders = useSelector(state => state.laboratory.list);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState('')
    const [fetchTestOrders, setFetchTestOrders] = useState(testOrders)
    const classes = useStyles()

    useEffect(() => {
        
        if(props.location.state.encounterId !="" ){         
                setLoading(true);
                    const onSuccess = () => {
                        setLoading(false)
                        
                    }
                    const onError = () => {
                        setLoading(false)     
                    }
            dispatch(fetchAllLabTestOrder(onSuccess,onError ));
           
        }
    }, []); //componentDidMount 

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

    const labTestType = [];    
    
    testOrders.forEach(function(value, index, array) {
        const getList = value['formDataObj']!==null && value['formDataObj'].find(x => { 

            if(x.data && x.data!==null && x.data.manifest_status===1){
            labTestType.push(x);
            }
        
        })         
    });

    //This is function to check for the status of each collection to display on the tablist below 
    const sampleStatus = e =>{
         if(e===2){
            return <p><Badge  color="light">Pending </Badge></p>
        }else if(e==="3"){
            return <p><Badge  color="light">Sample Verified</Badge></p>
        }else if(e==="4"){
            return <p><Badge  color="light">Sample Rejected</Badge></p>
        }else if(e===5){
            return <p><Badge  color="light">Result Available</Badge></p>
        }else{
            return <p>{" "}</p>
        }
    }



return (
    <Page title='PCR Details'>
        <br/>
        <MatButton
            type='submit'
            variant='contained'
            color='primary'
            className={classes.button}                        
            className=" float-right mr-1"
            onClick={() => window.print()}
        >
            <TiPrinter/>{" "} Print
        </MatButton>
       
        <div>
        <Row>
            <Col>
                <div >
                    {!loading ?
                        <LabManifestDetails getpatientdetails={ props.location.state }/>  
                    :
                        <p> <Spinner color="primary" /> Loading Please Wait..</p>
                    }
                </div>
                <br/>
                <Card className="mb-12">
                  <CardHeader>  
                        
                  </CardHeader>
                <CardBody>
                    
                <br />
                    <Row>
                        <Col>
                            <Card body>
                                
                                    <Form >
                                        <Table  striped responsive>
                                            <thead style={{  backgroundColor:'#9F9FA5' }}>
                                                <tr>
                                                    <th>Sample ID</th>
                                                    <th>Test</th>
                                                    <th>Sample Type</th>
                                                    <th>Date Requested</th>
                                                    <th>Status</th>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {!loading ? labTestType.map((row) => (
                                                    row.data!==null?
                                                    <tr key={row.id} style={{ borderBottomColor: '#fff' }}>
                                                      <th className={classes.td}>{row.data.lab_test_id !==null && row.data.lab_test_id !=='' ? row.data.lab_test_id : ''}</th>
                                                     <th className={classes.td}>{row.data.description===""?" ":row.data.description}</th>
                                                      <td className={classes.td}>{row.data.sample_type==="" ? " ":row.data.sample_type}</td>
                                                      <td className={classes.td}> {encounterDate} </td>
                                                      <td className={classes.td}>{sampleStatus(row.data.lab_test_order_status)}  </td>
                                                     
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
        </div>
     
    </Page>
  )
  
}


export default PrintManiFest