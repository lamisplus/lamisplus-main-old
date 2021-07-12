import React from 'react'
import {Card} from 'reactstrap'
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
import DeleteOrgUnit from "./DeleteOrgUnit";
import UpdateOrganisationUnit from "./UpdateOrganisationUnit";
import CreateParentOrgUnit from "./CreateParentOrgUnit";
import { useSelector, useDispatch } from 'react-redux';
import {  fetchAllParentOrganizationalUnitlevel } from '../../../actions/organizationalUnit';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlusCircle, FaPlus} from 'react-icons/fa';


const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})





  const ParentOrganizationUnit = (props) => {
  
    const parentOrganisationUnitId = props.location.state && props.location.state.orgUnitLevel  ? props.location.state.orgUnitLevel : {};
    const [collectModal, setcollectModal] = useState([])
    const [orgUnitID, setorgUnitID] = useState([])
    const [modal, setModal] = useState(false) // 
    const toggleModal = () => setModal(!modal)
    const [modal2, setModal2] = useState(false) //
    const toggleModal2 = () => setModal2(!modal2)
    const [modal3, setModal3] = useState(false) //
    const toggleModal3 = () => setModal3(!modal3)
    const classes = useStyles()
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch();
    const listOfAllParentOrgUnit = useSelector(state => state.organizationalUnitReducer.list);

    useEffect(() => {
      setLoading(true);
      const onSuccess = () => {
          setLoading(false)
          
      }
      const onError = () => {
          setLoading(false)     
      }
        const fetchAllOrgUnit = dispatch(fetchAllParentOrganizationalUnitlevel(parentOrganisationUnitId.id, onSuccess,onError ));

  }, []); //componentDidMount
    const deleteModule = (row) => {  
      setcollectModal({...collectModal, ...row});
      setModal(!modal) 
    }

    const updateOrgUnit = (row) => {  
      setcollectModal({...collectModal, ...row});
      console.log(parentOrganisationUnitId)
      setorgUnitID(parentOrganisationUnitId) 
      setModal3(!modal3) 
    }

    const createParentOrgUnit = () => {  

      setorgUnitID(parentOrganisationUnitId)  
      setModal2(!modal2) 
    }

    

return (
    <div >
       <ToastContainer autoClose={3000} hideProgressBar />

                            <Card body>
                            <Breadcrumbs aria-label="breadcrumb">
                              <Link color="inherit" to={{pathname: "/admin"}} >
                                  Admin
                              </Link>
                              <Link color="inherit" to={{pathname: "admin-organization-unit"}} >
                                 Organisational Unit Level Setup
                              </Link>
                              <Typography color="textPrimary">{parentOrganisationUnitId.name} </Typography>
                             </Breadcrumbs>
                              <br/>
                                  <div className={"d-flex justify-content-end pb-2"}>
                                      <Button variant="contained"
                                              color="primary"
                                              startIcon={<FaPlus />}
                                              onClick={() => createParentOrgUnit()}>
                                          <span style={{textTransform: 'capitalize'}}>Add Org. Unit</span>
                                      </Button>
                               </div>
                            <MaterialTable
                              title="Organisational Unit"
                              columns={[
                                { title: 'Name', field: 'name' },
                                { title: 'Org. Unit Level Name', field: 'ParentOrgUnitName' },
                                { title: 'Parent Org. Unit name', field: 'ParentName' },
                                { title: 'Description', field: 'description' },
                                
                                { title: 'Action', field: 'actions'},
                              ]}
                              isLoading={loading}
                                data={listOfAllParentOrgUnit.map((row) => ({
                                      name: row.name, 
                                      ParentOrgUnitName: row && row.parentParentOrganisationUnitName ? row.parentParentOrganisationUnitName : "",  
                                      ParentName: row && row.parentOrganisationUnitName ? row.parentOrganisationUnitName : "", 
                                      description: row. description,
                                    
                                    actions: 
                                      <div>
                                        <Menu>
                                            <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                              Actions <span aria-hidden>▾</span>
                                            </MenuButton>
                                                <MenuList style={{ color:"#000 !important"}} > 
                                                      
                                            <MenuItem  style={{ color:"#000 !important"}} onSelect={() => updateOrgUnit(row)}>                      
                                                      
                                                            <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Edit </span>
                                                                                
                                              </MenuItem>                                    
                                              <MenuItem  style={{ color:"#000 !important"}} onSelect={() => deleteModule(row)}>                      
                                                      
                                                            <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}}>Delete </span>
                                                                                
                                              </MenuItem> 
                                              <MenuItem  style={{ color:"#000 !important"}}  onClick={() => createParentOrgUnit( row)}>                      
                                                      
                                                      <FaPlusCircle size="15" color="blue" />{" "}<span style={{color: '#000'}}>Add Org. Unit Identifier </span>
                                                
                                              </MenuItem>     
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
                   
       <DeleteOrgUnit modalstatus={modal} togglestatus={toggleModal} orgUnit={collectModal} />
       <CreateParentOrgUnit modalstatus={modal2} togglestatus={toggleModal2} orgUnitID={orgUnitID} />
       <UpdateOrganisationUnit modalstatus={modal3} togglestatus={toggleModal3} orgUnit={collectModal}  orgUnitID={orgUnitID}/>
       
    </div>
  )
  
}


export default ParentOrganizationUnit