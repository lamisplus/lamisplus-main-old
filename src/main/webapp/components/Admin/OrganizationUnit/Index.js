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
import {  MdDelete, MdModeEdit, MdRemoveRedEye } from "react-icons/md";
import { FaPlusCircle} from 'react-icons/fa'

import DeleteModule from "./DeleteModule";
import CreateOrganizationUnit from "./CreateOrganizationUnit";
import CreatOrgUnitByUpload from "./CreatOrgUnitByUpload";
import { useSelector, useDispatch } from 'react-redux';
import {  fetchAllOrganizationalUnit, Delete } from '../../../actions/organizationalUnit';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import CreateParentOrgUnit from "./CreateParentOrgUnit";


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
        
                <br />
                    <Row>
                        <Col>
                            <Card body>
                            <h1>Organization Unit Manager
                                <MatButton
                                  type='submit'
                                  variant='contained'
                                  color='primary'
                                  className={classes.button}                        
                                  className=" float-right mr-1"
                                  onClick={() => createOrgUnit()}
                                >
                                  <TiPlus/>{" "} New Org. Level
                                </MatButton>
                                </h1>
                               
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
                                                       <MenuItem  style={{ color:"#000 !important"}}  onClick={() => createParentOrgUnit( row.id)}>                      
                                                      
                                                          <FaPlusCircle size="15" color="blue" />{" "}<span style={{color: '#000'}}>Add </span>
                                                    
                                                      </MenuItem>
                                                      <MenuItem  style={{ color:"#000 !important"}} >                      
                                                      <Link
                                                        to={{pathname: "/admin/parent-organization-unit", state: { parentOrganisationUnitId: row.id  }}}>
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
                                filtering: true
                              }}
                            />
                            </Card>
                        </Col>
                  </Row>
        
       <DeleteModule modalstatus={modal} togglestatus={toggleModal} orgUnitID={orgUnitID}/>
       <CreateOrganizationUnit modalstatus={modal2} togglestatus={toggleModal2}  />
       <CreatOrgUnitByUpload modalstatus={modal3} togglestatus={toggleModal3}  />
       <CreateParentOrgUnit modalstatus={modal4} togglestatus={toggleModal4}   orgUnitID={orgUnitID}/>
                       
       
    </div>
  )
  
}


export default OrganizationUnit