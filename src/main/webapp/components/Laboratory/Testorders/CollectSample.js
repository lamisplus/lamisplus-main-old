import React from 'react'
import {Card, CardBody,CardHeader,Col,Row,Alert,Table, Form,FormGroup,Label,Input} from 'reactstrap'
import { useState , useEffect} from 'react'
import { TiArrowBack } from 'react-icons/ti'
import MatButton from '@material-ui/core/Button'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import {FaPlusSquare} from 'react-icons/fa';
import {TiArrowForward} from 'react-icons/ti';
import 'react-widgets/dist/css/react-widgets.css'
import { ToastContainer } from "react-toastify";
//Date Picker
import Page from './../../Page'
import {  fetchById } from '../../../actions/patients'
import {  fetchAllLabTestOrderOfPatient } from '../../../actions/laboratory'
import TransferModalConfirmation from './TransferModalConfirmation';
import ModalSampleTransfer from './TransferSampleFormIo';
import SampleCollectionFormIo from './SampleCollectionFormIo'
import { useSelector, useDispatch } from 'react-redux';
import PatientDetailCard from 'components/PatientProfile/PatientDetailCard';
import { Spinner } from 'reactstrap';
import { Badge } from 'reactstrap';
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import ModalViewResult from './../TestResult/ViewResult';
import {authentication} from '../../../_services/authentication';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";



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
    
    const testOrders = useSelector(state => state.laboratory.testorder);
    const sampleCollections = props.location.state && props.location.state.formDataObj  ? props.location.state.formDataObj : {};
    const encounterDate = props.location.state && props.location.state.dateEncounter ? props.location.state.dateEncounter : null ;
    const hospitalNumber = props.location.state && props.location.state.hospitalNumber ? props.location.state.hospitalNumber: null;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState('')
    const [fetchTestOrders, setFetchTestOrders] = useState(sampleCollections)
    const classes = useStyles()
   
    useEffect(() => {
        
        if(props.location.state.encounterId !="" ){         
                setLoading(true);
                    const onSuccess = () => {
                        setLoading(false) 
 
                    }
                    const onError = () => {
                        //setFetchTestOrders(...testOrders)
                        setLoading(false) 

                    }
            dispatch(fetchAllLabTestOrderOfPatient(props.location.state.encounterId,onSuccess,onError ));
            dispatch(fetchById(hospitalNumber,onSuccess,onError));
        }
    }, [props.location.state.encounterId]); //componentDidMount 

        //Get list of test type
        const labTestType = [];
            if(testOrders !== null || testOrders ===""){
                testOrders.forEach(function(value, index, array) {
                    if(value['data']!==null)
                        labTestType.push(value['data'].lab_test_group);
                });
            }

        //Make the list contain unique list of Data 
        const uniqueValues = [...new Set(labTestType)];
        const [modal, setModal] = useState(false) //Modal to collect sample 
        const toggleModal = () => setModal(!modal)
        const [modal2, setModal2] = useState(false)//modal to transfer sample
        const toggleModal2 = () => setModal2(!modal2)
        const [modal4, setModal4] = useState(false)//modal to transfer sample Confirmation
        const toggleModal4 = () => setModal4(!modal4)
        const [modal3, setModal3] = useState(false)//modal to View Result
        const toggleModal3 = () => setModal3(!modal3)
        const [collectModal, setcollectModal] = useState([])//to collect array of datas into the modal and pass it as props
        const [labNum, setlabNum] = useState({lab_number:""})


        let  labNumber = "" //check if that key exist in the array
            testOrders.forEach(function(value, index, array) {
                if(value['data']!==null && value['data'].hasOwnProperty("lab_number")){
                   // setlabNum({lab_number:value['data'].lab_number})
                    if(value['data'].lab_number !== null){
                        labNumber = value['data'].lab_number
                    }
                }               
            });
    const handleLabNumber = e => {
        e.preventDefault();   
            setlabNum({ ...labNum, [e.target.name]: e.target.value })
            labNumber = e.target.value
    }

    const handleSample = (row,dateEncounter) => { 
        setcollectModal({...collectModal, ...row, dateEncounter, hospitalNumber});
        setModal(!modal) 
    }

    const transferSample = (row) => {
        setModal2(!modal2)
        setcollectModal({...collectModal, ...row});
    }
    const transferSampleConfirmation = (row) => {
        setModal4(!modal4)
        setcollectModal({...collectModal, ...row});
    }

    const viewresult = (row) => {  
        setcollectModal({...collectModal, ...row});
        setModal3(!modal3) 
    }

    const getGroup = e => {
        const getValue =e.target.value;
        if(getValue!=='All' || getValue ===null)
        { 
            //const testOrders = fetchTestOrders.length >0 ? fetchTestOrders:{}
            const getNewTestOrder = testOrders.find(x => x.data!==null && x.data.lab_test_group === getValue)
           setFetchTestOrders([getNewTestOrder])
           // testOrders =[...getNewTestOrder] 
        }else{
            setFetchTestOrders(testOrders)
        }
    };
    //This is function to check for the status of each collection to display on the tablist below 
    const sampleStatus = e =>{
        if(e===1){
            return <p><Badge  color="light">Sample Collected</Badge></p>
        }else if(e===2){
            return <p><Badge  color="light">Sample Transfered</Badge></p>
        }else if(e===3){
            return <p><Badge  color="light">Sample Verified</Badge></p>
        }else if(e===4){
            return <p><Badge  color="light">Sample Rejected</Badge></p>
        }else if(e===5){
            return <p><Badge  color="light">Result Available</Badge></p>
        }else{
            return <p>{" "}</p>
        }
    }


    function sampleTypeList (test){
        
        const  maxVal = []
        if (test != null && test.length > 0) {
          for(var i=0; i<test.length; i++){
             
                  if ( test[i].display!==null && test[i].display)
                        console.log(test[i])
                            maxVal.push(test[i].display)
              
          }
        return maxVal.toString();
        }
    }
//This is function to check for the status of each collection to display on the tablist below 
    const sampleAction = (e,dateEncounter) =>{
            if(e.data.lab_test_order_status ===0 || e.data.lab_test_order_status ===null){
                return (  <Menu>
                            <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px"}}>
                                Action <span aria-hidden>▾</span>
                            </MenuButton>
                                <MenuList style={{hover:"#eee"}}>
                                <MenuItem onSelect={() => handleSample(e,dateEncounter)}><FaPlusSquare size="15" style={{color: '#000'}}/>{" "}Collect Sample</MenuItem>
                                </MenuList>
                            </Menu>    
                        )
            }
            if(e.data.lab_test_order_status ===1){
                return (  <Menu>
                            <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px"}}>
                                Action <span aria-hidden>▾</span>
                            </MenuButton>
                                <MenuList style={{hover:"#eee"}}>
                                <MenuItem onSelect={() => transferSampleConfirmation(e)}><TiArrowForward size="15" style={{color: '#000'}}/>{" "} Transfer Sample</MenuItem> 
                                </MenuList>
                            </Menu>    
                        )
            }
            if(e.data.lab_test_order_status===5){
                return (  <Menu>
                            <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px"}}>
                                Action <span aria-hidden>▾</span>
                            </MenuButton>
                                <MenuList style={{hover:"#eee"}}>
                                <MenuItem onSelect={() => viewresult(e,dateEncounter)}><FaPlusSquare size="15" style={{color: '#000'}}/>{" "}View Result</MenuItem>
                                </MenuList>
                            </Menu>    
                        )
            }
  }

return (
    <div>
      
     <Card body>
         <CardBody>
        <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" 
                to={{pathname: "/laboratory",
                state: 'collect-sample'
                }} 
            >
                    Laboratory
            </Link>
           
            <Typography color="textPrimary">Sample Collection  </Typography>
            
         </Breadcrumbs>
        <br/>    
        <br/>
        <Row>
            <Col>
                <div >
                    {!loading ?
                        <PatientDetailCard getpatientdetails={ props.location.state }/>  
                    :
                        <p> <Spinner color="primary" /> Loading Please Wait..</p>
                    }
                </div>
                <br/>
                <Card className="mb-12">
                    <CardHeader> <span style={{  textTransform: 'capitalize'}}>Test Order Details </span>
                        <Link 
                            to ={{ 
                              pathname: "/laboratory",  
                              state: 'collect-sample'
                            }} 
                        >
                                
                            <MatButton
                                type='submit'
                                variant='contained'
                                color='primary'
                                className={classes.button}                        
                                className=" float-right mr-1"
                            >
                                <TiArrowBack/>{" "} Back
                            </MatButton>
                      
                        </Link>
                  </CardHeader>
                <CardBody>
                    <Alert color="primary">
                        Please make sure you enter Lab number before collecting sample 
                    </Alert>
                <br />
                    <Row>
                        <Col>
                            <Card body>
                                <Row form>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="occupation">Lab Test Group </Label>

                                                <Input
                                                  type="select"
                                                  name="testgroup"
                                                  id="testgroup"
                                                  onChange={getGroup}
                                                >
                                                   <option value="All"> All </option>
                                                    {
                                                      uniqueValues.map(x => 
                                                        <option key={x} value={x}>
                                                          {x}
                                                        </option>
                                                    )}
                                                    
                                              </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col md={3} className='float-right mr-1'>
                                        {/* {labNum['lab_number']==="" ? */}
                                        <FormGroup>
                                            <Label for="occupation">Lab Number </Label>
                                        <Input
                                            type='text'
                                            name='lab_number'
                                            id='lab_number'
                                            value={labNumber!=="" ? labNumber : labNum.lab_number}
                                            onChange={handleLabNumber}
                                            disabled={labNumber && labNum.lab_number ? 'true' : ''}
                                        />
                                        </FormGroup>                            
                                    </Col>
                                </Row>
                                    <Form >
                                        <Table  striped responsive>
                                            <thead style={{  backgroundColor:'#9F9FA5' }}>
                                                <tr>
                                                    <th>Test</th>
                                                    <th>Sample Type</th>
                                                    <th>Date Requested</th>
                                                    <th >Status</th>
                                                    <th ></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {!loading ? fetchTestOrders.map((row) => (
                                                    row.data!==null?
                                                    <tr key={row.id} style={{ borderBottomColor: '#fff' }}>
                                                      <th className={classes.td}>{row.data.description===""?" ":row.data.description}</th>
                                                      <td className={classes.td}>{sampleTypeList(row.data && row.data.sample_type!==null ? row.data.sample_type : null)}</td>
                                                      <td className={classes.td}> {encounterDate} </td>
                                                      <td className={classes.td}>{sampleStatus(row.data.lab_test_order_status)}  </td>
                                                      <td className={classes.td} hidden={authentication && !authentication.userHasRole(["laboratory_write"])} >{sampleAction(row,encounterDate)}</td>
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
        </CardBody>
    </Card>
    {modal || modal2  || modal3 || modal4 ? 
      (
        <>
            <SampleCollectionFormIo modalstatus={modal} togglestatus={toggleModal} datasample={collectModal} labnumber={labNumber !=="" ? labNumber : labNum['lab_number'] }/>
            <ModalSampleTransfer modalstatus={modal2} togglestatus={toggleModal2} datasample={collectModal} labnumber={labNumber!=="" ? labNumber : labNum}/>
            <ModalViewResult modalstatus={modal3} togglestatus={toggleModal3} datasample={collectModal} />
            <TransferModalConfirmation modalstatus={modal4} togglestatusConfirmation={toggleModal4} datasample={collectModal} actionButton={transferSample} labnumber={labNumber!=="" ? labNumber : labNum}/>
       </>
      ) 
      : ""
      } 
     
   
    </div>
  )  
}

export default CollectSample