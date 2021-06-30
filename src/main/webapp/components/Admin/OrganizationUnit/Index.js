import React from 'react'
import {Card,} from 'reactstrap'
import { useState, useEffect} from 'react'
import Button from '@material-ui/core/Button'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import 'react-widgets/dist/css/react-widgets.css'
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import MaterialTable from 'material-table';
import {  MdDelete, MdModeEdit, MdRemoveRedEye } from "react-icons/md";
import { FaPlusCircle, FaPlus} from 'react-icons/fa'
import DeleteOrgUnitLevel from "./DeleteOrgUnitLevel";
import CreateOrganizationUnitLevel from "./CreateOrganizationUnitLevel";
import UpdateOrganisationUnitLevel from "./UpdateOrganisationUnitLevel";
import { useSelector, useDispatch } from 'react-redux';
import {  fetchAllOrganizationalUnit, Delete } from '../../../actions/organizationalUnit';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import CreateParentOrgUnit from "./CreateParentOrgUnit";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
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





  const OrganizationUnit = (props) => {
    const [orgUnitID, setorgUnitID] = useState([])
    const [collectModal, setcollectModal] = useState([])
    const [modal, setModal] = useState(false) // 
    const toggleModal = () => setModal(!modal)
    const [modal2, setModal2] = useState(false) //
    const toggleModal2 = () => setModal2(!modal2)
    const [modal3, setModal3] = useState(false) //
    const toggleModal3 = () => setModal3(!modal3)
    const [modal4, setModal4] = useState(false) //
    const toggleModal4 = () => setModal4(!modal4)
    const classes = useStyles()
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch();
    const listOfAllOrgUnit = useSelector(state => state.organizationalUnitReducer.list);

    useEffect(() => {
      setLoading(true);
      const onSuccess = () => {
          setLoading(false)
          
      }
      const onError = () => {
          setLoading(false)     
      }
        const fetchAllOrgUnit = dispatch(fetchAllOrganizationalUnit(onSuccess,onError ));

    }, []); //componentDidMount

    const deleteModule = (row) => {  
      setcollectModal({...collectModal, ...row});
      setModal(!modal) 
    }
    const updateOrgUnitLevel = (row) => {  
      setcollectModal({...collectModal, ...row});
      setModal3(!modal3) 
    }
    
    const createOrgUnit = () => {  
      setModal2(!modal2) 
    }
    const createParentOrgUnit = (e) => {
      setorgUnitID(e)  
      setModal4(!modal4)
       
    }
console.log(listOfAllOrgUnit)
return (
    <div >
      <ToastContainer autoClose={3000} hideProgressBar />
                            <Card body>
                              
                            <Breadcrumbs aria-label="breadcrumb">
                              <Link color="inherit" to={{pathname: "/admin"}} >
                                  Admin
                              </Link>
                              <Typography color="textPrimary">Organisational Unit Level Setup </Typography>
                             </Breadcrumbs>
                               
                               
                                <br/>
                                  <div className={"d-flex justify-content-end pb-2"}>
                                      <Button variant="contained"
                                              color="primary"
                                              startIcon={<FaPlus />}
                                              onClick={() => createOrgUnit()}>
                                          <span style={{textTransform: 'capitalize'}}>New Org. Unit Level</span>
                                      </Button>

                                  </div>
                            <MaterialTable
                            icons={tableIcons}
                              title="Organisational Unit Levels"
                              columns={[
                                { title: ' Name', field: 'name' },
                                { title: 'Description', field: 'description' },
                                
                                { title: 'Action', field: 'actions'},
                              ]}
                              isLoading={loading}
                                data={listOfAllOrgUnit.map((row) => ({
                                      name: row.name,  
                                      description: row. description,
                                    
                                    actions: 
                                      <div>
                                        <Menu>
                                            <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                              Actions <span aria-hidden>▾</span>
                                            </MenuButton>
                                                <MenuList style={{ color:"#000 !important"}} >
                                                       
                                                      <MenuItem  style={{ color:"#000 !important"}} >                      
                                                      <Link
                                                        to={{pathname: "/admin-parent-organization-unit", state: { orgUnitLevel: row  }}}>
                                                          <MdRemoveRedEye size="15" color="blue" />{" "}<span style={{color: '#000'}}>View</span>
                                                       </Link>  
                                                      </MenuItem>
                                                      <MenuItem style={{ color:"#000 !important"}}  onSelect={() => updateOrgUnitLevel(row)}>
                                                            
                                                              <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Edit   </span>                   
                                                           
                                                      </MenuItem> 
                                                      <MenuItem  style={{ color:"#000 !important"}} onSelect={() => deleteModule(row)}>                      
                                                      
                                                            <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}}>Delete </span>
                                                                                
                                                      </MenuItem>
                                                      { row.status ===0 ? 
                                                      <MenuItem  style={{ color:"#000 !important"}}  onClick={() => createParentOrgUnit( row)}>                      
                                                      
                                                          <FaPlusCircle size="15" color="blue" />{" "}<span style={{color: '#000'}}>Add Org. Unit Level </span>
                                                    
                                                      </MenuItem>
                                                      :
                                                      ""
                                                      }                               
                                                      
                                              </MenuList>
                                        </Menu>
                                  </div>        
                                }))}
                              options={{
                                headerStyle: {
                                  backgroundColor: "#9F9FA5",
                                  color: "#000",
                                  margin: "auto"
                                  },
                                  searchFieldStyle: {
                                    width : '300%',
                                    margingLeft: '250px',
                                },
                                filtering: true,
                                exportButton: false,
                                searchFieldAlignment: 'left',
                                actionsColumnIndex: -1
                               
                              }}
                            />
                            </Card>
                      
       <DeleteOrgUnitLevel modalstatus={modal} togglestatus={toggleModal} orgUnit={collectModal}/>
       <CreateOrganizationUnitLevel modalstatus={modal2} togglestatus={toggleModal2}  />
       <UpdateOrganisationUnitLevel modalstatus={modal3} togglestatus={toggleModal3}  orgUnit={collectModal}/>
       <CreateParentOrgUnit modalstatus={modal4} togglestatus={toggleModal4}   orgUnitID={orgUnitID}/>
                       
       
    </div>
  )
  
}


export default OrganizationUnit