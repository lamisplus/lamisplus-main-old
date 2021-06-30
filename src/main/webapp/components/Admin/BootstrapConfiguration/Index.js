import React from 'react'
import {Card, CardBody,CardHeader,Col,Row} from 'reactstrap'
import { useState, useEffect} from 'react'
import { TiPlus } from 'react-icons/ti'
import MatButton from '@material-ui/core/Button'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import 'react-widgets/dist/css/react-widgets.css'
//Date Picker
import Page from '../../Page'
//import { Spinner } from 'reactstrap';
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import MaterialTable from 'material-table';
import {  MdDelete, MdModeEdit } from "react-icons/md";
import {  GrDocumentUpdate } from "react-icons/gr";
import {  FaSyncAlt } from "react-icons/fa";
import DeleteModule from "./DeleteModule";
import ActivateModule from './ActivateModule'
import { useSelector, useDispatch } from 'react-redux';
import {  fetchAllBootstrapModule } from '../../../actions/bootstrapModule';
import { Badge } from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})





  const BootstrapConfiguration = (props) => {
    const [collectModal, setcollectModal] = useState([])
    const [modal, setModal] = useState(false) //Modal 
    const toggleModal = () => setModal(!modal)
    const [modal2, setModal2] = useState(false) //Modal to collect sample 
    const toggleModal2 = () => setModal2(!modal2)
    const classes = useStyles()
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch();
    const listOfAllModule = useSelector(state => state.boostrapmodule.list);
    const [installationOverlay, setInstallationOverlay] = useState('true')
    useEffect(() => {
      setLoading(true);
      const onSuccess = () => {
          setLoading(false)
          
      }
      const onError = () => {
          setLoading(false)     
      }
        const fetchAllModule = dispatch(fetchAllBootstrapModule(onSuccess,onError ));

  }, []); //componentDidMount


  const deleteModule = (row) => {  
    setcollectModal({...collectModal, ...row});
    setModal(!modal) 
  }

  const activateModule = (row) => {  
    setcollectModal({...collectModal, ...row});
    setModal2(!modal2) 
  }
  const installModule = (moduleID) => {
    
    setInstallationOverlay('true')
    console.log(moduleID, "the code get here ")

  }
  console.log(installationOverlay)
  const actionOnModules = (e) =>{
    
    return (
      <Menu>
      <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
        Actions <span aria-hidden>▾</span>
      </MenuButton>
        
          <MenuList style={{ color:"#000 !important"}} >
           
             {e.status === 2 ?
              <>
                <MenuItem style={{ color:"#000 !important"}}>
                      <Link
                          to={{
                            pathname: "/admin-bootstrap-configuration-create-module",
                            ModuleDetail: e
                          }}
                      >
                        <GrDocumentUpdate size="15" color="blue" />{" "}<span style={{color: '#000'}}>Update  </span>                   
                      </Link>
                </MenuItem>
                <MenuItem  style={{ color:"#000 !important"}} onSelect={() => deleteModule(e)}>                      
                  <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}}>Deactivate</span>
                 </MenuItem>
                 
                </>
                 : "" 
              } 
              {e.status === 3 ?
              <>
               
                <MenuItem  style={{ color:"#000 !important"}} onSelect={() => activateModule(e)}>                      
                  <FaSyncAlt size="15" color="blue" />{" "}<span style={{color: '#000'}}>Activate</span>
                 </MenuItem>
                 
                </>
                 : "" 
              }                                   
                
        </MenuList>
       </Menu>
      )
}
const moduleStatus = e =>{
  if(e===1){
      return <p><Badge  color="info">Uploaded</Badge></p>
  }else if(e===2){
      return <p><Badge  color="light">installed</Badge></p>
  }else if(e===3){
    return <p><Badge  color="warning">Deactivated</Badge></p>
  }
  else{
      return <p>{" "}</p>
  }
}   

return (
    <React.Fragment>
       <ToastContainer autoClose={3000} hideProgressBar />
          <Card body>
              <Breadcrumbs aria-label="breadcrumb">
                  <Link color="inherit" to ={{
                      pathname: "/admin",
                      activetab: 1
                  }}  >
                      Admin
                  </Link>
                  <Typography color="textPrimary">Bootstrap Configuration</Typography>
              </Breadcrumbs>

          <Link 
              to ={{ 
                pathname: "/admin-bootstrap-configuration-create-module",
                ModuleDetail: ""
              }} 
            >
              <MatButton
                type='submit'
                variant='contained'
                color='primary'
                className={classes.button}                        
                className=" float-right mr-1"
              >
                <TiPlus/>{" "} New Module
              </MatButton>
          </Link>
        
          <MaterialTable
          icons={tableIcons}

            title="List Of Bootstrap Module"
            columns={[
              { title: 'Module Name', field: 'name' },
              { title: 'Description', field: 'description' },
              {title: 'Version',field: 'version', type: 'numeric'},
              { title: 'Date Created', field: 'date', type: 'date' },
              { title: 'Status', field: 'status'},
              { title: 'Action', field: 'actions'},
            ]}
            isLoading={loading}
            data={listOfAllModule.map((row) => ({
                  name: row.name, 
                  description: row.description,  
                  version: row.version,
                  date: row.buildTime, 
                  status:moduleStatus(row.status),
                  actions: actionOnModules(row)   
            }))}      
            options={{
              headerStyle: {
                backgroundColor: "#9F9FA5",
                color: "#000",
                margin: "auto"
                },
              filtering: true
            }}
          /> 
          
          </Card>

       <DeleteModule modalstatus={modal} togglestatus={toggleModal} datasample={collectModal} />
       <ActivateModule modalstatus={modal2} togglestatus={toggleModal2} datasample={collectModal} />
</React.Fragment>
  )
  
}


export default BootstrapConfiguration