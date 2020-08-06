import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { fetchAllLabTestOrder } from "./../../../actions/laboratory";
import "./../laboratory.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { TiArrowBack } from 'react-icons/ti';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Page from './../../Page';
import { Badge } from 'reactstrap';
import ModalSample from './../Testorders/CollectSampleModal';
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

const PatientSearch = (props) => {
    const [loading, setLoading] = useState('')
    const [modal2, setModal2] = useState(false)//modal to recollect sample
    const toggleModal2 = () => setModal2(!modal2)
    const [modal3, setModal3] = useState(false)//modal to View Result
    const toggleModal3 = () => setModal3(!modal3)
    const [collectModal, setcollectModal] = useState([])//to collect array of datas into the modal and pass it as props
    const classes = useStyles();

    useEffect(() => {
        setLoading('true');
            const onSuccess = () => {
                setLoading(false)
            }
            const onError = () => {
                setLoading(false)     
            }
                props.fetchAllLabTestOrderToday(onSuccess, onError);
    }, []); //componentDidMount

    const labTestType = [];    
    
    props.patientsTestOrderList.forEach(function(value, index, array) {
        const getList = value['formDataObj'].find(x => { 
            //console.log(value)
            if(x.data && x.data!==null && x.data.manifest_status===1){
                console.log(value);
            //return console.log(x)
            labTestType.push(value);
            }
        // return console.log(x)
        
        })         
    });
    // console.log(labTestType);
        
    const [labNum, setlabNum] = useState({lab_number:""})

    let  labNumber = "" //check if that key exist in the array
        props.patientsTestOrderList.forEach(function(value, index, array) {
            if(value['data']!==null &&  value['data'].hasOwnProperty("lab_number")){
                labNumber = value['data'].lab_number
            } 
            //console.log(value['data']) 
          
        });

    function dateDispatched (test){
        const  maxVal = []
            if(test.data!==null){
                
                test.forEach(function(value, index, array) {
                    if(value['data']!==null && value['data'].hasOwnProperty("manifest_status")){
                        //console.log(value['data'])
                        maxVal.push(value['data']);
                    }
                }
                );
                
            }
        return maxVal[0].date_sample_dispatched;
            
    }

    function sampleType (test){
        const  maxVal = []
            if(test.data!==null){
                
                test.forEach(function(value, index, array) {
                    if(value['data']!==null && value['data'].hasOwnProperty("manifest_status")){
                        //console.log(value['data'])
                        maxVal.push(value['data']);
                    }
                }
                );
                
            }
        return maxVal[0].sample_type;
            
    }

    function sampleStatus (test){
        const  maxVal = [];
            if(test.data!==null){            
                test.forEach(function(value, index, array) {
                    if(value['data']!==null && value['data'].hasOwnProperty("manifest_status")){                   
                        if(value['data'].lab_test_order_status==="4"){
                            maxVal.push( <p><Badge  color="light">Sample Rejected</Badge></p>);
                        }else if(value['data'].lab_test_order_status===5){
                            maxVal.push( <p><Badge  color="light">Result Available</Badge></p>);
                        }else{
                            maxVal.push( <p>{" Processing "}</p>);
                        }
                    
                    }
                }
                );
                
            }
        return maxVal;
            
    }

    const handleRecollectSample = (row) => { 
        console.log(row)
        setcollectModal({...collectModal, ...row});
        setModal2(!modal2) 
    }

    const SampleResult = (row) => { 
        console.log(row)
        setcollectModal({...collectModal, ...row});
        setModal3(!modal3) 
    }
    
    function sampleAction (test){
        const  maxVal = [];
            if(test.data!==null){            
                test.forEach(function(value, index, array) {
                    if(value['data']!==null && value['data'].hasOwnProperty("manifest_status")){                   
                        if(value['data'].lab_test_order_status==="4"){
                            maxVal.push( <Tooltip title="View Sample">
                                            <IconButton aria-label="View Sample"  onClick={() => handleRecollectSample(value)}>
                                                <VisibilityIcon color="primary"/>
                                            </IconButton>
                                         </Tooltip>
                                         
                                        );
                        }else if(value['data'].lab_test_order_status===5){
                            maxVal.push(    <Tooltip title="View Result">
                                                <IconButton aria-label="View result"  onClick={() => SampleResult(value)}>
                                                    <VisibilityIcon color="primary"/>
                                                </IconButton>
                                            </Tooltip>
                            
                                        );
                        }else{
                            maxVal.push( <p>{" "}</p>);
                        }
                    
                    }
                }
                );
                
            }
        return maxVal;
            
    }

    
  return (
    <Page title='Dispatched Samples '>
      
      <div>
      <br/>
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
        <br/><br/>
          <MaterialTable
              title="Dispatched samples list"
              columns={[
                  { title: "Patient ID", field: "Id" },
                  {
                    title: "Patient Name",
                    field: "name",
                  },
                  { title: "Date Ordered", field: "dateOrdered", type: "date" , filtering: false},          
                  { title: "Date dispatched", field: "dateDispatched", type: "date" , filtering: false}, 
                  {
                    title: "Sample Type",
                    field: "sampleType",
                    filtering: false
                  },
                  {
                    title: "Status ",
                    field: "sampleStatus",
                    filtering: false
                  },
                  {
                    title: "Action",
                    field: "actions",
                    filtering: false,
                  },
              ]}
              isLoading={loading}
              data={labTestType.map((row) => ({
                  Id: row.patientId,
                  name: row.firstName +  ' ' + row.lastName,
                  dateOrdered: row.dateEncounter,
                  dateDispatched: dateDispatched(row.formDataObj),
                  sampleType: sampleType(row.formDataObj),
                  sampleStatus: sampleStatus(row.formDataObj),
                  actions: sampleAction(row.formDataObj) 
                  
              }))}
              options={{
                  headerStyle: {
                  backgroundColor: "#9F9FA5",
                  color: "#000",
                  margin: "auto"
                  },
                  
                  filtering: true,
                  searchFieldStyle: {
                      width : '300%',
                      margingLeft: '250px',
                  },
                  exportButton: true,
                  searchFieldAlignment: 'left',          
              }}

          />
    </div>
    <ModalSample modalstatus={modal2} togglestatus={toggleModal2} datasample={collectModal}  labnumber={labNumber}/>
    <ModalViewResult modalstatus={modal3} togglestatus={toggleModal3} datasample={collectModal} />

  </Page>
  );
}

const mapStateToProps = state => {
    return {
        patientsTestOrderList: state.laboratory.list
    };
};

const mapActionToProps = {
    fetchAllLabTestOrderToday: fetchAllLabTestOrder
};
  
export default connect(mapStateToProps, mapActionToProps)(PatientSearch);