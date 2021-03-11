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
import DeleteModule from "./DeleteModule";
import CreateOrganizationUnit from "./CreateOrganizationUnit";
import CreatOrgUnitByUpload from "./CreatOrgUnitByUpload";
import { useSelector, useDispatch } from 'react-redux';
import {  fetchAllOrganizationalUnit, Delete } from '../../../actions/organizationalUnit';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import CreateParentOrgUnit from "./CreateParentOrgUnit";
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





  const OrganizationUnit = (props) => {
    const [orgUnitID, setorgUnitID] = useState([])
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

    const deleteModule = (rowId) => {  
      if (window.confirm(`Are you sure to delete this record? ${rowId}`))
      dispatch(Delete(4444))
    }

    const createOrgUnit = () => {  
      setModal2(!modal2) 
    }
    const createParentOrgUnit = (e) => {
      setorgUnitID(e)  
      setModal4(!modal4)
       
    }

return (
    <div >
      <ToastContainer autoClose={3000} hideProgressBar />
                            <Card body>
                              
                            <Breadcrumbs aria-label="breadcrumb">
                              <Link color="inherit" to={{pathname: "/admin"}} >
                                  Admin
                              </Link>
                              <Typography color="textPrimary">Organisational Unit Level Manager </Typography>
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
                              title="Organisational Unit Level"
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
                                                       <MenuItem  style={{ color:"#000 !important"}}  onClick={() => createParentOrgUnit( row)}>                      
                                                      
                                                          <FaPlusCircle size="15" color="blue" />{" "}<span style={{color: '#000'}}>Add </span>
                                                    
                                                      </MenuItem>
                                                      <MenuItem  style={{ color:"#000 !important"}} >                      
                                                      <Link
                                                        to={{pathname: "/admin-parent-organization-unit", state: { orgUnitLevel: row  }}}>
                                                          <MdRemoveRedEye size="15" color="blue" />{" "}<span style={{color: '#000'}}>View</span>
                                                       </Link>  
                                                      </MenuItem>
                                                      <MenuItem style={{ color:"#000 !important"}}>
                                                            
                                                              <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Edit   </span>                   
                                                           
                                                      </MenuItem> 
                                                      <MenuItem  style={{ color:"#000 !important"}} onSelect={() => deleteModule(row.organisationUnitLevelId)}>                      
                                                      
                                                            <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}}>Delete </span>
                                                                                
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
                      
       <DeleteModule modalstatus={modal} togglestatus={toggleModal} orgUnitID={orgUnitID}/>
       <CreateOrganizationUnit modalstatus={modal2} togglestatus={toggleModal2}  />
       <CreatOrgUnitByUpload modalstatus={modal3} togglestatus={toggleModal3}  />
       <CreateParentOrgUnit modalstatus={modal4} togglestatus={toggleModal4}   orgUnitID={orgUnitID}/>
                       
       
    </div>
  )
  
}


export default OrganizationUnit