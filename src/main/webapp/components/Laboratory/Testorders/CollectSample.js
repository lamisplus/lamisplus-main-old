import React from 'react'
import {Card, CardBody,CardHeader,Col,Row,Alert,Table, Form,FormGroup,Label,Input} from 'reactstrap'
import { useState , useEffect} from 'react'
import { TiArrowBack } from 'react-icons/ti'
import MatButton from '@material-ui/core/Button'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import {FaPlusSquare, FaRegEye} from 'react-icons/fa';
import {TiArrowForward} from 'react-icons/ti';
import 'react-widgets/dist/css/react-widgets.css'
//Date Picker
import Page from './../../Page'
import {  fetchById } from '../../../actions/patients'
import {  fetchAllLabTestOrderOfPatient } from '../../../actions/laboratory'
import ModalSample from './CollectSampleModal';
import ModalSampleTransfer from './TransferSampleModal';
import { useSelector, useDispatch } from 'react-redux';
import PatientDetailCard from 'components/Functions/PatientDetailCard';
import { Spinner } from 'reactstrap';
import { Badge } from 'reactstrap';
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import ModalViewResult from './../TestResult/ViewResult';



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
    const sampleCollections = props.location.state && props.location.state.formDataObj  ? props.location.state.formDataObj : {};
    const encounterDate = props.location.state && props.location.state.dateEncounter ? props.location.state.dateEncounter : null ;
    const hospitalNumber = props.location.state && props.location.state.hospitalNumber ? props.location.state.hospitalNumber: null;
    console.log()
    const testOrders = useSelector(state => state.laboratory.testorder);
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
                        setLoading(false)     
                    }
            dispatch(fetchAllLabTestOrderOfPatient(props.location.state.encounterId,onSuccess,onError ));
            dispatch(fetchById(hospitalNumber,onSuccess,onError));
        }
    }, []); //componentDidMount 

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
        const [modal3, setModal3] = useState(false)//modal to View Result
        const toggleModal3 = () => setModal3(!modal3)
        const [collectModal, setcollectModal] = useState([])//to collect array of datas into the modal and pass it as props
        const [labNum, setlabNum] = useState({lab_number:""})


        let  labNumber = "" //check if that key exist in the array
            testOrders.forEach(function(value, index, array) {
                if(value['data']!==null && value['data'].hasOwnProperty("lab_number")){
                    labNumber = value['data'].lab_number
                } 
                //console.log(value['data']) 
              
            });
          

    const handleLabNumber = e => {
        e.preventDefault();   
            setlabNum({ ...labNum, [e.target.name]: e.target.value })
    }

    const handleSample = (row,dateEncounter) => { 
        setcollectModal({...collectModal, ...row, dateEncounter, hospitalNumber});
        setModal(!modal) 
        console.log()
    }

    const transferSample = (row) => {
        setModal2(!modal2)
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
            console.log(getValue)
            //const testOrders = fetchTestOrders.length >0 ? fetchTestOrders:{}
            const getNewTestOrder = testOrders.find(x => x.data!==null && x.data.lab_test_group === getValue)
            setFetchTestOrders([getNewTestOrder]) 
            console.log(fetchTestOrders)
        }else{
            setFetchTestOrders([...sampleCollections])
        }
    };
    //This is function to check for the status of each collection to display on the tablist below 
    const sampleStatus = e =>{
        if(e===1){
            return <p><Badge  color="light">Sample Collected</Badge></p>
        }else if(e===2){
            return <p><Badge  color="light">Sample Transfered</Badge></p>
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

//This is function to check for the status of each collection to display on the tablist below 
    const sampleAction = (e,dateEncounter) =>{
    
        return (
            <Menu>
                <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px"}}>
                    Action <span aria-hidden>▾</span>
                </MenuButton>
                    <MenuList style={{hover:"#eee"}}>
                            { e.data.lab_test_order_status!==5 ?
                                <MenuItem onSelect={() => handleSample(e,dateEncounter)}><FaPlusSquare size="15" style={{color: '#000'}}/>{" "}Collect Sample</MenuItem>
                                :""
                            }
                            { e.data.lab_test_order_status!==5 ?
                                <MenuItem onSelect={() => transferSample(e)}><TiArrowForward size="15" style={{color: '#000'}}/>{" "} Transfer Sample</MenuItem>             
                                :""
                            }
                            { e.data.lab_test_order_status===5 ?
                                <MenuItem onSelect={() => viewresult(e)}><FaRegEye size="15" style={{color: '#3F51B5'}}/>{" "}View Result</MenuItem>
                                :""
                            }  
                    </MenuList>
            </Menu>
          )
  }


return (
    <Page title='Collect Sample'>
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
                    <CardHeader>Test Order Details 
                        <Link 
                            to ={{ 
                              pathname: "/laboratory",  
                              activetab: 1
                            }} >
                    
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
                        Please make sure you enter Lab number before collecting sample {console.log(labNum)}
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
                                                    <option value=""> </option>
                                                    {
                                                      uniqueValues.map(x => 
                                                        <option key={x} value={x}>
                                                          {x}
                                                        </option>
                                                    )}
                                                    <option value="All"> All </option>
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
                                                    <th>Status</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {console.log(fetchTestOrders)}
                                                {!loading ? fetchTestOrders.map((row) => (
                                                    row.data!==null?
                                                    <tr key={row.id} style={{ borderBottomColor: '#fff' }}>
                                                      <th className={classes.td}>{row.data.description===""?" ":row.data.description}</th>
                                                      <td className={classes.td}>{row.data.sample_type==="" ? " ":row.data.sample_type}</td>
                                                      <td className={classes.td}> {encounterDate} </td>
                                                      <td className={classes.td}>{sampleStatus(row.data.lab_test_order_status)}  </td>
                                                      <td className={classes.td}>{sampleAction(row,encounterDate)}</td>
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
      <ModalSample modalstatus={modal} togglestatus={toggleModal} datasample={collectModal}  labnumber={labNum}/>
      <ModalSampleTransfer modalstatus={modal2} togglestatus={toggleModal2} datasample={collectModal} labnumber={labNum}/>
      <ModalViewResult modalstatus={modal3} togglestatus={toggleModal3} datasample={collectModal} />

    </Page>
  )
  
}


export default CollectSample